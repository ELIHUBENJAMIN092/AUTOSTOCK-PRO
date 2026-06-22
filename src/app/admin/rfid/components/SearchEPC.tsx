"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

type Category =
  | string
  | {
      _id: string;
      name: string;
    };

type EPCResult = {
  _id: string;
  epc: string;
  product?: {
    _id: string;
    name: string;
    code?: string;
    description?: string;
    stock?: number;
    image?: string;
    imageUrl?: string;
    category?: Category;
  };
};

export default function SearchEPCModule() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EPCResult | null>(null);

  const handleSearch = async () => {
    if (!search.trim()) {
      toast.error("Ingrese un EPC");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const res = await fetch(
        `/api/rfid/search?epc=${encodeURIComponent(search.trim())}`
      );

      if (!res.ok) throw new Error();

      const data = await res.json();

      if (!data) {
        toast.error("EPC no encontrado");
        return;
      }

      setResult(data);
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

  const product = result?.product;

  const categoryName =
    typeof product?.category === "object"
      ? product.category.name
      : product?.category || "Sin categoría";

  const productImage =
    product?.imageUrl ||
    product?.image ||
    "/no-image.png";

  const stock = product?.stock ?? 0;

  return (
    <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 md:p-6">
      <h2 className="text-lg font-semibold mb-4">Buscar EPC RFID</h2>

      <div className="relative mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          placeholder="Buscar EPC..."
          className="w-full pl-4 pr-10 py-3 rounded-lg
          bg-neutral-800 border border-neutral-700 text-white
          focus:outline-none focus:border-neutral-500"
        />

        {search && (
          <button
            onClick={() => {
              setSearch("");
              setResult(null);
            }}
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

      {result && (
        <div className="space-y-5">
          <div className="bg-neutral-800 p-4 rounded flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm text-neutral-400">EPC:</p>
              <p className="font-mono break-all">{result.epc}</p>

              <p className="text-sm text-neutral-400 mt-2">Producto:</p>
              <p>
                {product?.name || "Producto no asignado"}{" "}
                {product?.code && `(${product.code})`}
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

          {product && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 md:p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="relative bg-white rounded-2xl overflow-hidden p-4">
                  {stock <= 3 && (
                    <span className="absolute right-4 top-4 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                      Stock Bajo
                    </span>
                  )}

                  <img
                    src={productImage}
                    alt={product.name}
                    className="w-full h-56 object-contain"
                  />
                </div>

                <div className="space-y-3">
                  <p className="text-neutral-400 text-lg">
                    {product.code || "Sin código"}
                  </p>

                  <h3 className="text-2xl font-bold text-white">
                    {product.name}
                  </h3>

                  <p className="text-neutral-300">
                    {product.description || "Sin descripción"}
                  </p>

                  <div className="flex items-center gap-2">
                    <span className="text-neutral-300 text-lg">Stock:</span>
                    <span className="text-4xl font-bold text-white">
                      {stock}
                    </span>
                  </div>

                  <span className="inline-block bg-neutral-700 border border-neutral-600 text-white px-4 py-2 rounded-lg font-semibold">
                    {categoryName}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}