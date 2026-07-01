import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendResetEmail(
  to: string,
  token: string
): Promise<void> {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || "noreply@autostock-pro.com",
    to,
    subject: "Restablecer contraseña — Autostock Pro",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
        <h2 style="color:#06b6d4;">Autostock Pro</h2>
        <p>Has solicitado restablecer tu contraseña.</p>
        <a href="${resetUrl}" style="display:inline-block;background:#06b6d4;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin:16px 0;">
          Restablecer contraseña
        </a>
        <p style="color:#666;font-size:13px;">Este enlace expira en 1 hora. Si no solicitaste este cambio, ignora este mensaje.</p>
      </div>
    `,
  });
}
