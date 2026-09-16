import { Sparkles, Store, Calendar, Megaphone, Laptop, Code2 } from 'lucide-react';

export function TrustCategories() {
  const categories = [
    { label: 'Creators & Artists', icon: Sparkles },
    { label: 'Small Businesses & Cafés', icon: Store },
    { label: 'Event Coordinators', icon: Calendar },
    { label: 'Marketing Teams', icon: Megaphone },
    { label: 'Independent Freelancers', icon: Laptop },
    { label: 'Software Developers', icon: Code2 },
  ];

  return (
    <section className="py-16 border-b border-white/[0.06] relative" id="trust-categories">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-bold text-[#9BAEA5] uppercase tracking-widest mb-6">
          Built for everyday sharing across industries
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#061812]/80 border border-white/[0.08] hover:border-[#20D47A]/40 text-[#E7F1EC] text-xs sm:text-sm font-medium transition-all duration-150 hover:bg-[#073B2A]/30"
              >
                <Icon className="w-4 h-4 text-[#20D47A]" />
                <span>{cat.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
