"use client";

import ProductActions from "./ProductActions";
import type { Product } from "../types";

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
        </tr>
      </thead>

      <tbody>
        {products.map((product) => (
          <tr
            key={product._id}
            className="border-b border-neutral-800 hover:bg-slate-900/70 transition"
          >
            <td className="py-3 text-sm font-medium text-slate-100">{product.name}</td>
            <td className="text-center text-slate-200">{product.stock}</td>
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
