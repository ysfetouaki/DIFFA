"use client";

import React from "react";
import { Quote } from "lucide-react";
import { useTranslations } from '@/lib/i18n/hooks';

const TestimonialSection = () => {
  const t = useTranslations();
  
  return (
    <section className="relative bg-[#1A1A1A] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 flex flex-col items-center justify-center px-8 py-[100px] text-center text-white">
        <h6 className="font-secondary text-xs font-bold uppercase tracking-[2px]">
          {t('testimonial.subtitle')}
        </h6>
        
        <blockquote className="relative my-6 max-w-[700px]">
          <span className="absolute -top-4 -left-2 font-display text-7xl opacity-30 sm:-left-8">"</span>
          <p className="font-display leading-[1.6] [font-size:clamp(1.5rem,2.5vw,1.75rem)]">
            {t('testimonial.quote')}
          </p>
          <span className="absolute -bottom-10 -right-2 font-display text-7xl opacity-30 sm:-right-8">"</span>
        </blockquote>

        <div className="text-xl tracking-widest text-[#FFB73F]">
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;