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
    <div className="w-full max-w-4xl mx-auto px-4 text-white space-y-8">
      <h1 className="text-2xl font-bold">Imprimir Inventario</h1>

      <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
        <button
          onClick={() => generatePDF()}
          disabled={loading}
          className="w-full bg-white text-black py-3 rounded font-semibold flex items-center justify-center gap-2"
        >
          <Printer size={18} />
          {loading ? "Generando PDF..." : "Generar PDF Inventario General"}
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="md:col-span-2 bg-white text-black rounded px-3 py-3"
          >
            <option value="">Seleccione una categoría</option>

            {categories.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>

          <button
            onClick={() => generatePDF(selectedCategory)}
            disabled={loading || !selectedCategory}
            className="bg-green-600 hover:bg-green-700 disabled:bg-neutral-600 text-white py-3 rounded font-semibold flex items-center justify-center gap-2"
          >
            <Printer size={18} />
            Por Categoría
          </button>
        </div>
      </section>

      <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <h2 className="font-semibold mb-3">Vista rápida</h2>

        <div className="bg-white text-black p-3 rounded text-xs max-h-60 overflow-y-auto">
          {products.slice(0, 8).map((p) => (
            <div key={p._id} className="flex justify-between border-b py-1">
              <span>{p.code}</span>
              <span className="px-2">{p.name}</span>
              <span>{p.stock}</span>
            </div>
          ))}
        </div>
      </section>

      <ScrollToTop />
    </div>
  );
}