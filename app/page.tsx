"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Shield, Upload, Lock, CircleCheckBig, MessageCircleHeart } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const ACCEPTED_TYPES = "image/heic,image/heif,image/png,image/jpg,image/jpeg";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { t } = useTranslation();

  const handleCardClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert(t.home.fileTooLarge);
      return;
    }

    // Convert file to base64 and store in sessionStorage so the upload page
    // can pick it up and pre-populate the preview.
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      sessionStorage.setItem("pending-upload", JSON.stringify({
        name: file.name,
        type: file.type,
        data: base64,
      }));
      router.push("/upload");
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="hero-bg px-4 py-20">
      {/* Background decorative shapes */}
      <div className="hero-shape hero-shape-1" />
      <div className="hero-shape hero-shape-2" />

      <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
          <Shield className="h-4 w-4" />
          {t.home.badge}
        </div>

        {/* Heading */}
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
          {t.home.headingLine1}
          <br />
          <span className="text-emerald-600">{t.home.headingLine2}</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
          {t.home.subtitle}
        </p>

        {/* Upload CTA Card */}
        <div className="mx-auto max-w-md">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES}
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={handleCardClick}
            className="upload-card block w-full cursor-pointer rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white/80 p-8 backdrop-blur-sm transition-colors hover:border-emerald-400 md:p-12"
          >
            <div className="flex flex-col items-center">
              {/* Pulsing upload icon */}
              <div className="pulse-soft mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                <Upload className="h-10 w-10 text-emerald-500" />
              </div>

              <h3 className="mb-2 text-xl font-semibold text-slate-800">
                {t.home.uploadTitle}
              </h3>
              <p className="mb-6 text-sm text-slate-500">
                {t.home.uploadHint}
              </p>

              <span className="inline-block rounded-full bg-emerald-600 px-8 py-3 font-semibold text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-700">
                {t.home.getStarted}
              </span>
            </div>
          </button>
        </div>

        {/* Trust Markers */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {t.home.trustSecure}
          </div>
          <div className="flex items-center gap-2">
            <CircleCheckBig className="h-5 w-5" />
            {t.home.trustInstant}
          </div>
          <div className="flex items-center gap-2">
            <MessageCircleHeart className="h-5 w-5" />
            {t.home.trustPatient}
          </div>
        </div>
      </div>
    </section>
  );
}
