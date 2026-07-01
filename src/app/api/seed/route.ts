import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  await connectDB();

  const category = await Category.create({
    name: "Cartuchos",
    description: "Cartuchos de impresora",
  });

  const product = await Product.create({
    code: "CT-HP-12A",
    name: "Cartucho HP 12A",
    description: "Cartucho original HP",
    category: category._id,
    stock: 20,
  });

  return NextResponse.json({ category, product });
}
