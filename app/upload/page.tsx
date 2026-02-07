"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n";

// Symptom keys (used for form values sent to the API)
const SYMPTOM_KEYS = [
  "itching",
  "redness",
  "pain",
  "dryness",
  "swelling",
  "flaking",
  "burning",
  "tenderness",
  "other",
] as const;

export default function UploadPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [medications, setMedications] = useState("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [symptomOther, setSymptomOther] = useState("");
  const [duration, setDuration] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Pick up a file pre-selected from the home page
  useEffect(() => {
    try {
      const pending = sessionStorage.getItem("pending-upload");
      if (!pending) return;
      sessionStorage.removeItem("pending-upload");

      const { name, type, data } = JSON.parse(pending) as {
        name: string;
        type: string;
        data: string;
      };

      // Convert base64 data URL back to a File object
      fetch(data)
        .then((res) => res.blob())
        .then((blob) => {
          const restored = new File([blob], name, { type });
          setFile(restored);
        });
    } catch {
      // Ignore malformed data – user can still pick a file manually
    }
  }, []);

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

  const symptomLabels = t.upload.symptoms;

  const toggleSymptom = (s: string) => {
    setSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  };

  const handleSubmit = async () => {
    if (!file) {
      setErrorMessage(t.upload.errorNoPhoto);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const symptomList = [
      ...symptoms,
      ...(symptomOther.trim() ? [symptomOther.trim()] : []),
    ];
    const symptomsText = symptomList.join(", ");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("medications", medications.trim());
      formData.append("symptoms", symptomsText);
      formData.append("duration", duration.trim());

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        throw new Error(body?.error ?? "Analysis failed.");
      }

      const report = (await response.json()) as {
        summary: string;
        visual_observations: string[];
        user_reported_symptoms: string[];
        current_medications: string[];
        duration_of_symptoms: string;
        possible_non_diagnostic_causes: string[];
        general_advice: string[];
        disclaimer: string;
      };

      // Convert image to base64 for display on report page
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64 = (reader.result as string) ?? "";
        const reportId =
          typeof crypto !== "undefined"
            ? crypto.randomUUID()
            : `${Date.now()}`;
        sessionStorage.setItem(`report-${reportId}`, JSON.stringify(report));
        sessionStorage.setItem(`report-image-${reportId}`, base64);
        router.push(`/report/${reportId}`);
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-12">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold">{t.upload.title}</h1>
          <p className="text-sm text-zinc-600">
            {t.upload.subtitle}
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-zinc-700">
              {t.upload.photoSection}
            </h2>
            <label className="mt-4 flex h-56 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-500">
              <input
                type="file"
                accept="image/heic,image/heif,image/png,image/jpg,image/jpeg"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              <span>{t.upload.photoPrompt}</span>
              {file && <span className="text-xs">{file.name}</span>}
            </label>
            {previewUrl && (
              <div className="mt-4 overflow-hidden rounded-xl border border-zinc-200">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-56 w-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-zinc-700">
                {t.upload.medicationsTitle}
              </h2>
              <p className="mt-2 text-xs text-zinc-500">
                {t.upload.medicationsHint}
              </p>
              <textarea
                placeholder={t.upload.medicationsPlaceholder}
                value={medications}
                onChange={(e) => setMedications(e.target.value)}
                className="mt-3 w-full resize-none rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                rows={3}
              />
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-zinc-700">{t.upload.symptomsTitle}</h2>
              <p className="mt-2 text-xs text-zinc-500">
                {t.upload.symptomsHint}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {SYMPTOM_KEYS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSymptom(s)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                      symptoms.includes(s)
                        ? "bg-zinc-900 text-white"
                        : "border border-zinc-200 bg-white text-zinc-600"
                    }`}
                  >
                    {symptomLabels[s]}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder={t.upload.symptomOtherPlaceholder}
                value={symptomOther}
                onChange={(e) => setSymptomOther(e.target.value)}
                className="mt-3 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
              />
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-zinc-700">
                {t.upload.durationTitle}
              </h2>
              <input
                type="text"
                placeholder={t.upload.durationPlaceholder}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="mt-3 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-xs text-zinc-500">
            {t.upload.disclaimer}
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
            {isSubmitting ? t.upload.submitting : t.upload.submit}
          </button>
        </section>
      </main>
    </div>
  );
}
