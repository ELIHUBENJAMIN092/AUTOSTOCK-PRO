"use client"

import { useEffect, useState } from 'react'
import { Product, Category } from '@/types'
import ProductCard from './ProductCard'
import SearchBar from './SearchBar'
import Button from '@/app/components/ui/Button'
import CategoryFilter from './CategoryFilter'

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [total, setTotal] = useState(0)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch('/api/categories')
        const data = await res.json()
        if (Array.isArray(data)) {
          setCategories(
            data
              .filter((c: any) => c?.isActive)
              .map((c: any) => ({
                _id: c._id,
                name: c.name,
              }))
          )
        }
      } catch (error) {
        console.error('Error cargando categorías:', error)
      }
    }

    loadCategories()
  }, [])

  useEffect(() => {
    setLoading(true)
    fetch(`/api/products?page=1&limit=${limit}`)
      .then(res => res.json())
      .then(({ products, total, page: p }: any) => {
        setProducts(products || [])
        setTotal(total || 0)
        setPage(p || 1)
      })
      .finally(() => setLoading(false))
  }, [limit])

  useEffect(() => {
    // Server-side search: query by name, code or EPC (handled by API)
    const q = search
    setLoading(true)
    fetch(`/api/products?page=1&limit=${limit}${q ? `&q=${encodeURIComponent(q)}` : ''}${category !== 'all' ? `&category=${encodeURIComponent(category)}` : ''}`)
      .then(res => res.json())
      .then(({ products, total, page: p }: any) => {
        setProducts(products || [])
        setTotal(total || 0)
        setPage(p || 1)
      })
      .finally(() => setLoading(false))
  }, [search, category, limit])

  const filtered = products.filter(p => {
    if (category === 'all') return true
    if (!p.category) return false
    return typeof p.category === 'string' ? p.category === category : p.category._id === category
  })
  const visibleProducts = filtered

  return (
    <section
      id="inventario"
      className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-20"
    >
      <div className="container px-4 mx-auto">

        <h2 className="text-5xl text-center font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-sky-200 to-violet-200 mb-10">
          Inventario de Productos
        </h2>

        <SearchBar
          initialValue={search}
          onSearch={setSearch}
          debounceMs={300}
          placeholder="Buscar por nombre, número de parte o EPC..."
        />

        <div className="mt-6">
          <CategoryFilter
            categories={categories}
            value={category}
            onChange={setCategory}
          />
        </div>

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

            {products.length < total ? (
              <div className="flex justify-center mt-10">
                <Button
                  onClick={async () => {
                    setLoadingMore(true)
                    try {
                      const next = page + 1
                      const res = await fetch(`/api/products?page=${next}&limit=${limit}${search ? `&q=${encodeURIComponent(search)}` : ''}${category !== 'all' ? `&category=${encodeURIComponent(category)}` : ''}`)
                      const body = await res.json()
                      setProducts(prev => [...prev, ...(body.products || [])])
                      setPage(body.page || next)
                      setTotal(body.total || total)
                    } finally {
                      setLoadingMore(false)
                    }
                  }}
                  disabled={loadingMore}
                >
                  {loadingMore ? "Cargando..." : "Ver más productos"}
                </Button>
              </div>
            ) : (
              total > 0 && (
                <div className="flex justify-center mt-10 text-neutral-400">
                  No hay más productos
                </div>
              )
            )}
          </>
        )}
      </div>
    </section>
  )
}
