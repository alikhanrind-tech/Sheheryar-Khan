import { Edit3, Sliders, ArrowDownToLine, ArrowRight } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      num: '01',
      icon: Edit3,
      title: 'Enter your content',
      desc: 'Paste a website URL, enter plain text, setup Wi-Fi network credentials, or fill out a vCard contact profile.',
    },
    {
      num: '02',
      icon: Sliders,
      title: 'Customize it',
      desc: 'Pick your export resolution, select error correction tolerance, and customize foreground/background palettes.',
    },
    {
      num: '03',
      icon: ArrowDownToLine,
      title: 'Download & share',
      desc: 'Save your generated QR code as high-resolution PNG or vector SVG ready for print, social, or digital screens.',
    },
  ];

  return (
    <section className="py-24 bg-[#061812]/30 border-t border-white/[0.06] relative" id="how-it-works">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#073B2A]/40 border border-[#20D47A]/20 text-[#54F5A0] text-xs font-semibold uppercase tracking-wider mb-4">
            Effortless Workflow
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Create your QR code in{' '}
            <span className="text-[#20D47A]">three simple steps</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#9BAEA5] leading-relaxed">
            No signup, no subscription, and no hidden redirects. Just fast and dependable generation.
          </p>
        </div>

        {/* Timeline Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Desktop Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 -translate-y-8 bg-gradient-to-r from-[#20D47A]/10 via-[#20D47A]/40 to-[#20D47A]/10 z-0" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left p-6 sm:p-8 rounded-2xl bg-[#061812]/80 border border-white/[0.08] hover:border-[#20D47A]/30 transition-all duration-200 group"
              >
                {/* Step pill & icon */}
                <div className="flex items-center justify-between w-full mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#073B2A] border border-[#20D47A]/30 flex items-center justify-center text-[#20D47A] group-hover:scale-105 group-hover:border-[#20D47A] transition-all shadow-md">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-2xl font-black text-white/20 group-hover:text-[#20D47A]/60 transition-colors">
                    {step.num}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#54F5A0] transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-[#9BAEA5] leading-relaxed">
                  {step.desc}
                </p>

                {idx < 2 && (
                  <div className="md:hidden mt-4 text-[#20D47A]/50">
                    <ArrowRight className="w-5 h-5 mx-auto rotate-90" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
