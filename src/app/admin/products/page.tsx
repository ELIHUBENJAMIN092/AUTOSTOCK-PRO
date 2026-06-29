"use client";

import { useEffect, useState } from "react";
import { useProducts } from "./hooks/useProducts";

import ProductsTable from "./components/ProductsTable";
import ProductsMobile from "./components/ProductsMobile";
import EditProductModal from "./components/EditProductModal";
import SearchBar from "@/app/components/home/SearchBar";
import ScrollToTop from "@/app/components/ScrollToTop";

import Link from "next/link";
import type { Product } from "./types";

export default function ProductsPage() {
  const {
    products,
    categories,
    loading,
    savedRow,
    updateStock,
    saveStock,
    refreshProducts,
  } = useProducts();

  const [search, setSearch] = useState("");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);

  useEffect(() => {
    setVisibleCount(20);
  }, [search]);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.code ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const displayedProducts = filteredProducts.slice(0, visibleCount);

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
        minStock: editProduct.minStock,
        category: editProduct.category?._id,
        isRFID: editProduct.isRFID,
        isActive: editProduct.isActive,
      }),
    });

    setSaving(false);
    setEditProduct(null);
    refreshProducts();
  };

  const handleDelete = async (product: Product) => {
    const confirmed = window.confirm(
      `¿Estás seguro de eliminar el producto "${product.name}"? Esta acción no se puede deshacer.`
    );

    if (!confirmed) return;

    await fetch(`/api/products/${product._id}`, {
      method: "DELETE",
    });

    refreshProducts();
  };

  if (loading) {
    return (
      <div className="w-full px-4 text-neutral-400">
        Cargando productos...
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden px-4 text-white mx-auto space-y-8">
      <div className="rounded-3xl border border-cyan-700 bg-gradient-to-r from-cyan-950 via-slate-950 to-slate-900 p-6 shadow-lg shadow-cyan-500/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-400">Gestión de Productos</p>
            <h1 className="text-3xl font-bold text-white">Inventario y control RFID</h1>
            <p className="mt-2 max-w-2xl text-neutral-300">
              Administra el inventario, actualiza stock, edita datos y elimina productos cuando sea necesario.
            </p>
          </div>

          <Link
            href="/admin/products/crear"
            className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-100"
          >
            + Crear producto
          </Link>
        </div>
      </div>

      <div className="w-full">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nombre o código..."
        />
      </div>

      <div className="md:hidden w-full overflow-hidden">
        <ProductsMobile
          products={displayedProducts}
          savedRow={savedRow}
          updateStock={updateStock}
          saveStock={saveStock}
          onEdit={setEditProduct}
          onDelete={handleDelete}
        />
      </div>

      <div className="hidden md:block w-full overflow-x-auto">
        <ProductsTable
          products={displayedProducts}
          savedRow={savedRow}
          updateStock={updateStock}
          saveStock={saveStock}
          onEdit={setEditProduct}
          onDelete={handleDelete}
        />
      </div>

      {filteredProducts.length > visibleCount && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-neutral-400">
            Quedan {filteredProducts.length - visibleCount} productos por cargar.
          </p>
          <button
            onClick={() => setVisibleCount((current) => Math.min(current + 20, filteredProducts.length))}
            className="rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400"
          >
            Ver más
          </button>
        </div>
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

      <ScrollToTop />
    </div>
  );
}