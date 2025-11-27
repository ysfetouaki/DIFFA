import type { Metadata } from "next";
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { ClerkProvider } from '@clerk/nextjs';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { CartProvider } from '@/contexts/CartContext';
import { Toaster } from '@/components/ui/sonner';
import Footer from '@/components/sections/footer';
import { ScrollProgress } from '@/components/ui/scroll-progress';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: "Diffa Tours - Découvrez le Maroc",
  description: "Votre agence de voyage au cœur du Maroc authentique",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
        <ScrollProgress />
        <ClerkProvider>
          <CurrencyProvider>
            <CartProvider>
              {children}
              <Footer />
              <Toaster />
            </CartProvider>
          </CurrencyProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}