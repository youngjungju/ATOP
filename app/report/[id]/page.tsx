"use client";

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Header,
  DiagnosisSummaryCard,
  SymptomBreakdownCard,
  ClinicalReferralCard,
  ActiveTreatmentCard,
  StatusUpdateCard,
  BottomSheetDialog,
} from '@/app/components';

type ReportPageProps = {
  searchParams: Promise<{
    imageUrl?: string;
    summary?: string;
  }>;
};

export default function ReportPage({ searchParams }: ReportPageProps) {
  const resolvedParams = React.use(searchParams);
  const imageUrl = resolvedParams?.imageUrl ?? "";
  const summary = resolvedParams?.summary ?? "";

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
  const [logCompliance, setLogCompliance] = useState({ pill: false, ointment: false });
  const [onPeriod, setOnPeriod] = useState(false);

  const handleToggleFeeling = useCallback((feeling: string) => {
    setSelectedFeelings((prev) =>
      prev.includes(feeling) ? prev.filter((f) => f !== feeling) : [...prev, feeling]
    );
  }, []);

  const handleToggleLogCompliance = useCallback((key: 'pill' | 'ointment') => {
    setLogCompliance((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleTogglePeriod = useCallback(() => {
    setOnPeriod((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-gray-900 pb-10">
      <Header />

      <main className="max-w-md mx-auto px-5 pt-2">
        <DiagnosisSummaryCard imageUrl={imageUrl} />

        <SymptomBreakdownCard description={summary} />

        {/* Action buttons */}
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
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#4A90E2]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714a2.25 2.25 0 0 0 .659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47 2.47a2.25 2.25 0 0 1-1.591.659H9.061a2.25 2.25 0 0 1-1.591-.659L5 14.5m14 0H5" />
              </svg>
            </span>
            <span className="text-xs font-bold text-gray-700 text-center leading-tight">My Prescriptions</span>
            <span className="text-[10px] text-gray-400 text-center leading-snug">Log current medications</span>
          </button>

          <button
            onClick={() => setConditionOpen(true)}
            className="flex flex-col items-center gap-2 bg-white rounded-[16px] p-5 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] border border-gray-50 hover:border-[#50C878]/30 hover:shadow-md active:scale-[0.97] transition-all cursor-pointer group"
          >
            <span className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#50C878]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </span>
            <span className="text-xs font-bold text-gray-700 text-center leading-tight">Body Condition Check</span>
            <span className="text-[10px] text-gray-400 text-center leading-snug">Report how you feel</span>
          </button>
        </motion.div>

        <ClinicalReferralCard />

        <div className="text-center py-6">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-10 leading-loose">
            Disclaimer: This is an AI-powered assessment. Please consult with a board-certified dermatologist for a clinical diagnosis.
          </p>
        </div>
      </main>

      {/* My Prescriptions dialog */}
      <BottomSheetDialog
        open={prescriptionsOpen}
        onClose={() => setPrescriptionsOpen(false)}
        title="My Prescriptions"
      >
        <ActiveTreatmentCard
          reminders={reminders}
          onToggleReminder={handleToggleReminder}
        />
      </BottomSheetDialog>

      {/* Body Condition Check dialog */}
      <BottomSheetDialog
        open={conditionOpen}
        onClose={() => setConditionOpen(false)}
        title="Body Condition Check"
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
