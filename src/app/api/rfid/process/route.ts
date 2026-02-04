import { NextResponse } from "next/server";
import csv from "csv-parser";
import { Readable } from "stream";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import RFIDTag from "@/models/RFIDTag";

export async function POST(req: Request) {
  const start = Date.now();

  try {
    await connectDB();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Archivo CSV no enviado" },
        { status: 400 }
      );
    }

    // 📦 Leer archivo
    const buffer = Buffer.from(await file.arrayBuffer());
    const lines = buffer.toString().split("\n");

    // 🔎 Buscar fila donde empieza TAG
    const headerIndex = lines.findIndex((line) =>
      line.toUpperCase().includes("TAG")
    );

    if (headerIndex === -1) {
      return NextResponse.json(
        { error: "No se encontró la columna TAG" },
        { status: 400 }
      );
    }

    // 🧼 Limpiar encabezados basura
    const cleanCSV = lines.slice(headerIndex).join("\n");
    const stream = Readable.from(cleanCSV);

    // EPC → cantidad
    const epcCount: Record<string, number> = {};

    // 📖 Leer CSV Zebra
    await new Promise<void>((resolve, reject) => {
      stream
        .pipe(csv())
        .on("data", (row: any) => {
          const epc = row.TAG?.trim();
          if (!epc) return;

          // 👇 CLAVE: solo contar EPC únicos
          epcCount[epc] = 1;
        })
        .on("end", resolve)
        .on("error", reject);
    });


    // 🔗 Buscar EPCs registrados
    const tags = await RFIDTag.find({
      epc: { $in: Object.keys(epcCount) },
    });

    const productStock: Record<string, number> = {};
    const notFound: string[] = [];

    for (const tag of tags) {
      const epc = tag.epc;
      const productId = tag.product.toString();
      const qty = epcCount[epc] || 0;

      productStock[productId] =
        (productStock[productId] || 0) + qty;
    }

    // ⚠ EPC no registrados
    for (const epc of Object.keys(epcCount)) {
      if (!tags.find((t) => t.epc === epc)) {
        notFound.push(epc);
      }
    }

    // 📦 Actualizar stock de productos
    let updated = 0;

    for (const [productId, stock] of Object.entries(productStock)) {
      await Product.findByIdAndUpdate(productId, {
        $set: {
          stock,
          updatedAt: new Date(),
        },
      });
      updated++;
    }

    return NextResponse.json({
      updated,
      notFound,
      durationMs: Date.now() - start,
    });
  } catch (error) {
    console.error("RFID PROCESS ERROR:", error);
    return NextResponse.json(
      { error: "Error procesando archivo RFID" },
      { status: 500 }
    );
  }
}
