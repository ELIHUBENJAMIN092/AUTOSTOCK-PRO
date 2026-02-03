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
  const isRFID = product.isRFID ?? false;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-neutral-900 p-6 rounded-xl w-full max-w-lg space-y-4">
        <h2 className="text-lg font-semibold">Editar producto</h2>

        {/* Código */}
        <input
          value={product.code ?? ""}
          onChange={(e) => onChange({ ...product, code: e.target.value })}
          className="bg-neutral-800 px-4 py-2 rounded w-full"
          placeholder="Código"
        />

        {/* Nombre */}
        <input
          value={product.name}
          onChange={(e) => onChange({ ...product, name: e.target.value })}
          className="bg-neutral-800 px-4 py-2 rounded w-full"
          placeholder="Nombre"
        />

        {/* Ubicación */}
        <input
          value={product.description ?? ""}
          onChange={(e) =>
            onChange({ ...product, description: e.target.value })
          }
          className="bg-neutral-800 px-4 py-2 rounded w-full"
          placeholder="Ubicación"
        />

        {/* Precio */}
        <input
          type="number"
          value={product.price ?? 0}
          onChange={(e) =>
            onChange({ ...product, price: Number(e.target.value) })
          }
          className="bg-neutral-800 px-4 py-2 rounded w-full"
          placeholder="Precio"
        />

        {/* STOCK (bloqueado si RFID está ON) */}
        <input
          type="number"
          value={product.stock ?? 0}
          disabled={isRFID}
          onChange={(e) =>
            onChange({ ...product, stock: Number(e.target.value) })
          }
          className={`px-4 py-2 rounded w-full ${
            isRFID
              ? "bg-neutral-700 cursor-not-allowed opacity-60"
              : "bg-neutral-800"
          }`}
          placeholder="Stock"
        />

        {isRFID && (
          <p className="text-xs text-yellow-400">
            ⚠ El stock se gestiona automáticamente por RFID
          </p>
        )}

        {/* Categoría */}
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

        {/* 🔘 RFID SWITCH */}
        <div className="flex items-center justify-between bg-neutral-800 px-4 py-3 rounded">
          <div>
            <p className="font-medium">Control RFID</p>
            <p className="text-xs text-neutral-400">
              Activar actualización automática de stock
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              onChange({ ...product, isRFID: !isRFID })
            }
            className={`w-14 h-7 flex items-center rounded-full transition ${
              isRFID ? "bg-green-500" : "bg-neutral-600"
            }`}
          >
            <span
              className={`h-6 w-6 bg-white rounded-full transform transition ${
                isRFID ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Acciones */}
        <div className="flex gap-3 pt-4">
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
