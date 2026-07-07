"use strict";

const admin = require("firebase-admin");
const {
  ASSIGNABLE_ROLES,
  buildClaims,
  normalizeRole,
  stripRoleClaims,
} = require("../src/auth/roles");

function parseArgs(argv) {
  const out = {};
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      out[key] = true;
      continue;
    }
    out[key] = next;
    i += 1;
  }
  return out;
}

function usage() {
  console.log([
    "Usage:",
    "  node scripts/manageRoles.js --action set --uid <uid> --role <role> --actor <email_or_uid> [--reason <text>] [--permissions p1,p2]",
    "  node scripts/manageRoles.js --action clear --uid <uid> --actor <email_or_uid> [--reason <text>]",
    `Assignable roles: ${ASSIGNABLE_ROLES.join(", ")}`,
  ].join("\n"));
}

function getExtraPermissions(raw) {
  if (!raw) return [];
  return String(raw)
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 20);
}

async function writeAuditLog(entry) {
  await admin.firestore().collection("role_management_logs").add({
    ...entry,
    source: "admin_sdk_script",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

async function main() {
  const args = parseArgs(process.argv);
  const action = String(args.action || "").trim().toLowerCase();
  const uid = String(args.uid || "").trim();
  const actor = String(args.actor || "").trim();
  const reason = String(args.reason || "manual_cli_update").trim().slice(0, 200);

  if (!uid || !actor || !["set", "clear"].includes(action)) {
    usage();
    process.exitCode = 1;
    return;
  }

  if (!admin.apps.length) {
    admin.initializeApp();
  }

  const userRecord = await admin.auth().getUser(uid);
  if (action === "set") {
    const role = normalizeRole(args.role);
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
      ...stripRoleClaims(userRecord.customClaims || {}),
      ...buildClaims(role, getExtraPermissions(args.permissions), orgCtx),
    };
    await admin.auth().setCustomUserClaims(uid, nextClaims);
    await admin.firestore().collection("users").doc(uid).set({
      role,
      roleClaimsUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
      roleClaimsVersion: nextClaims.claimsVersion,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, {merge: true});
    await writeAuditLog({
      action: "set_role",
      actorUid: actor,
      actorRole: "script",
      targetUid: uid,
      targetRole: role,
      reason,
      extraPermissions: nextClaims.permissions,
    });
    console.log(JSON.stringify({success: true, uid, role, claims: nextClaims}, null, 2));
    return;
  }

  const stripped = stripRoleClaims(userRecord.customClaims || {});
  await admin.auth().setCustomUserClaims(uid, stripped);
  await admin.firestore().collection("users").doc(uid).set({
    role: "user",
    organizationId: null,
    organizationRole: null,
    roleClaimsUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
    roleClaimsVersion: null,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }, {merge: true});
  await writeAuditLog({
    action: "clear_role",
    actorUid: actor,
    actorRole: "script",
    targetUid: uid,
    targetRole: "user",
    reason,
  });
  console.log(JSON.stringify({success: true, uid, role: "user"}, null, 2));
}

main().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});

