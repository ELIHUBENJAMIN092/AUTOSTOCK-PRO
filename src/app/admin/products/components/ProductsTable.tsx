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

export default function ProductsTable({
  products,
  savedRow,
  updateStock,
  saveStock,
  onEdit,
  onDelete,
}: Props) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-neutral-800 text-neutral-400">
          <th className="text-left py-2">Producto</th>
          <th className="text-center">Stock</th>
          <th className="text-right">Acciones</th>
          <th className="w-14"></th>
        </tr>
      </thead>

      <tbody>
        {products.map((product) => (
          <tr
            key={product._id}
            className="border-b border-neutral-800 hover:bg-slate-900/70 transition"
          >
            <td className="py-3">
              <div className="flex items-center gap-3">
                {product.image && (
                  <img
                    src={product.image}
                    alt=""
                    className="h-10 w-10 rounded-lg object-cover border border-neutral-700"
                  />
                )}
                <span className="text-sm font-medium text-slate-100">{product.name}</span>
              </div>
            </td>
            <td className="text-center text-slate-200">
              <span className="inline-flex items-center gap-1.5">
                {product.stock}
                {(product.stock ?? 0) <= (product.minStock ?? 5) && (
                  <AlertTriangle size={14} className="text-amber-400" aria-label="Stock bajo" />
                )}
              </span>
            </td>
            <td className="flex justify-end py-3">
              <ProductActions
                product={product}
                savedRow={savedRow}
                onUpdateStock={updateStock}
                onSave={saveStock}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
