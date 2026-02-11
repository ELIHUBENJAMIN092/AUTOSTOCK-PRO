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
      .populate({
        path: "category",
        select: "name isActive",
        strictPopulate: false,
      })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(products);

  } catch (error) {
    console.error("GET /api/products error:", error);

    return NextResponse.json(
      { error: "Error obteniendo productos" },
      { status: 500 }
    );
  }
}


/**
 * POST → crear producto (FormData + imagen Cloudinary)
 */
export async function POST(req: Request) {
  try {
    await connectDB();

    const formData = await req.formData();

    // ✅ Normalización segura
    const code = formData
      .get("code")
      ?.toString()
      .trim()
      .toUpperCase();

    const name = formData.get("name")?.toString().trim();
    const description = formData.get("description")?.toString() || "";
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock") || 0);
    const minStock = 5;
    const category = formData.get("category")?.toString();
    const imageFile = formData.get("image") as File | null;

    // 🔴 Validaciones obligatorias
    if (!code || !name || isNaN(price) || !category) {
      return NextResponse.json(
        { error: "Código, nombre, precio y categoría son obligatorios" },
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

    // ❌ Evitar código duplicado (MEJORADO)
    const codeExists = await Product.findOne({
      code: code,
    });

    if (codeExists) {
      return NextResponse.json(
        {
          error: "Ya existe un producto registrado con este código",
          field: "code",
        },
        { status: 409 }
      );
    }

    // 📸 Subir imagen a Cloudinary
    let image = "";

    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      const uploadResult: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      image = uploadResult.secure_url;
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
