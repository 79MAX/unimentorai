"use strict";

const {SecretManagerServiceClient} = require("@google-cloud/secret-manager");

const client = new SecretManagerServiceClient();
const cache = new Map();

function isEmulator() {
  return process.env.FUNCTIONS_EMULATOR === "true" ||
    !!process.env.FIREBASE_AUTH_EMULATOR_HOST ||
    !!process.env.FIRESTORE_EMULATOR_HOST;
}

function resolveProjectId() {
  if (process.env.GCLOUD_PROJECT) return process.env.GCLOUD_PROJECT;
  if (process.env.GCP_PROJECT) return process.env.GCP_PROJECT;
  if (!process.env.FIREBASE_CONFIG) return null;
  try {
    const parsed = JSON.parse(process.env.FIREBASE_CONFIG);
    return parsed.projectId || null;
  } catch (_) {
    return null;
  }
}

async function accessSecretVersion(secretName, version = "latest") {
  const projectId = resolveProjectId();
  if (!projectId) {
    throw new Error("Project ID introuvable pour Secret Manager");
  }
  const name = `projects/${projectId}/secrets/${secretName}/versions/${version}`;
  const [res] = await client.accessSecretVersion({name});
  const value = res && res.payload && res.payload.data
    ? res.payload.data.toString("utf8").trim()
    : "";
  return value;
}

async function getSecret(secretName, {required = true, allowEnvFallback = true} = {}) {
  if (cache.has(secretName)) {
    return cache.get(secretName);
  }

  if (allowEnvFallback && isEmulator()) {
    const envValue = process.env[secretName];
    if (envValue && String(envValue).trim().length > 0) {
      const value = String(envValue).trim();
      cache.set(secretName, value);
      return value;
    }
  }

  let value = "";
  try {
    value = await accessSecretVersion(secretName);
  } catch (error) {
    if (!required) {
      cache.set(secretName, "");
      return "";
    }
    throw error;
  }
  if (!value && required) {
    throw new Error(`Secret manquant: ${secretName}`);
  }
  cache.set(secretName, value || "");
  return value || "";
}

module.exports = {
  getSecret,
};

