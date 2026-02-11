import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import RFIDTag from "@/models/RFIDTag";
import Product from "@/models/Product";

export async function POST(req: Request) {
  try {
    await connectDB();

    // ✅ RECIBIR JSON (NO formData)
    const { epcs, productId } = await req.json();

    if (!Array.isArray(epcs) || epcs.length === 0) {
      return NextResponse.json(
        { error: "Lista EPC vacía" },
        { status: 400 }
      );
    }

    if (!productId) {
      return NextResponse.json(
        { error: "Producto requerido" },
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

    // 🔎 buscar EPC ya existentes
    const existing = await RFIDTag.find({
      epc: { $in: epcs }
    }).select("epc");

    const existingSet = new Set(existing.map(e => e.epc));

    const toInsert = epcs
      .filter(epc => !existingSet.has(epc))
      .map(epc => ({
        epc: epc.trim(),
        product: productId
      }));

    if (toInsert.length === 0) {
      return NextResponse.json({
        inserted: 0,
        skipped: epcs.length
      });
    }

    await RFIDTag.insertMany(toInsert);

    return NextResponse.json({
      inserted: toInsert.length,
      skipped: epcs.length - toInsert.length
    });

  } catch (err) {
    console.error("RFID BATCH ERROR:", err);
    return NextResponse.json(
      { error: "Error en registro batch" },
      { status: 500 }
    );
  }
}
