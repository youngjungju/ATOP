"use client";

import React, { useState } from 'react';
import FadeInCard from './FadeInCard';
import SeverityScale from './SeverityScale';
import { DIAGNOSIS_DATA } from './mockData';
import { useTranslation } from '@/lib/i18n';

interface SymptomBreakdownCardProps {
  description?: string;
}

const SymptomBreakdownCard = ({ description }: SymptomBreakdownCardProps) => {
  const { t } = useTranslation();
  const [values, setValues] = useState<Record<number, number>>(
    () => Object.fromEntries(DIAGNOSIS_DATA.metrics.map((m, i) => [i, m.value]))
  );

  const handleChange = (index: number, newValue: number) => {
    setValues((prev) => ({ ...prev, [index]: newValue }));
  };

  return (
    <FadeInCard delay={0.2}>
      <h2 className="text-sm font-bold text-gray-400 uppercase mb-6 tracking-tight">{t.symptomBreakdown.title}</h2>
      <div className="space-y-12 mb-8">
        {DIAGNOSIS_DATA.metrics.map((metric, i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {metric.icon}
                <span className="font-bold text-sm text-gray-700">{metric.label}</span>
              </div>
            </div>
            <SeverityScale
              status={metric.status}
              value={values[i]}
              onChange={(val) => handleChange(i, val)}
            />
          </div>
        ))}
      </div>
      <div className="p-4 bg-gray-50 rounded-xl border-l-4 border-[#4A90E2]">
        <p className="text-sm text-gray-600 leading-relaxed italic">&quot;{description || DIAGNOSIS_DATA.description}&quot;</p>
      </div>
    </FadeInCard>
  );
};

export default SymptomBreakdownCard;
