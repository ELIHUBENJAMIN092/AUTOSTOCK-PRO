"use client";

import { useEffect, useState } from "react";
import type { Product, Category } from "../types";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedRow, setSavedRow] = useState<string | null>(null);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    setProducts(await res.json());
  };

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data.filter((c: Category) => c.isActive));
  };

  useEffect(() => {
    Promise.all([fetchProducts(), fetchCategories()])
      .finally(() => setLoading(false));
  }, []);

  /* 🔢 Stock UI */
  const updateStock = (id: string, delta: number) => {
    setProducts(prev =>
      prev.map(p =>
        p._id === id
          ? { ...p, stock: Math.max(0, (p.stock ?? 0) + delta) }
          : p
      )
    );
  };

  /* 💾 Guardar stock */
  const saveStock = async (product: Product) => {
    await fetch(`/api/products/${product._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: product.stock }),
    });

    setSavedRow(product._id);
    setTimeout(() => setSavedRow(null), 2000);

    fetchProducts();
  };

  return {
    products,
    categories,
    loading,
    savedRow,
    updateStock,
    saveStock,

    /** 👇 API pública del hook */
    refreshProducts: fetchProducts,
  };
}
