const requestMap = new Map<string, number[]>();

export const rateLimiter = (
  ip: string,
  limit = 30,
  windowMs = 60000
): boolean => {
  const now = Date.now();

  if (!requestMap.has(ip)) {
    requestMap.set(ip, []);
  }

  const requests = requestMap.get(ip)!;

  const filtered = requests.filter(
    (timestamp) => now - timestamp < windowMs
  );

  filtered.push(now);

  requestMap.set(ip, filtered);

  return filtered.length <= limit;
};