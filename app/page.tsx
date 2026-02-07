import Link from "next/link";
import { Shield, Upload, Lock, CircleCheckBig, MessageCircleHeart } from "lucide-react";

export default function Home() {
  return (
    <section className="hero-bg px-4 py-20">
      {/* Background decorative shapes */}
      <div className="hero-shape hero-shape-1" />
      <div className="hero-shape hero-shape-2" />

      <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
          <Shield className="h-4 w-4" />
          AI-Powered Skin Care Support
        </div>

        {/* Heading */}
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
          Clearer skin starts with
          <br />
          <span className="text-emerald-600">understanding.</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
          Take a clear photo of your skin concern for a detailed analysis and
          supportive report. We&rsquo;re here to help you manage your journey
          with confidence.
        </p>

        {/* Upload CTA Card */}
        <div className="mx-auto max-w-md">
          <Link
            href="/report/demo"
            className="upload-card block cursor-pointer rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white/80 p-8 backdrop-blur-sm transition-colors hover:border-emerald-400 md:p-12"
          >
            <div className="flex flex-col items-center">
              {/* Pulsing upload icon */}
              <div className="pulse-soft mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                <Upload className="h-10 w-10 text-emerald-500" />
              </div>

              <h3 className="mb-2 text-xl font-semibold text-slate-800">
                Upload a Photo
              </h3>
              <p className="mb-6 text-sm text-slate-500">
                JPEG, PNG or HEIC files up to 10MB
              </p>

              <span className="inline-block rounded-full bg-emerald-600 px-8 py-3 font-semibold text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-700">
                Get Started
              </span>
            </div>
          </Link>
        </div>

        {/* Trust Markers */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Secure &amp; Private
          </div>
          <div className="flex items-center gap-2">
            <CircleCheckBig className="h-5 w-5" />
            Instant Results
          </div>
          <div className="flex items-center gap-2">
            <MessageCircleHeart className="h-5 w-5" />
            Patient-First Design
          </div>
        </div>
      </div>
    </section>
  );
}
