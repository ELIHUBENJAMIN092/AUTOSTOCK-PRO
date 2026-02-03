import { NextResponse } from "next/server";
import csv from "csv-parser";
import { Readable } from "stream";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

type CSVRow = {
  code?: string;
  stock?: string;
};

export async function POST(req: Request) {
  const start = Date.now();

  try {
    await connectDB();

    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Content-Type debe ser multipart/form-data" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Archivo CSV no enviado" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const stream = Readable.from(buffer.toString());

    const updates: { code: string; stock: number }[] = [];
    const notFound: string[] = [];
    let updated = 0;

    // 📖 Leer CSV
    await new Promise<void>((resolve, reject) => {
      stream
        .pipe(csv())
        .on("data", (row: CSVRow) => {
          if (!row.code || !row.stock) return;

          const code = row.code.trim();
          const stock = Number(row.stock);

          if (!code || Number.isNaN(stock)) return;

          updates.push({ code, stock });
        })
        .on("end", resolve)
        .on("error", reject);
    });

    // 🔁 Actualizar SOLO productos con RFID activo
    for (const item of updates) {
      const res = await Product.updateOne(
        {
          code: item.code,
          isRFID: true, // 🔥 CLAVE
        },
        {
          $set: {
            stock: item.stock,
            updatedAt: new Date(),
          },
        }
      );

      if (res.matchedCount === 0) {
        notFound.push(item.code);
      } else {
        updated++;
      }
    }

    return NextResponse.json({
      updated,
      notFound,
      durationMs: Date.now() - start,
    });
  } catch (error) {
    console.error("RFID PROCESS ERROR:", error);
    return NextResponse.json(
      { error: "Error procesando inventario RFID" },
      { status: 500 }
    );
  }
}
