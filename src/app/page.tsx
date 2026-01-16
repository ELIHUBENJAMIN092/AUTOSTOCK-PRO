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

  const fetchData = async () => {
    const [prodRes, catRes] = await Promise.all([
      fetch("/api/products"),
      fetch("/api/categories"),
    ]);

    const productsData = await prodRes.json();
    const categoriesData = (await catRes.json()).filter(
      (c: Category) => c.isActive
    );

    setProducts(productsData);
    setCategories(categoriesData);
    setLoading(false);
  };

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
    <div className="bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 min-h-screen text-white">

      {/* ================= HEADER ================= */}
      <header className="w-full px-6 py-6 flex flex-col lg:flex-row justify-between items-center">
        <a href="#" className="flex items-center gap-3 mb-6 lg:mb-0">
          <img
            src="https://static.shuffle.dev/uploads/files/ac/ac180bf4933c1e0d7ef4aa78934b884e39b64e5d/logos/logo-78d34ac57821d853aaf47e300463f4f0.png"
            alt="Logo"
            className="h-10"
          />
          <span className="text-2xl font-semibold tracking-wide">
            COMPEL
          </span>
        </a>

        <nav className="flex gap-6 mb-4 lg:mb-0">
          <a href="#inventario" className="text-sm text-neutral-300 hover:text-white">
            Inventario
          </a>
          <a href="#categorias" className="text-sm text-neutral-300 hover:text-white">
            Categorías
          </a>
          <a href="#contacto" className="text-sm text-neutral-300 hover:text-white">
            Contacto
          </a>
        </nav>

        <a
          href="/admin"
          className="px-5 py-2 bg-white text-neutral-950 font-semibold rounded-full hover:shadow-lg transition"
        >
          Administrador
        </a>
      </header>

      {/* ================= INVENTARIO ================= */}
      <section id="inventario" className="w-full px-6 py-20">
        <h2 className="text-5xl text-center mb-8 font-medium text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300">
          Inventario de Repuestos
        </h2>

        <div className="flex flex-col md:flex-row gap-4 mb-10 justify-between">
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
                className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-700 transition"
              >
                <img
                  src={p.image ?? "https://via.placeholder.com/400"}
                  alt={p.name}
                  className="w-full aspect-square object-cover"
                />

                <div className="p-4">
                  <span className="text-xs text-neutral-500">
                    Código: {p.code}
                  </span>
                  <h3 className="text-sm font-semibold mt-1">
                    {p.name}
                  </h3>
                  <p className="text-xs text-neutral-400 line-clamp-2">
                    {p.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
