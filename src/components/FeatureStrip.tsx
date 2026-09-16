import { Zap, Palette, Download, Shield } from 'lucide-react';

export function FeatureStrip() {
  const items = [
    {
      icon: Zap,
      title: 'Instant',
      desc: 'Generate in milliseconds directly in browser.',
    },
    {
      icon: Palette,
      title: 'Customizable',
      desc: 'Control resolution, error recovery, & colors.',
    },
    {
      icon: Download,
      title: 'Download Ready',
      desc: 'Export crisp PNG and lossless vector SVG.',
    },
    {
      icon: Shield,
      title: '100% Private',
      desc: 'Zero tracking or external server redirects.',
    },
  ];

  return (
    <section className="py-12 border-y border-white/[0.06] bg-[#061812]/50 relative" id="feature-strip">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold text-[#54F5A0] uppercase tracking-widest mb-8">
          Everything you need to create better QR codes
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center sm:items-start text-center sm:text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#073B2A]/60 border border-[#20D47A]/30 flex items-center justify-center text-[#20D47A] mb-3 group-hover:scale-105 group-hover:border-[#20D47A] transition-all">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#9BAEA5] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
