"use client";

import { useState } from "react";
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

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.code ?? "").toLowerCase().includes(search.toLowerCase())
  );

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

  if (loading) {
    return (
      <div className="w-full px-4 text-neutral-400">
        Cargando productos...
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden px-4 text-white mx-auto space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Productos</h1>

        <Link
          href="/admin/products/crear"
          className="w-full bg-white text-black px-5 py-3 rounded-lg font-semibold text-center hover:bg-neutral-200 transition"
        >
          + Crear producto
        </Link>
      </div>

      <section className="w-full overflow-hidden">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nombre o código..."
        />
      </section>

      <div className="md:hidden w-full overflow-hidden">
        <ProductsMobile
          products={filteredProducts}
          savedRow={savedRow}
          updateStock={updateStock}
          saveStock={saveStock}
          onEdit={setEditProduct}
        />
      </div>

      <div className="hidden md:block w-full overflow-x-auto">
        <ProductsTable
          products={filteredProducts}
          savedRow={savedRow}
          updateStock={updateStock}
          saveStock={saveStock}
          onEdit={setEditProduct}
        />
      </div>

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