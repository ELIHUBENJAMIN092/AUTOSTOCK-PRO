import { NextResponse } from "next/server";
import csv from "csv-parser";
import { Readable } from "stream";
import { requireAdmin } from "@/lib/require-admin";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import RFIDTag from "@/models/RFIDTag";

export async function POST(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;


  const start = Date.now();

  try {
    await connectDB();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const selectedProductId = formData.get("selectedProductId") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "Archivo CSV no enviado" },
        { status: 400 }
      );
    }

    // =========================
    // Leer CSV
    // =========================
    const buffer = Buffer.from(await file.arrayBuffer());
    const lines = buffer.toString().split("\n");

    const headerIndex = lines.findIndex((line) =>
      line.toUpperCase().includes("TAG")
    );

    if (headerIndex === -1) {
      return NextResponse.json(
        { error: "No se encontró la columna TAG" },
        { status: 400 }
      );
    }

    const cleanCSV = lines.slice(headerIndex).join("\n");
    const stream = Readable.from(cleanCSV);

    // EPC únicos detectados
    const scannedEpcs = new Set<string>();

    await new Promise<void>((resolve, reject) => {
      stream
        .pipe(csv())
        .on("data", (row: any) => {
          const epc = row.TAG?.trim();
          if (epc) scannedEpcs.add(epc);
        })
        .on("end", resolve)
        .on("error", reject);
    });

    // =========================
    // Buscar EPC registrados
    // =========================
    const tags = await RFIDTag.find({
      epc: { $in: Array.from(scannedEpcs) },
    });

    const notFound: string[] = [];

    const productStock: Record<string, number> = {};

    for (const tag of tags) {
      const productId = tag.product.toString();

      productStock[productId] =
        (productStock[productId] || 0) + 1;
    }

    // EPC sin registrar
    for (const epc of scannedEpcs) {
      if (!tags.find((t) => t.epc === epc)) {
        notFound.push(epc);
      }
    }

    // =========================
    // Actualizar producto(s)
    // =========================
    let updated = 0;
    let productId = "";
    let newStock = 0;

    if (selectedProductId) {
      // Producto específico
      const rfidProduct = await Product.findOne({
        _id: selectedProductId,
        isRFID: true,
        isActive: true,
      }).select("_id");

      if (rfidProduct) {
        const pid = rfidProduct._id.toString();
        newStock = productStock[pid] || 0;
        await Product.findByIdAndUpdate(pid, {
          $set: { stock: newStock, updatedAt: new Date() },
        });
        updated = 1;
        productId = pid;
      }
    } else {
      // Todos los productos con RFID ON
      const rfidProducts = await Product.find({
        isRFID: true,
        isActive: true,
      }).select("_id");

      for (const product of rfidProducts) {
        const pid = product._id.toString();
        const stock = productStock[pid] || 0;
        await Product.findByIdAndUpdate(pid, {
          $set: { stock, updatedAt: new Date() },
        });
        updated++;
      }
    }

    return NextResponse.json({
      updated,
      ...(productId && { productId }),
      ...(selectedProductId && { newStock }),
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
