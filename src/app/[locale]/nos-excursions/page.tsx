"use client";

import Header from '@/components/sections/header';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from '@/lib/i18n/hooks';

export default function NosExcursionsPage() {
  const locale = useLocale();
  const t = useTranslations();
  
  const excursionCategories = [
    {
      id: 1,
      title: t('excursionsPage.categories.marrakech.title'),
      href: "/marrakech",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/9954d743-8735-4b3b-868c-4bb1cfd3cbf8/generated_images/spectacular-view-of-marrakech-morocco-vi-83509ed4-20251124020921.jpg",
      description: t('excursionsPage.categories.marrakech.description')
    },
    {
      id: 2,
      title: t('excursionsPage.categories.agadir.title'),
      href: "/agadir",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/9954d743-8735-4b3b-868c-4bb1cfd3cbf8/generated_images/beautiful-agadir-beach-coastline-morocco-08392506-20251124020921.jpg",
      description: t('excursionsPage.categories.agadir.description')
    },
    {
      id: 3,
      title: t('excursionsPage.categories.circuits.title'),
      href: "/circuits",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/9954d743-8735-4b3b-868c-4bb1cfd3cbf8/generated_images/moroccan-desert-circuit-route-map-camel--94b81e3f-20251124020921.jpg",
      description: t('excursionsPage.categories.circuits.description')
    },
    {
      id: 6,
      title: t('excursionsPage.categories.taghazout.title'),
      href: "/taghazout",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/9954d743-8735-4b3b-868c-4bb1cfd3cbf8/generated_images/taghazout-surf-village-morocco-picturesq-30cd958b-20251124020921.jpg",
      description: t('excursionsPage.categories.taghazout.description')
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
          <Image
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/9954d743-8735-4b3b-868c-4bb1cfd3cbf8/generated_images/wide-panoramic-view-of-diverse-moroccan--39051fac-20251124133346.jpg"
            alt={t('excursionsPage.hero.title')}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-4xl md:text-6xl font-display font-light mb-4">{t('excursionsPage.hero.title')}</h1>
              <p className="text-lg md:text-xl font-body max-w-2xl mx-auto">
                {t('excursionsPage.hero.description')}
              </p>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-16 md:py-24 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h6 className="text-xs font-bold uppercase tracking-[2px] text-muted mb-4">
                {t('excursionsPage.categories.subtitle')}
              </h6>
              <h2 className="text-3xl md:text-4xl font-display text-foreground">
                {t('excursionsPage.categories.title')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {excursionCategories.map((category) => (
                <Link 
                  key={category.id} 
                  href={`/${locale}${category.href}`}
                  className="group block bg-white rounded-lg overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="relative h-[300px] overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl md:text-3xl font-display mb-2">
                        {category.title}
                      </h3>
                      <p className="text-sm md:text-base opacity-90">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  <div className="p-6 flex items-center justify-between">
                    <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                      {t('excursionsPage.categories.discover')}
                    </span>
                    <svg 
                      className="w-5 h-5 text-primary transition-transform group-hover:translate-x-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-secondary">
          <div className="max-w-4xl mx-auto text-center px-4">
            <p className="font-script italic text-2xl md:text-3xl text-primary mb-8">
              {t('excursionsPage.cta.quote')}
            </p>
            <a 
              href={`/${locale}/reservation`}
              className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded text-sm font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors"
            >
              {t('excursionsPage.cta.bookNow')}
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}