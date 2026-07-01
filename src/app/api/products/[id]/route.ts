import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import cloudinary from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/require-admin";

function extractPublicIdFromUrl(url: string): string | null {
  if (!url) return null;
  const m = url.match(/\/image\/upload\/(?:v\d+\/)?(.+?)\.[^.]+$/);
  return m ? m[1] : null;
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    await connectDB();

    const { id } = await context.params;
    const body = await req.json();

    /* ================= STOCK RÁPIDO (manual) ================= */
    // ⚠️ Solo permite actualizar stock directamente
    // si NO viene edición completa
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
      isRFID,
      image,
      imagePublicId,
    } = body;

    // 🔴 Validaciones obligatorias
    if (!code || !name || price == null || !category) {
      return NextResponse.json(
        { error: "Campos obligatorios faltantes" },
        { status: 400 }
      );
    }

    // 🔒 Validar categoría activa
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

    // ❌ Evitar código duplicado
    const codeExists = await Product.findOne({
      code: code.trim(),
      _id: { $ne: id },
    });

    if (codeExists) {
      return NextResponse.json(
        { error: "El número de parte ya existe" },
        { status: 400 }
      );
    }

    // 📸 Eliminar imagen anterior de Cloudinary si se reemplaza
    if (image && imagePublicId) {
      const existing = await Product.findById(id).select("image imagePublicId");
      if (existing) {
        const oldPublicId = existing.imagePublicId || extractPublicIdFromUrl(existing.image);
        if (oldPublicId) {
          await cloudinary.uploader.destroy(oldPublicId);
        }
      }
    }

    // ✅ Actualizar producto
    const updateData: Record<string, unknown> = {
      code: code.trim(),
      name,
      description,
      price,
      stock,
      minStock,
      category,
      isActive,
      isRFID,
    };
    if (image !== undefined) updateData.image = image;
    if (imagePublicId !== undefined) updateData.imagePublicId = imagePublicId;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
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

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    await connectDB();

    const { id } = await context.params;
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    const publicId = product.imagePublicId || extractPublicIdFromUrl(product.image);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({ message: "Producto eliminado" });
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error);
    return NextResponse.json(
      { error: "Error eliminando producto" },
      { status: 500 }
    );
  }
}
