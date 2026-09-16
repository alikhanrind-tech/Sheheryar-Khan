import { useState } from 'react';
import { QRConfig, ErrorCorrectionLevel, QRSizePreset } from '../../types';
import { Sliders, ChevronDown, ChevronUp, Palette, Layers, Maximize } from 'lucide-react';

interface CustomizationPanelProps {
  config: QRConfig;
  onChange: (updated: Partial<QRConfig>) => void;
}

const FG_PRESETS = [
  { name: 'Pitch Black', value: '#000000' },
  { name: 'Deep Emerald', value: '#073B2A' },
  { name: 'Verdant Green', value: '#105B38' },
  { name: 'Navy Midnight', value: '#0A192F' },
  { name: 'Dark Slate', value: '#1E293B' },
  { name: 'Burgundy', value: '#4A0E17' },
];

const BG_PRESETS = [
  { name: 'Crisp White', value: '#FFFFFF' },
  { name: 'Soft Cream', value: '#FAF9F6' },
  { name: 'Mint Ice', value: '#F0F9F5' },
  { name: 'Ice Gray', value: '#F1F5F9' },
];

export function CustomizationPanel({ config, onChange }: CustomizationPanelProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="space-y-4 pt-2 border-t border-black/5" id="customization-panel">
      {/* Primary styling row: Size & Error Correction */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Size Presets */}
        <div>
          <label htmlFor="select-qr-size" className="flex items-center gap-1.5 text-xs font-semibold text-[#101513] mb-1.5">
            <Maximize className="w-3.5 h-3.5 text-[#20D47A]" />
            Export Resolution
          </label>
          <select
            id="select-qr-size"
            value={config.size}
            onChange={(e) => onChange({ size: e.target.value as QRSizePreset })}
            className="w-full px-3 py-2 rounded-xl bg-[#F7FAF8] border border-[#D5E0DB] text-[#101513] text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#20D47A] cursor-pointer"
          >
            <option value="small">Small (320 × 320 px) — Quick Web</option>
            <option value="medium">Medium (512 × 512 px) — Standard</option>
            <option value="large">Large (800 × 800 px) — High Res</option>
            <option value="xlarge">Extra Large (1200 × 1200 px) — Print</option>
          </select>
        </div>

        {/* Error Correction */}
        <div>
          <label htmlFor="select-qr-ec" className="flex items-center gap-1.5 text-xs font-semibold text-[#101513] mb-1.5">
            <Layers className="w-3.5 h-3.5 text-[#20D47A]" />
            Error Correction
          </label>
          <select
            id="select-qr-ec"
            value={config.errorCorrectionLevel}
            onChange={(e) => onChange({ errorCorrectionLevel: e.target.value as ErrorCorrectionLevel })}
            className="w-full px-3 py-2 rounded-xl bg-[#F7FAF8] border border-[#D5E0DB] text-[#101513] text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#20D47A] cursor-pointer"
          >
            <option value="L">Low (7% recovery) — Denser data</option>
            <option value="M">Medium (15% recovery) — Balanced</option>
            <option value="Q">Quartile (25% recovery) — High durability</option>
            <option value="H">High (30% recovery) — Best for print & logos</option>
          </select>
        </div>
      </div>

      {/* Colors Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Foreground Color */}
        <div>
          <label className="flex items-center justify-between text-xs font-semibold text-[#101513] mb-1.5">
            <span className="flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#20D47A]" />
              Foreground Color
            </span>
            <span className="font-mono text-[11px] text-[#7D9187] uppercase">{config.fgColor}</span>
          </label>
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-[#D5E0DB] shadow-xs shrink-0 cursor-pointer">
              <input
                type="color"
                value={config.fgColor}
                onChange={(e) => onChange({ fgColor: e.target.value })}
                className="absolute -top-3 -left-3 w-16 h-16 cursor-pointer border-0"
                aria-label="Choose QR foreground color"
              />
            </div>
            <input
              type="text"
              value={config.fgColor}
              onChange={(e) => onChange({ fgColor: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#F7FAF8] border border-[#D5E0DB] text-[#101513] font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#20D47A]"
            />
          </div>
          {/* Quick Swatches */}
          <div className="flex items-center gap-1.5 mt-2">
            {FG_PRESETS.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => onChange({ fgColor: color.value })}
                title={color.name}
                className="w-5 h-5 rounded-full border border-black/10 transition-transform hover:scale-115 focus:outline-none"
                style={{ backgroundColor: color.value }}
              />
            ))}
          </div>
        </div>

        {/* Background Color */}
        <div>
          <label className="flex items-center justify-between text-xs font-semibold text-[#101513] mb-1.5">
            <span className="flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#20D47A]" />
              Background Color
            </span>
            <span className="font-mono text-[11px] text-[#7D9187] uppercase">
              {config.transparentBg ? 'TRANSPARENT' : config.bgColor}
            </span>
          </label>
          <div className="flex items-center gap-2">
            <div
              className={`relative w-10 h-10 rounded-xl overflow-hidden border border-[#D5E0DB] shadow-xs shrink-0 cursor-pointer ${
                config.transparentBg ? 'bg-[linear-gradient(45deg,#ccc_25%,transparent_25%),linear-gradient(-45deg,#ccc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ccc_75%),linear-gradient(-45deg,transparent_75%,#ccc_75%)] bg-[size:10px_10px] bg-[position:0_0,0_5px,5px_-5px,-5px_0]' : ''
              }`}
            >
              <input
                type="color"
                disabled={config.transparentBg}
                value={config.bgColor}
                onChange={(e) => onChange({ bgColor: e.target.value })}
                className="absolute -top-3 -left-3 w-16 h-16 cursor-pointer border-0 disabled:opacity-30"
                aria-label="Choose QR background color"
              />
            </div>
            <input
              type="text"
              disabled={config.transparentBg}
              value={config.transparentBg ? 'Transparent' : config.bgColor}
              onChange={(e) => onChange({ bgColor: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#F7FAF8] border border-[#D5E0DB] text-[#101513] font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#20D47A] disabled:opacity-50"
            />
          </div>
          {/* Transparent Toggle & BG presets */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1.5">
              {BG_PRESETS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  disabled={config.transparentBg}
                  onClick={() => onChange({ bgColor: color.value })}
                  title={color.name}
                  className="w-5 h-5 rounded-full border border-black/15 transition-transform hover:scale-115 focus:outline-none disabled:opacity-30"
                  style={{ backgroundColor: color.value }}
                />
              ))}
            </div>
            <label className="flex items-center gap-1.5 text-xs text-[#50635B] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={config.transparentBg}
                onChange={(e) => onChange({ transparentBg: e.target.checked })}
                className="rounded text-[#20D47A] focus:ring-[#20D47A] h-3.5 w-3.5"
              />
              <span>Transparent</span>
            </label>
          </div>
        </div>
      </div>

      {/* Advanced Toggle */}
      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full py-2 text-xs font-semibold text-[#50635B] hover:text-[#073B2A] transition-colors group"
        >
          <span className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-[#20D47A]" />
            Advanced Parameters (Quiet Zone Margin & Logo Center)
          </span>
          {showAdvanced ? (
            <ChevronUp className="w-4 h-4 text-[#7D9187] group-hover:text-[#073B2A]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#7D9187] group-hover:text-[#073B2A]" />
          )}
        </button>

        {showAdvanced && (
          <div className="p-3.5 bg-[#F7FAF8] rounded-xl border border-[#D5E0DB] mt-2 space-y-3 animate-in fade-in duration-200">
            {/* Margin / Quiet Zone */}
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-[#101513] mb-1">
                <span>Quiet Zone Margin</span>
                <span className="font-semibold text-[#073B2A]">{config.margin} modules</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[0, 1, 2, 4].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => onChange({ margin: m })}
                    className={`py-1.5 text-xs rounded-lg font-medium border transition-colors ${
                      config.margin === m
                        ? 'bg-white border-[#20D47A] text-[#073B2A] shadow-xs'
                        : 'bg-white/60 border-black/5 text-[#50635B] hover:bg-white'
                    }`}
                  >
                    {m === 0 ? 'None (0)' : `${m}x`}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Center Badge Overlay */}
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-[#101513] mb-1">
                <span>Center Brand Emblem</span>
                <span className="text-[11px] text-[#7D9187]">Auto-enforces High error correction</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'none', label: 'None' },
                  { id: 'sparkle', label: '✨ Spark' },
                  { id: 'link', label: '🔗 Link' },
                  { id: 'wifi', label: '📶 Wi-Fi' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onChange({
                        centerLogo: item.id,
                        errorCorrectionLevel: item.id !== 'none' ? 'H' : config.errorCorrectionLevel,
                      });
                    }}
                    className={`py-1.5 text-xs rounded-lg font-medium border transition-colors ${
                      config.centerLogo === item.id
                        ? 'bg-white border-[#20D47A] text-[#073B2A] shadow-xs'
                        : 'bg-white/60 border-black/5 text-[#50635B] hover:bg-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
