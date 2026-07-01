import { beforeAll } from "vitest";

beforeAll(() => {
  process.env.MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://localhost:27017/test";
});
