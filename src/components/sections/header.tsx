"use client";

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { Menu, X, Globe, DollarSign, User, ShoppingCart, Settings } from 'lucide-react';
import { useTranslations } from '@/lib/i18n/hooks';
import { usePathname } from '@/i18n/routing';
import { useParams, useRouter } from 'next/navigation';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useCart } from '@/contexts/CartContext';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';

const navLinks = [
  { href: "/", label: "nav.home" },
  { href: "/nos-excursions", label: "nav.excursions" },
  { href: "/qui-sommes-nous", label: "nav.about" },
  { href: "/autres-services", label: "nav.services" },
  { href: "/contact", label: "nav.contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  const params = useParams();
  const locale = (params.locale as string) || 'fr';
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();
  const { currency, setCurrency } = useCurrency();
  const { cartCount } = useCart();
  const { user } = useUser();
  
  // Check if user is admin
  const isAdmin = user?.publicMetadata?.role === 'admin';

  useEffect(() => {
    setIsClient(true);
  }, []);

  const switchLocale = (newLocale: 'en' | 'fr' | 'es' | 'it') => {
    // Construct the new path with the new locale
    const newPath = `/${newLocale}${pathname}`;
    router.push(newPath);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${isScrolled ? 'bg-[rgba(255,183,63,0.95)] backdrop-blur-sm shadow-md' : 'bg-black/30'}`}>
        <div className="mx-auto max-w-none">
          
          {/* Desktop Double Header */}
          <div className="hidden md:block">
            {/* First Bar - Translation, Currency, Client Login */}
            <div className="border-b border-white/20">
              <div className="px-5 lg:px-20 h-12 flex items-center justify-between">
                {/* Left side - Translation and Currency */}
                <div className="flex items-center gap-4">
                  {/* Language Switcher */}
                  <div className="flex items-center gap-2 bg-white/10 rounded px-3 py-1.5">
                    <Globe className="w-3.5 h-3.5 text-white" />
                    <button
                      onClick={() => switchLocale('en')}
                      className={`text-xs font-semibold ${locale === 'en' ? 'text-white' : 'text-white/60'} hover:text-white transition-colors`}
                    >
                      EN
                    </button>
                    <span className="text-white/40">|</span>
                    <button
                      onClick={() => switchLocale('fr')}
                      className={`text-xs font-semibold ${locale === 'fr' ? 'text-white' : 'text-white/60'} hover:text-white transition-colors`}
                    >
                      FR
                    </button>
                    <span className="text-white/40">|</span>
                    <button
                      onClick={() => switchLocale('es')}
                      className={`text-xs font-semibold ${locale === 'es' ? 'text-white' : 'text-white/60'} hover:text-white transition-colors`}
                    >
                      ES
                    </button>
                    <span className="text-white/40">|</span>
                    <button
                      onClick={() => switchLocale('it')}
                      className={`text-xs font-semibold ${locale === 'it' ? 'text-white' : 'text-white/60'} hover:text-white transition-colors`}
                    >
                      IT
                    </button>
                  </div>

                  {/* Currency Switcher */}
                  <div className="flex items-center gap-2 bg-white/10 rounded px-3 py-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-white" />
                    <button
                      onClick={() => setCurrency('MAD')}
                      className={`text-xs font-semibold ${currency === 'MAD' ? 'text-white' : 'text-white/60'} hover:text-white transition-colors`}
                    >
                      MAD
                    </button>
                    <span className="text-white/40">|</span>
                    <button
                      onClick={() => setCurrency('USD')}
                      className={`text-xs font-semibold ${currency === 'USD' ? 'text-white' : 'text-white/60'} hover:text-white transition-colors`}
                    >
                      USD
                    </button>
                    <span className="text-white/40">|</span>
                    <button
                      onClick={() => setCurrency('EUR')}
                      className={`text-xs font-semibold ${currency === 'EUR' ? 'text-white' : 'text-white/60'} hover:text-white transition-colors`}
                    >
                      EUR
                    </button>
                  </div>
                </div>

                {/* Right side - Cart and Clerk Authentication */}
                <div className="flex items-center gap-3">
                  {/* Admin Panel Link - Only show for admin users */}
                  {isAdmin && (
                    <Link 
                      href="/admin"
                      className="inline-flex items-center gap-2 rounded-[4px] border border-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:bg-white hover:text-zinc-900"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      Admin
                    </Link>
                  )}
                  
                  {/* Cart Icon */}
                  <Link 
                    href="/cart"
                    className="relative inline-flex items-center gap-2 rounded-[4px] border border-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:bg-white hover:text-zinc-900"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  
                  <SignedOut>
                    <Link 
                      href="/sign-in"
                      className="inline-block rounded-[4px] border border-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:bg-white hover:text-zinc-900"
                    >
                      {t('header.signIn')}
                    </Link>
                  </SignedOut>
                  <SignedIn>
                    <Link 
                      href="/mon-compte"
                      className="inline-flex items-center gap-2 rounded-[4px] border border-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:bg-white hover:text-zinc-900"
                    >
                      <User className="w-3.5 h-3.5" />
                      {t('header.myAccount')}
                    </Link>
                    <UserButton 
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "w-8 h-8"
                        }
                      }}
                    />
                  </SignedIn>
                </div>
              </div>
            </div>

            {/* Second Bar - Logo and Navigation */}
            <div className="px-5 lg:px-20">
              <div className="h-20 w-full flex items-center">
                <div className="flex-1">
                  <Link href="/" className="inline-block">
                    <Image 
                      src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/diffatours-logo2-1764026359909.png"
                      alt="Diffa Tours"
                      width={80}
                      height={80}
                      className="h-14 w-auto"
                      priority
                    />
                  </Link>
                </div>
                
                <div className="flex-none">
                  <nav className="font-secondary">
                    <ul className="flex items-center space-x-6">
                      {navLinks.map((link) => (
                        <li key={link.href}>
                          <Link href={link.href} className="text-sm font-semibold uppercase tracking-[1px] text-white transition-colors hover:text-accent">
                            {t(link.label)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>

                <div className="flex flex-1 justify-end">
                  <a href="#reservation" className="inline-block rounded-[4px] border border-white px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:bg-white hover:text-zinc-900 hover:scale-105 hover:shadow-lg">
                    {t('reservation.bookNow')}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex h-20 w-full items-center justify-between md:hidden px-5">
            <button onClick={() => setIsMenuOpen(true)} aria-label="Open menu" className="p-2">
              <Menu className="h-7 w-7 text-white" />
            </button>
            
            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <Image 
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/diffatours-logo2-1764026359909.png"
                alt="Diffa Tours"
                width={60}
                height={60}
                className="h-12 w-auto"
                priority
              />
            </Link>

            <div className="flex items-center gap-2">
              {/* Mobile Cart Icon */}
              <Link href="/cart" className="relative p-2">
                <ShoppingCart className="h-6 w-6 text-white" />
                {cartCount > 0 && (
                  <span className="absolute -top-0 -right-0 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              <SignedIn>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-7 h-7"
                    }
                  }}
                />
              </SignedIn>
              <SignedOut>
                <div className="w-7"></div>
              </SignedOut>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu Panel */}
      <div 
        className={`fixed inset-0 z-[100] md:hidden transition-opacity duration-300 ease-in-out ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-modal="true"
      >
        <div className="absolute inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)} />
        
        <div 
          className={`absolute right-0 top-0 h-full w-4/5 max-w-sm bg-card p-6 shadow-xl transition-transform duration-300 ease-in-out overflow-y-auto ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
            <div className="flex justify-end">
                <button onClick={() => setIsMenuOpen(false)} aria-label="Close menu" className="p-2">
                    <X className="h-7 w-7 text-foreground" />
                </button>
            </div>
            
            {/* Language & Currency Switchers */}
            <div className="mt-4 space-y-3 border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted" />
                <button
                  onClick={() => switchLocale('en')}
                  className={`text-sm font-semibold ${locale === 'en' ? 'text-primary' : 'text-muted'}`}
                >
                  EN
                </button>
                <span className="text-muted">|</span>
                <button
                  onClick={() => switchLocale('fr')}
                  className={`text-sm font-semibold ${locale === 'fr' ? 'text-primary' : 'text-muted'}`}
                >
                  FR
                </button>
                <span className="text-muted">|</span>
                <button
                  onClick={() => switchLocale('es')}
                  className={`text-sm font-semibold ${locale === 'es' ? 'text-primary' : 'text-muted'}`}
                >
                  ES
                </button>
                <span className="text-muted">|</span>
                <button
                  onClick={() => switchLocale('it')}
                  className={`text-sm font-semibold ${locale === 'it' ? 'text-primary' : 'text-muted'}`}
                >
                  IT
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted" />
                <button
                  onClick={() => setCurrency('MAD')}
                  className={`text-sm font-semibold ${currency === 'MAD' ? 'text-primary' : 'text-muted'}`}
                >
                  MAD
                </button>
                <span className="text-muted">|</span>
                <button
                  onClick={() => setCurrency('USD')}
                  className={`text-sm font-semibold ${currency === 'USD' ? 'text-primary' : 'text-muted'}`}
                >
                  USD
                </button>
                <span className="text-muted">|</span>
                <button
                  onClick={() => setCurrency('EUR')}
                  className={`text-sm font-semibold ${currency === 'EUR' ? 'text-primary' : 'text-muted'}`}
                >
                  EUR
                </button>
              </div>
            </div>
            
            <nav className="mt-8 font-secondary">
                <ul className="flex flex-col items-center space-y-6">
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <Link href={link.href} onClick={() => setIsMenuOpen(false)} className="text-lg font-medium uppercase tracking-wider text-foreground transition-colors hover:text-primary">
                                {t(link.label)}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="mt-10 pt-6 border-t border-border text-center space-y-3">
                {/* Admin Panel Link - Mobile */}
                {isAdmin && (
                  <Link 
                    href="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="inline-flex items-center justify-center gap-2 w-full rounded-[4px] border-2 border-accent px-6 py-3 text-sm font-semibold uppercase tracking-wider text-accent transition-all duration-300 hover:bg-accent hover:text-white mb-3"
                  >
                    <Settings className="w-4 h-4" />
                    Admin Panel
                  </Link>
                )}
                
                <SignedOut>
                  <Link 
                    href="/sign-in"
                    onClick={() => setIsMenuOpen(false)}
                    className="inline-block w-full rounded-[4px] border-2 border-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary transition-all duration-300 hover:bg-primary hover:text-white"
                  >
                    {t('header.signIn')}
                  </Link>
                </SignedOut>
                <SignedIn>
                  <Link 
                    href="/mon-compte"
                    onClick={() => setIsMenuOpen(false)}
                    className="inline-flex items-center justify-center gap-2 w-full rounded-[4px] border-2 border-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary transition-all duration-300 hover:bg-primary hover:text-white mb-3"
                  >
                    <User className="w-4 h-4" />
                    {t('header.myAccount')}
                  </Link>
                  <div className="flex items-center justify-center gap-3">
                    <UserButton 
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "w-10 h-10"
                        }
                      }}
                    />
                    <span className="text-sm font-medium text-foreground">{t('header.myAccount')}</span>
                  </div>
                </SignedIn>
                <a href="#reservation" className="inline-block w-full rounded-[4px] bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:scale-105 hover:shadow-lg">
                    {t('reservation.bookNow')}
                </a>
            </div>
        </div>
      </div>
    </>
  );
}