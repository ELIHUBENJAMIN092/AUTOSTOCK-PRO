"use client";

import type { Product, Category } from "../types";

interface Props {
  product: Product;
  categories: Category[];
  saving: boolean;
  onChange: (product: Product) => void;
  onClose: () => void;
  onSave: () => void;
}

export default function EditProductModal({
  product,
  categories,
  saving,
  onChange,
  onClose,
  onSave,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-neutral-900 p-6 rounded-xl w-full max-w-lg space-y-4">
        <h2 className="text-lg font-semibold">Editar producto</h2>

        <input
          value={product.code ?? ""}
          onChange={(e) => onChange({ ...product, code: e.target.value })}
          className="bg-neutral-800 px-4 py-2 rounded w-full"
          placeholder="Código"
        />

        <input
          value={product.name}
          onChange={(e) => onChange({ ...product, name: e.target.value })}
          className="bg-neutral-800 px-4 py-2 rounded w-full"
          placeholder="Nombre"
        />

        <input
          value={product.description ?? ""}
          onChange={(e) =>
            onChange({ ...product, description: e.target.value })
          }
          className="bg-neutral-800 px-4 py-2 rounded w-full"
          placeholder="Ubicación"
        />

        <input
          type="number"
          value={product.price ?? 0}
          onChange={(e) =>
            onChange({ ...product, price: Number(e.target.value) })
          }
          className="bg-neutral-800 px-4 py-2 rounded w-full"
          placeholder="Precio"
        />

        <input
          type="number"
          value={product.stock ?? 0}
          onChange={(e) =>
            onChange({ ...product, stock: Number(e.target.value) })
          }
          className="bg-neutral-800 px-4 py-2 rounded w-full"
          placeholder="Stock"
        />

        <select
          value={product.category?._id ?? ""}
          onChange={(e) =>
            onChange({
              ...product,
              category: categories.find((c) => c._id === e.target.value),
            })
          }
          className="bg-neutral-800 px-4 py-2 rounded w-full"
        >
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 bg-neutral-700 py-2 rounded"
          >
            Cancelar
          </button>

          <button
            onClick={onSave}
            disabled={saving}
            className="flex-1 bg-white text-black py-2 rounded font-semibold"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
