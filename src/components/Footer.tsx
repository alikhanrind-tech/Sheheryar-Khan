import { QrCode, ArrowUp } from 'lucide-react';

interface FooterProps {
  onScrollToGenerator: () => void;
}

export function Footer({ onScrollToGenerator }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = 2026;

  return (
    <footer className="bg-[#020B08] border-t border-white/[0.08] pt-16 pb-12 text-[#9BAEA5]" id="footer">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/[0.06]">
          {/* Brand info (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#073B2A] border border-[#20D47A]/30 flex items-center justify-center text-[#20D47A]">
                <QrCode className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                QRForge
              </span>
            </div>
            <p className="text-sm text-[#9BAEA5] max-w-sm leading-relaxed">
              Fast, simple QR code generation for modern digital experiences. Built with pure client-side technology for maximum privacy, speed, and reliability.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-[#20D47A] bg-[#20D47A]/10 px-2.5 py-1 rounded-full border border-[#20D47A]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#20D47A]" />
                Static Direct Payloads
              </span>
            </div>
          </div>

          {/* Column 1: Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={onScrollToGenerator}
                  className="hover:text-white transition-colors"
                >
                  QR Generator
                </button>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#use-cases" className="hover:text-white transition-colors">
                  Use Cases
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-white transition-colors">
                  Privacy Architecture
                </a>
              </li>
              <li>
                <span className="text-white/40 cursor-not-allowed">
                  Vector SVG Guide
                </span>
              </li>
              <li>
                <span className="text-white/40 cursor-not-allowed">
                  vCard 3.0 Specs
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Assurance
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-[#54F5A0]">100% Free Forever</span>
              </li>
              <li>
                <span className="text-[#9BAEA5]">No Tracking Cookies</span>
              </li>
              <li>
                <span className="text-[#9BAEA5]">No Link Expirations</span>
              </li>
              <li>
                <span className="text-[#9BAEA5]">ISO/IEC 18004 Compliant</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {currentYear} QRForge. All rights reserved. Zero telemetry recorded.</p>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-xs text-[#9BAEA5] hover:text-[#20D47A] transition-colors py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10"
            id="back-to-top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
