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

        {/* BUSCADOR REUTILIZABLE */}
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
