import { RecentQRItem } from '../../types';
import { History, Trash2, ArrowUpRight, Globe, FileText, Mail, Phone, Wifi, Contact, Cloud } from 'lucide-react';

interface RecentGenerationsProps {
  items: RecentQRItem[];
  onSelect: (item: RecentQRItem) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  isCloudSynced?: boolean;
}

export function RecentGenerations({ items, onSelect, onDelete, onClear, isCloudSynced = true }: RecentGenerationsProps) {
  if (items.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'url': return <Globe className="w-3.5 h-3.5 text-[#20D47A]" />;
      case 'text': return <FileText className="w-3.5 h-3.5 text-[#20D47A]" />;
      case 'email': return <Mail className="w-3.5 h-3.5 text-[#20D47A]" />;
      case 'phone': return <Phone className="w-3.5 h-3.5 text-[#20D47A]" />;
      case 'wifi': return <Wifi className="w-3.5 h-3.5 text-[#20D47A]" />;
      case 'vcard': return <Contact className="w-3.5 h-3.5 text-[#20D47A]" />;
      default: return <History className="w-3.5 h-3.5 text-[#20D47A]" />;
    }
  };

  const formatTime = (ts: number) => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(ts).toLocaleDateString();
  };

  return (
    <div className="w-full pt-6 mt-6 border-t border-black/10" id="recent-generations-container">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#073B2A]" />
          <h4 className="text-xs font-bold text-[#101513] uppercase tracking-wider">
            Recent Generations ({items.length})
          </h4>
          {isCloudSynced && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#105B38] bg-[#20D47A]/15 px-2 py-0.5 rounded-full border border-[#20D47A]/30">
              <Cloud className="w-2.5 h-2.5 text-[#20D47A]" />
              Cloud Synced
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-[#7D9187] hover:text-rose-600 transition-colors flex items-center gap-1 font-medium"
          id="btn-clear-recent"
        >
          <Trash2 className="w-3 h-3" />
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7FAF8] hover:bg-[#EDF3F0] border border-black/5 transition-all group"
          >
            <button
              type="button"
              onClick={() => onSelect(item)}
              className="flex items-center gap-3 text-left flex-1 min-w-0"
              title="Click to reload this QR code"
            >
              <div className="w-10 h-10 rounded-lg bg-white p-1 border border-black/5 shrink-0 overflow-hidden shadow-2xs">
                <img
                  src={item.dataUrl}
                  alt={item.title}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#101513] truncate">
                  {getIcon(item.contentType)}
                  <span className="truncate">{item.title}</span>
                </div>
                <div className="text-[10px] text-[#7D9187] flex items-center gap-1.5 mt-0.5">
                  <span className="uppercase">{item.contentType}</span>
                  <span>•</span>
                  <span>{formatTime(item.timestamp)}</span>
                </div>
              </div>
            </button>

            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => onSelect(item)}
                className="p-1 text-[#7D9187] hover:text-[#073B2A] transition-colors"
                title="Load into editor"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(item.id)}
                className="p-1 text-[#7D9187] hover:text-rose-500 transition-colors"
                title="Remove from history"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
