"use strict";

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const rateLimiter = require("../middleware/rateLimiter");
const {
  buildClaims,
  normalizeOrganizationRole,
  normalizeRole,
  stripRoleClaims,
} = require("./roles");

const ORG_TYPES = new Set(["school", "university", "enterprise"]);
const ORG_STATUS_ACTIVE = "active";

const AUDIT = "role_management_logs";

function resolvePlatformRoleForClaims(storedRole, claimsRole) {
  const raw = String(storedRole || claimsRole || "user").trim().toLowerCase();
  const legacy = raw === "apprenant" ? "user" : raw;
  try {
    return normalizeRole(legacy);
  } catch (_) {
    return "user";
  }
}

function assertPlatformAdmin(context) {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Authentification requise");
  }
  const role = context.auth.token && context.auth.token.role;
  if (role !== "admin") {
    throw new functions.https.HttpsError("permission-denied", "Admin plateforme requis");
  }
}

async function writeAudit(entry) {
  await admin.firestore().collection(AUDIT).add({
    ...entry,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

/**
 * Crée une organisation et désigne l'admin initial (enterprise_admin + owner côté org).
 * Réservé à l'admin plateforme.
 */
exports.createOrganization = functions.https.onCall(
  rateLimiter.withRateLimitCallable(async (data, context) => {
    assertPlatformAdmin(context);

    const name = String(data?.name || "").trim().slice(0, 200);
    const type = String(data?.type || "").trim().toLowerCase();
    const initialAdminUid = String(data?.initialAdminUid || "").trim();

    if (!name) {
      throw new functions.https.HttpsError("invalid-argument", "name requis");
    }
    if (!ORG_TYPES.has(type)) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "type invalide (school | university | enterprise)",
      );
    }
    if (!initialAdminUid || initialAdminUid.length > 128) {
      throw new functions.https.HttpsError("invalid-argument", "initialAdminUid requis");
    }

    let initialUser;
    try {
      initialUser = await admin.auth().getUser(initialAdminUid);
    } catch (e) {
      throw new functions.https.HttpsError("not-found", "Utilisateur initial introuvable");
    }
    if (!initialUser) {
      throw new functions.https.HttpsError("not-found", "Utilisateur initial introuvable");
    }

    const db = admin.firestore();
    const orgRef = db.collection("organizations").doc();
    const orgId = orgRef.id;

    const batch = db.batch();
    batch.set(orgRef, {
      name,
      type,
      status: ORG_STATUS_ACTIVE,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: context.auth.uid,
    });
    batch.set(
      db.collection("users").doc(initialAdminUid),
      {
        organizationId: orgId,
        organizationRole: "owner",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      {merge: true},
    );
    await batch.commit();

    const userRecord = await admin.auth().getUser(initialAdminUid);
    const currentClaims = userRecord.customClaims || {};
    const platformRole = "enterprise_admin";
    const nextClaims = {
      ...stripRoleClaims(currentClaims),
      ...buildClaims(platformRole, [], {
        organizationId: orgId,
        organizationRole: "owner",
      }),
    };

    await admin.auth().setCustomUserClaims(initialAdminUid, nextClaims);
    await db.collection("users").doc(initialAdminUid).set(
      {
        role: platformRole,
        roleClaimsUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
        roleClaimsVersion: nextClaims.claimsVersion,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      {merge: true},
    );

    await writeAudit({
      action: "create_organization",
      actorUid: context.auth.uid,
      targetUid: initialAdminUid,
      organizationId: orgId,
      orgType: type,
      reason: String(data?.reason || "create_organization").slice(0, 200),
    });

    return {
      success: true,
      organizationId: orgId,
      initialAdminUid,
      name,
      type,
      status: ORG_STATUS_ACTIVE,
    };
  }, functions),
);

/**
 * Rattache un utilisateur à une organisation (Firestore + claims tenant).
 * Admin plateforme : tout contrôle.
 * enterprise_admin : uniquement son organizationId ; pas de rôle org owner.
 */
exports.attachUserToOrganization = functions.https.onCall(
  rateLimiter.withRateLimitCallable(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError("unauthenticated", "Authentification requise");
    }

    const targetUid = String(data?.targetUid || "").trim();
    const organizationId = String(data?.organizationId || "").trim();
    const organizationRole = normalizeOrganizationRole(data?.organizationRole);

    if (!targetUid || targetUid.length > 128) {
      throw new functions.https.HttpsError("invalid-argument", "targetUid requis");
    }
    if (!organizationId || organizationId.length > 128) {
      throw new functions.https.HttpsError("invalid-argument", "organizationId requis");
    }

    const token = context.auth.token || {};
    const isPlatformAdmin = token.role === "admin";
    const isEntAdmin =
      token.role === "enterprise_admin" &&
      token.organizationId === organizationId;

    if (!isPlatformAdmin && !isEntAdmin) {
      throw new functions.https.HttpsError("permission-denied", "Droits insuffisants");
    }

    if (!isPlatformAdmin && organizationRole === "owner") {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Seul l admin plateforme peut attribuer le role owner",
      );
    }

    const db = admin.firestore();
    const orgSnap = await db.collection("organizations").doc(organizationId).get();
    if (!orgSnap.exists) {
      throw new functions.https.HttpsError("not-found", "Organisation introuvable");
    }
    const orgData = orgSnap.data() || {};
    if (orgData.status != ORG_STATUS_ACTIVE) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Organisation non active",
      );
    }

    const targetRef = db.collection("users").doc(targetUid);
    const targetSnap = await targetRef.get();
    if (!targetSnap.exists) {
      throw new functions.https.HttpsError("not-found", "Profil utilisateur introuvable");
    }
    const prev = targetSnap.data() || {};
    const prevOrg = prev.organizationId != null ? String(prev.organizationId) : null;
    if (prevOrg && prevOrg !== organizationId && !isPlatformAdmin) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Changement d organisation reserve a l admin plateforme",
      );
    }

    let targetAuth;
    try {
      targetAuth = await admin.auth().getUser(targetUid);
    } catch (e) {
      throw new functions.https.HttpsError("not-found", "Compte Auth introuvable");
    }

    const currentClaims = targetAuth.customClaims || {};
    const currentRole = resolvePlatformRoleForClaims(prev.role, currentClaims.role);

    if (!isPlatformAdmin && currentRole === "admin") {
      throw new functions.https.HttpsError("permission-denied", "Cible non autorisee");
    }

    await targetRef.set(
      {
        organizationId,
        organizationRole,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      {merge: true},
    );

    const nextClaims = {
      ...stripRoleClaims(currentClaims),
      ...buildClaims(currentRole, [], {
        organizationId,
        organizationRole,
      }),
    };

    await admin.auth().setCustomUserClaims(targetUid, nextClaims);
    await targetRef.set(
      {
        role: currentRole,
        roleClaimsUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
        roleClaimsVersion: nextClaims.claimsVersion,
      },
      {merge: true},
    );

    await writeAudit({
      action: "attach_user_to_organization",
      actorUid: context.auth.uid,
      actorRole: token.role || null,
      targetUid,
      organizationId,
      organizationRole,
      reason: String(data?.reason || "attach_user_to_organization").slice(0, 200),
    });

    return {
      success: true,
      targetUid,
      organizationId,
      organizationRole,
      platformRole: currentRole,
    };
  }, functions),
);

