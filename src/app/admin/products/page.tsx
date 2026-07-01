"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useProducts } from "./hooks/useProducts";

import { ArrowRight } from "lucide-react";
import ProductsTable from "./components/ProductsTable";
import ProductsMobile from "./components/ProductsMobile";
import EditProductModal from "./components/EditProductModal";
import SearchBar from "@/app/components/home/SearchBar";
import Button from '@/app/components/ui/Button'
import ScrollToTop from "@/app/components/ScrollToTop";

import Link from "next/link";
import type { Product } from "./types";

export default function ProductsPage() {
  const {
    products,
    categories,
    loading,
    savedRow,
    total,
    page,
    limit,
    setPage,
    updateStock,
    saveStock,
    refreshProducts,
  } = useProducts();

  const [search, setSearch] = useState("");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const searchResetRef = useRef(false);

  useEffect(() => {
    searchResetRef.current = true;
    setPage(1);
    refreshProducts(search, 1);
  }, [search, refreshProducts, setPage]);

  useEffect(() => {
    if (searchResetRef.current) {
      searchResetRef.current = false;
      return;
    }

    refreshProducts(search, page);
  }, [page, refreshProducts, search]);

  const displayedProducts = products;

  const pageCount = useMemo(
    () => Math.max(1, Math.ceil(total / limit)),
    [total, limit]
  );

  const pageNumbers = useMemo(() => {
    const buttons: Array<number | string> = [];
    const shown = 5;
    const half = Math.floor(shown / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(pageCount, page + half);

    if (page <= half) {
      start = 1;
      end = Math.min(pageCount, shown);
    }

    if (page + half > pageCount) {
      end = pageCount;
      start = Math.max(1, pageCount - shown + 1);
    }

    if (start > 1) {
      buttons.push(1);
      if (start > 2) buttons.push("...");
    }

    for (let number = start; number <= end; number += 1) {
      buttons.push(number);
    }

    if (end < pageCount) {
      if (end < pageCount - 1) buttons.push("...");
      buttons.push(pageCount);
    }

    return buttons;
  }, [page, pageCount]);

  const saveEdit = async () => {
    if (!editProduct) return;

    setSaving(true);

    try {
      const res = await fetch(`/api/products/${editProduct._id}`, {
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

      if (!res.ok) throw new Error();

      toast.success("Producto actualizado correctamente");
    } catch {
      toast.error("Error al actualizar el producto");
    }

    setSaving(false);
    setEditProduct(null);
    refreshProducts();
  };

  const handleDelete = async (product: Product) => {
    const confirmed = window.confirm(
      `¿Estás seguro de eliminar el producto "${product.name}"? Esta acción no se puede deshacer.`
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      toast.success("Producto eliminado correctamente");
      refreshProducts();
    } catch {
      toast.error("Error al eliminar el producto");
    }
  };

  if (loading) {
    return (
      <div className="w-full px-4 text-neutral-400">
        Cargando productos...
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-hidden px-4 md:px-6 text-white max-w-screen-xl mx-auto space-y-8">
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
        <SearchBar initialValue={search} onSearch={setSearch} debounceMs={300} placeholder="Buscar por nombre, código o EPC..." />
      </div>

      <div className="flex flex-col gap-2 text-sm text-neutral-400">
        <p>
          Página <span className="font-semibold text-white">{page}</span> de <span className="font-semibold text-white">{pageCount}</span>
        </p>
        <p>
          Total <span className="font-semibold text-white">{total}</span> productos
        </p>
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

      {pageCount > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-neutral-800 bg-slate-950/50 px-4 py-4 text-sm text-neutral-300 shadow-lg shadow-cyan-500/10">
          <p>
            Mostrando página <span className="font-semibold text-white">{page}</span> de <span className="font-semibold text-white">{pageCount}</span>
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => {
                const prevPage = Math.max(1, page - 1);
                setPage(prevPage);
              }}
              disabled={page === 1}
              className="rounded-2xl px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20"
            >
              Anterior
            </Button>

            <div className="hidden sm:flex flex-wrap items-center gap-2">
              {pageNumbers.map((pageNumber, index) =>
                typeof pageNumber === "number" ? (
                  <Button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    disabled={pageNumber === page}
                    className={`rounded-2xl px-4 py-2 text-sm font-semibold shadow-lg shadow-cyan-500/20 ${
                      pageNumber === page ? "bg-cyan-500 text-slate-950" : "!bg-white !text-slate-950 hover:bg-slate-100"
                    }`}
                  >
                    {pageNumber}
                  </Button>
                ) : (
                  <span key={`ellipsis-${index}`} className="inline-flex h-10 items-center px-3 text-sm text-neutral-400">
                    …
                  </span>
                )
              )}
            </div>

            <Button
              onClick={() => {
                const nextPage = Math.min(pageCount, page + 1);
                setPage(nextPage);
              }}
              disabled={page === pageCount}
              className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20"
            >
              Siguiente
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
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