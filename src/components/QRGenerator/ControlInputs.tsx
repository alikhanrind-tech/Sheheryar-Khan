import { useState } from 'react';
import { QRConfig } from '../../types';
import { Eye, EyeOff, Globe, Sparkles } from 'lucide-react';

interface ControlInputsProps {
  config: QRConfig;
  onChange: (updated: Partial<QRConfig>) => void;
}

export function ControlInputs({ config, onChange }: ControlInputsProps) {
  const [showWifiPassword, setShowWifiPassword] = useState(false);

  const sampleUrls = [
    'https://example.com',
    'https://instagram.com/mybrand',
    'https://drive.google.com/file',
  ];

  return (
    <div className="space-y-4" id="generator-input-fields">
      {/* 1. URL Content */}
      {config.contentType === 'url' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="input-url" className="text-sm font-semibold text-[#101513]">
              Website Address (URL)
            </label>
            <span className="text-xs text-[#7D9187]">Auto-adds https://</span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7D9187]">
              <Globe className="w-4 h-4" />
            </div>
            <input
              id="input-url"
              type="url"
              value={config.url}
              onChange={(e) => onChange({ url: e.target.value })}
              placeholder="https://yourwebsite.com or menu.link"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F7FAF8] border border-[#D5E0DB] text-[#101513] placeholder-[#8EA39A] text-sm focus:outline-none focus:ring-2 focus:ring-[#20D47A] focus:border-transparent transition-all shadow-inner"
            />
          </div>
          {/* Quick suggestions */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs text-[#50635B]">
            <span className="font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#20D47A]" /> Try:
            </span>
            {sampleUrls.map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => onChange({ url: sample })}
                className="px-2 py-0.5 rounded-md bg-[#EDF3F0] hover:bg-[#D5E5DD] text-[#073B2A] transition-colors"
              >
                {sample.replace('https://', '')}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. Plain Text */}
      {config.contentType === 'text' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="input-text" className="text-sm font-semibold text-[#101513]">
              Plain Text or Message
            </label>
            <span className="text-xs text-[#7D9187]">{config.text.length} characters</span>
          </div>
          <textarea
            id="input-text"
            rows={4}
            value={config.text}
            onChange={(e) => onChange({ text: e.target.value })}
            placeholder="Type or paste any note, discount promo code, crypto address, or message..."
            className="w-full p-3.5 rounded-xl bg-[#F7FAF8] border border-[#D5E0DB] text-[#101513] placeholder-[#8EA39A] text-sm focus:outline-none focus:ring-2 focus:ring-[#20D47A] focus:border-transparent transition-all resize-y min-h-[96px] shadow-inner"
          />
        </div>
      )}

      {/* 3. Email */}
      {config.contentType === 'email' && (
        <div className="space-y-3">
          <div>
            <label htmlFor="input-email-addr" className="block text-sm font-semibold text-[#101513] mb-1">
              Recipient Email Address
            </label>
            <input
              id="input-email-addr"
              type="email"
              value={config.email.address}
              onChange={(e) =>
                onChange({
                  email: { ...config.email, address: e.target.value },
                })
              }
              placeholder="hello@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7FAF8] border border-[#D5E0DB] text-[#101513] placeholder-[#8EA39A] text-sm focus:outline-none focus:ring-2 focus:ring-[#20D47A] focus:border-transparent transition-all shadow-inner"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="input-email-sub" className="block text-xs font-semibold text-[#50635B] mb-1">
                Default Subject (Optional)
              </label>
              <input
                id="input-email-sub"
                type="text"
                value={config.email.subject}
                onChange={(e) =>
                  onChange({
                    email: { ...config.email, subject: e.target.value },
                  })
                }
                placeholder="Inquiry from QR"
                className="w-full px-3 py-2 rounded-xl bg-[#F7FAF8] border border-[#D5E0DB] text-[#101513] placeholder-[#8EA39A] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#20D47A] shadow-inner"
              />
            </div>
            <div>
              <label htmlFor="input-email-body" className="block text-xs font-semibold text-[#50635B] mb-1">
                Pre-filled Body (Optional)
              </label>
              <input
                id="input-email-body"
                type="text"
                value={config.email.body}
                onChange={(e) =>
                  onChange({
                    email: { ...config.email, body: e.target.value },
                  })
                }
                placeholder="Hi, I would like to..."
                className="w-full px-3 py-2 rounded-xl bg-[#F7FAF8] border border-[#D5E0DB] text-[#101513] placeholder-[#8EA39A] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#20D47A] shadow-inner"
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. Phone Number */}
      {config.contentType === 'phone' && (
        <div className="space-y-2">
          <label htmlFor="input-phone" className="block text-sm font-semibold text-[#101513]">
            Phone Number to Dial
          </label>
          <input
            id="input-phone"
            type="tel"
            value={config.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
            className="w-full px-4 py-3 rounded-xl bg-[#F7FAF8] border border-[#D5E0DB] text-[#101513] placeholder-[#8EA39A] text-sm focus:outline-none focus:ring-2 focus:ring-[#20D47A] focus:border-transparent transition-all shadow-inner"
          />
          <p className="text-xs text-[#7D9187]">
            Include country code (e.g. +1 for US) so scanners anywhere can call directly.
          </p>
        </div>
      )}

      {/* 5. Wi-Fi Network */}
      {config.contentType === 'wifi' && (
        <div className="space-y-3">
          <div>
            <label htmlFor="input-wifi-ssid" className="block text-sm font-semibold text-[#101513] mb-1">
              Network Name (SSID)
            </label>
            <input
              id="input-wifi-ssid"
              type="text"
              value={config.wifi.ssid}
              onChange={(e) =>
                onChange({
                  wifi: { ...config.wifi, ssid: e.target.value },
                })
              }
              placeholder="e.g. CoffeeShop_Guest_5G"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7FAF8] border border-[#D5E0DB] text-[#101513] placeholder-[#8EA39A] text-sm focus:outline-none focus:ring-2 focus:ring-[#20D47A] shadow-inner"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="input-wifi-pass" className="block text-xs font-semibold text-[#50635B] mb-1">
                Wi-Fi Password
              </label>
              <div className="relative">
                <input
                  id="input-wifi-pass"
                  type={showWifiPassword ? 'text' : 'password'}
                  value={config.wifi.password}
                  onChange={(e) =>
                    onChange({
                      wifi: { ...config.wifi, password: e.target.value },
                    })
                  }
                  placeholder="Network password"
                  className="w-full pl-3 pr-9 py-2 rounded-xl bg-[#F7FAF8] border border-[#D5E0DB] text-[#101513] placeholder-[#8EA39A] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#20D47A] shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowWifiPassword(!showWifiPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7D9187] hover:text-[#101513] p-1"
                  aria-label={showWifiPassword ? 'Hide password' : 'Show password'}
                >
                  {showWifiPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="input-wifi-enc" className="block text-xs font-semibold text-[#50635B] mb-1">
                Security Encryption
              </label>
              <select
                id="input-wifi-enc"
                value={config.wifi.encryption}
                onChange={(e) =>
                  onChange({
                    wifi: {
                      ...config.wifi,
                      encryption: e.target.value as 'WPA' | 'WEP' | 'nopass',
                    },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-[#F7FAF8] border border-[#D5E0DB] text-[#101513] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#20D47A]"
              >
                <option value="WPA">WPA / WPA2 / WPA3 (Standard)</option>
                <option value="WEP">WEP (Legacy)</option>
                <option value="nopass">None (Open Network)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 6. vCard Contact */}
      {config.contentType === 'vcard' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="vcard-fn" className="block text-xs font-semibold text-[#50635B] mb-1">
                First Name
              </label>
              <input
                id="vcard-fn"
                type="text"
                value={config.vcard.firstName}
                onChange={(e) =>
                  onChange({
                    vcard: { ...config.vcard, firstName: e.target.value },
                  })
                }
                placeholder="Alex"
                className="w-full px-3 py-2 rounded-xl bg-[#F7FAF8] border border-[#D5E0DB] text-[#101513] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#20D47A] shadow-inner"
              />
            </div>
            <div>
              <label htmlFor="vcard-ln" className="block text-xs font-semibold text-[#50635B] mb-1">
                Last Name
              </label>
              <input
                id="vcard-ln"
                type="text"
                value={config.vcard.lastName}
                onChange={(e) =>
                  onChange({
                    vcard: { ...config.vcard, lastName: e.target.value },
                  })
                }
                placeholder="Rivers"
                className="w-full px-3 py-2 rounded-xl bg-[#F7FAF8] border border-[#D5E0DB] text-[#101513] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#20D47A] shadow-inner"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="vcard-org" className="block text-xs font-semibold text-[#50635B] mb-1">
                Company / Organization
              </label>
              <input
                id="vcard-org"
                type="text"
                value={config.vcard.organization}
                onChange={(e) =>
                  onChange({
                    vcard: { ...config.vcard, organization: e.target.value },
                  })
                }
                placeholder="Verdant Studios"
                className="w-full px-3 py-2 rounded-xl bg-[#F7FAF8] border border-[#D5E0DB] text-[#101513] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#20D47A] shadow-inner"
              />
            </div>
            <div>
              <label htmlFor="vcard-title" className="block text-xs font-semibold text-[#50635B] mb-1">
                Job Title
              </label>
              <input
                id="vcard-title"
                type="text"
                value={config.vcard.title}
                onChange={(e) =>
                  onChange({
                    vcard: { ...config.vcard, title: e.target.value },
                  })
                }
                placeholder="Principal Architect"
                className="w-full px-3 py-2 rounded-xl bg-[#F7FAF8] border border-[#D5E0DB] text-[#101513] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#20D47A] shadow-inner"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="vcard-phone" className="block text-xs font-semibold text-[#50635B] mb-1">
                Phone Number
              </label>
              <input
                id="vcard-phone"
                type="tel"
                value={config.vcard.phone}
                onChange={(e) =>
                  onChange({
                    vcard: { ...config.vcard, phone: e.target.value },
                  })
                }
                placeholder="+1 555 987 6543"
                className="w-full px-3 py-2 rounded-xl bg-[#F7FAF8] border border-[#D5E0DB] text-[#101513] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#20D47A] shadow-inner"
              />
            </div>
            <div>
              <label htmlFor="vcard-email" className="block text-xs font-semibold text-[#50635B] mb-1">
                Email
              </label>
              <input
                id="vcard-email"
                type="email"
                value={config.vcard.email}
                onChange={(e) =>
                  onChange({
                    vcard: { ...config.vcard, email: e.target.value },
                  })
                }
                placeholder="alex@verdant.io"
                className="w-full px-3 py-2 rounded-xl bg-[#F7FAF8] border border-[#D5E0DB] text-[#101513] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#20D47A] shadow-inner"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
