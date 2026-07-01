const REQUIRED_VARS = [
  "MONGODB_URI",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
] as const;

const OPTIONAL_VARS = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_FROM",
] as const;

export function checkEnv(): { ok: boolean; missing: string[] } {
  const missing: string[] = [];

  for (const key of REQUIRED_VARS) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  return { ok: missing.length === 0, missing };
}

export function getEnvStatus() {
  const required = REQUIRED_VARS.map((key) => ({
    key,
    set: !!process.env[key],
  }));

  const optional = OPTIONAL_VARS.map((key) => ({
    key,
    set: !!process.env[key],
  }));

  return { required, optional };
}
