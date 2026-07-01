const ipMap = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  ip: string,
  limit: number = 10,
  windowMs: number = 60000
): { ok: boolean; remaining: number } {
  const now = Date.now();
  const record = ipMap.get(ip);

  if (!record || now > record.resetAt) {
    ipMap.set(ip, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { ok: false, remaining: 0 };
  }

  record.count += 1;
  return { ok: true, remaining: limit - record.count };
}
