"use client";

import { useEffect, useState } from "react";
import { Plus, Minus, Pencil, ImageIcon } from "lucide-react";

/* ================= TIPOS ================= */
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
  image?: string;
};

/* ================= COMPONENTE ================= */
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  /* 🔍 filtros */
  const [search, setSearch] = useState("");

  /* ========== CREAR PRODUCTO ========== */
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("0");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");

  /* ========== EDITAR ========== */
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  /* ================= FETCH ================= */
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

  /* ================= CREAR ================= */
  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !price || !category) {
      setError("Nombre, precio y categoría son obligatorios");
      return;
    }

    let imageUrl = "";

    if (image) {
      const formData = new FormData();
      formData.append("file", image);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        setError("Error subiendo imagen");
        return;
      }

      const uploadData = await uploadRes.json();
      imageUrl = uploadData.url;
    }

    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        category,
        image: imageUrl,
      }),
    });

    setCode("");
    setName("");
    setDescription("");
    setPrice("");
    setStock("0");
    setCategory("");
    setImage(null);

    fetchProducts();
  };

  /* ================= STOCK RÁPIDO ================= */
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

  /* ================= GUARDAR EDICIÓN ================= */
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

  /* ================= RENDER ================= */
  return (
    <div className="p-6 text-white space-y-8">
      <h1 className="text-2xl font-bold">Productos</h1>

      {/* ================= CREAR PRODUCTO ================= */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Agregar Nuevo Producto</h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <form
          onSubmit={createProduct}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* DATOS */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Código"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="bg-neutral-800 px-4 py-2 rounded"
            />

            <input
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-neutral-800 px-4 py-2 rounded"
            />

            <input
              placeholder="Ubicación"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-neutral-800 px-4 py-2 rounded md:col-span-2"
            />

            <input
              type="number"
              placeholder="Precio"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-neutral-800 px-4 py-2 rounded"
            />

            <input
              type="number"
              placeholder="Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="bg-neutral-800 px-4 py-2 rounded"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-neutral-800 px-4 py-2 rounded md:col-span-2"
            >
              <option value="">Selecciona categoría</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* IMAGEN (COMO ANTES) */}
          <div className="flex justify-center">
            <input
              type="file"
              id="imageUpload"
              hidden
              accept="image/*"
              onChange={(e) =>
                e.target.files && setImage(e.target.files[0])
              }
            />

            {!image ? (
              <label
                htmlFor="imageUpload"
                className="w-44 h-44 border-2 border-dashed
                           border-neutral-600 rounded-xl
                           flex flex-col items-center justify-center
                           cursor-pointer hover:bg-neutral-800 transition"
              >
                <ImageIcon size={40} />
                <span className="text-sm mt-2">Subir imagen</span>
              </label>
            ) : (
              <div className="relative w-44 h-44">
                <img
                  src={URL.createObjectURL(image)}
                  className="w-full h-full object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="absolute top-2 right-2 bg-black/70
                             w-7 h-7 rounded-full text-white"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="md:col-span-3 bg-white text-black py-3 rounded font-semibold"
          >
            Agregar Producto
          </button>
        </form>
      </div>

      {/* ================= BUSCADOR ================= */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar producto..."
        className="w-full px-4 py-3 bg-neutral-800 rounded-lg"
      />

      {/* ================= LISTADO ================= */}
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          {/* MOBILE */}
          <div className="md:hidden space-y-4">
            {filteredProducts.map((p) => (
              <div
                key={p._id}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-4"
              >
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-xs text-neutral-400">
                  {p.code} · {p.category?.name}
                </p>

                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateStock(p._id, -1)}
                      className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center"
                    >
                      <Minus />
                    </button>

                    <span className="font-semibold">{p.stock}</span>

                    <button
                      onClick={() => updateStock(p._id, 1)}
                      className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center"
                    >
                      <Plus />
                    </button>
                  </div>

                  <button
                    onClick={() => setEditProduct(p)}
                    className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center"
                  >
                    <Pencil />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border border-neutral-800 rounded">
              <thead className="bg-neutral-900">
                <tr>
                  <th className="p-3 text-left">Código</th>
                  <th className="p-3 text-left">Nombre</th>
                  <th className="p-3 text-left">Categoría</th>
                  <th className="p-3 text-left">Stock</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p._id} className="border-t border-neutral-800">
                    <td className="p-3">{p.code}</td>
                    <td className="p-3">{p.name}</td>
                    <td className="p-3">{p.category?.name}</td>
                    <td className="p-3">{p.stock}</td>
                    <td className="p-3">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => updateStock(p._id, -1)}
                          className="w-8 h-8 bg-neutral-800 rounded flex items-center justify-center"
                        >
                          <Minus size={16} />
                        </button>
                        <button
                          onClick={() => updateStock(p._id, 1)}
                          className="w-8 h-8 bg-neutral-800 rounded flex items-center justify-center"
                        >
                          <Plus size={16} />
                        </button>
                        <button
                          onClick={() => setEditProduct(p)}
                          className="w-8 h-8 bg-neutral-800 rounded flex items-center justify-center"
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
          <div className="bg-neutral-900 p-6 rounded-xl w-full max-w-lg space-y-4">
            <h2 className="text-lg font-semibold">Editar producto</h2>

            <input
              value={editProduct.code ?? ""}
              onChange={(e) =>
                setEditProduct({ ...editProduct, code: e.target.value })
              }
              className="bg-neutral-800 px-4 py-2 rounded w-full"
            />

            <input
              value={editProduct.name}
              onChange={(e) =>
                setEditProduct({ ...editProduct, name: e.target.value })
              }
              className="bg-neutral-800 px-4 py-2 rounded w-full"
            />

            <input
              value={editProduct.description ?? ""}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  description: e.target.value,
                })
              }
              className="bg-neutral-800 px-4 py-2 rounded w-full"
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
              className="bg-neutral-800 px-4 py-2 rounded w-full"
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
              className="bg-neutral-800 px-4 py-2 rounded w-full"
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
              className="bg-neutral-800 px-4 py-2 rounded w-full"
            >
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <div className="flex gap-3">
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
