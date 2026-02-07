import { NextResponse } from "next/server";

import { getGeminiModel } from "@/lib/gemini";

type Medication = {
  name: string;
  time: "morning" | "evening";
  type: "topical" | "oral";
};

const timeLabel: Record<Medication["time"], string> = {
  morning: "아침",
  evening: "저녁",
};

const typeLabel: Record<Medication["type"], string> = {
  oral: "먹는 약",
  topical: "바르는 약",
};

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      imageUrl?: string;
      medications?: Medication[];
    };

    if (!body.imageUrl) {
      return NextResponse.json(
        { error: "이미지 URL이 필요합니다." },
        { status: 400 },
      );
    }

    const imageResponse = await fetch(body.imageUrl);
    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: "이미지 URL을 불러올 수 없습니다." },
        { status: 400 },
      );
    }

    const contentType =
      imageResponse.headers.get("content-type") || "image/jpeg";
    if (!contentType.startsWith("image/")) {
      return NextResponse.json(
        { error: "유효한 이미지 타입이 아닙니다." },
        { status: 400 },
      );
    }

    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    const imageBase64 = imageBuffer.toString("base64");

    const medications = Array.isArray(body.medications)
      ? body.medications.filter((med) => med?.name)
      : [];

    const medsText =
      medications.length === 0
        ? "입력된 약 정보 없음"
        : medications
            .map(
              (med) =>
                `- ${med.name} (${timeLabel[med.time]}, ${typeLabel[med.type]})`,
            )
            .join("\n");

    const model = getGeminiModel();
    const instructions = [
      "너는 의료 진단을 하지 않는다.",
      "사진에서 보이는 시각적 특징을 객관적으로 관찰하여 한국어로 요약한다.",
      "질병명 단정, 상태 판단, 치료/약 추천은 절대 하지 않는다.",
      "사용자 약 정보는 사실 기록 수준으로만 언급한다.",
      "불확실성(조명/화질)을 반드시 한 줄 포함한다.",
      "출력은 4~6줄의 짧은 문장으로 구성한다.",
    ].join("\n");

    const prompt = `${instructions}\n\n사용자 복용/사용 기록:\n${medsText}\n\n사진을 기반으로 관찰 요약을 작성해줘.`;

    const result = await model.generateContent([
      { text: prompt },
      {
        inlineData: {
          data: imageBase64,
          mimeType: contentType,
        },
      },
    ]);

    const summary =
      result.response.text()?.trim() || "요약을 생성할 수 없습니다.";

    return NextResponse.json({ summary });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "관찰 요약 생성 중 오류가 발생했습니다.";
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
