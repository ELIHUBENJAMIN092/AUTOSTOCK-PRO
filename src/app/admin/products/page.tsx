"use client";

import { useState } from "react";
import { useProducts } from "./hooks/useProducts";

import ProductsTable from "./components/ProductsTable";
import ProductsMobile from "./components/ProductsMobile";
import ProductForm from "./components/ProductForm";
import EditProductModal from "./components/EditProductModal";
import SearchBar from "@/app/components/home/SearchBar";
import ScrollToTop from "@/app/components/ScrollToTop";

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
    <div className="w-full overflow-x-hidden px-4 md:px-6 text-white max-w-5xl mx-auto space-y-8">

      <h1 className="text-2xl font-bold">
        Productos
      </h1>

      {/* ➕ Crear */}
      <section className="max-w-full">
        <ProductForm
          categories={categories}
          onCreated={refreshProducts}
        />
      </section>

      {/* 🔍 Buscar */}
      <section className="max-w-full">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nombre o código..."
        />
      </section>

      {/* 📱 Mobile */}
      <div className="md:hidden w-full overflow-x-hidden">
        <ProductsMobile
          products={filteredProducts}
          savedRow={savedRow}
          updateStock={updateStock}
          saveStock={saveStock}
          onEdit={setEditProduct}
        />
      </div>

      {/* 🖥 Desktop */}
      <div className="hidden md:block w-full overflow-x-auto">
        <ProductsTable
          products={filteredProducts}
          savedRow={savedRow}
          updateStock={updateStock}
          saveStock={saveStock}
          onEdit={setEditProduct}
        />
      </div>

      {/* Modal */}
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
