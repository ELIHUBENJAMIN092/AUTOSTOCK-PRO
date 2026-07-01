import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import RFIDTag from "@/models/RFIDTag";
import { requireAdmin } from "@/lib/require-admin";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    await connectDB();


    const { id } = await context.params;

    const deleted = await RFIDTag.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "EPC no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "EPC eliminado correctamente",
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar" },
      { status: 500 }
    );
  }
}