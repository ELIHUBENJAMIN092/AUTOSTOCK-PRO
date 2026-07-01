"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Token inválido");
      return;
    }

    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error al restablecer la contraseña");
        return;
      }

      setDone(true);
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="bg-neutral-900 p-8 rounded-xl w-full max-w-sm border border-neutral-800 text-center">
        <p className="text-red-400 mb-4">Enlace inválido o expirado.</p>
        <Link href="/forgot-password" className="text-cyan-400 hover:text-cyan-300 text-sm">
          Solicitar nuevo enlace
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="bg-neutral-900 p-8 rounded-xl w-full max-w-sm border border-neutral-800 text-center">
        <p className="text-emerald-400 mb-4">Contraseña actualizada correctamente.</p>
        <Link href="/login" className="text-cyan-400 hover:text-cyan-300 text-sm">
          Iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 p-8 rounded-xl w-full max-w-sm border border-neutral-800">
      <h1 className="text-2xl font-bold text-white mb-2 text-center">
        Nueva contraseña
      </h1>
      <p className="text-sm text-neutral-400 text-center mb-6">
        Ingresa tu nueva contraseña.
      </p>

      <form onSubmit={handleSubmit}>
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none"
          required
          minLength={6}
        />

        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full mb-6 px-4 py-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-500 text-neutral-950 font-semibold py-3 rounded-lg hover:bg-cyan-400 transition disabled:opacity-60"
        >
          {loading ? "Guardando..." : "Cambiar contraseña"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950">
      <Suspense fallback={
        <div className="bg-neutral-900 p-8 rounded-xl w-full max-w-sm border border-neutral-800 text-center">
          <p className="text-neutral-400">Cargando...</p>
        </div>
      }>
        <ResetForm />
      </Suspense>
    </div>
  );
}
