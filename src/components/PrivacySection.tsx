import { ShieldCheck, Lock, EyeOff, ServerOff } from 'lucide-react';

export function PrivacySection() {
  const points = [
    {
      icon: ServerOff,
      title: 'Zero Intermediary Redirects',
      desc: 'Many services force your links through proprietary redirect servers that track users and can break or expire later. QRForge encodes your direct raw destination.',
    },
    {
      icon: Lock,
      title: 'In-Browser Local Processing',
      desc: 'All raster canvas computation happens in your web browser. Confidential Wi-Fi passwords and personal phone numbers are never stored in a central database.',
    },
    {
      icon: EyeOff,
      title: 'No Tracking & No Ads',
      desc: 'No telemetry cookies, no tracking pixels, and no commercial data-broker profiling. Just clean, static mathematical matrix barcodes.',
    },
    {
      icon: ShieldCheck,
      title: 'Forever Functional',
      desc: 'Because these are authentic direct-payload static QR codes, they will continue scanning and functioning indefinitely without any renewal fees.',
    },
  ];

  return (
    <section className="py-24 bg-[#061812]/40 border-y border-white/[0.06] relative overflow-hidden" id="privacy">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 right-1/4 w-[450px] h-[450px] bg-[#20D47A]/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copy & Bullet Points */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#073B2A]/50 border border-[#20D47A]/30 text-[#54F5A0] text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-[#20D47A]" />
              Privacy & Longevity By Architecture
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Your content{' '}
              <span className="text-[#20D47A]">stays yours.</span>
            </h2>

            <p className="text-base sm:text-lg text-[#9BAEA5] leading-relaxed">
              We believe a QR code generator should be a dependable utility, not a tracking trap. Unlike traditional QR generators that monetize by holding your URLs hostage behind paywalls or expiry limits, QRForge generates pure, self-contained standard QR matrices.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3">
              {points.map((pt, idx) => {
                const Icon = pt.icon;
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                      <Icon className="w-4 h-4 text-[#20D47A] shrink-0" />
                      <span>{pt.title}</span>
                    </div>
                    <p className="text-xs text-[#9BAEA5] leading-relaxed">
                      {pt.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Abstract Futuristic Security Shield Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[380px] p-8 rounded-3xl bg-[#061812] border border-[#20D47A]/30 shadow-2xl shadow-black/80 text-center relative overflow-hidden group">
              {/* Radial inner glow */}
              <div className="absolute inset-0 bg-radial-emerald pointer-events-none" />

              {/* Glowing Shield & QR Illustration */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#073B2A] to-[#020B08] border-2 border-[#20D47A]/50 flex items-center justify-center text-[#20D47A] shadow-xl shadow-[#20D47A]/20 mb-6 group-hover:scale-105 transition-transform duration-300">
                  <ShieldCheck className="w-12 h-12 text-[#20D47A]" />
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 w-full mb-4 backdrop-blur-xs">
                  <div className="flex items-center justify-between text-xs text-[#9BAEA5] mb-2 font-mono">
                    <span>SECURITY_LAYER</span>
                    <span className="text-[#20D47A] font-semibold">ACTIVE</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#073B2A] via-[#20D47A] to-[#54F5A0] w-full" />
                  </div>
                  <div className="mt-2 text-[11px] text-[#E7F1EC]/70 text-left">
                    Client sandbox isolation active • 0 external requests on generate
                  </div>
                </div>

                <div className="text-xs text-[#9BAEA5]">
                  Encodes standard ISO/IEC 18004 2D symbol specifications natively.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
