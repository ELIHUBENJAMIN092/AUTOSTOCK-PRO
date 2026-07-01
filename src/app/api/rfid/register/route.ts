import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import RFIDTag from "@/models/RFIDTag";
import { requireAdmin } from "@/lib/require-admin";
import Product from "@/models/Product";

export async function POST(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    await connectDB();
    const { epc, productId } = await req.json();

    if (!epc || !productId) {
      return NextResponse.json(
        { error: "EPC y producto son obligatorios" },
        { status: 400 }
      );
    }

    // validar producto
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: "Producto no existe" },
        { status: 404 }
      );
    }

    // evitar EPC duplicado
    const exists = await RFIDTag.findOne({ epc });
    if (exists) {
      return NextResponse.json(
        { error: "Este EPC ya está registrado" },
        { status: 400 }
      );
    }

    const tag = await RFIDTag.create({
      epc: epc.trim(),
      product: productId,
    });

    return NextResponse.json(tag);
  } catch (err) {
    console.error("RFID REGISTER ERROR:", err);
    return NextResponse.json(
      { error: "Error registrando EPC" },
      { status: 500 }
    );
  }
}
