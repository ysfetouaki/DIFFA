"use client";

import React from 'react';
import {
  Car,
  Users,
  MapPin,
  Camera,
  Globe,
  Compass,
  Hotel,
  Headphones,
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import { useTranslations } from '@/lib/i18n/hooks';

interface Amenity {
  icon: React.ComponentType<LucideProps>;
  labelKey: string;
}

const AmenitiesGrid = () => {
  const t = useTranslations();
  
  const amenities: Amenity[] = [
    { icon: Car, labelKey: 'amenities.transport' },
    { icon: Users, labelKey: 'amenities.guides' },
    { icon: MapPin, labelKey: 'amenities.circuits' },
    { icon: Camera, labelKey: 'amenities.visits' },
    { icon: Globe, labelKey: 'amenities.destinations' },
    { icon: Compass, labelKey: 'amenities.adventures' },
    { icon: Hotel, labelKey: 'amenities.hotels' },
    { icon: Headphones, labelKey: 'amenities.support' },
  ];

  return (
    <section className="bg-background py-20 lg:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h6 className="text-xs font-bold uppercase tracking-[2px] font-secondary text-[#FFB73F]">
            {t('amenities.subtitle')}
          </h6>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {amenities.map((amenity, index) => {
            const IconComponent = amenity.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center p-8">
                <IconComponent className="h-12 w-12 text-[#FFB73F]" strokeWidth={2} />
                <p className="mt-4 text-base font-body text-[#2C2C2C]">
                  {t(amenity.labelKey)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AmenitiesGrid;