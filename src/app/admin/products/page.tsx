"use client";

import { useEffect, useState } from "react";
import { Plus, Minus, Pencil } from "lucide-react";

type Category = {
  _id: string;
  name: string;
  isActive: boolean;
};

type Product = {
  _id: string;
  code?: string;
  name: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: Category;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal editar
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([fetchProducts(), fetchCategories()]).finally(() =>
      setLoading(false)
    );
  }, []);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    setProducts(await res.json());
  };

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data.filter((c: Category) => c.isActive));
  };

  // ================= STOCK =================
  const updateStock = async (id: string, delta: number) => {
    const product = products.find((p) => p._id === id);
    if (!product) return;

    const newStock = Math.max(0, (product.stock ?? 0) + delta);

    setProducts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, stock: newStock } : p))
    );

    await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: newStock }),
    });
  };

  // ================= GUARDAR EDICIÓN =================
  const saveEdit = async () => {
    if (!editProduct) return;
    setSaving(true);

    await fetch(`/api/products/${editProduct._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: editProduct.code,
        name: editProduct.name,
        description: editProduct.description,
        price: editProduct.price,
        stock: editProduct.stock,
        category: editProduct.category?._id,
      }),
    });

    setSaving(false);
    setEditProduct(null);
    fetchProducts();
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.code ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Productos</h1>

      {/* BUSCADOR */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar producto..."
        className="w-full mb-6 px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg"
      />

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          {/* ================= MOBILE ================= */}
          <div className="space-y-4 md:hidden">
            {filteredProducts.map((p) => (
              <div
                key={p._id}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-4"
              >
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  {p.code} · {p.category?.name}
                </p>

                <p className="mt-2">${p.price?.toFixed(2)}</p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateStock(p._id, -1)}
                      disabled={(p.stock ?? 0) === 0}
                      className="w-10 h-10 bg-neutral-800 rounded-lg
                                 flex items-center justify-center
                                 disabled:opacity-40"
                    >
                      <Minus />
                    </button>

                    <span className="text-lg font-semibold">
                      {p.stock ?? 0}
                    </span>

                    <button
                      onClick={() => updateStock(p._id, 1)}
                      className="w-10 h-10 bg-neutral-800 rounded-lg
                                 flex items-center justify-center"
                    >
                      <Plus />
                    </button>
                  </div>

                  <button
                    onClick={() => setEditProduct(p)}
                    className="w-10 h-10 bg-neutral-800 rounded-lg
                               flex items-center justify-center"
                  >
                    <Pencil />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ================= DESKTOP ================= */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border border-neutral-800 rounded">
              <thead className="bg-neutral-900">
                <tr>
                  <th className="p-3 text-left">Código</th>
                  <th className="p-3 text-left">Nombre</th>
                  <th className="p-3 text-left">Categoría</th>
                  <th className="p-3 text-left">Precio</th>
                  <th className="p-3 text-left">Stock</th>
                  <th className="p-3">Editar</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr
                    key={p._id}
                    className="border-t border-neutral-800 hover:bg-neutral-900"
                  >
                    <td className="p-3">{p.code}</td>
                    <td className="p-3">{p.name}</td>
                    <td className="p-3">{p.category?.name}</td>
                    <td className="p-3">${p.price?.toFixed(2)}</td>
                    <td className="p-3 font-semibold">{p.stock}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateStock(p._id, -1)}
                          className="w-8 h-8 bg-neutral-800 rounded
                                     flex items-center justify-center"
                        >
                          <Minus size={16} />
                        </button>

                        <button
                          onClick={() => updateStock(p._id, 1)}
                          className="w-8 h-8 bg-neutral-800 rounded
                                     flex items-center justify-center"
                        >
                          <Plus size={16} />
                        </button>

                        <button
                          onClick={() => setEditProduct(p)}
                          className="w-8 h-8 bg-neutral-800 rounded
                                     flex items-center justify-center"
                        >
                          <Pencil size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ================= MODAL EDITAR ================= */}
      {editProduct && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-neutral-900 w-full max-w-lg p-6 rounded-xl space-y-4">
            <h2 className="text-lg font-semibold">Editar producto</h2>

            <input
              value={editProduct.code ?? ""}
              onChange={(e) =>
                setEditProduct({ ...editProduct, code: e.target.value })
              }
              className="w-full px-4 py-2 bg-neutral-800 rounded"
              placeholder="Código"
            />

            <input
              value={editProduct.name}
              onChange={(e) =>
                setEditProduct({ ...editProduct, name: e.target.value })
              }
              className="w-full px-4 py-2 bg-neutral-800 rounded"
              placeholder="Nombre"
            />

            <input
              value={editProduct.description ?? ""}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  description: e.target.value,
                })
              }
              className="w-full px-4 py-2 bg-neutral-800 rounded"
              placeholder="Ubicación"
            />

            <input
              type="number"
              value={editProduct.price ?? 0}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  price: Number(e.target.value),
                })
              }
              className="w-full px-4 py-2 bg-neutral-800 rounded"
              placeholder="Precio"
            />

            <input
              type="number"
              value={editProduct.stock ?? 0}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  stock: Number(e.target.value),
                })
              }
              className="w-full px-4 py-2 bg-neutral-800 rounded"
              placeholder="Stock"
            />

            <select
              value={editProduct.category?._id ?? ""}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  category: categories.find(
                    (c) => c._id === e.target.value
                  ),
                })
              }
              className="w-full px-4 py-2 bg-neutral-800 rounded"
            >
              <option value="">Selecciona categoría</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setEditProduct(null)}
                className="flex-1 bg-neutral-700 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={saveEdit}
                disabled={saving}
                className="flex-1 bg-white text-black py-2 rounded"
              >
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
