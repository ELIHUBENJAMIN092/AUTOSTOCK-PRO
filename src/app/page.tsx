"use client";

import { useEffect, useState } from "react";

type Category = {
  _id: string;
  name: string;
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
      fetch("/api/categories")
    ]);
    const productsData = await prodRes.json();
    const categoriesData = (await catRes.json()).filter((c: Category) => c.isActive);

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

      {/* ================= HEADER / HERO ================= */}
      <header className="container mx-auto px-4 py-8 flex flex-col lg:flex-row justify-between items-center">
        <a href="#" className="flex items-center gap-2 mb-6 lg:mb-0">
          <img src="https://static.shuffle.dev/uploads/files/ac/ac180bf4933c1e0d7ef4aa78934b884e39b64e5d/logos/logo-78d34ac57821d853aaf47e300463f4f0.png" alt="Logo" className="h-10"/>
          <span className="text-xl font-semibold">AutoStock Pro</span>
        </a>
        <nav className="flex gap-6 mb-4 lg:mb-0">
          <a href="#inventario" className="text-sm hover:text-white text-neutral-300 transition-colors">Inventario</a>
          <a href="#categorias" className="text-sm hover:text-white text-neutral-300 transition-colors">Categorías</a>
          <a href="#contacto" className="text-sm hover:text-white text-neutral-300 transition-colors">Contacto</a>
        </nav>
        <a href="/admin" className="px-4 py-2 bg-white text-neutral-950 font-semibold rounded-full hover:shadow-lg transition-all duration-200">Administrador</a>
      </header>

      <section className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-8 lg:gap-12 py-12">
        <div className="lg:w-1/2">
          <span className="text-sm text-neutral-400 font-medium">Sistema de Gestión Inteligente</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 my-4">
            Control Total de tus Repuestos Automotrices
          </h1>
          <p className="text-neutral-300 text-lg mb-6">
            Administra tu inventario de repuestos en tiempo real con nuestro sistema integrado. Consulta disponibilidad, gestiona stock y mantén tu negocio organizado con tecnología MongoDB.
          </p>
          <div className="flex gap-4 flex-wrap">
            <a href="#inventario" className="px-6 py-3 bg-white text-neutral-950 font-semibold rounded-full hover:shadow-lg transition-all duration-200">Ver inventario</a>
            <a href="/admin" className="px-6 py-3 border border-neutral-700 text-white rounded-full hover:border-white transition-all duration-200">Panel Administrativo</a>
          </div>
        </div>
        <div className="lg:w-1/2 relative">
          <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-blue-400 to-purple-800 rounded-2xl filter blur-3xl"></div>
          <div className="p-1 border border-white border-opacity-20 rounded-2xl">
            <img src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=850" alt="Hero" className="rounded-xl relative object-cover w-full"/>
          </div>
        </div>
      </section>

      {/* ================= INVENTARIO ================= */}
      <section id="inventario" className="container mx-auto px-4 py-20">
        <h2 className="text-5xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 text-center mb-6">Inventario de Repuestos</h2>
        <p className="text-center text-neutral-300 mb-12">Consulta nuestro stock disponible en tiempo real. Cada repuesto incluye imagen, descripción detallada y disponibilidad actualizada.</p>

        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
          <input 
            type="text" 
            placeholder="Buscar por nombre o código..." 
            className="w-full md:w-96 px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg placeholder-neutral-400 focus:border-white focus:outline-none text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white"
          >
            <option value="">Todas las Categorías</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-center text-neutral-400">Cargando productos...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((p) => (
              <div key={p._id} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-700 transition-all duration-200">
                <div className="relative aspect-square">
                  <img src={p.image ?? "https://via.placeholder.com/400"} alt={p.name} className="w-full h-full object-cover"/>
                  <div className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full ${p.stock! > 10 ? 'bg-green-600' : p.stock! > 0 ? 'bg-yellow-600' : 'bg-red-600'}`}>
                    {p.stock! > 10 ? 'En Stock' : p.stock! > 0 ? 'Stock Bajo' : 'Sin Stock'}
                  </div>
                </div>
                <div className="p-5">
                  <span className="text-xs text-neutral-500 font-medium">Código: {p.code}</span>
                  <h3 className="text-xl font-semibold text-white mb-2">{p.name}</h3>
                  <p className="text-sm text-neutral-400 mb-4">{p.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400 text-sm">Stock:</span>
                    <span className="text-white font-semibold">{p.stock}</span>
                    <span className="px-3 py-1 bg-neutral-800 text-neutral-300 text-xs font-medium rounded-full">{p.category?.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gradient-to-b from-neutral-900 to-neutral-950 py-12 border-t border-neutral-800">
        <div className="container mx-auto px-4 text-neutral-400 flex flex-col md:flex-row justify-between gap-8">
          <div>
            <a href="#" className="flex items-center gap-2 mb-4">
              <img src="https://static.shuffle.dev/uploads/files/ac/ac180bf4933c1e0d7ef4aa78934b884e39b64e5d/logos/logo-78d34ac57821d853aaf47e300463f4f0.png" alt="Logo" className="h-8"/>
              <span className="text-xl font-semibold text-white">AutoStock Pro</span>
            </a>
            <p>Sistema integral de gestión de inventario de repuestos automotrices con tecnología MongoDB.</p>
          </div>
          <div>
            <h6 className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 mb-4">Enlaces rápidos</h6>
            <ul className="space-y-2">
              <li><a href="#inventario" className="hover:text-white transition-colors">Inventario</a></li>
              <li><a href="#categorias" className="hover:text-white transition-colors">Categorías</a></li>
              <li><a href="#contacto" className="hover:text-white transition-colors">Contacto</a></li>
            </ul>
          </div>
          <div>
            <h6 className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 mb-4">Contacto</h6>
            <ul className="space-y-2">
              <li>📧 info@autostock.com</li>
              <li>📱 +1 (555) 123-4567</li>
              <li>📍Av. Principal 123</li>
            </ul>
          </div>
        </div>
        <p className="mt-8 text-center text-sm text-neutral-500">© 2026 AutoStock Pro. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
