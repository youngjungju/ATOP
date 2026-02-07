type Medication = {
  name: string;
  time: "morning" | "evening";
  type: "topical" | "oral";
};

type ReportPageProps = {
  searchParams?: {
    imageUrl?: string;
    summary?: string;
    meds?: string;
  };
};

const timeLabel: Record<Medication["time"], string> = {
  morning: "아침",
  evening: "저녁",
};

const typeLabel: Record<Medication["type"], string> = {
  oral: "먹는 약",
  topical: "바르는 약",
};

const parseMedications = (raw?: string): Medication[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Medication[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item?.name);
  } catch {
    return [];
  }
};

export default function ReportPage({ searchParams }: ReportPageProps) {
  const imageUrl = searchParams?.imageUrl ?? "";
  const summary = searchParams?.summary ?? "";
  const medications = parseMedications(searchParams?.meds);

  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-12">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold">관찰 리포트</h1>
          <p className="text-sm text-zinc-600">
            사진과 사용자 기록에 기반한 시각적 관찰 요약입니다.
          </p>
        </header>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-700">업로드 이미지</h2>
          {imageUrl ? (
            <div className="mt-4 overflow-hidden rounded-xl border border-zinc-200">
              <img
                src={imageUrl}
                alt="업로드 이미지"
                className="h-80 w-full object-cover"
              />
            </div>
          ) : (
            <p className="mt-4 text-sm text-zinc-500">
              이미지가 제공되지 않았습니다.
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-700">
            AI 시각적 관찰 요약
          </h2>
          <p className="mt-3 whitespace-pre-wrap text-sm text-zinc-700">
            {summary || "요약 정보가 없습니다."}
          </p>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-700">
            복용/사용 중인 약 정보
          </h2>
          {medications.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-500">
              입력된 약 정보가 없습니다.
            </p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm text-zinc-700">
              {medications.map((med, index) => (
                <li
                  key={`${med.name}-${index}`}
                  className="rounded-lg border border-zinc-200 px-3 py-2"
                >
                  <div className="font-semibold">{med.name}</div>
                  <div className="text-xs text-zinc-500">
                    {timeLabel[med.time]} · {typeLabel[med.type]}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 text-xs text-zinc-500 shadow-sm">
          본 결과는 의료 진단이 아니며, 사진과 사용자 기록에 기반한 시각적
          관찰 요약입니다.
        </section>
      </main>
    </div>
  );
}
