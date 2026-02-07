"use client";

import React from "react";
import { I18nProvider } from "@/lib/i18n";
import LanguageToggle from "@/app/components/LanguageToggle";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <LanguageToggle />
      {children}
    </I18nProvider>
  );
}
