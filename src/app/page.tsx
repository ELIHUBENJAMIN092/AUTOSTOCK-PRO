'use client'

import { useEffect, useState } from 'react'

interface Product {
  _id: string
  code: string
  name: string
  description: string
  image: string
  stock: number
  category?: {
    name: string
  }
}

export default function HomePage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch('/api/products')
        const data = await res.json()
        setProducts(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      {/* ================= HERO + NAVBAR ================= */}
      <section className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950">
        <div className="container px-4 mx-auto">
          <nav className="flex justify-between items-center py-8">
            <a className="flex items-center gap-2">
              <img
                src="https://static.shuffle.dev/uploads/files/ac/ac180bf4933c1e0d7ef4aa78934b884e39b64e5d/logos/logo-78d34ac57821d853aaf47e300463f4f0.png"
                className="h-8"
              />
            </a>

            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="lg:hidden text-neutral-300"
            >
              ☰
            </button>

            <ul className="hidden lg:flex ml-auto mr-8 gap-8">
              <li><a href="#inventario" className="text-neutral-300 hover:text-white">Inventario</a></li>
              <li><a href="#categorias" className="text-neutral-300 hover:text-white">Categorías</a></li>
              <li><a href="#contacto" className="text-neutral-300 hover:text-white">Contacto</a></li>
            </ul>

            {/* Botón de acceso admin con enlace a login */}
            <a 
              href="http://localhost:3000/login" 
              className="hidden lg:block px-4 py-2 bg-white text-neutral-950 rounded-full font-semibold hover:bg-neutral-200 transition"
            >
              Acceso Admin
            </a>
          </nav>

          {/* HERO */}
          <div className="flex flex-wrap items-center pb-20">
            <div className="w-full lg:w-1/2">
              <h1 className="text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-300 font-medium mb-6">
                Control Total de tus Repuestos
              </h1>
              <p className="text-neutral-300 mb-8">
                Gestión de inventario automotriz en tiempo real con MongoDB.
              </p>
              <a
                href="#inventario"
                className="px-6 py-3 bg-white rounded-full font-semibold text-black"
              >
                Ver Inventario
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= INVENTARIO ================= */}
      <section
        id="inventario"
        className="bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 py-20"
      >
        <div className="container px-4 mx-auto">
          <h2 className="text-5xl text-center font-medium text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-300 mb-10">
            Inventario de Repuestos
          </h2>

          {/* BUSCADOR */}
          <div className="max-w-md mx-auto mb-12">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o número de parte..."
              className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none"
            />
          </div>

          {loading ? (
            <p className="text-center text-neutral-400">Cargando...</p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
              {filteredProducts.map((p) => (
                <div
                  key={p._id}
                  className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-700 transition"
                >
                  <div className="relative aspect-square">
                    <img
                      src={
                        p.image ||
                        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400"
                      }
                      className="w-full h-full object-cover"
                    />
                    <span
                      className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full ${
                        p.stock > 10
                          ? "bg-green-600"
                          : p.stock > 0
                          ? "bg-yellow-600"
                          : "bg-red-600"
                      }`}
                    >
                      {p.stock > 10
                        ? "En Stock"
                        : p.stock > 0
                        ? "Stock Bajo"
                        : "Sin Stock"}
                    </span>
                  </div>

                  <div className="p-4">
                    <span className="text-xs text-neutral-500">{p.code}</span>

                    <h3 className="text-white font-semibold mt-1">{p.name}</h3>

                    <p className="text-sm text-neutral-400 mt-2 line-clamp-2">
                      {p.description}
                    </p>

                    <div className="mt-4">
                      <span className="text-sm text-neutral-300">
                        Stock: <b>{p.stock}</b>
                      </span>

                      {p.category?.name && (
                        <div className="mt-2">
                          <span className="text-sm font-semibold text-red-500">
                            {p.category.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gradient-to-b from-neutral-900 to-neutral-950 py-12 border-t border-neutral-800">
        <div className="container px-4 mx-auto text-center text-neutral-500">
          © 2026 AutoStock Pro. Todos los derechos reservados.
        </div>
      </footer>
    </>
  )
}
