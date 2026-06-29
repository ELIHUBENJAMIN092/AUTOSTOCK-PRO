"use client";

import { Minus, Plus, Save, Check, Pencil, Trash2 } from "lucide-react";
import type { Product } from "../types";

interface Props {
  product: Product;
  savedRow: string | null;
  onUpdateStock: (id: string, delta: number) => void;
  onSave: (product: Product) => Promise<void>;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductActions({
  product,
  savedRow,
  onUpdateStock,
  onSave,
  onEdit,
  onDelete,
}: Props) {
  const isSaved = savedRow === product._id;

  const baseBtn =
    "p-2 md:p-2.5 rounded-lg border transition-all duration-200 shrink-0";

  const grayBtn =
    "border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500";

  const greenBtn =
    "border-green-500 text-green-500 bg-green-500/10";

  const redBtn =
    "border-rose-500 text-rose-400 bg-rose-500/10 hover:text-white hover:border-rose-300";

  return (
    <div className="flex flex-wrap justify-end gap-2 w-full">
      <button
        type="button"
        onClick={() => onUpdateStock(product._id, -1)}
        className={`${baseBtn} ${grayBtn}`}
        title="Disminuir stock"
      >
        <Minus className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => onUpdateStock(product._id, 1)}
        className={`${baseBtn} ${grayBtn}`}
        title="Aumentar stock"
      >
        <Plus className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => onSave(product)}
        className={`${baseBtn} ${isSaved ? greenBtn : grayBtn}`}
        title={isSaved ? "Guardado" : "Guardar"}
      >
        {isSaved ? (
          <Check className="w-4 h-4" />
        ) : (
          <Save className="w-4 h-4" />
        )}
      </button>

      <button
        type="button"
        onClick={() => onEdit(product)}
        className={`${baseBtn} ${grayBtn}`}
        title="Editar producto"
      >
        <Pencil className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => onDelete(product)}
        className={`${baseBtn} ${redBtn}`}
        title="Eliminar producto"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
