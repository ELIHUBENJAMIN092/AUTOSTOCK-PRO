import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No se envió ninguna imagen" },
        { status: 400 }
      );
    }

    // Validar tipo y tamaño (máx 5MB)
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5 MB

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Tipo de imagen no permitido" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    if ((file as any).size && (file as any).size > maxSize) {
      return NextResponse.json({ error: "Imagen demasiado grande (máx 5MB)" }, { status: 400 });
    }
    const buffer = Buffer.from(bytes);

    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "products",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          }
        )
        .end(buffer);
    });

    return NextResponse.json({
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    });
  } catch (error) {
    console.error("Cloudinary error:", error);
    return NextResponse.json(
      { error: "Error subiendo imagen" },
      { status: 500 }
    );
  }
}
