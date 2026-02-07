"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

type Report = {
  summary: string;
  visual_observations: string[];
  user_reported_symptoms: string[];
  current_medications: string[];
  duration_of_symptoms: string;
  possible_non_diagnostic_causes: string[];
  general_advice: string[];
  disclaimer: string;
};

export default function ReportPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [report, setReport] = useState<Report | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    const stored = sessionStorage.getItem(`report-${id}`);
    const img = sessionStorage.getItem(`report-image-${id}`);
    if (stored) {
      try {
        setReport(JSON.parse(stored) as Report);
        setImageData(img);
      } catch {
        setNotFound(true);
      }
    } else {
      setNotFound(true);
    }
  }, [id]);

  if (notFound || !id) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-zinc-600">Report not found or expired.</p>
        <Link
          href="/upload"
          className="rounded-full bg-zinc-900 px-6 py-2 text-sm font-semibold text-white"
        >
          Create New Report
        </Link>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <p className="text-zinc-500">Loading report...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-12">
        <header className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Skin Observation Report</h1>
            <p className="text-sm text-zinc-600">
              Preliminary visual analysis — not medical diagnosis
            </p>
          </div>
          <Link
            href="/upload"
            className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700"
          >
            New Report
          </Link>
        </header>

        {imageData && (
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-zinc-700">
              Uploaded Image
            </h2>
            <div className="mt-4 overflow-hidden rounded-xl border border-zinc-200">
              <img
                src={imageData}
                alt="Skin"
                className="h-80 w-full object-cover"
              />
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-700">Summary</h2>
          <p className="mt-3 text-sm text-zinc-700">{report.summary}</p>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-700">
            Visual Observations
          </h2>
          <ul className="mt-3 space-y-2">
            {report.visual_observations.map((obs, i) => (
              <li
                key={i}
                className="rounded-lg border border-zinc-100 px-3 py-2 text-sm text-zinc-700"
              >
                {obs}
              </li>
            ))}
          </ul>
        </section>

        {report.user_reported_symptoms.length > 0 && (
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-zinc-700">
              User-Reported Symptoms
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {report.user_reported_symptoms.map((s, i) => (
                <li
                  key={i}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700"
                >
                  {s}
                </li>
              ))}
            </ul>
          </section>
        )}

        {report.current_medications.length > 0 && (
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-zinc-700">
              Current Medications
            </h2>
            <ul className="mt-3 space-y-1 text-sm text-zinc-700">
              {report.current_medications.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </section>
        )}

        {report.duration_of_symptoms && (
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-zinc-700">
              Duration of Symptoms
            </h2>
            <p className="mt-2 text-sm text-zinc-700">
              {report.duration_of_symptoms}
            </p>
          </section>
        )}

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-700">
            Possible Non-Diagnostic Causes
          </h2>
          <p className="mt-2 text-xs text-zinc-500">
            These are examples only — not a diagnosis.
          </p>
          <ul className="mt-3 space-y-1 text-sm text-zinc-700">
            {report.possible_non_diagnostic_causes.map((c, i) => (
              <li key={i}>• {c}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-700">
            General Advice
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-zinc-700">
            {report.general_advice.map((a, i) => (
              <li key={i}>• {a}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-6">
          <p className="text-sm font-medium text-amber-900">
            {report.disclaimer}
          </p>
        </section>
      </main>
    </div>
  );
}
