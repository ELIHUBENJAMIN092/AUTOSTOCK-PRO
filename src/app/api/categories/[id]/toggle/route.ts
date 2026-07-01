import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import { requireAdmin } from "@/lib/require-admin";

/**
 * PATCH → Activar / Desactivar categoría (toggle)
 */
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    // ✅ FIX Next.js 15 / 16 (params es Promise)
    const { id } = await context.params;

    await connectDB();

    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        { error: "Categoría no encontrada" },
        { status: 404 }
      );
    }

    // 🔁 TOGGLE
    category.isActive = !category.isActive;
    await category.save();

    return NextResponse.json(
      {
        message: "Estado de la categoría actualizado",
        category,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /api/categories/[id]/toggle error:", error);

    return NextResponse.json(
      { error: "Error al actualizar categoría" },
      { status: 500 }
    );
  }
}
