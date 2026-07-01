import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    await connectDB();

    const products = await Product.find()
      .populate("category", "name")
      .sort({ name: 1 })
      .lean();

    const header = "Código,Nombre,Descripción,Precio,Stock,Stock Mínimo,Categoría,RFID,Activo,Imagen\n";
    const rows = products.map((p: any) =>
      [
        p.code,
        `"${(p.name || "").replace(/"/g, '""')}"`,
        `"${(p.description || "").replace(/"/g, '""')}"`,
        p.price ?? 0,
        p.stock ?? 0,
        p.minStock ?? 5,
        `"${(p.category?.name || "").replace(/"/g, '""')}"`,
        p.isRFID ? "Sí" : "No",
        p.isActive ? "Sí" : "No",
        p.image || "",
      ].join(",")
    ).join("\n");

    const csv = "\uFEFF" + header + rows;

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="inventario-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    console.error("GET /api/products/export error:", error);
    return NextResponse.json(
      { error: "Error exportando productos" },
      { status: 500 }
    );
  }
}
