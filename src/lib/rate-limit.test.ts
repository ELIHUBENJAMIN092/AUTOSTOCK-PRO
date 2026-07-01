import { describe, it, expect } from "vitest";

describe("rateLimit", () => {
  it("should allow first request", async () => {
    const { rateLimit } = await import("./rate-limit");
    const result = rateLimit("test-ip-1", 3, 60000);
    expect(result.ok).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it("should block after exceeding limit", async () => {
    const { rateLimit } = await import("./rate-limit");
    const ip = "test-ip-2";
    rateLimit(ip, 2, 60000);
    rateLimit(ip, 2, 60000);
    const result = rateLimit(ip, 2, 60000);
    expect(result.ok).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("should reset after window expires", async () => {
    const { rateLimit } = await import("./rate-limit");
    const ip = "test-ip-3";
    rateLimit(ip, 1, 10); // 10ms window
    const result = rateLimit(ip, 1, 10);
    expect(result.ok).toBe(false);

    await new Promise((r) => setTimeout(r, 20));

    const result2 = rateLimit(ip, 1, 10);
    expect(result2.ok).toBe(true);
  });

  it("should track remaining correctly", async () => {
    const { rateLimit } = await import("./rate-limit");
    const ip = "test-ip-4";
    const r1 = rateLimit(ip, 5, 60000);
    expect(r1.remaining).toBe(4);
    rateLimit(ip, 5, 60000);
    const r2 = rateLimit(ip, 5, 60000);
    expect(r2.remaining).toBe(2);
  });
});
