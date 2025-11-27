"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from '@/lib/i18n/hooks';

const PropertyPhotos = () => {
  const t = useTranslations();
  
  return (
    <section className="bg-white py-[60px] px-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative aspect-[4/3]">
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9954d743-8735-4b3b-868c-4bb1cfd3cbf8-palaisriadberbere-com/assets/images/le-riad-berbere-16.jpg"
              alt="Outdoor garden view with a bench and pool at Palais Riad Berbère"
              fill
              className="object-cover rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
            />
          </div>
          <div className="relative aspect-[4/3]">
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9954d743-8735-4b3b-868c-4bb1cfd3cbf8-palaisriadberbere-com/assets/images/467974431_18010777751650637_8490939350574355602_n--14.jpg"
              alt="Interior of a spa with arches and a red carpet at Palais Riad Berbère"
              fill
              className="object-cover rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
            />
          </div>
        </div>
        <div className="text-center pt-10 lg:pt-14">
          <p className="font-script italic text-[22px] text-[#6B5D4F] leading-tight">
            {t('propertyPhotos.quote')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default PropertyPhotos;