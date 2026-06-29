"use client";

import type { Product, Category } from "../types";
import Button from '@/app/components/ui/Button'
import IconButton from '@/app/components/ui/IconButton'

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
        <div className="flex items-center justify-between bg-neutral-800 px-4 py-3 rounded-xl shadow-inner shadow-black/20">
          <div>
            <p className="font-medium text-white">Control RFID</p>
            <p className="text-xs text-neutral-400">
              Activar actualización automática de stock
            </p>
          </div>

          <button
            type="button"
            onClick={() => onChange({ ...product, isRFID: !isRFID })}
            className={`relative inline-flex h-10 w-24 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
              isRFID ? "bg-emerald-500" : "bg-neutral-700 hover:bg-neutral-600"
            }`}
            title={isRFID ? "Desactivar RFID" : "Activar RFID"}
          >
            <span
              className={`absolute left-1 top-1 h-8 w-8 rounded-full bg-white shadow-md transition-transform duration-300 ${
                isRFID ? "translate-x-12" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Acciones */}
        <div className="flex gap-3 pt-4">
            <Button onClick={onClose} className="flex-1 bg-neutral-700 py-2 rounded">Cancelar</Button>

            <Button onClick={onSave} disabled={saving} className="flex-1 bg-white text-black py-2 rounded font-semibold">{saving ? "Guardando..." : "Guardar"}</Button>
        </div>
      </div>
    </div>
  );
}
