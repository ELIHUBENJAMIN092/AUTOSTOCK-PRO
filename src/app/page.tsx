"use client";

import { useEffect, useState } from "react";

type Category = {
  _id: string;
  name: string;
  isActive?: boolean;
};

type Product = {
  _id: string;
  code: string;
  name: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: Category;
  image?: string;
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  async function fetchData() {
  try {
    const [prodRes, catRes] = await Promise.all([
      fetch("/api/products", { cache: "no-store" }),
      fetch("/api/categories", { cache: "no-store" }),
    ]);

    const prodJson = await prodRes.json();
    const catJson = await catRes.json();

    const productsData = Array.isArray(prodJson) ? prodJson : [];
    const categoriesData = Array.isArray(catJson)
      ? catJson.filter((c) => c.isActive)
      : [];

    setProducts(productsData);
    setCategories(categoriesData);
  } catch (error) {
    console.error("❌ Error cargando datos:", error);
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
    fetchData();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      !filterCategory || p.category?._id === filterCategory;

    return matchSearch && matchCategory;
  });

  return (
    <div className="bg-neutral-950 min-h-screen text-white px-6 py-10">
      <h1 className="text-3xl font-semibold mb-8 text-center">
        Inventario de Repuestos
      </h1>

      {/* 🔍 FILTROS */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between">
        <input
          type="text"
          placeholder="Buscar por nombre o código..."
          className="w-full md:w-96 px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg"
        >
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-neutral-400">Cargando productos…</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p._id}
              className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden"
            >
              <img
                src={p.image || "https://via.placeholder.com/400"}
                alt={p.name}
                className="w-full aspect-square object-cover"
              />

              <div className="p-4">
                <span className="text-xs text-neutral-500">
                  Código: {p.code}
                </span>
                <h3 className="text-sm font-semibold mt-1">{p.name}</h3>
                <p className="text-xs text-neutral-400 line-clamp-2">
                  {p.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
