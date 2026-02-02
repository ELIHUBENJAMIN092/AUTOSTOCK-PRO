"use client";

import { useEffect, useState } from "react";
import { Plus, Minus, Pencil, Save, Check } from "lucide-react";
import SearchBar from "@/app/components/home/SearchBar";
import CreateProductForm from "./components/CreateProductForm";
import EditProductModal from "./components/EditProductModal";
import type { Product, Category } from "./types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedRow, setSavedRow] = useState<string | null>(null);


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

  /* ================= STOCK (UI) ================= */
  const updateStock = (id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p._id === id
          ? { ...p, stock: Math.max(0, (p.stock ?? 0) + delta) }
          : p
      )
    );
  };

  /* ================= GUARDAR STOCK ================= */
  const saveStock = async (product: Product) => {
    try {
      await fetch(`/api/products/${product._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: product.stock }),
      });

      setSavedRow(product._id);

      setTimeout(() => {
        setSavedRow(null);
      }, 2000);

      fetchProducts();
    } catch (error) {
      console.error("Error guardando stock", error);
    }
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

      <CreateProductForm
        categories={categories}
        onSubmit={createProduct}
        code={code}
        setCode={setCode}
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
        price={price}
        setPrice={setPrice}
        stock={stock}
        setStock={setStock}
        category={category}
        setCategory={setCategory}
        image={image}
        setImage={setImage}
        error={error}
      />

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Buscar por nombre o número de parte..."
      />

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          {/* ===== MOBILE ===== */}
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

                  <div className="flex gap-2">
                    <button
                      onClick={() => saveStock(p)}
                      className={`
    w-10 h-10 rounded-lg flex items-center justify-center transition
    ${savedRow === p._id
                          ? "bg-green-600 text-white"
                          : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                        }
  `}
                    >
                      {savedRow === p._id ? <Check /> : <Save />}
                    </button>

                    <button
                      onClick={() => setEditProduct(p)}
                      className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center"
                    >
                      <Pencil />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ===== DESKTOP ===== */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border border-neutral-800 rounded">
              <thead className="bg-neutral-900">
                <tr>
                  <th className="p-3 text-left">Código</th>
                  <th className="p-3 text-left">Nombre</th>
                  <th className="p-3 text-left">Categoría</th>
                  <th className="p-3 text-left">Stock</th>
                  <th className="p-3 text-center">Acciones</th>
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
                          onClick={() => saveStock(p)}
                          className={`
    w-8 h-8 rounded flex items-center justify-center transition
    ${savedRow === p._id
                              ? "bg-green-600 text-white"
                              : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                            }
  `}
                        >
                          {savedRow === p._id ? (
                            <Check size={16} />
                          ) : (
                            <Save size={16} />
                          )}
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

      {editProduct && (
        <EditProductModal
          product={editProduct}
          categories={categories}
          saving={saving}
          onChange={setEditProduct}
          onClose={() => setEditProduct(null)}
          onSave={saveEdit}
        />
      )}
    </div>
  );
}
