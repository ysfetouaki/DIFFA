"use client";

import React, { useState } from "react";
import { useTranslations } from '@/lib/i18n/hooks';
import { Mail } from "lucide-react";

const Newsletter = () => {
  const t = useTranslations();
  const backgroundImageUrl = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/9954d743-8735-4b3b-868c-4bb1cfd3cbf8/generated_images/stunning-wide-panoramic-view-of-moroccan-948b1144-20251123184351.jpg";

  return (
    <section
      className="relative bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}>

      <div className="absolute inset-0 bg-black/75" />
      <div className="relative isolate px-8 py-20">
        <div className="container mx-auto">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
            <div className="lg:w-3/5">
              <h6 className="font-secondary text-xs font-bold uppercase tracking-[2px] !text-white">
                {t('newsletter.subtitle')}
              </h6>
              <h3 className="mt-4 max-w-[500px] font-display text-[28px] font-normal leading-tight lg:text-[32px] lg:!text-white">
                {t('newsletter.title')}
              </h3>
            </div>
            <div className="w-full lg:w-2/5">
              <form
                className="flex w-full flex-col gap-4 lg:ml-auto lg:max-w-[400px]"
                onSubmit={(e) => e.preventDefault()}>

                <input
                  type="email"
                  placeholder={t('newsletter.emailPlaceholder')}
                  className="h-auto w-full rounded-[4px] border-0 bg-white px-5 py-[14px] font-body text-base text-foreground placeholder:text-muted/80 focus:outline-none focus:ring-2 focus:ring-ring"
                  aria-label="Email for newsletter" />

                <button
                  type="submit"
                  className="h-auto w-full rounded-[4px] border-0 bg-[#FFB73F] px-8 py-[14px] text-base font-medium text-white transition-colors hover:bg-[#e69d1a]">

                  {t('newsletter.subscribe')} &gt;
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>);

};

export default Newsletter;