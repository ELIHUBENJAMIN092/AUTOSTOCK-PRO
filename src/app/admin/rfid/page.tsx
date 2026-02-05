"use client";

import { useEffect, useState } from "react";
import ScrollToTop from "@/app/components/ScrollToTop";
import toast from "react-hot-toast";
import { UploadCloud, CheckCircle } from "lucide-react";

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

  const [epc, setEpc] = useState("");
  const [productId, setProductId] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [saving, setSaving] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RFIDResult | null>(null);

  // ✅ NUEVO
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/products?rfid=true")
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]));
  }, []);

  const handleSaveEPC = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!epc || !productId) return;

    try {
      setSaving(true);

      const res = await fetch("/api/rfid/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ epc, productId }),
      });

      if (!res.ok) throw new Error();

      toast.success("EPC registrado correctamente");
      setEpc("");
      setProductId("");
    } catch {
      toast.error("Error registrando EPC");
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
      setLoading(true);
      setResult(null);
      setSuccess(false);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/rfid/process", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      setResult({
        updated: data.updated ?? 0,
        durationMs: data.durationMs ?? 0,
        notFound: Array.isArray(data.notFound) ? data.notFound : [],
      });

      setSuccess(true); // ✅ CHECK VERDE
      toast.success("Inventario actualizado");

    } catch {
      toast.error("Error procesando archivo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full overflow-x-hidden px-4 md:px-6 text-white max-w-4xl mx-auto space-y-10">

      <h1 className="text-2xl font-bold">
        Inventario RFID
      </h1>

      {/* REGISTRAR EPC */}
      <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 md:p-6 max-w-full">
        <h2 className="text-lg font-semibold mb-4">
          Registrar EPC
        </h2>

        <form
          onSubmit={handleSaveEPC}
          className="flex flex-col gap-4 md:grid md:grid-cols-2"
        >
          <input
            value={epc}
            onChange={(e) => setEpc(e.target.value)}
            placeholder="EPC"
            className="bg-neutral-800 px-4 py-2 rounded w-full"
            required
          />

          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="bg-neutral-800 px-4 py-2 rounded w-full"
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
            type="submit"
            disabled={saving}
            className="md:col-span-2 bg-white text-black py-3 rounded font-semibold w-full"
          >
            {saving ? "Guardando..." : "Registrar EPC"}
          </button>
        </form>
      </section>

      {/* SUBIR CSV */}
      <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 md:p-6 max-w-full">

        <h2 className="text-lg font-semibold mb-4">
          Procesar archivo Zebra RFID
        </h2>

        <form onSubmit={handleUpload} className="space-y-5">

          <input
            type="file"
            id="rfidUpload"
            hidden
            accept=".csv"
            onChange={(e) => {
              setFile(e.target.files?.[0] || null);
              setSuccess(false); // reset visual
            }}
          />

          {!file ? (
            <label
              htmlFor="rfidUpload"
              className="w-full h-32 border-2 border-dashed border-neutral-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-800 transition"
            >
              <UploadCloud size={32} />
              <span className="text-sm mt-2">
                Seleccionar archivo CSV
              </span>
            </label>
          ) : (
            <div className="bg-neutral-800 rounded p-3 flex flex-wrap gap-2 justify-between items-center">
              <span className="text-sm break-all">{file.name}</span>

              <button
                type="button"
                onClick={() => setFile(null)}
                className="text-xs bg-black/60 px-3 py-1 rounded"
              >
                Cambiar
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-3 rounded font-semibold"
          >
            {loading ? "Procesando..." : "Actualizar Inventario"}
          </button>

          {/* ✅ CHECK VISUAL VERDE */}
          {success && (
            <div className="flex items-center gap-2 text-green-400 font-semibold animate-pulse">
              <CheckCircle size={22} />
              Inventario actualizado correctamente
            </div>
          )}

        </form>

        {result && (
          <div className="mt-6 bg-neutral-800 p-4 rounded">
            <p>✔ Actualizados: {result.updated}</p>
            <p>⏱ Tiempo: {result.durationMs} ms</p>

            {result.notFound.length > 0 && (
              <>
                <p className="text-red-400 mt-2">
                  EPC no registrados ({result.notFound.length})
                </p>

                <ul className="text-xs mt-1 space-y-1 break-all max-h-40 overflow-auto">
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
