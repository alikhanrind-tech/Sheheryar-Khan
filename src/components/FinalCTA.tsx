import { ArrowUp, Sparkles, QrCode } from 'lucide-react';

interface FinalCTAProps {
  onScrollToGenerator: () => void;
}

export function FinalCTA({ onScrollToGenerator }: FinalCTAProps) {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden" id="final-cta">
      {/* Dramatic Emerald Ambient Glow */}
      <div className="absolute inset-0 bg-radial-bottom-glow pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#20D47A]/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Decorative floating QR modules in the background */}
      <div className="absolute top-10 left-[10%] opacity-15 pointer-events-none hidden sm:block">
        <QrCode className="w-20 h-20 text-[#20D47A]" />
      </div>
      <div className="absolute bottom-10 right-[10%] opacity-15 pointer-events-none hidden sm:block">
        <QrCode className="w-24 h-24 text-[#54F5A0]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#073B2A]/60 border border-[#20D47A]/30 text-[#54F5A0] text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#20D47A]" />
          Instant • Free • Zero Hassle
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Ready to create your{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#20D47A] to-[#54F5A0] drop-shadow-[0_0_30px_rgba(32,212,122,0.3)]">
            QR code?
          </span>
        </h2>

        <p className="mt-5 text-base sm:text-xl text-[#9BAEA5] max-w-xl mx-auto leading-relaxed">
          Generate a clean, customizable QR code in just a few seconds. No account needed.
        </p>

        <div className="mt-8 flex items-center justify-center">
          <button
            type="button"
            onClick={onScrollToGenerator}
            id="final-cta-btn"
            className="inline-flex items-center justify-center gap-2 bg-[#20D47A] hover:bg-[#54F5A0] text-[#020B08] font-bold text-base sm:text-lg px-8 py-4 rounded-xl transition-all duration-200 transform hover:-translate-y-1 shadow-2xl shadow-[#20D47A]/30 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#54F5A0]"
          >
            <span>Create QR Code Now</span>
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
