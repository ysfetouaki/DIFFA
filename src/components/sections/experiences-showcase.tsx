'use client';

import React from "react";
import Image from "next/image";
import { useTranslations, useLocale } from '@/lib/i18n/hooks';

interface ExperienceCardProps {
  imgSrc: string;
  title: string;
  description: string;
  isMiddleCard: boolean;
  locale: string;
}

const ExperienceCard = ({ imgSrc, title, description, isMiddleCard, locale }: ExperienceCardProps) => {
  const imageHeightClass = isMiddleCard ? 'h-[466px]' : 'h-[373px]';
  const t = useTranslations();

  return (
    <div className="flex flex-col items-center md:items-start text-center md:text-left">
      <div className="bg-white p-2 w-full">
        <div className={`relative w-full ${imageHeightClass}`}>
          <Image
            src={imgSrc}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 373px" />
        </div>
      </div>
      <h5 className="mt-8 text-xl text-white font-semibold font-display">{title}</h5>
      <p className="mt-4 text-sm text-white/90">
        {description}
      </p>
      <a href={`/${locale}/contact`} className="mt-6 text-sm text-white underline hover:text-accent transition-colors">
        {t('common.readMore')}
      </a>
    </div>);
};


const ExperiencesShowcase = () => {
  const t = useTranslations();
  const locale = useLocale();

  const experiencesData = [
  {
    imgSrc: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/9954d743-8735-4b3b-868c-4bb1cfd3cbf8/generated_images/atlas-mountains-morocco-travel-dramatic--8a07ba08-20251124020921.jpg",
    title: t('experiences.atlas.title'),
    description: t('experiences.atlas.description')
  },
  {
    imgSrc: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/9954d743-8735-4b3b-868c-4bb1cfd3cbf8/generated_images/moroccan-sahara-desert-adventure-off-roa-54eb8f40-20251124020921.jpg",
    title: t('experiences.desert.title'),
    description: t('experiences.desert.description')
  },
  {
    imgSrc: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/9954d743-8735-4b3b-868c-4bb1cfd3cbf8/generated_images/moroccan-cultural-heritage-traditional-m-9fd652f0-20251124020921.jpg",
    title: t('experiences.cultural.title'),
    description: t('experiences.cultural.description')
  }];


  const bgImage = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/9954d743-8735-4b3b-868c-4bb1cfd3cbf8/generated_images/breathtaking-moroccan-travel-scene-showi-74294209-20251123184351.jpg";

  return (
    <section
      className="relative bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url('${bgImage}')` }}>

      <div className="absolute inset-0 bg-black/70" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-[1200px] px-8 py-20 lg:py-28">
        <div className="text-center mb-16 lg:mb-20">
          <h6 className="font-secondary text-xs font-bold uppercase tracking-[2px] text-primary">
            {t('experiences.subtitle')}
          </h6>
          <h2 className="mt-4 font-display text-[36px] md:text-[42px] leading-tight max-w-3xl mx-auto text-white">
            {t('experiences.title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
          {experiencesData.map((exp, index) =>
          <ExperienceCard
            key={exp.title}
            imgSrc={exp.imgSrc}
            title={exp.title}
            description={exp.description}
            isMiddleCard={index === 1}
            locale={locale} />
          )}
        </div>
      </div>
    </section>);
};

export default ExperiencesShowcase;