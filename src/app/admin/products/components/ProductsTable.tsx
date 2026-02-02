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

export default function ProductsTable({
  products,
  savedRow,
  updateStock,
  saveStock,
  onEdit,
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
          <tr key={product._id} className="border-b border-neutral-800">
            <td className="py-2">{product.name}</td>
            <td className="text-center">{product.stock}</td>
            <td className="flex justify-end py-2">
              <ProductActions
                product={product}
                savedRow={savedRow}
                onUpdateStock={updateStock}
                onSave={saveStock}
                onEdit={onEdit}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
