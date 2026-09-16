import { useState, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { QRGenerator } from './components/QRGenerator/QRGenerator';
import { FeatureStrip } from './components/FeatureStrip';
import { FeaturesSection } from './components/FeaturesSection';
import { HowItWorks } from './components/HowItWorks';
import { UseCasesSection } from './components/UseCasesSection';
import { PrivacySection } from './components/PrivacySection';
import { TrustCategories } from './components/TrustCategories';
import { FAQSection } from './components/FAQSection';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';

export default function App() {
  const [appMode, setAppMode] = useState<'generate' | 'scan'>('generate');

  const scrollToGenerator = useCallback(() => {
    setAppMode('generate');
    const el = document.getElementById('generator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const scrollToScanner = useCallback(() => {
    setAppMode('scan');
    const el = document.getElementById('generator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const scrollToFeatures = useCallback(() => {
    const el = document.getElementById('features');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#020B08] text-[#E7F1EC] selection:bg-[#20D47A]/30 selection:text-white relative">
      {/* Subtle global background grid texture */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.035] -z-20"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* Sticky Navigation */}
      <Navbar
        onScrollToGenerator={scrollToGenerator}
        onScrollToScanner={scrollToScanner}
      />

      {/* Hero Section */}
      <Hero
        onScrollToGenerator={scrollToGenerator}
        onScrollToScanner={scrollToScanner}
        onScrollToFeatures={scrollToFeatures}
      />

      {/* Central QR Generator & Scanner Application */}
      <QRGenerator
        appMode={appMode}
        onModeChange={setAppMode}
      />

      {/* Trust & Feature Strip */}
      <FeatureStrip />

      {/* Features Showcase */}
      <FeaturesSection />

      {/* 3-Step Process: How It Works */}
      <HowItWorks />

      {/* Versatile Use Cases */}
      <UseCasesSection />

      {/* Security & Privacy Architecture */}
      <PrivacySection />

      {/* Built For Everyday Sharing Badges */}
      <TrustCategories />

      {/* Frequently Asked Questions */}
      <FAQSection />

      {/* Bottom Dramatic CTA */}
      <FinalCTA onScrollToGenerator={scrollToGenerator} />

      {/* Footer */}
      <Footer onScrollToGenerator={scrollToGenerator} />
    </div>
  );
}
