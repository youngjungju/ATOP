"use client";

import React from 'react';
import FadeInCard from './FadeInCard';
import ConfidenceBadge from './ConfidenceBadge';
import { DIAGNOSIS_DATA } from './mockData';

interface DiagnosisSummaryCardProps {
  imageUrl?: string;
  subtype?: string;
}

const DiagnosisSummaryCard = ({ imageUrl, subtype }: DiagnosisSummaryCardProps) => (
  <FadeInCard delay={0.1}>
    <div className="flex justify-between items-start mb-6">
      <h2 className="text-sm font-bold text-gray-400 uppercase tracking-tight">Analysis Result</h2>
      <ConfidenceBadge percentage={DIAGNOSIS_DATA.confidence} />
    </div>
    <div className="text-center mb-8">
      <h3 className="text-2xl font-bold text-gray-800 leading-tight italic">{subtype || DIAGNOSIS_DATA.subtype}</h3>
    </div>
    <div className="flex justify-center items-center gap-6 mb-4">
      <div className="flex flex-col items-center gap-2">
        <div className="w-20 h-20 rounded-full border-4 border-[#4A90E2]/20 overflow-hidden relative bg-gray-200">
          {imageUrl ? (
            <img src={imageUrl} alt="User Photo" className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-200 to-red-100 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-red-400/30 blur-md" />
            </div>
          )}
        </div>
        <span className="text-[10px] font-bold text-gray-400 uppercase">User Photo</span>
      </div>
      <div className="h-px w-8 bg-gray-100" />
      <div className="flex flex-col items-center gap-2">
        <div className="w-20 h-20 rounded-full border-4 border-[#50C878]/20 overflow-hidden relative bg-gray-200">
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-300 to-red-200 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-red-500/40 blur-lg" />
          </div>
        </div>
        <span className="text-[10px] font-bold text-gray-400 uppercase">Reference</span>
      </div>
    </div>
  </FadeInCard>
);

export default DiagnosisSummaryCard;
