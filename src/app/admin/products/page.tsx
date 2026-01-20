"use client";

import { useEffect, useState } from "react";
import { ImageIcon } from "lucide-react";


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
  minStock?: number;
  isActive?: boolean;
  category?: Category;
  image?: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Crear
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("0");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  // 📸 Imagen (PASO 2)
  const [image, setImage] = useState<File | null>(null);

  // 🔹 Editar (MODAL)
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  // 🔍 Filtros
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    setProducts(await res.json());
  };

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data.filter((c: Category) => c.isActive));
  };

  useEffect(() => {
    Promise.all([fetchProducts(), fetchCategories()]).finally(() =>
      setLoading(false)
    );
  }, []);

  // ================= CREAR PRODUCTO =================
  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!code || !name || !price || !category) {
      setError("Código, nombre, precio y categoría son obligatorios");
      return;
    }

    let imageUrl = "";

    // 📸 SUBIR IMAGEN A CLOUDINARY
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

    // 📦 GUARDAR PRODUCTO EN DB
    const res = await fetch("/api/products", {
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

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Error creando producto");
      return;
    }

    setCode("");
    setName("");
    setDescription("");
    setPrice("");
    setStock("0");
    setCategory("");
    setImage(null);

    fetchProducts();
  };


  // ================= EDITAR PRODUCTO =================
  const saveEdit = async () => {
    if (!editProduct) return;
    setSaving(true);

    const res = await fetch(`/api/products/${editProduct._id}`, {
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

    if (!res.ok) {
      console.error("Error al guardar producto");
    }

    setSaving(false);
    setEditProduct(null);
    fetchProducts();
  };

  // ================= FILTRO =================
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.code ?? "").toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      !filterCategory || p.category?._id === filterCategory;

    return matchSearch && matchCategory;
  });

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Productos</h1>

      {/* ================= FORMULARIO CREAR PRODUCTO ================= */}
      <div className="mb-8 p-6 bg-neutral-900 rounded-xl border border-neutral-800">
        <h2 className="text-lg font-semibold mb-4">Agregar Nuevo Producto</h2>
        {error && <p className="text-red-500 mb-3">{error}</p>}

        <form
          onSubmit={createProduct}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* 🧾 DATOS PRODUCTO */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Código"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="px-4 py-2 bg-neutral-800 rounded text-white"
            />
            <input
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-2 bg-neutral-800 rounded text-white"
            />

            <input
              type="text"
              placeholder="Ubicación"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="px-4 py-2 bg-neutral-800 rounded text-white md:col-span-2"
            />

            <input
              type="number"
              placeholder="Precio"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="px-4 py-2 bg-neutral-800 rounded text-white"
            />
            <input
              type="number"
              placeholder="Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="px-4 py-2 bg-neutral-800 rounded text-white"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 bg-neutral-800 rounded text-white md:col-span-2"
            >
              <option value="">Selecciona categoría</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* 🖼️ IMAGEN */}
          <div className="flex justify-center">
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              hidden
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImage(e.target.files[0]);
                }
              }}
            />

            {!image ? (
              /* ⬆️ CUADRO SUBIR */
              <label
                htmlFor="imageUpload"
                className="w-44 h-44 flex flex-col items-center justify-center
        border-2 border-dashed border-neutral-600
        rounded-xl cursor-pointer
        hover:border-white hover:bg-neutral-800
        transition text-neutral-400 hover:text-white"
              >
                <ImageIcon size={40} />
                <span className="text-sm mt-2">Subir imagen</span>
              </label>
            ) : (
              /* 🖼️ PREVIEW REEMPLAZA EL CUADRO */
              <div className="relative w-44 h-44">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-xl border border-neutral-700"
                />

                {/* ❌ BOTÓN BORRAR */}
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="absolute top-2 right-2 bg-black/70
          text-white rounded-full w-7 h-7
          flex items-center justify-center
          hover:bg-red-600 transition"
                  title="Eliminar imagen"
                >
                  ✕
                </button>
              </div>
            )}
          </div>


          {/* 🔘 BOTÓN */}
          <button
            type="submit"
            className="md:col-span-3 bg-white text-black py-3 rounded font-semibold hover:shadow-lg transition"
          >
            Agregar Producto
          </button>
        </form>
      </div>

      {/* ================= BUSCADOR ================= */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar..."
          className="flex-1 px-4 py-2 bg-neutral-800 rounded"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 bg-neutral-800 rounded"
        >
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* ================= LISTADO ================= */}
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          {/* 📱 MOBILE */}
          <div className="space-y-4 md:hidden">
            {filteredProducts.map((p) => (
              <div
                key={p._id}
                className="bg-neutral-900 border border-neutral-800 rounded p-4"
              >
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-sm text-neutral-400">{p.category?.name}</p>

                <div className="flex justify-between text-sm mt-2">
                  <span>${p.price?.toFixed(2)}</span>
                  <span>Stock: {p.stock ?? 0}</span>
                </div>

                <button
                  onClick={() => setEditProduct(p)}
                  className="mt-3 w-full bg-neutral-800 hover:bg-neutral-700 text-white py-2 rounded text-sm transition"
                >
                  Editar
                </button>
              </div>
            ))}
          </div>

          {/* 🖥️ DESKTOP */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border border-neutral-800 rounded">
              <thead className="bg-neutral-900 text-sm">
                <tr>
                  <th className="p-3 text-left">Código</th>
                  <th className="p-3 text-left">Nombre</th>
                  <th className="p-3 text-left">Categoría</th>
                  <th className="p-3 text-left">Precio</th>
                  <th className="p-3 text-left">Stock</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr
                    key={p._id}
                    className="border-t border-neutral-800 hover:bg-neutral-900 transition"
                  >
                    <td className="p-3">{p.code}</td>
                    <td className="p-3">{p.name}</td>
                    <td className="p-3">{p.category?.name}</td>
                    <td className="p-3">${p.price?.toFixed(2)}</td>
                    <td className="p-3">{p.stock}</td>
                    <td className="p-3">
                      <button
                        onClick={() => setEditProduct(p)}
                        className="bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1 rounded text-sm transition"
                      >
                        Editar
                      </button>
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
        <div className="fixed inset-0 bg-black/60 flex items-end md:items-center justify-center z-50">
          <div className="bg-neutral-900 w-full md:max-w-lg p-6 rounded-t-xl md:rounded-xl space-y-4">
            <h2 className="text-lg font-semibold">Editar producto</h2>

            <input
              value={editProduct.code}
              onChange={(e) =>
                setEditProduct({ ...editProduct, code: e.target.value })
              }
              className="w-full px-4 py-2 bg-neutral-800 rounded text-white"
              placeholder="Código"
            />

            <input
              value={editProduct.name}
              onChange={(e) =>
                setEditProduct({ ...editProduct, name: e.target.value })
              }
              className="w-full px-4 py-2 bg-neutral-800 rounded text-white"
              placeholder="Nombre"
            />

            <input
              value={editProduct.description ?? ""}
              onChange={(e) =>
                setEditProduct({ ...editProduct, description: e.target.value })
              }
              className="w-full px-4 py-2 bg-neutral-800 rounded text-white"
              placeholder="Descripción"
            />

            <input
              type="number"
              value={editProduct.price ?? ""}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  price: Number(e.target.value),
                })
              }
              className="w-full px-4 py-2 bg-neutral-800 rounded text-white"
              placeholder="Precio"
            />

            <input
              type="number"
              value={editProduct.stock ?? ""}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  stock: Number(e.target.value),
                })
              }
              className="w-full px-4 py-2 bg-neutral-800 rounded text-white"
              placeholder="Stock"
            />

            <select
              value={editProduct.category?._id ?? ""}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  category: categories.find((c) => c._id === e.target.value),
                })
              }
              className="w-full px-4 py-2 bg-neutral-800 rounded text-white"
            >
              <option value="">Selecciona categoría</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <div className="flex gap-3">
              <button
                onClick={() => setEditProduct(null)}
                className="flex-1 bg-neutral-700 py-2 rounded text-white hover:bg-neutral-600 transition"
              >
                Cancelar
              </button>
              <button
                onClick={saveEdit}
                disabled={saving}
                className="flex-1 bg-white text-black py-2 rounded hover:shadow-lg transition"
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
