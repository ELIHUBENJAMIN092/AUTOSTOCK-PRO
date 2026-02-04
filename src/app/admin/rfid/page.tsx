"use client";

import { useEffect, useState } from "react";
import ScrollToTop from "@/app/components/ScrollToTop";

type Product = {
  _id: string;
  name: string;
  code?: string;
};

type RFIDResult = {
  updated: number;
  notFound: string[];
  durationMs: number;
};

export default function RFIDPage() {
  /* ---------------- EPC REGISTRO ---------------- */
  const [epc, setEpc] = useState("");
  const [productId, setProductId] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  /* ---------------- RFID CSV ---------------- */
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RFIDResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* ---------------- LOAD PRODUCTS ---------------- */
  useEffect(() => {
    fetch("/api/products?rfid=true")
      .then((res) => res.json())
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  /* ---------------- SAVE EPC ---------------- */
  const handleSaveEPC = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!epc || !productId) return;

    setSaving(true);
    setSaveMsg(null);

    try {
      const res = await fetch("/api/rfid/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ epc, productId }),
      });

      if (!res.ok) throw new Error("Error al registrar EPC");

      setSaveMsg("✅ EPC registrado correctamente");
      setEpc("");
      setProductId("");
    } catch (err: any) {
      setSaveMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- PROCESS CSV ---------------- */
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

      if (!res.ok) throw new Error("Error al procesar el archivo RFID");

      setResult(await res.json());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-white max-w-3xl space-y-10">
      <h1 className="text-2xl font-bold">RFID · Gestión de Inventario</h1>

      {/* ================= REGISTRO EPC ================= */}
      <section className="p-4 bg-neutral-900 border border-neutral-800 rounded">
        <h2 className="font-semibold mb-4">➕ Registrar EPC</h2>

        <form onSubmit={handleSaveEPC} className="space-y-3">
          <input
            value={epc}
            onChange={(e) => setEpc(e.target.value)}
            placeholder="EPC (ej: 300833B2DDD9014000000001)"
            className="w-full p-2 bg-neutral-800 rounded"
            required
          />

          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="w-full p-2 bg-neutral-800 rounded"
            required
          >
            <option value="">Selecciona producto</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} {p.code && `(${p.code})`}
              </option>
            ))}
          </select>

          <button
            disabled={saving}
            className="bg-white text-black px-4 py-2 rounded disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Registrar EPC"}
          </button>

          {saveMsg && <p className="text-sm mt-2">{saveMsg}</p>}
        </form>
      </section>

      {/* ================= RFID CSV ================= */}
      <section>
        <h2 className="font-semibold mb-4">📤 Procesar archivo RFID (Zebra)</h2>

        <form onSubmit={handleUpload} className="space-y-4">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm"
            required
          />

          <button
            disabled={loading}
            className="bg-white text-black px-6 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Procesando..." : "Actualizar inventario"}
          </button>
        </form>

        {error && <p className="text-red-400 mt-4">{error}</p>}

        {result && (
          <div className="mt-6 p-4 bg-neutral-900 rounded">
            <p>✔ Actualizados: {result.updated}</p>
            <p>⏱ Tiempo: {result.durationMs} ms</p>

            {result.notFound.length > 0 && (
              <>
                <p className="text-red-400 mt-2">
                  EPC no registrados ({result.notFound.length})
                </p>
                <ul className="text-xs mt-1">
                  {result.notFound.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </section>

      <ScrollToTop />
    </div>
  );
}
