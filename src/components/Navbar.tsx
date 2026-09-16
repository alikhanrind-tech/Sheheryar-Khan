import { useState, useEffect } from 'react';
import { Menu, X, QrCode, ArrowUpRight, Camera, Sparkles, Cloud, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { auth, onAuthStateChanged, signInWithGoogle, logOut, User } from '../lib/firebase';

interface NavbarProps {
  onScrollToGenerator: () => void;
  onScrollToScanner: () => void;
}

export function Navbar({ onScrollToGenerator, onScrollToScanner }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.warn('Google sign-in error or cancelled:', err);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Generator', href: '#generator' },
    { label: 'Scan QR', href: '#scan' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Use Cases', href: '#use-cases' },
    { label: 'FAQ', href: '#faq' },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href === '#generator') {
      onScrollToGenerator();
      return;
    }
    if (href === '#scan') {
      onScrollToScanner();
      return;
    }
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#020B08]/85 backdrop-blur-md border-b border-white/[0.08] shadow-lg shadow-black/40 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20D47A] rounded-lg"
            id="brand-logo-link"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#073B2A] to-[#061812] border border-[#20D47A]/30 p-2 flex items-center justify-center relative shadow-sm group-hover:border-[#20D47A]/60 transition-colors">
              <QrCode className="w-5 h-5 text-[#20D47A]" />
              <div className="absolute inset-0 rounded-xl bg-[#20D47A]/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xs" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                QRForge
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#20D47A] animate-pulse"></span>
              </span>
              <span className="text-[10px] tracking-wider uppercase text-[#9BAEA5] font-medium -mt-0.5">
                Next-Gen QR Studio
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-[#061812]/70 border border-white/[0.07] px-4 py-1.5 rounded-full backdrop-blur-md">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link.href)}
                className="px-3.5 py-1.5 text-sm font-medium text-[#9BAEA5] hover:text-white transition-colors rounded-full hover:bg-white/[0.05] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#20D47A]"
                id={`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user && !user.isAnonymous ? (
              <div className="flex items-center gap-2 bg-[#061812] border border-white/[0.12] rounded-full pl-2 pr-3 py-1">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-5 h-5 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-[#073B2A] flex items-center justify-center text-[10px] text-[#20D47A] font-bold">
                    {user.displayName?.[0] || 'U'}
                  </div>
                )}
                <span className="text-xs text-[#E7F1EC] font-medium max-w-[90px] truncate">
                  {user.displayName?.split(' ')[0] || user.email?.split('@')[0] || 'Account'}
                </span>
                <button
                  type="button"
                  onClick={handleSignOut}
                  title="Sign out of Google"
                  className="text-[#7D9187] hover:text-rose-400 p-0.5 transition-colors"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={authLoading}
                className="inline-flex items-center gap-1.5 text-xs text-[#E7F1EC] hover:text-white bg-[#061812]/90 hover:bg-[#073B2A]/70 px-3 py-1.5 rounded-full border border-white/[0.12] hover:border-[#20D47A]/50 transition-all font-medium"
                title="Sign in with Google to sync your saved QR codes across all devices"
              >
                <LogIn className="w-3 h-3 text-[#20D47A]" />
                {authLoading ? 'Signing in...' : 'Sign in to Sync'}
              </button>
            )}

            <button
              onClick={onScrollToGenerator}
              id="header-cta-button"
              className="inline-flex items-center justify-center gap-2 bg-[#20D47A] hover:bg-[#54F5A0] text-[#020B08] font-semibold text-sm px-4 py-2 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 shadow-md shadow-[#20D47A]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#54F5A0]"
            >
              Create QR Code
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-[#061812] border border-white/[0.1] text-white hover:text-[#20D47A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20D47A]"
              aria-label="Toggle navigation menu"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer"
          className="md:hidden mt-3 mx-4 p-5 rounded-2xl bg-[#061812] border border-white/[0.1] shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link.href)}
                className="flex items-center justify-between px-4 py-2.5 text-base font-medium text-[#E7F1EC] hover:text-[#20D47A] hover:bg-white/[0.04] rounded-xl text-left transition-colors"
                id={`mobile-nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-3 mt-1 border-t border-white/[0.08] flex flex-col gap-3">
              {user && !user.isAnonymous ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                  <div className="flex items-center gap-2.5">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        className="w-7 h-7 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#073B2A] flex items-center justify-center text-xs text-[#20D47A] font-bold">
                        {user.displayName?.[0] || 'U'}
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-semibold text-white">
                        {user.displayName || user.email}
                      </p>
                      <p className="text-[10px] text-[#20D47A]">Cloud Sync Active</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="text-xs text-[#9BAEA5] hover:text-rose-400 font-medium px-2 py-1 rounded-lg border border-white/[0.1] hover:bg-white/[0.05]"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={authLoading}
                  className="w-full flex items-center justify-center gap-2 bg-[#061812] hover:bg-[#073B2A]/80 text-[#E7F1EC] text-sm font-medium py-2.5 px-4 rounded-xl border border-white/[0.12] transition-colors"
                >
                  <LogIn className="w-4 h-4 text-[#20D47A]" />
                  <span>{authLoading ? 'Signing in...' : 'Sign in with Google'}</span>
                </button>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onScrollToGenerator();
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#20D47A] hover:bg-[#54F5A0] text-[#020B08] font-bold text-sm py-3 px-4 rounded-xl transition-colors shadow-lg shadow-[#20D47A]/25"
                id="mobile-cta-button"
              >
                Create QR Code
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
