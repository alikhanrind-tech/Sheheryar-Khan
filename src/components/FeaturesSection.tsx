import { Zap, Palette, Layers, Download, Smartphone, Lock } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: 'Instant Generation',
      desc: 'Type and watch your code render in real time with hardware-accelerated canvas processing.',
    },
    {
      icon: Palette,
      title: 'Custom Colors & Alpha',
      desc: 'Tailor foreground and background shades with hex precision or transparent backgrounds for print overlays.',
    },
    {
      icon: Layers,
      title: 'Multiple Content Types',
      desc: 'Encode web addresses, direct Wi-Fi credentials, phone dialers, mailto prompts, or full vCard contacts.',
    },
    {
      icon: Download,
      title: 'High-Resolution Downloads',
      desc: 'Export crisp raster PNGs up to 1200px or infinite-scale vector SVGs ready for billboards and packaging.',
    },
    {
      icon: Smartphone,
      title: 'Universal Mobile Scans',
      desc: 'Standard-compliant 2D matrix encoding readable by native iOS Camera, Android Google Lens, and all scanners.',
    },
    {
      icon: Lock,
      title: 'Zero-Tracking Privacy',
      desc: '100% client-side execution. Your URLs and confidential Wi-Fi keys never leave your local device.',
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden" id="features">
      {/* Background glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#20D47A]/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#073B2A]/40 border border-[#20D47A]/20 text-[#54F5A0] text-xs font-semibold uppercase tracking-wider mb-4">
            Engineered For Excellence
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Simple tools.{' '}
            <span className="text-[#20D47A]">Professional results.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#9BAEA5] leading-relaxed">
            Everything you need to create QR codes that look sharp, scan reliably, and work seamlessly across every modern device.
          </p>
        </div>

        {/* 6 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="group relative p-7 rounded-2xl bg-[#061812]/70 hover:bg-[#073B2A]/30 border border-white/[0.08] hover:border-[#20D47A]/40 transition-all duration-300 transform hover:-translate-y-1.5 shadow-lg shadow-black/40 hover:shadow-[#20D47A]/10"
              >
                {/* Accent corner glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#20D47A]/5 rounded-bl-full pointer-events-none group-hover:bg-[#20D47A]/15 transition-all" />

                <div className="w-12 h-12 rounded-xl bg-[#073B2A] border border-[#20D47A]/30 flex items-center justify-center text-[#20D47A] mb-5 group-hover:border-[#20D47A] group-hover:scale-110 transition-all">
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#54F5A0] transition-colors">
                  {feat.title}
                </h3>
                <p className="text-sm text-[#9BAEA5] leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
