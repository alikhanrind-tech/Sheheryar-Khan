import { useState, useEffect, useRef } from 'react';
import { QRConfig, ContentType, RecentQRItem } from '../../types';
import { ContentTypeTabs } from './ContentTypeTabs';
import { ControlInputs } from './ControlInputs';
import { CustomizationPanel } from './CustomizationPanel';
import { QRPreview } from './QRPreview';
import { RecentGenerations } from './RecentGenerations';
import { QRScanner } from '../QRScanner/QRScanner';
import { getRecentQRCodes, saveRecentQRCode, deleteRecentQRCode, clearRecentQRCodes, formatQRContent } from '../../utils/qrUtils';
import {
  ensureAuthSession,
  saveQRToCloud,
  loadQRsFromCloud,
  deleteQRFromCloud,
  auth,
  onAuthStateChanged,
  User,
} from '../../lib/firebase';
import { QrCode, Sparkles, RefreshCw, Camera, Wand2, Cloud, Check } from 'lucide-react';

const DEFAULT_CONFIG: QRConfig = {
  contentType: 'url',
  url: 'https://qrforge.dev',
  text: 'Hello from QRForge!',
  email: {
    address: 'contact@example.com',
    subject: 'Project Inquiry',
    body: 'Hello, I scanned your QR code!',
  },
  phone: '+15551234567',
  wifi: {
    ssid: 'Studio_Guest_WiFi',
    password: 'SuperSecretPassword',
    encryption: 'WPA',
    hidden: false,
  },
  vcard: {
    firstName: 'Alex',
    lastName: 'Morgan',
    organization: 'Verdant Tech',
    title: 'Creative Technologist',
    phone: '+1 555 456 7890',
    email: 'alex@verdant.io',
    url: 'https://verdant.io',
  },
  size: 'medium',
  errorCorrectionLevel: 'M',
  fgColor: '#073B2A',
  bgColor: '#FFFFFF',
  transparentBg: false,
  margin: 2,
  centerLogo: 'none',
};

interface QRGeneratorProps {
  appMode?: 'generate' | 'scan';
  onModeChange?: (mode: 'generate' | 'scan') => void;
}

export function QRGenerator({ appMode: externalMode, onModeChange }: QRGeneratorProps) {
  const [internalMode, setInternalMode] = useState<'generate' | 'scan'>('generate');
  const activeMode = externalMode !== undefined ? externalMode : internalMode;

  const setMode = (m: 'generate' | 'scan') => {
    setInternalMode(m);
    if (onModeChange) onModeChange(m);
  };

  const [config, setConfig] = useState<QRConfig>(DEFAULT_CONFIG);
  const [recentItems, setRecentItems] = useState<RecentQRItem[]>([]);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const isInitialCloudLoadRef = useRef(false);

  // Initialize Firebase Auth session & listen to state changes
  useEffect(() => {
    ensureAuthSession().catch((e) => console.warn('Auth session initial error:', e));

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user && !isInitialCloudLoadRef.current) {
        isInitialCloudLoadRef.current = true;
        setIsCloudSyncing(true);
        try {
          const cloudItems = await loadQRsFromCloud(user.uid);
          const localItems = getRecentQRCodes();
          // Merge unique by ID
          const itemMap = new Map<string, RecentQRItem>();
          [...cloudItems, ...localItems].forEach((it) => {
            if (!itemMap.has(it.id)) {
              itemMap.set(it.id, it);
            }
          });
          const merged = Array.from(itemMap.values()).sort((a, b) => b.timestamp - a.timestamp);
          setRecentItems(merged);
        } catch (e) {
          console.warn('Failed to load cloud items:', e);
        } finally {
          setIsCloudSyncing(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Load local recents on mount immediately for instant display
  useEffect(() => {
    setRecentItems(getRecentQRCodes());
  }, []);

  const handleConfigChange = (updated: Partial<QRConfig>) => {
    setConfig((prev) => ({ ...prev, ...updated }));
  };

  const handleContentTypeChange = (type: ContentType) => {
    setConfig((prev) => ({ ...prev, contentType: type }));
  };

  // Called when code is freshly rendered
  const handleCodeGenerated = (dataUrl: string, rawContent: string) => {
    if (!rawContent || rawContent.length < 3) return;

    let title = rawContent;
    if (config.contentType === 'url') {
      title = config.url || 'Web link';
    } else if (config.contentType === 'wifi') {
      title = `WiFi: ${config.wifi.ssid || 'Network'}`;
    } else if (config.contentType === 'email') {
      title = `Email: ${config.email.address}`;
    } else if (config.contentType === 'phone') {
      title = `Tel: ${config.phone}`;
    } else if (config.contentType === 'vcard') {
      title = `Contact: ${config.vcard.firstName} ${config.vcard.lastName}`.trim();
    } else {
      title = rawContent.slice(0, 24);
    }

    const newItem: RecentQRItem = {
      id: `${config.contentType}-${Date.now()}`,
      title,
      contentType: config.contentType,
      rawContent,
      dataUrl,
      timestamp: Date.now(),
      config: { ...config },
    };

    const updated = saveRecentQRCode(newItem);
    setRecentItems(updated);

    // Sync to Firebase Firestore
    if (currentUser) {
      saveQRToCloud(newItem, currentUser.uid).catch((err) => {
        console.warn('Cloud sync error:', err);
      });
    }
  };

  const handleSelectRecent = (item: RecentQRItem) => {
    setConfig(item.config);
    setMode('generate');
    setFeedbackNotice(`Loaded "${item.title}" into editor`);
    setTimeout(() => setFeedbackNotice(null), 3000);
  };

  const handleDeleteRecent = (id: string) => {
    const updated = deleteRecentQRCode(id);
    setRecentItems(updated);
    if (currentUser) {
      deleteQRFromCloud(id, currentUser.uid).catch((err) => {
        console.warn('Cloud delete error:', err);
      });
    }
  };

  const handleClearRecent = () => {
    clearRecentQRCodes();
    setRecentItems([]);
  };

  const handleResetToDefault = () => {
    setConfig(DEFAULT_CONFIG);
    setFeedbackNotice('Reset to standard presets');
    setTimeout(() => setFeedbackNotice(null), 2500);
  };

  const handleLoadFromScan = (scannedConfig: Partial<QRConfig>) => {
    setConfig((prev) => ({
      ...prev,
      ...scannedConfig,
    }));
    setMode('generate');
    setFeedbackNotice('Loaded scanned content into generator!');
    setTimeout(() => setFeedbackNotice(null), 3500);
  };

  return (
    <section className="relative px-4 sm:px-6 lg:px-8 pb-20 -mt-6 sm:-mt-10" id="generator">
      {/* Decorative backdrop glow */}
      <div className="absolute inset-0 max-w-6xl mx-auto -z-10 bg-radial-emerald pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Main Application Container Card: Bright White Surface contrasting against dark backdrop */}
        <div
          id="main-qr-card"
          className="bg-white rounded-[26px] p-6 sm:p-8 lg:p-10 white-card-shadow border border-white/40 relative overflow-hidden"
        >
          {/* Subtle Top Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#073B2A] via-[#20D47A] to-[#54F5A0]" />

          {/* Card Header & Studio Mode Selector (Generate vs Scan & Read) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-black/5 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#F0F5F2] border border-[#20D47A]/30 flex items-center justify-center text-[#073B2A] shadow-inner">
                {activeMode === 'generate' ? (
                  <QrCode className="w-6 h-6 text-[#105B38]" />
                ) : (
                  <Camera className="w-6 h-6 text-[#105B38]" />
                )}
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#101513] tracking-tight flex items-center gap-2">
                  {activeMode === 'generate' ? 'QR Code Generator' : 'QR Code Scanner & Reader'}
                  <span className="hidden sm:inline-block text-[11px] font-semibold text-[#073B2A] bg-[#20D47A]/20 px-2 py-0.5 rounded-full">
                    {activeMode === 'generate' ? 'Create' : 'Scan'}
                  </span>
                  <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold text-[#105B38] bg-[#20D47A]/15 px-2 py-0.5 rounded-full border border-[#20D47A]/30" title="Connected to Google Firebase Firestore">
                    <Cloud className="w-2.5 h-2.5 text-[#20D47A]" />
                    {isCloudSyncing ? 'Syncing...' : 'Cloud Synced'}
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-[#7D9187]">
                  {activeMode === 'generate'
                    ? 'Create, customize, and export high-resolution vector QR codes instantly.'
                    : 'Scan any QR code using your device camera or upload image files to decode content.'}
                </p>
              </div>
            </div>

            {/* Studio Mode Segmented Switcher & Reset Button */}
            <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
              {feedbackNotice && (
                <span className="text-xs font-semibold text-[#105B38] bg-[#20D47A]/20 px-3 py-1.5 rounded-lg animate-in fade-in">
                  {feedbackNotice}
                </span>
              )}

              {/* Mode Switch Tabs */}
              <div className="flex items-center p-1 bg-[#F0F5F2] rounded-xl border border-black/5">
                <button
                  type="button"
                  onClick={() => setMode('generate')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeMode === 'generate'
                      ? 'bg-white text-[#073B2A] shadow-xs'
                      : 'text-[#50635B] hover:text-[#101513]'
                  }`}
                  id="tab-mode-generate"
                >
                  <Wand2 className="w-3.5 h-3.5 text-[#20D47A]" />
                  Generate
                </button>
                <button
                  type="button"
                  onClick={() => setMode('scan')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeMode === 'scan'
                      ? 'bg-white text-[#073B2A] shadow-xs'
                      : 'text-[#50635B] hover:text-[#101513]'
                  }`}
                  id="tab-mode-scan"
                >
                  <Camera className="w-3.5 h-3.5 text-[#20D47A]" />
                  Scan & Read
                </button>
              </div>

              {activeMode === 'generate' && (
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="flex items-center gap-1.5 text-xs text-[#50635B] hover:text-[#101513] px-3 py-1.5 rounded-lg border border-black/10 hover:bg-[#F7FAF8] transition-colors"
                  title="Reset fields to defaults"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Active Mode Render */}
          {activeMode === 'generate' ? (
            <>
              {/* Two-Column Grid: Left Controls & Right Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* LEFT CONFIGURATION PANEL (7 cols on lg) */}
                <div className="lg:col-span-7 space-y-6">
                  {/* 1. Content Type Selector */}
                  <ContentTypeTabs
                    activeType={config.contentType}
                    onChange={handleContentTypeChange}
                  />

                  {/* 2. Content Input Fields */}
                  <ControlInputs
                    config={config}
                    onChange={handleConfigChange}
                  />

                  {/* 3. Customization Panel (Size, Error Correction, Colors, Margin) */}
                  <CustomizationPanel
                    config={config}
                    onChange={handleConfigChange}
                  />

                  {/* Primary Full Width Trigger */}
                  <button
                    type="button"
                    onClick={() => {
                      const content = formatQRContent(config);
                      if (content) {
                        setFeedbackNotice('Updated & rendered!');
                        setTimeout(() => setFeedbackNotice(null), 2000);
                      }
                    }}
                    id="btn-generate-main"
                    className="w-full flex items-center justify-center gap-2.5 bg-[#20D47A] hover:bg-[#54F5A0] text-[#020B08] font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg shadow-[#20D47A]/25 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#073B2A]"
                  >
                    <Sparkles className="w-5 h-5 text-[#073B2A]" />
                    <span>Generate QR Code</span>
                  </button>
                </div>

                {/* RIGHT PREVIEW PANEL (5 cols on lg) */}
                <div className="lg:col-span-5 h-full">
                  <QRPreview
                    config={config}
                    onCodeGenerated={handleCodeGenerated}
                  />
                </div>
              </div>

              {/* RECENT GENERATIONS TRAY */}
              <RecentGenerations
                items={recentItems}
                onSelect={handleSelectRecent}
                onDelete={handleDeleteRecent}
                onClear={handleClearRecent}
                isCloudSynced={!!currentUser}
              />
            </>
          ) : (
            /* SCANNER & READER WORKSPACE */
            <QRScanner
              onLoadIntoGenerator={handleLoadFromScan}
              onClose={() => setMode('generate')}
            />
          )}
        </div>
      </div>
    </section>
  );
}
