"use client";

import { Minus, Plus, Save, Check, Pencil } from "lucide-react";
import type { Product } from "../types";

interface Props {
  product: Product;
  savedRow: string | null;
  onUpdateStock: (id: string, delta: number) => void;
  onSave: (product: Product) => Promise<void>;
  onEdit: (product: Product) => void;
}

export default function ProductActions({
  product,
  savedRow,
  onUpdateStock,
  onSave,
  onEdit,
}: Props) {
  const isSaved = savedRow === product._id;

  const baseBtn =
    "p-2 rounded-lg border transition-all duration-200";

  const grayBtn =
    "border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500";

  const greenBtn =
    "border-green-500 text-green-500 bg-green-500/10";

  return (
    <div className="flex items-center gap-2">
      {/* ➖ */}
      <button
        onClick={() => onUpdateStock(product._id, -1)}
        className={`${baseBtn} ${grayBtn}`}
      >
        <Minus className="w-4 h-4" />
      </button>

      {/* ➕ */}
      <button
        onClick={() => onUpdateStock(product._id, 1)}
        className={`${baseBtn} ${grayBtn}`}
      >
        <Plus className="w-4 h-4" />
      </button>

      {/* 💾 Guardar / ✔ */}
      <button
        onClick={() => onSave(product)}
        className={`${baseBtn} ${isSaved ? greenBtn : grayBtn}`}
      >
        {isSaved ? (
          <Check className="w-4 h-4" />
        ) : (
          <Save className="w-4 h-4" />
        )}
      </button>

      {/* ✏️ Editar */}
      <button
        onClick={() => onEdit(product)}
        className={`${baseBtn} ${grayBtn}`}
      >
        <Pencil className="w-4 h-4" />
      </button>
    </div>
  );
}
