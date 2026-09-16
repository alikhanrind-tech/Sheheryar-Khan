import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQItem } from '../types';

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // first open by default

  const faqs: FAQItem[] = [
    {
      question: 'Is the QR code generator free?',
      answer:
        'Yes, QRForge is 100% free with no hidden charges, trial periods, or limits on the number of QR codes you can generate and download.',
    },
    {
      question: 'Can I customize the QR code colors?',
      answer:
        'Yes. You can customize both the foreground (dark matrix modules) and background colors using custom hex codes, precision color pickers, or quick preset swatches. You can also export with a transparent background for graphic overlays.',
    },
    {
      question: 'What types of content can I encode?',
      answer:
        'You can encode website links (URLs), raw plain text, pre-formatted emails with subjects and body text, direct phone dialers, Wi-Fi credentials with WPA/WPA2/WEP encryption, and full vCard contact cards.',
    },
    {
      question: 'Can I download the QR code?',
      answer:
        'Yes. You can download crisp, high-resolution PNG raster images up to 1200×1200px or infinite-scale vector SVGs that are ready for commercial print design in Illustrator, Figma, or print shops.',
    },
    {
      question: 'Will the QR code expire?',
      answer:
        'Never. QRForge creates static direct-payload QR codes. The target data (like your URL or Wi-Fi password) is mathematically baked into the black-and-white pattern itself. As long as your destination link remains online, the QR code will scan forever without any expiration.',
    },
    {
      question: 'Do I need to create an account?',
      answer:
        'No account, sign-in, or credit card is required. You can generate, preview, and download as many codes as you need immediately upon opening the page.',
    },
    {
      question: 'Can I use QR codes for commercial projects?',
      answer:
        'Yes. All generated codes are yours to use on product packaging, restaurant tables, flyers, business cards, billboards, television broadcasts, or software products with zero royalty or licensing restrictions.',
    },
    {
      question: 'Does the generator work on mobile?',
      answer:
        'Yes. QRForge is fully responsive with a touch-friendly interface designed for smartphones, tablets, laptops, and ultra-wide desktop monitors.',
    },
    {
      question: 'Can I scan and read existing QR codes?',
      answer:
        'Yes! QRForge includes a built-in scanner. You can read QR codes in real-time using your device camera, upload or drag-and-drop saved image files (PNG, JPG, WEBP), or paste screenshots directly with Ctrl+V. You can immediately copy decoded data or transfer it directly into the generator to redesign it.',
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-24 relative" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#073B2A]/40 border border-[#20D47A]/20 text-[#54F5A0] text-xs font-semibold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-[#20D47A]" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Got questions?{' '}
            <span className="text-[#20D47A]">We have answers.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#9BAEA5]">
            Everything you need to know about generating static, reliable QR codes.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-[#061812] border-[#20D47A]/40 shadow-lg shadow-[#20D47A]/5'
                    : 'bg-[#061812]/50 border-white/[0.08] hover:border-white/[0.18]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full py-4 sm:py-5 px-6 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20D47A]"
                  aria-expanded={isOpen}
                  id={`faq-btn-${idx}`}
                >
                  <span className="text-base sm:text-lg font-semibold text-white pr-4">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'bg-[#20D47A] text-[#020B08] rotate-180' : 'bg-white/5 text-[#9BAEA5]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div
                    className="px-6 pb-5 pt-1 text-sm sm:text-base text-[#9BAEA5] leading-relaxed border-t border-white/[0.04] animate-in fade-in duration-200"
                    id={`faq-content-${idx}`}
                  >
                    {faq.answer}
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
