import { describe, it, expect } from "vitest";

describe("env-check", () => {
  it("should detect missing required vars", async () => {
    const { checkEnv } = await import("./env-check");
    const result = checkEnv();
    expect(result.missing.length).toBeGreaterThan(0);
    expect(result.ok).toBe(false);
  });

  it("should list NEXTAUTH_SECRET as missing", async () => {
    const { checkEnv } = await import("./env-check");
    const result = checkEnv();
    expect(result.missing).toContain("NEXTAUTH_SECRET");
  });

  it("should return env status correctly", async () => {
    const { getEnvStatus } = await import("./env-check");
    const status = getEnvStatus();
    expect(status.required.length).toBeGreaterThan(0);
    expect(status.optional.length).toBeGreaterThan(0);
  });
});
