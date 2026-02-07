import { NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "업로드할 파일이 없습니다." },
        { status: 400 },
      );
    }

    const allowedMimeTypes = new Set([
      "image/heic",
      "image/heif",
      "image/png",
      "image/jpg",
      "image/jpeg",
    ]);
    const allowedExtensions = new Set(["heic", "heif", "png", "jpg", "jpeg"]);
    const extension = file.name.split(".").pop()?.toLowerCase() || "";

    if (file.type) {
      if (!allowedMimeTypes.has(file.type)) {
        return NextResponse.json(
          { error: "지원하지 않는 이미지 형식입니다." },
          { status: 400 },
        );
      }
    } else if (extension && !allowedExtensions.has(extension)) {
      return NextResponse.json(
        { error: "지원하지 않는 이미지 형식입니다." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = `uploads/${crypto.randomUUID()}.${
      extension || "jpg"
    }`;

    const supabase = getSupabaseAdmin();
    const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "skin-images";

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });

    if (error) {
      return NextResponse.json(
        { error: `스토리지 업로드 실패: ${error.message}` },
        { status: 500 },
      );
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return NextResponse.json({ publicUrl: data.publicUrl });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "업로드 처리 중 오류가 발생했습니다.";
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
