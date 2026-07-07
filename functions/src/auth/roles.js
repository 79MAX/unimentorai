"use strict";

const ROLE_DEFINITIONS = Object.freeze({
  admin: Object.freeze({
    role: "admin",
    permissions: [
      "admin:all",
      "courses:moderate",
      "roles:manage",
      "security:audit",
      "users:impersonation_read",
    ],
  }),
  enterprise_admin: Object.freeze({
    role: "enterprise_admin",
    permissions: [
      "enterprise:manage",
      "courses:assign",
      "reports:read",
      "users:read_limited",
    ],
  }),
  mentor: Object.freeze({
    role: "mentor",
    permissions: [
      "mentoring:host",
      "mentoring:match",
      "courses:read_private_assigned",
    ],
  }),
  recruiter: Object.freeze({
    role: "recruiter",
    permissions: [
      "talent:read_public",
      "opportunities:manage",
    ],
  }),
  user: Object.freeze({
    role: "user",
    permissions: [
      "courses:read_published",
      "mentoring:participate",
    ],
  }),
});

const ASSIGNABLE_ROLES = Object.freeze(Object.keys(ROLE_DEFINITIONS));
const DEFAULT_ROLE = "user";
const CLAIMS_VERSION = 2;

const ORGANIZATION_ROLES = Object.freeze(["owner", "admin", "member"]);

function normalizeRole(inputRole) {
  const role = String(inputRole || "").trim().toLowerCase();
  if (!ASSIGNABLE_ROLES.includes(role)) {
    throw new Error(`Role unsupported: ${inputRole}`);
  }
  return role;
}

function normalizeOrganizationRole(input) {
  const r = String(input || "member").trim().toLowerCase();
  if (ORGANIZATION_ROLES.includes(r)) {
    return r;
  }
  return "member";
}

/**
 * @param {string} inputRole
 * @param {string[]} extraPermissions
 * @param {{organizationId: string, organizationRole?: string}|null} orgContext
 *        null = B2C (pas de claims tenant)
 */
function buildClaims(inputRole, extraPermissions = [], orgContext = null) {
  const role = normalizeRole(inputRole);
  const base = ROLE_DEFINITIONS[role];
  const permissions = Array.from(new Set([
    ...base.permissions,
    ...extraPermissions.map((x) => String(x).trim()).filter(Boolean),
  ])).sort();
  const out = {
    role,
    roles: [role],
    permissions,
    claimsVersion: CLAIMS_VERSION,
  };
  if (orgContext && orgContext.organizationId) {
    const oid = String(orgContext.organizationId).trim();
    if (oid.length > 0 && oid.length <= 128) {
      out.organizationId = oid;
      out.organizationRole = normalizeOrganizationRole(orgContext.organizationRole);
    }
  }
  return out;
}

function stripRoleClaims(existingClaims = {}) {
  const next = {...existingClaims};
  delete next.role;
  delete next.roles;
  delete next.permissions;
  delete next.claimsVersion;
  delete next.organizationId;
  delete next.organizationRole;
  return next;
}

function canManageRole(actorClaims = {}, targetRole) {
  const actorRole = actorClaims.role || null;
  const normalizedTargetRole = normalizeRole(targetRole);
  if (actorRole === "admin") return true;
  if (actorRole === "enterprise_admin") {
    return normalizedTargetRole !== "admin";
  }
  return false;
}

module.exports = {
  ASSIGNABLE_ROLES,
  CLAIMS_VERSION,
  DEFAULT_ROLE,
  ORGANIZATION_ROLES,
  ROLE_DEFINITIONS,
  buildClaims,
  canManageRole,
  normalizeOrganizationRole,
  normalizeRole,
  stripRoleClaims,
};

