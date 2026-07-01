import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  await connectDB();
  return NextResponse.json({ ok: true });
}
