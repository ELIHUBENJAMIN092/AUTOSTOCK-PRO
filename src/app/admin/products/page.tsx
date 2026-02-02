"use client";

import { useState } from "react";
import { useProducts } from "./hooks/useProducts";

import ProductsTable from "./components/ProductsTable";
import ProductsMobile from "./components/ProductsMobile";
import ProductForm from "./components/ProductForm";
import EditProductModal from "./components/EditProductModal";
import SearchBar from "@/app/components/home/SearchBar";

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
      }),
    });

    setSaving(false);
    setEditProduct(null);
    refreshProducts();
  };

  if (loading) {
    return <p className="text-neutral-400">Cargando productos...</p>;
  }

  return (
    <div className="p-6 space-y-8 text-white">
      <h1 className="text-2xl font-bold">Productos</h1>

      {/* ➕ Crear */}
      <ProductForm
        categories={categories}
        onCreated={refreshProducts}
      />

      {/* 🔍 Buscar */}
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Buscar por nombre o código..."
      />

      {/* Mobile */}
      <div className="md:hidden">
        <ProductsMobile
          products={filteredProducts}
          savedRow={savedRow}
          updateStock={updateStock}
          saveStock={saveStock}
          onEdit={setEditProduct}
        />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
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
    </div>
  );
}
