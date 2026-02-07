"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import React from "react";
import en from "./locales/en";
import ko from "./locales/ko";
import type { Translations } from "./locales/en";

// ─── Supported locales ───
export const LOCALES = ["en", "ko"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  ko: "한국어",
};

// ─── Locale → translations map ───
const messages: Record<Locale, Translations> = { en, ko };

// ─── Default locale ───
const DEFAULT_LOCALE: Locale = "en";
const STORAGE_KEY = "atop-locale";

// ─── Helpers ───

/** Read the persisted locale from localStorage (safe for SSR). */
function getStoredLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && LOCALES.includes(stored as Locale)) return stored as Locale;
  return DEFAULT_LOCALE;
}

/** Persist the chosen locale. */
function storeLocale(locale: Locale) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, locale);
  }
}

// ─── Context ───

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: en,
});

// ─── Provider ───

interface I18nProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
}

export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(
    initialLocale ?? getStoredLocale
  );

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    storeLocale(next);
  }, []);

  const value: I18nContextValue = {
    locale,
    setLocale,
    t: messages[locale],
  };

  return React.createElement(I18nContext.Provider, { value }, children);
}

// ─── Hook ───

/**
 * Access translations and locale management.
 *
 * @example
 * const { t, locale, setLocale } = useTranslation();
 * <h1>{t.home.headingLine1}</h1>
 * <button onClick={() => setLocale("ko")}>한국어</button>
 */
export function useTranslation() {
  return useContext(I18nContext);
}

// ─── Re-exports ───
export type { Translations };
export { en, ko };
