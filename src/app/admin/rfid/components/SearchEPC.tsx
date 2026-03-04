"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

type EPCResult = {
  _id: string;
  epc: string;
  product?: {
    _id: string;
    name: string;
    code?: string;
  };
};

export default function SearchEPCModule() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EPCResult | null>(null);

  const handleSearch = async () => {
    if (!search) return;

    try {
      setLoading(true);
      setResult(null);

      const res = await fetch(`/api/rfid/search?epc=${search}`);
      if (!res.ok) throw new Error();

      const data = await res.json();
      setResult(data);

      if (!data) toast.error("EPC no encontrado");
    } catch {
      toast.error("Error buscando EPC");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!result) return;

    try {
      const res = await fetch(`/api/rfid/delete/${result._id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      toast.success("EPC eliminado correctamente");
      setResult(null);
      setSearch("");
    } catch {
      toast.error("Error eliminando EPC");
    }
  };

  return (
    <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 md:p-6">
      <h2 className="text-lg font-semibold mb-4">
        Buscar EPC
      </h2>

      {/* Buscador estilo moderno */}
      <div className="relative mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar EPC..."
          className="w-full pl-4 pr-10 py-3 rounded-lg
            bg-neutral-800 border border-neutral-700 text-white
            focus:outline-none focus:border-neutral-500"
        />

        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>

      <button
        onClick={handleSearch}
        disabled={loading}
        className="w-full bg-white text-black py-3 rounded font-semibold mb-4"
      >
        {loading ? "Buscando..." : "Buscar EPC"}
      </button>

      {/* Resultado */}
      {result && (
        <div className="bg-neutral-800 p-4 rounded flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-sm text-neutral-400">EPC:</p>
            <p className="font-mono">{result.epc}</p>

            <p className="text-sm text-neutral-400 mt-2">Producto:</p>
            <p>
              {result.product?.name}{" "}
              {result.product?.code && `(${result.product.code})`}
            </p>
          </div>

          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-400 transition"
            title="Eliminar EPC"
          >
            <Trash2 size={22} />
          </button>
        </div>
      )}
    </section>
  );
}