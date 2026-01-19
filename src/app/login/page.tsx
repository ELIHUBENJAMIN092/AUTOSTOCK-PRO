"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Credenciales incorrectas");
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950">
      <form
        onSubmit={handleSubmit}
        className="bg-neutral-900 p-8 rounded-xl w-full max-w-sm border border-neutral-800"
      >
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Acceso Admin
        </h1>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none"
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none"
          required
        />

        <button
          type="submit"
          className="w-full bg-white text-neutral-950 font-semibold py-3 rounded-lg hover:bg-neutral-100 transition"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
}
