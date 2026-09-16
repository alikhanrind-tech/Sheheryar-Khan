import { ContentType } from '../../types';
import { Globe, FileText, Mail, Phone, Wifi, Contact, LucideIcon } from 'lucide-react';

interface ContentTypeTabsProps {
  activeType: ContentType;
  onChange: (type: ContentType) => void;
}

const TABS: { id: ContentType; label: string; icon: LucideIcon }[] = [
  { id: 'url', label: 'Website URL', icon: Globe },
  { id: 'text', label: 'Plain Text', icon: FileText },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'phone', label: 'Phone', icon: Phone },
  { id: 'wifi', label: 'Wi-Fi Network', icon: Wifi },
  { id: 'vcard', label: 'Contact (vCard)', icon: Contact },
];

export function ContentTypeTabs({ activeType, onChange }: ContentTypeTabsProps) {
  return (
    <div className="w-full" id="content-type-tabs">
      <label className="block text-xs font-semibold text-[#101513]/70 uppercase tracking-wider mb-2">
        Select Content Type
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 p-1 bg-[#F0F5F2] rounded-xl border border-black/5">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeType === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              id={`tab-btn-${tab.id}`}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-white text-[#073B2A] shadow-sm border border-black/5 ring-1 ring-[#20D47A]/30'
                  : 'text-[#50635B] hover:text-[#101513] hover:bg-white/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#20D47A]' : 'text-[#7D9187]'}`} />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
