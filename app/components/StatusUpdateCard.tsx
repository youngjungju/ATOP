"use client";

import React from 'react';
import { Pill, FlaskConical, Clock, Heart } from 'lucide-react';
import FadeInCard from './FadeInCard';
import { useTranslation } from '@/lib/i18n';

interface StatusUpdateCardProps {
  selectedFeelings: string[];
  onToggleFeeling: (feeling: string) => void;
  logCompliance: { pill: boolean; ointment: boolean };
  onToggleLogCompliance: (key: 'pill' | 'ointment') => void;
  onPeriod: boolean;
  onTogglePeriod: () => void;
}

const FEELING_KEYS = ["itchiness", "stinging", "dryness", "burning", "sensitive", "normal"] as const;

const StatusUpdateCard = ({
  selectedFeelings,
  onToggleFeeling,
  logCompliance,
  onToggleLogCompliance,
  onPeriod,
  onTogglePeriod,
}: StatusUpdateCardProps) => {
  const { t } = useTranslation();

  return (
  <FadeInCard delay={0.05}>
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-sm font-bold text-gray-400 uppercase tracking-tight">{t.statusUpdate.title}</h2>
      <div className="flex items-center gap-1 text-[10px] font-bold text-[#4A90E2] bg-blue-50 px-2 py-1 rounded">
        <Clock size={12} />
        {t.statusUpdate.justNow}
      </div>
    </div>

    {/* Feeling Selection */}
    <div className="mb-6">
      <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">{t.statusUpdate.currentFeelings}</p>
      <div className="flex flex-wrap gap-2">
        {FEELING_KEYS.map((key) => {
          const label = t.statusUpdate.feelings[key];
          return (
            <button
              key={key}
              onClick={() => onToggleFeeling(key)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all border ${
                selectedFeelings.includes(key)
                  ? 'bg-[#4A90E2] text-white border-[#4A90E2] shadow-md shadow-blue-100'
                  : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>

    {/* Treatment Check & Factors */}
    <div className="space-y-4">
      <p className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">{t.statusUpdate.medicalLog}</p>

      <label className="flex items-center justify-between p-3 rounded-xl border border-gray-50 bg-gray-50/50 cursor-pointer group">
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-lg transition-colors ${logCompliance.pill ? 'bg-[#50C878] text-white' : 'bg-gray-200 text-gray-400'}`}>
            <Pill size={16} />
          </div>
          <span className="text-sm font-bold text-gray-700">{t.statusUpdate.tookPill}</span>
        </div>
        <input
          type="checkbox"
          className="w-5 h-5 rounded border-gray-300 text-[#4A90E2] focus:ring-[#4A90E2]"
          checked={logCompliance.pill}
          onChange={() => onToggleLogCompliance('pill')}
        />
      </label>

      <label className="flex items-center justify-between p-3 rounded-xl border border-gray-50 bg-gray-50/50 cursor-pointer group">
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-lg transition-colors ${logCompliance.ointment ? 'bg-[#50C878] text-white' : 'bg-gray-200 text-gray-400'}`}>
            <FlaskConical size={16} />
          </div>
          <span className="text-sm font-bold text-gray-700">{t.statusUpdate.appliedOintment}</span>
        </div>
        <input
          type="checkbox"
          className="w-5 h-5 rounded border-gray-300 text-[#4A90E2] focus:ring-[#4A90E2]"
          checked={logCompliance.ointment}
          onChange={() => onToggleLogCompliance('ointment')}
        />
      </label>

      <div className="h-px bg-gray-100 w-full my-2" />

      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Heart size={18} className={onPeriod ? "text-pink-400" : "text-gray-300"} />
          <span className="text-sm font-bold text-gray-600">{t.statusUpdate.menstrualCycle}</span>
        </div>
        <button
          onClick={onTogglePeriod}
          className={`w-12 h-6 rounded-full relative transition-colors ${onPeriod ? 'bg-pink-400' : 'bg-gray-200'}`}
        >
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${onPeriod ? 'left-7' : 'left-1'}`} />
        </button>
      </div>
    </div>

    <button className="w-full mt-6 py-3.5 bg-gray-900 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-black transition-all">
      {t.statusUpdate.saveDailyReport}
    </button>
  </FadeInCard>
  );
};

export default StatusUpdateCard;
