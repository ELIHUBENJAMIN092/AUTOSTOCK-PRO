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
    <div className="w-full max-w-full space-y-4 overflow-hidden">
      {products.map((product) => (
        <div
          key={product._id}
          className="w-full rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 overflow-hidden"
        >
          <div className="font-medium text-neutral-100 break-words">
            {product.name}
          </div>

          <div className="text-sm text-neutral-400 mb-4">
            Stock: {product.stock}
          </div>

          <div className="w-full overflow-hidden">
            <div className="flex flex-wrap gap-2 justify-end">
              <ProductActions
                product={product}
                savedRow={savedRow}
                onUpdateStock={updateStock}
                onSave={saveStock}
                onEdit={onEdit}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}