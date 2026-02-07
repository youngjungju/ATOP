"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Medication = {
  name: string;
  time: "morning" | "evening";
  type: "topical" | "oral";
};

const DEFAULT_MEDICATION: Medication = {
  name: "",
  time: "morning",
  type: "oral",
};

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [medications, setMedications] = useState<Medication[]>([
    { ...DEFAULT_MEDICATION },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file],
  );

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const updateMedication = (
    index: number,
    field: keyof Medication,
    value: string,
  ) => {
    setMedications((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const addMedication = () => {
    setMedications((prev) => [...prev, { ...DEFAULT_MEDICATION }]);
  };

  const removeMedication = (index: number) => {
    setMedications((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async () => {
    if (!file) {
      setErrorMessage("사진 파일을 먼저 업로드해주세요.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const filteredMedications = medications
      .map((med) => ({ ...med, name: med.name.trim() }))
      .filter((med) => med.name.length > 0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorBody = (await uploadResponse.json()) as {
          error?: string;
        };
        throw new Error(
          errorBody?.error ?? "이미지 업로드에 실패했습니다.",
        );
      }

      const uploadData = (await uploadResponse.json()) as {
        publicUrl: string;
      };

      const visionResponse = await fetch("/api/vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: uploadData.publicUrl,
          medications: filteredMedications,
        }),
      });

      if (!visionResponse.ok) {
        const errorBody = (await visionResponse.json()) as {
          error?: string;
        };
        throw new Error(
          errorBody?.error ?? "AI 관찰 요약 생성에 실패했습니다.",
        );
      }

      const visionData = (await visionResponse.json()) as { summary: string };

      const reportId =
        typeof crypto !== "undefined"
          ? crypto.randomUUID()
          : `${Date.now()}`;

      const params = new URLSearchParams({
        imageUrl: uploadData.publicUrl,
        summary: visionData.summary,
        meds: JSON.stringify(filteredMedications),
      });

      router.push(`/report/${reportId}?${params.toString()}`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "처리 중 오류가 발생했습니다.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-12">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold">관찰 리포트 만들기</h1>
          <p className="text-sm text-zinc-600">
            사진과 복용 기록을 입력하면, AI가 시각적 특징을 요약합니다.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-zinc-700">
              사진 업로드
            </h2>
            <label className="mt-4 flex h-56 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-500">
              <input
                type="file"
                accept="image/heic,image/heif,image/png,image/jpg,image/jpeg"
                className="hidden"
                onChange={(event) => {
                  const selected = event.target.files?.[0] ?? null;
                  setFile(selected);
                }}
              />
              <span>이미지를 선택하세요</span>
              {file && <span className="text-xs">{file.name}</span>}
            </label>
            {previewUrl && (
              <div className="mt-4 overflow-hidden rounded-xl border border-zinc-200">
                <img
                  src={previewUrl}
                  alt="업로드 미리보기"
                  className="h-56 w-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-zinc-700">
              복용/사용 중인 약 기록
            </h2>
            <p className="mt-2 text-xs text-zinc-500">
              의료 판단 없이 사실 기록만 리포트에 표시됩니다.
            </p>
            <div className="mt-4 space-y-4">
              {medications.map((med, index) => (
                <div
                  key={`med-${index}`}
                  className="rounded-xl border border-zinc-200 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-600">
                      약 정보 {index + 1}
                    </span>
                    {medications.length > 1 && (
                      <button
                        type="button"
                        className="text-xs text-red-500"
                        onClick={() => removeMedication(index)}
                      >
                        삭제
                      </button>
                    )}
                  </div>
                  <div className="mt-3 grid gap-3">
                    <input
                      type="text"
                      placeholder="약 이름"
                      value={med.name}
                      onChange={(event) =>
                        updateMedication(index, "name", event.target.value)
                      }
                      className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={med.time}
                        onChange={(event) =>
                          updateMedication(index, "time", event.target.value)
                        }
                        className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                      >
                        <option value="morning">아침</option>
                        <option value="evening">저녁</option>
                      </select>
                      <select
                        value={med.type}
                        onChange={(event) =>
                          updateMedication(index, "type", event.target.value)
                        }
                        className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                      >
                        <option value="oral">먹는 약</option>
                        <option value="topical">바르는 약</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-4 w-full rounded-xl border border-dashed border-zinc-300 px-3 py-2 text-sm text-zinc-600"
              onClick={addMedication}
            >
              + 약 정보 추가
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-xs text-zinc-500">
            본 결과는 의료 진단이 아니며, 사진과 사용자 기록에 기반한 시각적
            관찰 요약입니다.
          </p>
          {errorMessage && (
            <p className="mt-3 text-sm text-red-500">{errorMessage}</p>
          )}
          <button
            type="button"
            className="mt-4 w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-zinc-400"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "리포트 생성 중..." : "리포트 생성하기"}
          </button>
        </section>
      </main>
    </div>
  );
}
