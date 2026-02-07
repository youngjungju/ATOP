"use client";

import React, { useState } from 'react';
import { MapPin, Calendar, Navigation, ChevronLeft, ChevronRight } from 'lucide-react';
import FadeInCard from './FadeInCard';
import { DIAGNOSIS_DATA } from './mockData';
import { useTranslation } from '@/lib/i18n';

const ClinicalReferralCard = () => {
  const { t, locale } = useTranslation();
  const hospitals = DIAGNOSIS_DATA.hospitals;
  const [currentIndex, setCurrentIndex] = useState(0);

  const goPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? hospitals.length - 1 : prev - 1));
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev === hospitals.length - 1 ? 0 : prev + 1));
  };

  const current = hospitals[currentIndex];

  const handleOpenInMaps = () => {
    window.open(current.mapUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <FadeInCard delay={0.3}>
      <h2 className="text-sm font-bold text-gray-400 uppercase mb-5 tracking-tight">
        {t.clinicalReferral.title}
      </h2>

      {/* Hospital carousel */}
      <div className="relative mb-4">
        {/* Navigation arrows */}
        <button
          onClick={goPrev}
          aria-label="Previous hospital"
          className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all"
        >
          <ChevronLeft size={16} className="text-gray-600" />
        </button>
        <button
          onClick={goNext}
          aria-label="Next hospital"
          className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all"
        >
          <ChevronRight size={16} className="text-gray-600" />
        </button>

        {/* Hospital info card */}
        <div className="mx-6 bg-gray-50 rounded-xl p-4 transition-all duration-300 ease-in-out">
          <h3 className="text-lg font-bold text-gray-800">
            {locale === 'ko' ? current.name : current.nameEn}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">{current.doctor}</p>
          <div className="flex items-center gap-1 mt-1.5">
            <span className="text-[10px] px-1.5 py-0.5 bg-white rounded text-gray-400 font-bold border border-gray-200">
              {current.distance}
            </span>
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-1.5 mt-3">
          {hospitals.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to hospital ${i + 1}`}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? 'bg-[#4A90E2] w-4'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Map placeholder */}
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

      {/* Action buttons */}
      <div className="flex flex-col gap-2">
        <button className="w-full py-4 bg-[#4A90E2] text-white rounded-[8px] font-bold shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
          <Calendar size={18} /> {t.clinicalReferral.bookAppointment}
        </button>
        <button
          onClick={handleOpenInMaps}
          className="w-full py-4 bg-white text-[#4A90E2] border-2 border-[#4A90E2] rounded-[8px] font-bold hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
        >
          <Navigation size={18} /> {t.clinicalReferral.openInMaps}
        </button>
      </div>

      {/* Counter label */}
      <p className="text-center text-[10px] text-gray-400 mt-3 font-medium">
        {currentIndex + 1} / {hospitals.length} {t.clinicalReferral.hospitalCount}
      </p>
    </FadeInCard>
  );
};

export default ClinicalReferralCard;
