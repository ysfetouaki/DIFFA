"use client";

import Image from "next/image";
import { useTranslations } from '@/lib/i18n/hooks';

const Hero = () => {
  const t = useTranslations();
  
  return (
    <section className="relative flex items-center justify-center min-h-screen text-white">
      <div className="absolute inset-0">
        <Image
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/9954d743-8735-4b3b-868c-4bb1cfd3cbf8/generated_images/stunning-wide-panoramic-view-of-moroccan-948b1144-20251123184351.jpg"
          alt={t('hero.title')}
          fill
          style={{ objectFit: "cover" }}
          quality={100}
          priority
          className="z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/50 z-10" />
      </div>

      <div className="relative z-20 text-center px-4 animate-fadeInDown">
        <div className="border border-white/75 p-6 md:p-10">
          <h1
            className="font-display text-white text-[36px] md:text-[72px] leading-tight font-normal"
            style={{ textShadow: "0 1px 1px rgba(0, 0, 0, 0.3)" }}
          >
            {t('hero.title')}
          </h1>
          <p className="font-display text-white text-xl md:text-2xl font-light mt-4">
            {t('hero.subtitle')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;