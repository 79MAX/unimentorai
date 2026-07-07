"use strict";

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const rateLimiter = require("../middleware/rateLimiter");
const {
  ASSIGNABLE_ROLES,
  buildClaims,
  canManageRole,
  normalizeRole,
  stripRoleClaims,
} = require("./roles");

const ROLE_AUDIT_COLLECTION = "role_management_logs";

async function writeRoleAuditLog(entry) {
  await admin.firestore().collection(ROLE_AUDIT_COLLECTION).add({
    ...entry,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

async function assertAuthorizedManager(context, targetRole) {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Authentification requise");
  }
  const actorClaims = context.auth.token || {};
  if (!canManageRole(actorClaims, targetRole)) {
    throw new functions.https.HttpsError("permission-denied", "Droits insuffisants pour gerer ce role");
  }
  return {
    actorUid: context.auth.uid,
    actorRole: actorClaims.role || null,
  };
}

function sanitizeExtraPermissions(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((x) => String(x || "").trim())
    .filter((x) => x.length > 0 && x.length <= 64)
    .slice(0, 20);
}

exports.setUserRoleClaims = functions.https.onCall(
  rateLimiter.withRateLimitCallable(async (data, context) => {
    const uid = String(data?.uid || "").trim();
    const role = normalizeRole(data?.role);
    const extraPermissions = sanitizeExtraPermissions(data?.extraPermissions);
    const reason = String(data?.reason || "manual_role_update").trim().slice(0, 200);
    if (!uid) {
      throw new functions.https.HttpsError("invalid-argument", "uid requis");
    }

    const {actorUid, actorRole} = await assertAuthorizedManager(context, role);
    const userRecord = await admin.auth().getUser(uid);
    const currentClaims = userRecord.customClaims || {};
    const userSnap = await admin.firestore().collection("users").doc(uid).get();
    const u = userSnap.data() || {};
    const orgCtx =
      u.organizationId && String(u.organizationId).trim().length > 0
        ? {
          organizationId: String(u.organizationId).trim(),
          organizationRole: u.organizationRole || "member",
        }
        : null;
    const nextClaims = {
      ...stripRoleClaims(currentClaims),
      ...buildClaims(role, extraPermissions, orgCtx),
    };

    await admin.auth().setCustomUserClaims(uid, nextClaims);
    await admin.firestore().collection("users").doc(uid).set({
      role,
      roleClaimsUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
      roleClaimsVersion: nextClaims.claimsVersion,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, {merge: true});

    await writeRoleAuditLog({
      action: "set_role",
      actorUid,
      actorRole,
      targetUid: uid,
      targetRole: role,
      extraPermissions,
      reason,
    });

    return {
      success: true,
      uid,
      role,
      claimsVersion: nextClaims.claimsVersion,
      permissions: nextClaims.permissions,
    };
  }, functions)
);

exports.clearUserRoleClaims = functions.https.onCall(
  rateLimiter.withRateLimitCallable(async (data, context) => {
    const uid = String(data?.uid || "").trim();
    const reason = String(data?.reason || "manual_role_clear").trim().slice(0, 200);
    if (!uid) {
      throw new functions.https.HttpsError("invalid-argument", "uid requis");
    }

    const {actorUid, actorRole} = await assertAuthorizedManager(context, "user");
    const userRecord = await admin.auth().getUser(uid);
    const nextClaims = stripRoleClaims(userRecord.customClaims || {});

    await admin.auth().setCustomUserClaims(uid, nextClaims);
    await admin.firestore().collection("users").doc(uid).set({
      role: "user",
      organizationId: null,
      organizationRole: null,
      roleClaimsUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
      roleClaimsVersion: null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, {merge: true});

    await writeRoleAuditLog({
      action: "clear_role",
      actorUid,
      actorRole,
      targetUid: uid,
      targetRole: "user",
      reason,
    });

    return {success: true, uid, role: "user"};
  }, functions)
);

exports.getUserRoleClaims = functions.https.onCall(
  rateLimiter.withRateLimitCallable(async (data, context) => {
    const uid = String(data?.uid || context?.auth?.uid || "").trim();
    if (!uid) {
      throw new functions.https.HttpsError("invalid-argument", "uid requis");
    }
    if (!context.auth) {
      throw new functions.https.HttpsError("unauthenticated", "Authentification requise");
    }
    const actorClaims = context.auth.token || {};
    if (context.auth.uid !== uid && actorClaims.role !== "admin") {
      if (actorClaims.role === "enterprise_admin") {
        const targetSnap = await admin.firestore().collection("users").doc(uid).get();
        const tOrg = targetSnap.exists ? targetSnap.data().organizationId : null;
        const actorOrg = actorClaims.organizationId;
        if (!tOrg || !actorOrg || String(tOrg) !== String(actorOrg)) {
          throw new functions.https.HttpsError("permission-denied", "Lecture des claims refusee");
        }
      } else {
        throw new functions.https.HttpsError("permission-denied", "Lecture des claims refusee");
      }
    }

    const userRecord = await admin.auth().getUser(uid);
    return {
      uid,
      email: userRecord.email || null,
      claims: userRecord.customClaims || {},
      assignableRoles: ASSIGNABLE_ROLES,
    };
  }, functions)
);

