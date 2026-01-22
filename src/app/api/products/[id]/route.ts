import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;
    const body = await req.json();

    /* ================= STOCK RÁPIDO ================= */
    if (
      Object.keys(body).length === 1 &&
      typeof body.stock === "number"
    ) {
      const updated = await Product.findByIdAndUpdate(
        id,
        { stock: body.stock },
        { new: true }
      ).populate("category", "name isActive");

      if (!updated) {
        return NextResponse.json(
          { error: "Producto no encontrado" },
          { status: 404 }
        );
      }

      return NextResponse.json(updated);
    }

    /* ================= EDICIÓN COMPLETA ================= */
    const {
      code,
      name,
      description,
      price,
      stock,
      minStock,
      category,
      isActive,
    } = body;

    // 🔴 Validaciones completas
    if (!code || !name || price == null || !category) {
      return NextResponse.json(
        { error: "Campos obligatorios faltantes" },
        { status: 400 }
      );
    }

    // 🔒 validar categoría activa
    const categoryExists = await Category.findOne({
      _id: category,
      isActive: true,
    });

    if (!categoryExists) {
      return NextResponse.json(
        { error: "Categoría inválida o inactiva" },
        { status: 400 }
      );
    }

    // ❌ evitar código duplicado
    const codeExists = await Product.findOne({
      code,
      _id: { $ne: id },
    });

    if (codeExists) {
      return NextResponse.json(
        { error: "El número de parte ya existe" },
        { status: 400 }
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        code: code.trim(),
        name,
        description,
        price,
        stock,
        minStock,
        category,
        isActive,
      },
      { new: true }
    ).populate("category", "name isActive");

    if (!updatedProduct) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("PUT /api/products/[id] error:", error);
    return NextResponse.json(
      { error: "Error actualizando producto" },
      { status: 500 }
    );
  }
}
