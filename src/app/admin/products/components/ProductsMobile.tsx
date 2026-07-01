"use client";

import { AlertTriangle } from "lucide-react";
import ProductActions from "./ProductActions";
import type { Product } from "@/types";

interface Props {
  products: Product[];
  savedRow: string | null;
  updateStock: (id: string, delta: number) => void;
  saveStock: (product: Product) => Promise<void>;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductsMobile({
  products,
  savedRow,
  updateStock,
  saveStock,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="w-full max-w-full space-y-4 overflow-hidden">
      {products.map((product) => (
        <div
          key={product._id}
          className="w-full rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 overflow-hidden"
        >
          <div className="flex items-center gap-3">
            {product.image && (
              <img
                src={product.image}
                alt=""
                className="h-10 w-10 rounded-lg object-cover border border-neutral-700 shrink-0"
              />
            )}
            <div className="font-medium text-neutral-100 break-words min-w-0">
              {product.name}
            </div>
          </div>

          <div className="text-sm text-neutral-400 mb-4">
            Stock: {product.stock}
            {(product.stock ?? 0) <= (product.minStock ?? 5) && (
              <span className="ml-2 inline-flex items-center gap-1 text-amber-400" aria-label="Stock bajo">
                <AlertTriangle size={14} /> bajo
              </span>
            )}
          </div>

          <div className="w-full overflow-hidden">
            <div className="flex flex-wrap gap-2 justify-end">
              <ProductActions
                product={product}
                savedRow={savedRow}
                onUpdateStock={updateStock}
                onSave={saveStock}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}