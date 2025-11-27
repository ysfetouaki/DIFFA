"use client";

import { Link } from "@/i18n/routing";
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MapPin, Clock, Users, Star } from "lucide-react";
import { useTranslations, useLocale } from '@/lib/i18n/hooks';
import type { LucideIcon } from "lucide-react";

type Feature = {
  icon: LucideIcon;
  text: string;
};

const RoomsSuites = () => {
  const locale = useLocale();
  const t = useTranslations();
  
  const toursData = [
    {
      title: t('excursions.tours.ourika.title'),
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9954d743-8735-4b3b-868c-4bb1cfd3cbf8-palaisriadberbere-com/assets/images/2-1-1-8.avif",
      features: [
        { icon: MapPin, text: t('excursions.features.location') },
        { icon: Clock, text: t('excursions.features.fullDay') },
        { icon: Users, text: t('excursions.features.group') },
      ],
      description: t('excursions.tours.ourika.description')
    },
    {
      title: t('excursions.tours.quad.title'),
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9954d743-8735-4b3b-868c-4bb1cfd3cbf8-palaisriadberbere-com/assets/images/Design-sans-titre-70-370x463-5.png",
      features: [
        { icon: MapPin, text: t('excursions.features.agadir') },
        { icon: Clock, text: t('excursions.features.threeHours') },
        { icon: Star, text: t('excursions.features.popular') },
      ],
      description: t('excursions.tours.quad.description')
    },
    {
      title: t('excursions.tours.imperial.title'),
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9954d743-8735-4b3b-868c-4bb1cfd3cbf8-palaisriadberbere-com/assets/images/1-9.avif",
      features: [
        { icon: MapPin, text: t('excursions.features.multiCity') },
        { icon: Clock, text: t('excursions.features.sevenDays') },
        { icon: Users, text: t('excursions.features.private') },
      ],
      description: t('excursions.tours.imperial.description')
    }
  ];

  return (
    <section className="bg-background py-[110px]">
      <div className="container mx-auto max-w-[1200px] lg:px-[80px] px-5">
        <div className="relative mb-16">
          <div className="text-center">
            <h6 className="text-[12px] font-bold uppercase tracking-[2px] text-[#FFB73F]">
              {t('excursions.subtitle')}
            </h6>
            <h3 className="font-display text-[36px] text-[#2C2C2C] mt-4">
              {t('excursions.title')}
            </h3>
          </div>
          <Link
            href={`/${locale}/nos-excursions`}
            className="absolute top-[8px] right-0 hidden lg:inline-block bg-[#FFB73F] text-white px-[25px] py-[18px] text-[14px] font-medium rounded-[2px] hover:bg-primary transition-colors duration-300"
          >
            {t('excursions.viewAll')}
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {toursData.map((tour, index) => (
            <div key={index} className="bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-2 group">
              <div className="relative h-[280px]">
                <Image
                  src={tour.image}
                  alt={tour.title}
                  layout="fill"
                  objectFit="cover"
                  className="w-full h-full"
                />
              </div>
              <div className="p-8 flex flex-col">
                <h5 className="font-display text-[18px] font-medium leading-[1.3] text-[#2C2C2C] mb-5 min-h-[48px]">
                  {tour.title}
                </h5>
                <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#5c5c5c] mb-5 border-b border-border pb-5">
                  {tour.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                       <feature.icon size={18} className="text-[#FFB73F]" />
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-[#5c5c5c] leading-[1.5] mb-5 h-[105px] overflow-hidden">
                  {tour.description}
                </p>
                <a href={`/${locale}/contact`} className="text-sm font-semibold text-[#2C2C2C] hover:text-primary transition-colors mt-auto">
                  {t('excursions.learnMore')} &gt;
                </a>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center items-center gap-2 mt-16">
            <span className="w-2.5 h-2.5 bg-[#FFB73F] rounded-full cursor-pointer"></span>
            <span className="w-2.5 h-2.5 bg-[#d9d9d9] rounded-full cursor-pointer hover:bg-[#FFB73F]/80 transition-colors"></span>
            <span className="w-2.5 h-2.5 bg-[#d9d9d9] rounded-full cursor-pointer hover:bg-[#FFB73F]/80 transition-colors"></span>
            <span className="w-2.5 h-2.5 bg-[#d9d9d9] rounded-full cursor-pointer hover:bg-[#FFB73F]/80 transition-colors"></span>
        </div>

      </div>
    </section>
  );
};

export default RoomsSuites;