"use client";

import Image from "next/image";
import { useTranslations } from '@/lib/i18n/hooks';

const WelcomeIntro = () => {
  const t = useTranslations();
  
  return (
    <section className="bg-white py-12 px-6 text-center md:py-20 md:px-8">
      <div className="mx-auto max-w-[900px]">
        <h6 className="font-secondary mb-4 text-xs font-bold uppercase tracking-[2px] text-primary">
          {t('welcome.subtitle')}
        </h6>
        <h2 className="font-display mb-6 text-[36px] font-normal leading-[1.4] text-foreground md:text-[42px]">
          {t('welcome.title')}
        </h2>
        <p className="font-body text-base leading-[1.8] text-muted md:text-lg">
          {t('welcome.description')}
        </p>
      </div>
    </section>
  );
};

export default WelcomeIntro;