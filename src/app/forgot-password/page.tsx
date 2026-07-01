"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error al enviar el correo");
        return;
      }

      setSent(true);
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950">
      <div className="bg-neutral-900 p-8 rounded-xl w-full max-w-sm border border-neutral-800">
        <h1 className="text-2xl font-bold text-white mb-2 text-center">
          Recuperar contraseña
        </h1>
        <p className="text-sm text-neutral-400 text-center mb-6">
          Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        {sent ? (
          <div className="text-center">
            <p className="text-emerald-400 mb-4">
              Si el email existe, recibirás un enlace para restablecer tu contraseña.
            </p>
            <Link
              href="/login"
              className="text-cyan-400 hover:text-cyan-300 text-sm"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
            )}

            <input
              type="email"
              placeholder="Tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-6 px-4 py-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 text-neutral-950 font-semibold py-3 rounded-lg hover:bg-cyan-400 transition disabled:opacity-60"
            >
              {loading ? "Enviando..." : "Enviar enlace"}
            </button>

            <p className="text-center mt-4">
              <Link
                href="/login"
                className="text-neutral-400 hover:text-white text-sm"
              >
                Volver al inicio de sesión
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
