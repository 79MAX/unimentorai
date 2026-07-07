/* =========================
   SCHEMA BUILDER (ZOD-LIKE CORE V2)
   - Lightweight validation engine
   - SaaS-ready + AI-ready
========================= */

import { is, assert } from "./validator.js";

/* =========================
   SCHEMA EXECUTOR
========================= */
export function schema(definition) {
  return (data = {}) => {
    for (const key in definition) {
      const rule = definition[key];
      const value = data?.[key];

      rule(value);
    }

    return true;
  };
}

/* =========================
   RULE FACTORY (CLEAN & SCALABLE)
========================= */
export const rules = {
  required:
    (field) =>
    (v) => {
      assert(
        v !== undefined && v !== null,
        `${field}_REQUIRED`,
        field
      );
    },

  email:
    (field) =>
    (v) => {
      assert(is.email(v), "INVALID_EMAIL", field);
    },

  string:
    (field) =>
    (v) => {
      assert(is.string(v), "INVALID_STRING", field);
    },

  min:
    (field, n) =>
    (v) => {
      assert(
        is.string(v) && v.length >= n,
        `MIN_LENGTH_${n}`,
        field
      );
    },

  max:
    (field, n) =>
    (v) => {
      assert(
        is.string(v) && v.length <= n,
        `MAX_LENGTH_${n}`,
        field
      );
    },
};
