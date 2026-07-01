import { describe, it, expect } from "vitest";

describe("db", () => {
  it("should have MONGODB_URI defined in env", () => {
    // In test env this won't be set, but the module should handle it
    const uri = process.env.MONGODB_URI;
    expect(typeof uri).toBe("string");
    // It should start with mongodb
    if (uri) {
      expect(uri.startsWith("mongodb")).toBe(true);
    }
  });

  it("should export connectDB function", async () => {
    const db = await import("./db");
    expect(typeof db.connectDB).toBe("function");
  });
});
