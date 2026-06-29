"use client";

import { useEffect, useState } from "react";
import ScrollToTop from "@/app/components/ScrollToTop";
import toast from "react-hot-toast";
import { Printer } from "lucide-react";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { useSession } from "next-auth/react";

type Category =
  | string
  | {
      _id: string;
      name: string;
      isActive?: boolean;
    };

type Product = {
  _id: string;
  name: string;
  code?: string;
  stock?: number;
  category?: Category;
};

export default function PrintInventoryPage() {
  const { data: session } = useSession();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const user = session?.user?.name || session?.user?.email || "Usuario";

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => setProducts(Array.isArray(d) ? d : []))
      .catch(() => setProducts([]));
  }, []);

  const categories = Array.from(
    new Map(
      products
        .map((p) => {
          if (!p.category) return null;

          if (typeof p.category === "string") {
            return [p.category, p.category];
          }

          return [p.category._id, p.category.name];
        })
        .filter(Boolean) as [string, string][]
    )
  );

  const generatePDF = async (categoryId?: string) => {
    try {
      setLoading(true);

      const filteredProducts = categoryId
        ? products.filter((p) => {
            if (!p.category) return false;

            if (typeof p.category === "string") {
              return p.category === categoryId;
            }

            return p.category._id === categoryId;
          })
        : products;

      if (filteredProducts.length === 0) {
        toast.error("No hay productos para imprimir");
        return;
      }

      const categoryName = categoryId
        ? categories.find(([id]) => id === categoryId)?.[1] || ""
        : "";

      const now = new Date();
      const fecha = now.toLocaleDateString();
      const hora = now.toLocaleTimeString();

      const width = 70;
      const margin = 4;

      const drawPDF = (doc: jsPDF) => {
        doc.setFont("courier", "normal");

        doc.setFontSize(10);
        doc.text("INVENTARIO", width / 2, 8, { align: "center" });

        if (categoryId) {
          doc.setFontSize(7);
          doc.text(`Categoria: ${categoryName}`, width / 2, 12, {
            align: "center",
          });
        }

        doc.setFontSize(7);
        doc.text("--------------------------------", width / 2, categoryId ? 16 : 12, {
          align: "center",
        });

        const startInfoY = categoryId ? 20 : 16;

        doc.text(`Fecha: ${fecha}`, margin, startInfoY);
        doc.text(`Hora: ${hora}`, margin, startInfoY + 4);
        doc.text(`Usuario: ${user}`, margin, startInfoY + 8);

        doc.text("--------------------------------", width / 2, startInfoY + 12, {
          align: "center",
        });

        autoTable(doc, {
          startY: startInfoY + 16,
          margin: { left: margin, right: margin },

          styles: {
            font: "helvetica",
            fontSize: 8,
            cellPadding: 1,
            overflow: "linebreak",
          },

          alternateRowStyles: {
            fillColor: [245, 245, 245],
          },

          headStyles: {
            textColor: 0,
            fillColor: false,
            halign: "center",
            fontStyle: "bold",
          },

          columnStyles: {
            0: { cellWidth: 18, halign: "left" },
            1: { cellWidth: 34, halign: "center" },
            2: { cellWidth: 10, halign: "right" },
          },

          head: [["N° Parte", "Producto", "Stock"]],

          body: filteredProducts.map((p) => [
            p.code || "-",
            p.name,
            String(p.stock ?? 0),
          ]),
        });

        const finalY = (doc as any).lastAutoTable.finalY + 6;

        doc.setFont("courier", "normal");
        doc.setFontSize(7);
        doc.text("--------------------------------", width / 2, finalY, {
          align: "center",
        });

        return finalY + 10;
      };

      const tempDoc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [width, 600],
      });

      const finalHeight = drawPDF(tempDoc);

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [width, finalHeight],
      });

      drawPDF(doc);

      const safeCategoryName = categoryName
        .replace(/[\\/:*?"<>|]/g, "")
        .trim();

      const fileName = categoryId
        ? `inventario-${safeCategoryName || "categoria"}.pdf`
        : "inventario-ticket.pdf";

      doc.save(fileName);

      toast.success("PDF generado ✔");
    } catch (err) {
      console.error(err);
      toast.error("Error generando PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 md:px-6 py-6 text-white space-y-8">
      <div className="rounded-[2rem] border border-sky-700/30 bg-gradient-to-r from-slate-950 via-sky-950 to-slate-900 p-6 shadow-xl shadow-sky-500/10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Panel de impresión</p>
            <h1 className="text-3xl font-bold text-white">Imprimir Inventario</h1>
            <p className="mt-2 max-w-3xl text-neutral-300">
              Genera informes PDF rápidos del inventario general o por categoría para imprimir en Zebra y mantener el control de stock.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-3xl bg-white/10 px-4 py-3 text-sm text-neutral-200 border border-white/10">
            <Printer size={20} />
            Generación rápida de inventarios
          </div>
        </div>
      </div>

      <section className="bg-neutral-900 border border-sky-700/20 rounded-3xl p-6 shadow-lg shadow-sky-500/10 space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-cyan-300">Generar PDF</h2>
            <p className="text-sm text-neutral-400">Descarga un PDF completo del inventario o elige una categoría específica.</p>
          </div>
          <button
            onClick={() => generatePDF()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-3xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400 disabled:opacity-60"
          >
            <Printer size={18} />
            {loading ? "Generando PDF..." : "Inventario General"}
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-[1.8fr_1fr]">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded-3xl border border-neutral-800 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          >
            <option value="">Seleccione una categoría</option>
            {categories.map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>

          <button
            onClick={() => generatePDF(selectedCategory)}
            disabled={loading || !selectedCategory}
            className="w-full rounded-[1.75rem] bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-slate-950 shadow-2xl shadow-emerald-500/25 ring-1 ring-emerald-300/20 transition duration-200 hover:from-emerald-400 hover:via-emerald-300 hover:to-teal-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Generando categoría..." : "Imprimir Categoría"}
          </button>
        </div>
      </section>

      <section className="bg-neutral-900 border border-slate-700/40 rounded-3xl p-6 shadow-lg shadow-slate-950/20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Vista rápida</h2>
            <p className="text-sm text-neutral-400">Resumen de los primeros productos del catálogo para validar antes de imprimir.</p>
          </div>
          <span className="inline-flex items-center rounded-full bg-slate-800 px-4 py-2 text-sm text-cyan-300 border border-cyan-700/40">
            {products.length} productos cargados
          </span>
        </div>

        <div className="mt-4 overflow-hidden rounded-3xl border border-neutral-800 bg-slate-950 p-3 text-sm text-neutral-100">
          <div className="grid grid-cols-[1.2fr_3fr_0.8fr] gap-4 border-b border-neutral-800 pb-3 text-xs uppercase tracking-[0.2em] text-neutral-500">
            <span>Código</span>
            <span>Producto</span>
            <span className="text-right">Stock</span>
          </div>
          <div className="space-y-2 mt-3">
            {products.slice(0, 8).map((p) => (
              <div key={p._id} className="grid grid-cols-[1.2fr_3fr_0.8fr] gap-4 text-sm text-neutral-200">
                <span>{p.code || "-"}</span>
                <span className="truncate">{p.name}</span>
                <span className="text-right text-emerald-300">{p.stock ?? 0}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ScrollToTop />
    </div>
  );
}