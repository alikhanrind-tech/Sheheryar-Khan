export function UseCasesSection() {
  const cases = [
    {
      title: 'Restaurant Menus & Order',
      desc: 'Touchless digital menus, wine lists, and instant table checkout without physical paper.',
      accent: 'emerald',
      svgVisual: (
        <svg viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-24">
          <rect x="25" y="10" width="110" height="80" rx="8" fill="#061812" stroke="#20D47A" strokeOpacity="0.4" strokeWidth="1.5" />
          <rect x="40" y="22" width="50" height="6" rx="3" fill="#20D47A" fillOpacity="0.8" />
          <rect x="40" y="36" width="70" height="4" rx="2" fill="#E7F1EC" fillOpacity="0.4" />
          <rect x="40" y="46" width="60" height="4" rx="2" fill="#E7F1EC" fillOpacity="0.4" />
          <rect x="40" y="56" width="45" height="4" rx="2" fill="#E7F1EC" fillOpacity="0.4" />
          <rect x="100" y="20" width="22" height="22" rx="4" fill="#073B2A" stroke="#20D47A" strokeWidth="1" />
          <rect x="104" y="24" width="6" height="6" fill="#54F5A0" />
          <rect x="112" y="32" width="6" height="6" fill="#54F5A0" />
        </svg>
      ),
    },
    {
      title: 'Business Websites & Portfolios',
      desc: 'Bridge physical business cards, posters, and print media directly to client portfolios.',
      accent: 'emerald',
      svgVisual: (
        <svg viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-24">
          <rect x="20" y="15" width="120" height="70" rx="8" fill="#061812" stroke="#20D47A" strokeOpacity="0.4" strokeWidth="1.5" />
          <circle cx="32" cy="25" r="2.5" fill="#20D47A" />
          <circle cx="40" cy="25" r="2.5" fill="#E7F1EC" fillOpacity="0.5" />
          <circle cx="48" cy="25" r="2.5" fill="#E7F1EC" fillOpacity="0.3" />
          <line x1="20" y1="33" x2="140" y2="33" stroke="#20D47A" strokeOpacity="0.2" />
          <rect x="30" y="44" width="40" height="28" rx="4" fill="#073B2A" stroke="#20D47A" strokeWidth="1" />
          <rect x="80" y="46" width="45" height="6" rx="3" fill="#E7F1EC" fillOpacity="0.7" />
          <rect x="80" y="58" width="35" height="4" rx="2" fill="#9BAEA5" fillOpacity="0.5" />
        </svg>
      ),
    },
    {
      title: 'Event Tickets & Badges',
      desc: 'Instant conference check-in, VIP passes, map coordinates, and real-time schedules.',
      accent: 'emerald',
      svgVisual: (
        <svg viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-24">
          <path d="M20 20C20 15 25 10 30 10H130C135 10 140 15 140 20V40C135 40 130 45 130 50C130 55 135 60 140 60V80C140 85 135 90 130 90H30C25 90 20 85 20 80V60C25 60 30 55 30 50C30 45 25 40 20 40V20Z" fill="#061812" stroke="#20D47A" strokeOpacity="0.4" strokeWidth="1.5" />
          <line x1="105" y1="14" x2="105" y2="86" stroke="#20D47A" strokeOpacity="0.3" strokeDasharray="3 3" />
          <rect x="36" y="28" width="50" height="6" rx="3" fill="#20D47A" />
          <rect x="36" y="42" width="40" height="4" rx="2" fill="#E7F1EC" fillOpacity="0.5" />
          <rect x="36" y="52" width="30" height="4" rx="2" fill="#E7F1EC" fillOpacity="0.4" />
          <rect x="114" y="38" width="18" height="18" rx="3" fill="#073B2A" stroke="#20D47A" strokeWidth="1" />
        </svg>
      ),
    },
    {
      title: 'Product Packaging & User Guides',
      desc: 'Link buyers to warranty registration, ingredients transparency, and video manuals.',
      accent: 'emerald',
      svgVisual: (
        <svg viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-24">
          <path d="M80 15L125 35V75L80 90L35 75V35L80 15Z" fill="#061812" stroke="#20D47A" strokeOpacity="0.4" strokeWidth="1.5" />
          <path d="M80 15V90" stroke="#20D47A" strokeOpacity="0.3" />
          <path d="M35 35L80 52L125 35" stroke="#20D47A" strokeOpacity="0.3" />
          <rect x="92" y="50" width="18" height="18" rx="2" fill="#073B2A" stroke="#20D47A" strokeWidth="1" />
        </svg>
      ),
    },
    {
      title: 'Guest Wi-Fi Setup',
      desc: 'Let customers or office guests connect to high-speed encrypted Wi-Fi with a single point-and-scan.',
      accent: 'emerald',
      svgVisual: (
        <svg viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-24">
          <rect x="30" y="15" width="100" height="70" rx="10" fill="#061812" stroke="#20D47A" strokeOpacity="0.4" strokeWidth="1.5" />
          <path d="M60 45C72 35 88 35 100 45" stroke="#20D47A" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M68 53C76 47 84 47 92 53" stroke="#54F5A0" strokeWidth="2" strokeLinecap="round" />
          <circle cx="80" cy="62" r="3.5" fill="#20D47A" />
        </svg>
      ),
    },
    {
      title: 'Marketing & Outdoor Billboards',
      desc: 'Vector-sharp QR codes engineered for distant scans on banners, trade show booths, and bus stops.',
      accent: 'emerald',
      svgVisual: (
        <svg viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-24">
          <rect x="25" y="12" width="110" height="60" rx="6" fill="#061812" stroke="#20D47A" strokeOpacity="0.4" strokeWidth="1.5" />
          <line x1="50" y1="72" x2="40" y2="92" stroke="#20D47A" strokeWidth="2" strokeLinecap="round" />
          <line x1="110" y1="72" x2="120" y2="92" stroke="#20D47A" strokeWidth="2" strokeLinecap="round" />
          <rect x="38" y="24" width="40" height="8" rx="2" fill="#20D47A" />
          <rect x="38" y="38" width="55" height="4" rx="2" fill="#E7F1EC" fillOpacity="0.5" />
          <rect x="102" y="22" width="22" height="22" rx="3" fill="#073B2A" stroke="#20D47A" strokeWidth="1" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden" id="use-cases">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#073B2A]/40 border border-[#20D47A]/20 text-[#54F5A0] text-xs font-semibold uppercase tracking-wider mb-4">
            Versatile Applications
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Built for any scenario,{' '}
            <span className="text-[#20D47A]">any medium</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#9BAEA5] leading-relaxed">
            From sleek digital touchpoints to high-volume commercial print runs, QRForge delivers clean, resilient matrix codes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((c, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#061812]/70 border border-white/[0.08] hover:border-[#20D47A]/40 transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-black/30 flex flex-col justify-between group"
            >
              <div className="mb-4 bg-[#020B08]/60 rounded-xl p-2 border border-white/[0.04] group-hover:border-[#20D47A]/20 transition-colors">
                {c.svgVisual}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#54F5A0] transition-colors">
                  {c.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#9BAEA5] leading-relaxed">
                  {c.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
