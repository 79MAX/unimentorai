const logs = [];

export function getBillingLogs() {
  return logs;
}

export function createBillingLog(log) {
  logs.push(log);
}

