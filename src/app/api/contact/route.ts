import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { rateLimit } from "@/lib/rate-limit";
import Message from "@/models/Message";
import { connectDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
  const { ok } = rateLimit(ip, 5, 60000);
  if (!ok) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intenta de nuevo en un minuto." },
      { status: 429 }
    );
  }

  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    await connectDB();

    const newMessage = await Message.create({ name, email, message });

    return NextResponse.json(
      { success: true, message: newMessage },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Error al enviar el mensaje" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    await connectDB();

    const { id, isRead } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    const updated = await Message.findByIdAndUpdate(
      id,
      { isRead },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json(
        { error: "Mensaje no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: updated });
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar mensaje" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const showAll = searchParams.get("all") === "true";
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.max(1, Number(searchParams.get("limit") || 10));
    const skip = (page - 1) * limit;

    const filter = showAll ? {} : { isRead: false };

    const [messages, total] = await Promise.all([
      Message.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Message.countDocuments(filter),
    ]);

    return NextResponse.json({ messages, total, page, limit });
  } catch {
    return NextResponse.json(
      { error: "Error al obtener mensajes" },
      { status: 500 }
    );
  }
}
