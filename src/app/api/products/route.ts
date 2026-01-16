import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import cloudinary from "@/lib/cloudinary";


/**
 * GET → listar productos
 */
export async function GET() {
  try {
    await connectDB();

    const products = await Product.find()
      .populate("category", "name isActive")
      .sort({ createdAt: -1 });

    return NextResponse.json(products);
  } catch {
    return NextResponse.json(
      { error: "Error obteniendo productos" },
      { status: 500 }
    );
  }
}

/**
 * POST → crear producto (code MANUAL)
 */
export async function POST(req: Request) {
  try {
    await connectDB();

    const {
      code,
      name,
      description = "",
      price,
      stock = 0,
      minStock = 5,
      category,
      image = "",
    } = await req.json();

    // 🔴 Validaciones obligatorias
    if (!code || !name || price == null || !category) {
      return NextResponse.json(
        { error: "Code, nombre, precio y categoría son obligatorios" },
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
      code: code.toUpperCase(),
    });

    if (codeExists) {
      return NextResponse.json(
        { error: "El número de parte ya existe" },
        { status: 400 }
      );
    }

    // ✅ Crear producto
    const product = await Product.create({
      code,
      name,
      description,
      price,
      stock,
      minStock,
      category,
      image,
      isActive: true,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { error: "Error creando producto" },
      { status: 500 }
    );
  }
}
