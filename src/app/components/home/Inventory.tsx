'use client'

import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import SearchBar from './SearchBar'
import CategoryFilter from './CategoryFilter'

export default function Inventory() {
  const [products, setProducts] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

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

  const visibleProducts = showAll ? filtered : filtered.slice(0, 20)

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

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nombre o número de parte..."
        />

        <CategoryFilter
          categories={categories}
          value={category}
          onChange={setCategory}
        />

        {loading ? (
          <p className="text-center text-neutral-400">Cargando...</p>
        ) : visibleProducts.length === 0 ? (
          <p className="text-center text-neutral-400">
            No se encontraron productos
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
              {visibleProducts.map(p => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>

            {filtered.length > 20 && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="px-6 py-3 rounded-xl bg-white text-black font-semibold
                             hover:opacity-90 transition"
                >
                  {showAll ? "Ver menos" : "Ver más productos"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
