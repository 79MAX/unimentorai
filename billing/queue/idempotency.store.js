/* =========================
   🧠 IDEMPOTENCY STORE
   UniMentorAI - Enterprise Queue Protection
========================= */

/* =========================
   ⚡ STORE CONFIG
========================= */
const processedStore = new Map();

const DEFAULT_TTL =
  Number(process.env.IDEMPOTENCY_TTL_MS) ||
  1000 * 60 * 60 * 24; // 24h

const CLEANUP_INTERVAL =
  Number(process.env.IDEMPOTENCY_CLEANUP_MS) ||
  1000 * 60 * 10; // 10min

/* =========================
   ⏱ INTERNAL CLOCK
========================= */
const now = () => Date.now();

/* =========================
   🔍 VALIDATE ENTRY
========================= */
function isExpired(entry) {

  return !entry || now() > entry.expiresAt;
}

/* =========================
   🔍 CHECK IF PROCESSED
========================= */
export function isProcessed(id) {

  if (!id || typeof id !== "string") {
    return false;
  }

  const entry = processedStore.get(id);

  if (!entry) {
    return false;
  }

  /* =========================
     ⏳ AUTO EXPIRE
  ========================= */
  if (isExpired(entry)) {

    processedStore.delete(id);

    return false;
  }

  return true;
}

/* =========================
   ✅ MARK AS PROCESSED
========================= */
export function markProcessed(
  id,
  ttl = DEFAULT_TTL,
  metadata = {}
) {

  if (!id || typeof id !== "string") {
    return false;
  }

  const timestamp = now();

  processedStore.set(id, {
    id,
    metadata,
    processedAt: timestamp,
    expiresAt: timestamp + ttl
  });

  return true;
}

/* =========================
   📤 GET ENTRY
========================= */
export function getProcessed(id) {

  if (!isProcessed(id)) {
    return null;
  }

  return processedStore.get(id);
}

/* =========================
   🧹 REMOVE ENTRY
========================= */
export function removeProcessed(id) {

  if (!id) {
    return false;
  }

  return processedStore.delete(id);
}

/* =========================
   🧹 CLEAR STORE
========================= */
export function clearProcessed() {

  processedStore.clear();

  return true;
}

/* =========================
   📊 STORE METRICS
========================= */
export function getProcessedStats() {

  let active = 0;
  let expired = 0;

  for (const entry of processedStore.values()) {

    if (isExpired(entry)) {
      expired++;
    } else {
      active++;
    }
  }

  return {
    total: processedStore.size,
    active,
    expired,
    ttl: DEFAULT_TTL,
    cleanupInterval: CLEANUP_INTERVAL,
    timestamp: new Date().toISOString()
  };
}

/* =========================
   🔥 CLEANUP ENGINE
========================= */
function cleanupExpiredEntries() {

  const currentTime = now();

  let removed = 0;

  for (const [id, entry] of processedStore.entries()) {

    if (currentTime > entry.expiresAt) {

      processedStore.delete(id);

      removed++;
    }
  }

  /* =========================
     📊 OPTIONAL DEBUG LOG
  ========================= */
  if (
    process.env.NODE_ENV === "development" &&
    removed > 0
  ) {
    console.log(
      `[IDEMPOTENCY_CLEANUP] Removed ${removed} expired entries`
    );
  }
}

/* =========================
   ⏳ AUTO CLEANUP SCHEDULER
========================= */
const cleanupTimer = setInterval(
  cleanupExpiredEntries,
  CLEANUP_INTERVAL
);

/* =========================
   🛡 PREVENT TIMER BLOCKING EXIT
========================= */
if (cleanupTimer.unref) {
  cleanupTimer.unref();
}
