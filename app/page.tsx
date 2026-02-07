import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-16">
        <header className="flex flex-col gap-6">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-500">
            Skin Observation Report
          </p>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            진단이 아닌 관찰로,
            <br />
            의사와의 대화를 더 쉽게 만듭니다.
          </h1>
          <p className="max-w-2xl text-lg text-zinc-600">
            피부 사진과 복용 기록을 기반으로 AI가 시각적 특징을 요약합니다.
            판단이나 처방 없이, 전달하기 쉬운 언어로 정리합니다.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
              href="/upload"
            >
              지금 관찰 리포트 만들기
            </Link>
            <div className="rounded-full border border-zinc-200 px-6 py-3 text-sm text-zinc-600">
              의료 진단이 아닌 관찰 요약입니다.
            </div>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "사진 기반 요약",
              body: "붉은기, 건조해 보이는 영역, 표면 질감 등 눈에 보이는 특징만 서술합니다.",
            },
            {
              title: "복용 기록 정리",
              body: "사용자가 입력한 약 정보를 사실 기록으로만 요약합니다.",
            },
            {
              title: "의료 오해 방지",
              body: "진단/처방/치료 제안 없이 관찰 결과만 제공합니다.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-base font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-zinc-600">{item.body}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-zinc-200 bg-white p-8">
          <h2 className="text-xl font-semibold">데모 흐름</h2>
          <ol className="mt-4 grid gap-3 text-sm text-zinc-600 md:grid-cols-2">
            <li>1. Upload skin photo</li>
            <li>2. Enter medications, symptoms, duration</li>
            <li>3. BLIP-2 visual analysis + report generation</li>
            <li>4. View structured report with disclaimer</li>
          </ol>
          <p className="mt-6 text-xs text-zinc-500">
            본 서비스는 의료 진단이 아니며, 사진과 사용자 기록에 기반한 시각적
            관찰 요약입니다.
          </p>
        </section>
      </main>
    </div>
  );
}
