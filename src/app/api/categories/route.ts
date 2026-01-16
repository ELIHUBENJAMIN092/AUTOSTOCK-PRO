import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";

// GET → listar categorías
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find()
      .sort({ createdAt: -1 });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: "Error obteniendo categorías" },
      { status: 500 }
    );
  }
}

// POST → crear categoría
export async function POST(req: Request) {
  try {
    const { name, description } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Nombre requerido" },
        { status: 400 }
      );
    }

    await connectDB();

    const exists = await Category.findOne({ name });
    if (exists) {
      return NextResponse.json(
        { error: "La categoría ya existe" },
        { status: 400 }
      );
    }

    const category = await Category.create({
      name,
      description: description || "",
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creando categoría" },
      { status: 500 }
    );
  }
}