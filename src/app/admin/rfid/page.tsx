"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import ScrollToTop from "@/app/components/ScrollToTop";
import toast from "react-hot-toast";
import { UploadCloud, CheckCircle } from "lucide-react";
import SearchEPC from "./components/SearchEPC";
import Button from '@/app/components/ui/Button'

type Product = {
  _id: string;
  name: string;
  code?: string;
};

type RFIDResult = {
  updated: number;
  newStock: number;
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
  const [selectedRFIDProduct, setSelectedRFIDProduct] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedRFIDProductName, setSelectedRFIDProductName] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredProducts = useMemo(
    () =>
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.code || "").toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [products, searchQuery]
  );

  const [success, setSuccess] = useState(false);

  // ⭐⭐⭐ BATCH MODULE STATE
  const [batchText, setBatchText] = useState("");
  const [batchSaving, setBatchSaving] = useState(false);

  useEffect(() => {
    fetch("/api/products?rfid=true")
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data.products) ? data.products : []))
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

  // ⭐⭐⭐ BATCH MODULE HANDLER
  const handleBatchRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!batchText || !productId) {
      toast.error("Falta EPC o producto");
      return;
    }

    const epcs = batchText
      .split("\n")
      .map((e) => e.trim())
      .filter(Boolean);

    if (!epcs.length) {
      toast.error("No hay EPC válidos");
      return;
    }

    try {
      setBatchSaving(true);

      const res = await fetch("/api/rfid/batch-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ epcs, productId }),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      toast.success(`Registrados: ${data.inserted}`);

      setBatchText("");

    } catch {
      toast.error("Error en registro batch");
    } finally {
      setBatchSaving(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    if (!selectedRFIDProduct) {
      toast.error("Debe buscar y seleccionar un producto");
      return;
    }

    try {
      setLoading(true);
      setResult(null);
      setSuccess(false);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("selectedProductId", selectedRFIDProduct);

      const res = await fetch("/api/rfid/process", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error procesando archivo");
      }

      setResult({
        updated: data.updated ?? 0,
        newStock: data.newStock ?? 0,
        durationMs: data.durationMs ?? 0,
        notFound: Array.isArray(data.notFound) ? data.notFound : [],
      });

      setSuccess(true);
      toast.success("Inventario actualizado");

    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error procesando archivo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full overflow-x-hidden px-4 md:px-6 text-white max-w-screen-xl mx-auto space-y-10">

      <div className="rounded-[2rem] border border-cyan-700/30 bg-gradient-to-r from-slate-950 via-cyan-950 to-slate-900 p-6 shadow-xl shadow-cyan-500/10">
        <h1 className="text-3xl font-bold text-white">Inventario RFID</h1>
        <p className="mt-3 max-w-3xl text-neutral-300">
          Registra EPC por producto, carga lotes por línea y procesa archivos Zebra para mantener tu inventario RFID actualizado.
        </p>
      </div>

      {/* 🔎 BUSCAR EPC */}
      <SearchEPC />

      {/* REGISTRAR EPC */}
      <section className="bg-neutral-900 border border-cyan-700/20 rounded-3xl p-4 md:p-6 shadow-lg shadow-cyan-500/10 max-w-full">
        <h2 className="text-xl font-semibold text-cyan-300 mb-4">
          Registrar EPC
        </h2>

        <form
          onSubmit={handleSaveEPC}
          className="grid gap-4 md:grid-cols-2"
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

          <Button type="submit" disabled={saving} className="md:col-span-2 w-full rounded-3xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 disabled:opacity-60">{saving ? "Guardando..." : "Registrar EPC"}</Button>
        </form>
      </section>

      {/* ⭐⭐⭐ BATCH REGISTER UI */}
      <section className="bg-neutral-900 border border-emerald-700/20 rounded-3xl p-4 md:p-6 shadow-lg shadow-emerald-500/10">
        <h2 className="text-xl font-semibold text-emerald-300 mb-4">
          Registro Masivo EPC
        </h2>

        <form onSubmit={handleBatchRegister} className="space-y-4">

          <textarea
            value={batchText}
            onChange={(e) => setBatchText(e.target.value)}
            placeholder="1 EPC por línea..."
            className="bg-neutral-800 w-full p-3 rounded h-40"
          />

          <Button type="submit" disabled={batchSaving} className="w-full rounded-3xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400 disabled:opacity-60">{batchSaving ? "Registrando..." : "Registrar Lote"}</Button>

        </form>
      </section>

      {/* SUBIR CSV */}
      <section className="bg-neutral-900 border border-amber-700/20 rounded-3xl p-4 md:p-6 shadow-lg shadow-amber-500/10 max-w-full">
        <h2 className="text-xl font-semibold text-amber-300 mb-4">
          Procesar archivo Zebra RFID
        </h2>

        <form onSubmit={handleUpload} className="space-y-5">

          {/* Producto a actualizar */}
          <div>
            <label className="text-sm text-neutral-400 mb-2 block">
              Producto a actualizar
            </label>
            {selectedRFIDProduct && selectedRFIDProductName ? (
              <div className="bg-neutral-800 px-4 py-2.5 rounded-lg w-full border border-neutral-700 flex justify-between items-center">
                <span className="text-white">{selectedRFIDProductName}</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRFIDProduct("");
                    setSelectedRFIDProductName("");
                    setSearchQuery("");
                  }}
                  className="text-xs text-amber-400 hover:text-amber-300"
                >
                  Cambiar
                </button>
              </div>
            ) : (
              <div ref={searchRef} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowResults(true);
                  }}
                  onFocus={() => setShowResults(true)}
                  onBlur={() => setTimeout(() => setShowResults(false), 200)}
                  placeholder="Buscar producto por nombre o código..."
                  className="bg-neutral-800 px-4 py-2.5 rounded-lg w-full border border-neutral-700 text-white placeholder-neutral-500"
                  required
                />
                {showResults && searchQuery && (
                  <div className="absolute z-10 mt-1 w-full bg-neutral-800 border border-neutral-700 rounded-lg max-h-48 overflow-y-auto shadow-xl">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((p) => (
                        <button
                          key={p._id}
                          type="button"
                          onClick={() => {
                            setSelectedRFIDProduct(p._id);
                            setSelectedRFIDProductName(
                              `${p.name}${p.code ? ` (${p.code})` : ""}`
                            );
                            setSearchQuery("");
                            setShowResults(false);
                          }}
                          className="w-full text-left px-4 py-2 text-white hover:bg-neutral-700 transition border-b border-neutral-700 last:border-0"
                        >
                          {p.name}{" "}
                          {p.code && (
                            <span className="text-neutral-400">({p.code})</span>
                          )}
                        </button>
                      ))
                    ) : (
                      <p className="px-4 py-2 text-neutral-500 text-sm">
                        Sin resultados
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
            <p className="text-xs text-neutral-500 mt-1.5">
              Solo se actualizará el stock de este producto
            </p>
          </div>

          <input
            type="file"
            id="rfidUpload"
            hidden
            accept=".csv"
            onChange={(e) => {
              setFile(e.target.files?.[0] || null);
              setSuccess(false);
            }}
          />

          {!file ? (
            <label
              htmlFor="rfidUpload"
              className="w-full h-32 rounded-3xl border border-neutral-700 border-dashed bg-neutral-900 flex flex-col items-center justify-center cursor-pointer transition hover:border-amber-400 hover:bg-neutral-800"
            >
              <UploadCloud size={32} className="text-amber-300" />
              <span className="text-sm mt-2 text-neutral-200">
                Seleccionar archivo CSV
              </span>
            </label>
          ) : (
            <div className="bg-neutral-800 rounded p-3 flex flex-wrap gap-2 justify-between items-center">
              <span className="text-sm break-all">{file.name}</span>

                  <Button type="button" onClick={() => setFile(null)} className="text-xs bg-black/60 px-3 py-1 rounded">Cambiar</Button>
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full rounded-3xl bg-amber-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-400 disabled:opacity-60">{loading ? "Procesando..." : "Actualizar inventario"}</Button>

          {success && (
            <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/10 px-4 py-3 text-emerald-300 font-semibold animate-pulse">
              <CheckCircle size={22} />
              Inventario actualizado correctamente
            </div>
          )}

        </form>

        {result && (
          <div className="mt-6 rounded-3xl border border-neutral-800 bg-neutral-900 p-4 shadow-inner shadow-black/20">
            <p className="text-sm text-emerald-300">✔ Producto actualizado: <span className="font-semibold text-white">{result.updated}</span></p>
            <p className="text-sm text-amber-300">📦 Nuevo stock: <span className="font-semibold text-white">{result.newStock}</span></p>
            <p className="text-sm text-cyan-300">⏱ Tiempo: <span className="font-semibold text-white">{result.durationMs} ms</span></p>

            {result.notFound.length > 0 && (
              <>
                <p className="text-red-400 mt-2">
                  EPC no registrados ({result.notFound.length})
                </p>

                <ul className="text-xs mt-1 space-y-1 break-all max-h-40 overflow-auto text-neutral-300">
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
