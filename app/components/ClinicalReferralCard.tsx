"use client";

import React from 'react';
import { MapPin, Calendar, Navigation } from 'lucide-react';
import FadeInCard from './FadeInCard';
import { DIAGNOSIS_DATA } from './mockData';
import { useTranslation } from '@/lib/i18n';

const ClinicalReferralCard = () => {
  const { t } = useTranslation();

  return (
  <FadeInCard delay={0.3}>
    <h2 className="text-sm font-bold text-gray-400 uppercase mb-5 tracking-tight">{t.clinicalReferral.title}</h2>
    <div className="mb-4">
      <h3 className="text-lg font-bold text-gray-800">{DIAGNOSIS_DATA.referral.doctor}</h3>
      <div className="flex items-center gap-1 text-gray-500">
        <p className="text-xs font-medium">{DIAGNOSIS_DATA.referral.hospital}</p>
        <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded text-gray-400 font-bold ml-1">
          {DIAGNOSIS_DATA.referral.distance}
        </span>
      </div>
    </div>
    <div className="w-full h-32 bg-gray-100 rounded-xl mb-6 relative overflow-hidden group">
      <div className="absolute inset-0 bg-[#e5e7eb] flex items-center justify-center">
        <div className="relative">
          <div className="absolute -top-6 -left-2 flex flex-col items-center">
            <MapPin size={32} className="text-red-500 drop-shadow-md animate-bounce" />
            <div className="w-4 h-1 bg-black/10 rounded-full blur-[1px]" />
          </div>
          <div className="grid grid-cols-4 grid-rows-4 gap-2 opacity-30">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="w-8 h-8 bg-white rounded-sm" />
            ))}
          </div>
        </div>
      </div>
    </div>
    <div className="flex flex-col gap-2">
      <button className="w-full py-4 bg-[#4A90E2] text-white rounded-[8px] font-bold shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
        <Calendar size={18} /> {t.clinicalReferral.bookAppointment}
      </button>
      <button className="w-full py-4 bg-white text-[#4A90E2] border-2 border-[#4A90E2] rounded-[8px] font-bold hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
        <Navigation size={18} /> {t.clinicalReferral.openInMaps}
      </button>
    </div>
  </FadeInCard>
  );
};

export default ClinicalReferralCard;
