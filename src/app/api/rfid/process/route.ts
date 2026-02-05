import { NextResponse } from "next/server";
import csv from "csv-parser";
import { Readable } from "stream";
import { connectDB } from "@/lib/db";
import RFIDTag from "@/models/RFIDTag";
import Product from "@/models/Product";

export async function POST(req: Request) {
  const start = Date.now();

  try {
    await connectDB();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "Archivo no enviado" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const stream = Readable.from(buffer.toString());

    // 1️⃣ EPC detectados en el archivo
    const detectedEPCs = new Set<string>();

    await new Promise<void>((resolve, reject) => {
      stream
        .pipe(csv())
        .on("data", (row: any) => {
          const epc = row.TAG?.trim();
          if (epc) detectedEPCs.add(epc);
        })
        .on("end", resolve)
        .on("error", reject);
    });

    // 2️⃣ Buscar EPC registrados
    const tags = await RFIDTag.find({
      epc: { $in: Array.from(detectedEPCs) },
    });

    // 3️⃣ Agrupar por producto
    const productCount = new Map<string, number>();

    for (const tag of tags) {
      const pid = tag.product.toString();
      productCount.set(pid, (productCount.get(pid) || 0) + 1);
    }

    // 4️⃣ Obtener TODOS los productos RFID
    const rfidProducts = await Product.find({ isRFID: true });

    let updated = 0;

    for (const product of rfidProducts) {
      const newStock = productCount.get(product._id.toString()) || 0;

      if (product.stock !== newStock) {
        product.stock = newStock;
        await product.save();
        updated++;
      }
    }

    return NextResponse.json({
      updated,
      detectedTags: detectedEPCs.size,
      durationMs: Date.now() - start,
    });
  } catch (err) {
    console.error("RFID PROCESS ERROR:", err);
    return NextResponse.json(
      { error: "Error procesando RFID" },
      { status: 500 }
    );
  }
}
