"use client";

import React from 'react';
import { Bell, CheckCircle2, Pill, FlaskConical } from 'lucide-react';
import FadeInCard from './FadeInCard';
import { DIAGNOSIS_DATA } from './mockData';
import { useTranslation } from '@/lib/i18n';

interface ActiveTreatmentCardProps {
  reminders: Record<number, boolean>;
  onToggleReminder: (id: number) => void;
  medications?: Array<{
    name: string;
    time: string;
    type: string;
  }>;
}

const ActiveTreatmentCard = ({ reminders, onToggleReminder, medications }: ActiveTreatmentCardProps) => {
  const { t } = useTranslation();

  // If medications are provided, map them to the display format
  // Otherwise use the mock data
  const treatmentsToDisplay = medications && medications.length > 0 
    ? medications.map((med, index) => ({
        id: index + 1,
        name: med.name,
        dosage: `${med.type === 'oral' ? t.activeTreatment.pill : t.activeTreatment.topical} • ${med.time === 'morning' ? t.activeTreatment.morning : t.activeTreatment.evening}`,
        icon: med.type === 'oral' ? <Pill size={20} /> : <FlaskConical size={20} />
      }))
    : DIAGNOSIS_DATA.treatments;

  return (
    <FadeInCard delay={0}>
      <div className="bg-[#F0F7FF] -m-6 p-6 rounded-[16px]">
        <h2 className="text-sm font-bold text-gray-400 uppercase mb-5 tracking-tight">{t.activeTreatment.title}</h2>
        <div className="space-y-3">
          {treatmentsToDisplay.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-[12px] flex items-center justify-between shadow-sm border border-blue-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-[#4A90E2]">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-800">{item.name}</h4>
                  <p className="text-[11px] text-gray-500 font-medium uppercase">{item.dosage}</p>
                </div>
              </div>
              <button
                onClick={() => onToggleReminder(item.id)}
                className={`p-2 rounded-full transition-colors ${reminders[item.id] ? 'bg-[#50C878] text-white' : 'bg-gray-100 text-gray-400'}`}
              >
                <Bell size={16} />
              </button>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 py-3 border-2 border-dashed border-blue-200 rounded-xl flex items-center justify-center gap-2 text-[#4A90E2] text-sm font-bold bg-white/50 hover:bg-white transition-colors">
          <CheckCircle2 size={18} />
          {t.activeTreatment.logDailyUsage}
        </button>
      </div>
    </FadeInCard>
  );
};

export default ActiveTreatmentCard;
