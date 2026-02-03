"use client";

import { useState } from "react";
import ScrollToTop from "@/app/components/ScrollToTop";

type RFIDResult = {
  updated: number;
  notFound: string[];
  durationMs: number;
};

export default function RFIDPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RFIDResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/rfid/process", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Error al procesar el archivo RFID");
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-white max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">RFID · Actualización de Inventario</h1>

      {/* 📤 SUBIR ARCHIVO */}
      <form onSubmit={handleUpload} className="space-y-4 mb-8">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm file:bg-neutral-800 file:border-0 file:px-4 file:py-2 file:rounded file:text-white"
          required
        />

        <button
          disabled={loading}
          className="bg-white text-black px-6 py-2 rounded font-medium disabled:opacity-50"
        >
          {loading ? "Procesando..." : "Procesar archivo RFID"}
        </button>
      </form>

      {/* ❌ ERROR */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/40 border border-red-500 rounded">
          {error}
        </div>
      )}

      {/* ✅ RESULTADO */}
      {result && (
        <div className="space-y-4 p-4 bg-neutral-900 border border-neutral-800 rounded">
          <h2 className="font-semibold text-lg">Resultado del proceso</h2>

          <p>✔ Productos actualizados: <b>{result.updated}</b></p>
          <p>⏱ Tiempo de proceso: <b>{result.durationMs} ms</b></p>

          {result.notFound.length > 0 && (
            <div>
              <p className="text-red-400 mt-2">
                ⚠ EPC no registrados ({result.notFound.length})
              </p>

              <ul className="text-xs text-neutral-400 mt-1 space-y-1">
                {result.notFound.map((epc) => (
                  <li key={epc}>{epc}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <ScrollToTop />
    </div>
  );
}
