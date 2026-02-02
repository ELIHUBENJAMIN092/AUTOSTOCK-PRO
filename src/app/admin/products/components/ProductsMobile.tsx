"use client";

import ProductActions from "./ProductActions";
import type { Product } from "../types";

interface Props {
  products: Product[];
  savedRow: string | null;
  updateStock: (id: string, delta: number) => void;
  saveStock: (product: Product) => Promise<void>;
  onEdit: (product: Product) => void;
}

export default function ProductsMobile({
  products,
  savedRow,
  updateStock,
  saveStock,
  onEdit,
}: Props) {
  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div
          key={product._id}
          className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4"
        >
          <div className="font-medium text-neutral-100">
            {product.name}
          </div>

          <div className="text-sm text-neutral-400 mb-3">
            Stock: {product.stock}
          </div>

          <div className="flex justify-end">
            <ProductActions
              product={product}
              savedRow={savedRow}
              onUpdateStock={updateStock}
              onSave={saveStock}
              onEdit={onEdit}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
