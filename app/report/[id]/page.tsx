"use client";

import React, { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Header,
  DiagnosisSummaryCard,
  SymptomBreakdownCard,
  ClinicalReferralCard,
  ActiveTreatmentCard,
  StatusUpdateCard,
  BottomSheetDialog,
  FadeInCard,
} from "@/app/components";
import { useTranslation } from "@/lib/i18n";

// ── Preserved: identical Report type ──
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
  const { t } = useTranslation();
  // ── Preserved: identical data-fetching logic ──
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

  // ── New: local state for interactive UI components ──

  // Dialog state
  const [prescriptionsOpen, setPrescriptionsOpen] = useState(false);
  const [conditionOpen, setConditionOpen] = useState(false);

  // ActiveTreatmentCard state
  const [reminders, setReminders] = useState<Record<number, boolean>>({});
  const handleToggleReminder = useCallback((id: number) => {
    setReminders((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // StatusUpdateCard state
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  const [logCompliance, setLogCompliance] = useState({
    pill: false,
    ointment: false,
  });
  const [onPeriod, setOnPeriod] = useState(false);

  const handleToggleFeeling = useCallback((feeling: string) => {
    setSelectedFeelings((prev) =>
      prev.includes(feeling)
        ? prev.filter((f) => f !== feeling)
        : [...prev, feeling]
    );
  }, []);

  const handleToggleLogCompliance = useCallback(
    (key: "pill" | "ointment") => {
      setLogCompliance((prev) => ({ ...prev, [key]: !prev[key] }));
    },
    []
  );

  const handleTogglePeriod = useCallback(() => {
    setOnPeriod((prev) => !prev);
  }, []);

  // ── Data transformation: medications for ActiveTreatmentCard ──
  const medicationProps = report
    ? report.current_medications.map((med) => ({
        name: med,
        time: "morning" as const,
        type: "oral" as const,
      }))
    : [];

  // ── Preserved: identical not-found conditional logic (UI-only styling update) ──
  if (notFound || !id) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-gray-500 font-medium">
          {t.report.notFound}
        </p>
        <Link
          href="/upload"
          className="rounded-xl bg-[#4A90E2] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200"
        >
          {t.report.createNew}
        </Link>
      </div>
    );
  }

  // ── Preserved: identical loading conditional logic (UI-only styling update) ──
  if (!report) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <p className="text-gray-400 font-medium">{t.report.loading}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-gray-900 pb-10">
      <Header />

      {/* Preserved navigation — "New Report" link (replaces old header <Link>) */}
      <div className="max-w-md mx-auto px-5 pt-3 pb-1 flex justify-end">
        <Link
          href="/upload"
          className="text-xs font-bold text-[#4A90E2] hover:underline"
        >
          {t.report.newReport}
        </Link>
      </div>

      <main className="max-w-md mx-auto px-5 pt-2">
        {/* ── report.imageData ── */}
        {/* Primary diagnosis card with uploaded image (image only, subtype uses mock) */}
        <DiagnosisSummaryCard imageUrl={imageData ?? undefined} />

        {/* ── report.summary ── */}
        {/* Summary — preserved as readable paragraph (NOT crammed into subtype heading) */}
        <FadeInCard delay={0.15}>
          <h2 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-tight">
            {t.report.summary}
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {report.summary}
          </p>
        </FadeInCard>

        {/* ── report.visual_observations ── */}
        {/* Symptom breakdown with severity sliders + observations as quoted description */}
        <SymptomBreakdownCard
          description={report.visual_observations.join(" ")}
        />

        {/* ── report.user_reported_symptoms ── */}
        {/* Preserved from API data — these are the symptoms the user selected during upload */}
        {report.user_reported_symptoms.length > 0 && (
          <FadeInCard delay={0.25}>
            <h2 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-tight">
              {t.report.userReportedSymptoms}
            </h2>
            <div className="flex flex-wrap gap-2">
              {report.user_reported_symptoms.map((s, i) => (
                <span
                  key={i}
                  className="rounded-full bg-[#4A90E2]/10 px-3 py-1.5 text-xs font-semibold text-[#4A90E2]"
                >
                  {s}
                </span>
              ))}
            </div>
          </FadeInCard>
        )}

        {/* ── report.duration_of_symptoms ── */}
        {/* Preserved from API data — conditionally rendered when present */}
        {report.duration_of_symptoms && (
          <FadeInCard delay={0.28}>
            <h2 className="text-sm font-bold text-gray-400 uppercase mb-3 tracking-tight">
              {t.report.durationOfSymptoms}
            </h2>
            <p className="text-sm text-gray-600">
              {report.duration_of_symptoms}
            </p>
          </FadeInCard>
        )}

        {/* Action buttons grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-2 gap-3 mb-5"
        >
          <button
            onClick={() => setPrescriptionsOpen(true)}
            className="flex flex-col items-center gap-2 bg-white rounded-[16px] p-5 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] border border-gray-50 hover:border-[#4A90E2]/30 hover:shadow-md active:scale-[0.97] transition-all cursor-pointer group"
          >
            <span className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-[#4A90E2]"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714a2.25 2.25 0 0 0 .659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47 2.47a2.25 2.25 0 0 1-1.591.659H9.061a2.25 2.25 0 0 1-1.591-.659L5 14.5m14 0H5"
                />
              </svg>
            </span>
            <span className="text-xs font-bold text-gray-700 text-center leading-tight">
              {t.report.prescriptionsButton}
            </span>
            <span className="text-[10px] text-gray-400 text-center leading-snug">
              {t.report.prescriptionsHint}
            </span>
          </button>

          <button
            onClick={() => setConditionOpen(true)}
            className="flex flex-col items-center gap-2 bg-white rounded-[16px] p-5 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] border border-gray-50 hover:border-[#50C878]/30 hover:shadow-md active:scale-[0.97] transition-all cursor-pointer group"
          >
            <span className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-[#50C878]"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </span>
            <span className="text-xs font-bold text-gray-700 text-center leading-tight">
              {t.report.conditionButton}
            </span>
            <span className="text-[10px] text-gray-400 text-center leading-snug">
              {t.report.conditionHint}
            </span>
          </button>
        </motion.div>

        {/* ── report.possible_non_diagnostic_causes ── */}
        {report.possible_non_diagnostic_causes.length > 0 && (
          <FadeInCard delay={0.35}>
            <h2 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-tight">
              {t.report.possibleCauses}
            </h2>
            <p className="text-[10px] text-gray-400 mb-3">
              {t.report.possibleCausesNote}
            </p>
            <ul className="space-y-2">
              {report.possible_non_diagnostic_causes.map((cause, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-600"
                >
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#4A90E2] flex-shrink-0" />
                  {cause}
                </li>
              ))}
            </ul>
          </FadeInCard>
        )}

        {/* ── report.general_advice ── */}
        {report.general_advice.length > 0 && (
          <FadeInCard delay={0.4}>
            <h2 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-tight">
              {t.report.generalAdvice}
            </h2>
            <ul className="space-y-2">
              {report.general_advice.map((advice, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-600"
                >
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#50C878] flex-shrink-0" />
                  {advice}
                </li>
              ))}
            </ul>
          </FadeInCard>
        )}

        {/* Clinical referral */}
        <ClinicalReferralCard />

        {/* ── report.disclaimer ── */}
        <div className="text-center py-6">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-10 leading-loose">
            {report.disclaimer}
          </p>
        </div>
      </main>

      {/* ── report.current_medications (via BottomSheetDialog) ── */}
      <BottomSheetDialog
        open={prescriptionsOpen}
        onClose={() => setPrescriptionsOpen(false)}
        title={t.report.prescriptionsButton}
      >
        <ActiveTreatmentCard
          reminders={reminders}
          onToggleReminder={handleToggleReminder}
          medications={medicationProps.length > 0 ? medicationProps : undefined}
        />
      </BottomSheetDialog>

      {/* Body Condition Check dialog (new interactive feature, not replacing existing data) */}
      <BottomSheetDialog
        open={conditionOpen}
        onClose={() => setConditionOpen(false)}
        title={t.report.conditionButton}
      >
        <StatusUpdateCard
          selectedFeelings={selectedFeelings}
          onToggleFeeling={handleToggleFeeling}
          logCompliance={logCompliance}
          onToggleLogCompliance={handleToggleLogCompliance}
          onPeriod={onPeriod}
          onTogglePeriod={handleTogglePeriod}
        />
      </BottomSheetDialog>
    </div>
  );
}
