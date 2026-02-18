"use client";

import { useEffect, useState } from "react";
import ScrollToTop from "@/app/components/ScrollToTop";
import toast from "react-hot-toast";
import { Printer } from "lucide-react";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { useSession } from "next-auth/react";

type Product = {
  _id: string;
  name: string;
  code?: string;
  stock?: number;
};

export default function PrintInventoryPage() {
  const { data: session } = useSession();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const user =
    session?.user?.name ||
    session?.user?.email ||
    "Usuario";

  // ================= FETCH =================
  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then(d => setProducts(Array.isArray(d) ? d : []))
      .catch(() => setProducts([]));
  }, []);

  // ================= PDF =================
  const generatePDF = async () => {
    try {
      setLoading(true);

      const now = new Date();
      const fecha = now.toLocaleDateString();
      const hora = now.toLocaleTimeString();

      const width = 70;
      const margin = 4;

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [width, 600] // altura inicial grande
      });

      doc.setFont("courier", "normal");

      // ===== HEADER =====
      doc.setFontSize(10);
      doc.text("INVENTARIO", width / 2, 8, { align: "center" });

      doc.setFontSize(7);
      doc.text("--------------------------------", width / 2, 12, { align: "center" });

      doc.text(`Fecha: ${fecha}`, margin, 16);
      doc.text(`Hora: ${hora}`, margin, 20);
      doc.text(`Usuario: ${user}`, margin, 24);

      doc.text("--------------------------------", width / 2, 28, { align: "center" });

      // ===== TABLA =====
      autoTable(doc, {
        startY: 32,
        margin: { left: margin, right: margin },

        styles: {
          font: "helvetica",
          fontSize: 8,
          cellPadding: 1,
          overflow: "linebreak"
        },

        headStyles: {
          textColor: 0,
          fillColor: false,
          halign: "center"
        },

        columnStyles: {
          0: { cellWidth: 18, halign: "left" },
          1: { cellWidth: 34, halign: "center" },
          2: { cellWidth: 10, halign: "right" }
        },

        head: [["N° Parte", "Producto", "Stock"]],

        body: products.map((p) => [
          p.code || "-",
          p.name,
          String(p.stock ?? 0)
        ])
      });

      // ===== LÍNEA FINAL ESTILO TICKET =====
      const finalY = (doc as any).lastAutoTable.finalY + 6;

      doc.setFont("courier", "normal");
      doc.setFontSize(7);

      doc.text("--------------------------------", width / 2, finalY, {
        align: "center"
      });

      // ===== ALTURA FINAL DINÁMICA =====
      (doc.internal.pageSize as any).height = finalY + 10;

      doc.save("inventario-ticket.pdf");

      toast.success("PDF generado ✔");

    } catch (err) {
      console.error(err);
      toast.error("Error generando PDF");
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div className="w-full max-w-4xl mx-auto px-4 text-white space-y-8">
      <h1 className="text-2xl font-bold">
        Imprimir Inventario
      </h1>

      <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <button
          onClick={generatePDF}
          disabled={loading}
          className="w-full bg-white text-black py-3 rounded font-semibold flex items-center justify-center gap-2"
        >
          <Printer size={18} />
          {loading ? "Generando PDF..." : "Generar PDF Inventario"}
        </button>
      </section>

      {/* PREVIEW */}
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
