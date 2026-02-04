"use client";

import { useState } from "react";
import type { Product } from "@/app/admin/products/types";

interface Props {
  products: Product[];
}

export default function RegisterEPC({ products }: Props) {
  const [epc, setEpc] = useState("");
  const [productId, setProductId] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleSave = async () => {
    if (!epc || !productId) return;

    setLoading(true);
    setMsg(null);

    const res = await fetch("/api/rfid/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ epc, productId }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMsg(data.error || "Error");
    } else {
      setMsg("✅ EPC registrado correctamente");
      setEpc("");
    }

    setLoading(false);
  };

  return (
    <div className="p-4 bg-neutral-900 border border-neutral-800 rounded space-y-4">
      <h2 className="text-lg font-semibold">Registrar etiqueta RFID</h2>

      <select
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        className="w-full bg-neutral-800 px-4 py-2 rounded"
      >
        <option value="">Seleccionar producto</option>
        {products.map((p) => (
          <option key={p._id} value={p._id}>
            {p.code} — {p.name}
          </option>
        ))}
      </select>

      <input
        value={epc}
        onChange={(e) => setEpc(e.target.value)}
        placeholder="EPC leído del tag"
        className="w-full bg-neutral-800 px-4 py-2 rounded"
      />

      <button
        onClick={handleSave}
        disabled={loading}
        className="bg-white text-black px-6 py-2 rounded font-medium disabled:opacity-50"
      >
        {loading ? "Guardando..." : "Registrar EPC"}
      </button>

      {msg && <p className="text-sm text-neutral-300">{msg}</p>}
    </div>
  );
}
