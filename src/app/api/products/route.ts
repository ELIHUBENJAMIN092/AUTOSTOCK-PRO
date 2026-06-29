import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import RFIDTag from "@/models/RFIDTag";
import Category from "@/models/Category";
import cloudinary from "@/lib/cloudinary";
import { z } from "zod";

/**
 * GET → listar productos
 */
export async function GET(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const page = Math.max(1, Number(url.searchParams.get("page") || 1));
    const limit = Math.max(1, Number(url.searchParams.get("limit") || 20));
    const skip = (page - 1) * limit;

    const q = url.searchParams.get("q")?.trim();
    const categoryFilter = url.searchParams.get("category")?.trim();

    // Construir filtro
    const filters: any = {};

    if (categoryFilter && categoryFilter !== "all") {
      filters.category = categoryFilter;
    }

    // Búsqueda por nombre o código
    const or: any[] = [];
    if (q) {
      const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      or.push({ name: re }, { code: re });

      // Buscar por EPC exacto en RFIDTag
      const epc = q.toString().trim().toUpperCase();
      const tag = await RFIDTag.findOne({ epc }).select("product");
      if (tag && tag.product) {
        or.push({ _id: tag.product });
      }
    }

    if (or.length) {
      filters.$or = or;
    }

    const [products, total] = await Promise.all([
      Product.find(filters)
        .populate({
          path: "category",
          select: "name isActive",
          strictPopulate: false,
        })
        .sort({ name: 1, code: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filters),
    ]);

    return NextResponse.json({ products, total, page, limit });

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

    // Validar campos con Zod
    const productSchema = z.object({
      code: z.string().min(1).transform((s) => s.trim().toUpperCase()),
      name: z.string().min(1).transform((s) => s.trim()),
      description: z.string().optional().default("") ,
      price: z.preprocess((v) => Number(v), z.number().nonnegative()),
      stock: z.preprocess((v) => Number(v || 0), z.number().int().nonnegative()),
      minStock: z.number().int().nonnegative().optional().default(5),
      category: z.string().min(1),
    });

    const raw = {
      code: formData.get("code")?.toString() ?? "",
      name: formData.get("name")?.toString() ?? "",
      description: formData.get("description")?.toString() ?? "",
      price: formData.get("price"),
      stock: formData.get("stock"),
      minStock: 5,
      category: formData.get("category")?.toString() ?? "",
    };

    const parsed = productSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    }

    const { code, name, description, price, stock, minStock, category } = parsed.data;
    const imageFile = formData.get("image") as File | null;

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

    // 📸 Validación y subida de imagen a Cloudinary (si viene)
    let image = "";

    if (imageFile) {
      // Validar tipo y tamaño
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      const maxSize = 5 * 1024 * 1024; // 5 MB

      if (!allowedTypes.includes(imageFile.type)) {
        return NextResponse.json({ error: "Tipo de imagen no permitido" }, { status: 400 });
      }

      if ((imageFile as any).size && (imageFile as any).size > maxSize) {
        return NextResponse.json({ error: "Imagen demasiado grande (máx 5MB)" }, { status: 400 });
      }

      const buffer = Buffer.from(await imageFile.arrayBuffer());

      const uploadResult: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "products", resource_type: "image" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      image = uploadResult.secure_url;
    }

    // ✅ Validaciones finales y creación de producto

    if (price < 0) {
      return NextResponse.json({ error: "Precio inválido" }, { status: 400 });
    }

    if (!Number.isFinite(price) || isNaN(price)) {
      return NextResponse.json({ error: "Precio inválido" }, { status: 400 });
    }

    if (!Number.isInteger(stock) || stock < 0) {
      return NextResponse.json({ error: "Stock inválido" }, { status: 400 });
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
