"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import type { Product, Category } from "@/types";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedRow, setSavedRow] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [stockMin, setStockMin] = useState("");
  const [stockMax, setStockMax] = useState("");
  const pageRef = useRef(page);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  const fetchProducts = useCallback(async (query = "", pageNumber = pageRef.current) => {
    const params = new URLSearchParams();

    if (query) {
      params.set("q", query);
    }

    if (stockMin) params.set("stockMin", stockMin);
    if (stockMax) params.set("stockMax", stockMax);

    params.set("page", String(pageNumber));
    params.set("limit", String(limit));

    const res = await fetch(`/api/products?${params.toString()}`);
    const data = await res.json();

    setProducts(Array.isArray(data) ? data : data?.products ?? []);
    setTotal(typeof data?.total === "number" ? data.total : 0);
  }, [limit, stockMin, stockMax]);

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data.filter((c: Category) => c.isActive));
  };

  useEffect(() => {
    setLoading(true);
    fetchProducts().finally(() => setLoading(false));
  }, [fetchProducts]);

  useEffect(() => {
    fetchCategories();
  }, []);

  /* 🔢 Stock UI */
  const updateStock = (id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (String(p._id) !== String(id)) {
          return p;
        }

        const currentStock = Number(p.stock ?? 0);
        return {
          ...p,
          stock: Math.max(0, currentStock + delta),
        };
      })
    );
  };

  /* 💾 Guardar stock */
  const saveStock = async (product: Product) => {
    const stockValue = Number(product.stock ?? 0);

    const response = await fetch(`/api/products/${product._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: stockValue }),
    });

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => null);
      console.error("Error guardando stock:", errorPayload || response.statusText);
      toast.error("Error al guardar el stock");
      return;
    }

    setSavedRow(product._id);
    setTimeout(() => setSavedRow(null), 2000);

    await fetchProducts();
  };

  return {
    products,
    categories,
    loading,
    savedRow,
    total,
    page,
    limit,
    stockMin,
    stockMax,
    setPage,
    setStockMin,
    setStockMax,
    updateStock,
    saveStock,

    /** 👇 API pública del hook */
    refreshProducts: fetchProducts,
  };
}
