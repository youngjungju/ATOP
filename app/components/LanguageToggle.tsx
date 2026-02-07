"use client";

import React from "react";
import { useTranslation, type Locale } from "@/lib/i18n";

const options: { value: Locale; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "ko", label: "KR" },
];

const LanguageToggle = () => {
  const { locale, setLocale } = useTranslation();

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center rounded-full bg-white/80 shadow-md backdrop-blur-sm border border-gray-200/60 p-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setLocale(opt.value)}
          className={`relative px-3.5 py-1.5 text-xs font-bold rounded-full transition-all duration-200 ${
            locale === opt.value
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageToggle;
