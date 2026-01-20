'use client'

import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'

export default function Inventory() {
  const [products, setProducts] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [])

  const categories = Array.from(
    new Set(
      products
        .map(p => p.category?.name)
        .filter(Boolean)
    )
  )

  const filtered = products.filter(p => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase())

    const matchCategory =
      category === 'all' || p.category?.name === category

    return matchSearch && matchCategory
  })

  return (
    <section
      id="inventario"
      className="bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 py-20"
    >
      <div className="container px-4 mx-auto">

        <h2 className="text-5xl text-center font-medium text-transparent bg-clip-text
          bg-gradient-to-r from-gray-100 to-gray-300 mb-10">
          Inventario de Repuestos
        </h2>

        {/* BUSCADOR */}
        <div className="max-w-3xl mx-auto mb-6 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
              />
            </svg>
          </span>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o número de parte..."
            className="w-full pl-12 pr-4 py-3 rounded-lg
              bg-neutral-800 border border-neutral-700 text-white
              focus:outline-none focus:border-neutral-500"
          />
        </div>

        {/* FILTRO POR CATEGORÍAS (CHIPS) */}
        {categories.length > 0 && (
          <div className="max-w-6xl mx-auto mb-12">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">

              {/* TODAS */}
              <button
                onClick={() => setCategory('all')}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition
                  ${
                    category === 'all'
                      ? 'bg-white text-black'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
              >
                Todas
              </button>

              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition
                    ${
                      category === cat
                        ? 'bg-white text-black'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PRODUCTOS */}
        {loading ? (
          <p className="text-center text-neutral-400">Cargando...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-neutral-400">
            No se encontraron productos
          </p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {filtered.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
