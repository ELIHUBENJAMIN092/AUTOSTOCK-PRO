import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import RFIDTag from "@/models/RFIDTag";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const epc = searchParams.get("epc")?.trim().toUpperCase();

    if (!epc) {
      return NextResponse.json(
        { error: "EPC requerido" },
        { status: 400 }
      );
    }

    const tag = await RFIDTag.findOne({ epc }).populate("product");

    if (!tag) {
      return NextResponse.json(
        { error: "No encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(tag);

  } catch (error) {
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}