import { ArrowDown, CheckCircle2, ShieldCheck, Zap, Download, Camera } from 'lucide-react';

interface HeroProps {
  onScrollToGenerator: () => void;
  onScrollToScanner: () => void;
  onScrollToFeatures: () => void;
}

export function Hero({ onScrollToGenerator, onScrollToScanner, onScrollToFeatures }: HeroProps) {
  return (
    <section className="relative pt-32 pb-14 md:pt-40 md:pb-20 overflow-hidden" id="hero-section">
      {/* Radial Emerald Glow & Ambient Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] md:w-[900px] h-[450px] md:h-[550px] bg-[#20D47A]/12 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-10 left-1/4 w-[350px] h-[350px] bg-[#073B2A]/40 rounded-full blur-[90px] pointer-events-none -z-10 animate-float-slow" />
      <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-[#20D47A]/8 rounded-full blur-[100px] pointer-events-none -z-10 animate-float-reverse" />

      {/* Bokeh / Floating Ambient Particles */}
      <div className="absolute top-24 left-[15%] w-3 h-3 rounded-full bg-[#54F5A0]/30 blur-xs animate-pulse-subtle pointer-events-none" />
      <div className="absolute top-48 right-[18%] w-4 h-4 rounded-full bg-[#20D47A]/25 blur-xs animate-float-slow pointer-events-none" />
      <div className="absolute top-72 left-[28%] w-2 h-2 rounded-full bg-[#54F5A0]/40 blur-xs pointer-events-none" />
      <div className="absolute top-96 right-[30%] w-3 h-3 rounded-full bg-[#20D47A]/30 blur-xs animate-float-reverse pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Subtle pill badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#061812] border border-[#20D47A]/25 text-[#54F5A0] text-xs font-medium mb-6 shadow-sm shadow-[#20D47A]/10">
          <span className="w-2 h-2 rounded-full bg-[#20D47A] animate-ping" />
          <span>Modern Client-Side Vector Engine</span>
          <span className="text-white/40">•</span>
          <span className="text-white/70">No Tracking</span>
        </div>

        {/* Luminous Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] max-w-4xl mx-auto">
          Create QR Codes in{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#20D47A] via-[#54F5A0] to-[#E7F1EC] drop-shadow-[0_0_35px_rgba(32,212,122,0.35)]">
            Seconds.
          </span>
        </h1>

        {/* Supporting description */}
        <p className="mt-6 text-lg sm:text-xl text-[#9BAEA5] max-w-2xl mx-auto font-normal leading-relaxed">
          Generate clean, customizable QR codes for links, text, Wi-Fi, and contacts — instantly and without complicated setup.
        </p>

        {/* Trust Badges Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs sm:text-sm font-medium text-[#E7F1EC]/80">
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#20D47A]" />
            Free to use
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#20D47A]" />
            Instant generation
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Download className="w-4 h-4 text-[#20D47A]" />
            Download as PNG & SVG
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#20D47A]" />
            No signup required
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={onScrollToGenerator}
            id="hero-generate-cta"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#20D47A] hover:bg-[#54F5A0] text-[#020B08] font-bold text-base px-8 py-3.5 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 shadow-xl shadow-[#20D47A]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#54F5A0]"
          >
            Generate QR Code
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </button>
          <button
            onClick={onScrollToScanner}
            id="hero-scan-cta"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#061812]/90 hover:bg-[#073B2A]/70 text-[#E7F1EC] font-semibold text-base px-6 py-3.5 rounded-xl border border-[#20D47A]/30 hover:border-[#20D47A] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20D47A]"
          >
            <Camera className="w-4 h-4 text-[#20D47A]" />
            Scan & Read QR
          </button>
          <button
            onClick={onScrollToFeatures}
            id="hero-explore-cta"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/[0.04] text-[#9BAEA5] hover:text-white font-medium text-base px-5 py-3.5 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
          >
            Explore Features
          </button>
        </div>
      </div>
    </section>
  );
}
