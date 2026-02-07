"use client";

import React from 'react';
import {
  Header,
  DiagnosisSummaryCard,
  SymptomBreakdownCard,
  ClinicalReferralCard,
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

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-gray-900 pb-10">
      <Header />

      <main className="max-w-md mx-auto px-5 pt-2">
        <DiagnosisSummaryCard imageUrl={imageUrl} />

        <SymptomBreakdownCard description={summary} />

        <ClinicalReferralCard />

        <div className="text-center py-6">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-10 leading-loose">
            Disclaimer: This is an AI-powered assessment. Please consult with a board-certified dermatologist for a clinical diagnosis.
          </p>
        </div>
      </main>
    </div>
  );
}
