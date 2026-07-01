"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useProducts } from "./hooks/useProducts";

import { ArrowRight, Download } from "lucide-react";
import { Skeleton } from '@/app/components/ui/Skeleton';
import ProductsTable from "./components/ProductsTable";
import ProductsMobile from "./components/ProductsMobile";
import EditProductModal from "./components/EditProductModal";
import SearchBar from "@/app/components/home/SearchBar";
import Button from '@/app/components/ui/Button'
import { TableSkeleton } from '@/app/components/ui/Skeleton'
import ConfirmModal from '@/app/components/ui/ConfirmModal'
import ScrollToTop from "@/app/components/ScrollToTop";

import Link from "next/link";
import type { Product, Category } from "@/types";

export default function ProductsPage() {
  const {
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
    refreshProducts,
  } = useProducts();

  const [search, setSearch] = useState("");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const searchResetRef = useRef(false);

  useEffect(() => {
    searchResetRef.current = true;
    setPage(1);
    refreshProducts(search, 1);
  }, [search, refreshProducts, setPage, stockMin, stockMax]);

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
          category: (editProduct.category as Category)?._id ?? editProduct.category,
          isRFID: editProduct.isRFID,
          isActive: editProduct.isActive,
          image: editProduct.image,
          imagePublicId: editProduct.imagePublicId,
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
    setDeleteTarget(product);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/products/${deleteTarget._id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      toast.success("Producto eliminado correctamente");
      refreshProducts();
    } catch {
      toast.error("Error al eliminar el producto");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return (
      <div className="w-full overflow-x-hidden px-4 md:px-6 text-white max-w-screen-xl mx-auto space-y-8">
        <div className="rounded-3xl border border-cyan-700 bg-gradient-to-r from-cyan-950 via-slate-950 to-slate-900 p-6">
          <Skeleton className="h-4 w-48 mb-2" />
          <Skeleton className="h-8 w-72 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <TableSkeleton rows={6} />
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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 space-y-3">
          <SearchBar initialValue={search} onSearch={setSearch} debounceMs={300} placeholder="Buscar por nombre, código o EPC..." />
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Stock mín."
              value={stockMin}
              onChange={(e) => setStockMin(e.target.value)}
              className="w-28 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
            />
            <input
              type="number"
              placeholder="Stock máx."
              value={stockMax}
              onChange={(e) => setStockMax(e.target.value)}
              className="w-28 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
            />
            {(stockMin || stockMax) && (
              <button
                onClick={() => { setStockMin(""); setStockMax(""); }}
                className="rounded-lg border border-neutral-700 px-3 py-1.5 text-sm text-neutral-400 hover:text-white transition"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>
        <a
          href="/api/products/export"
          className="inline-flex items-center gap-2 rounded-2xl border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm font-medium text-neutral-200 transition hover:border-cyan-500 hover:text-white shrink-0"
        >
          <Download size={16} />
          Exportar CSV
        </a>
      </div>

      <div className="flex flex-col gap-2 text-sm text-neutral-400">
        <p>
          Página <span className="font-semibold text-white">{page}</span> de <span className="font-semibold text-white">{pageCount}</span>
        </p>
        <p>
          Total <span className="font-semibold text-white">{total}</span> productos
        </p>
      </div>

      {displayedProducts.length === 0 ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/50 p-8 text-center">
          <p className="text-neutral-400">No hay productos que coincidan con tu búsqueda.</p>
          <p className="text-sm text-neutral-600 mt-1">
            {search ? "Intenta con otro término." : "Agrega productos desde el botón + Crear producto."}
          </p>
        </div>
      ) : (
        <>
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
        </>
      )}

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

      <ConfirmModal
        open={!!deleteTarget}
        title="Eliminar producto"
        message={deleteTarget ? `¿Estás seguro de eliminar "${deleteTarget.name}"? Esta acción no se puede deshacer.` : ""}
        confirmLabel="Eliminar"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      <ScrollToTop />
    </div>
  );
}