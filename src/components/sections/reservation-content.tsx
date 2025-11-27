'use client';

import React, { useState, useEffect } from "react";
import { useTranslations } from '@/lib/i18n/hooks';
import { useCurrency } from "@/contexts/CurrencyContext";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { ChevronLeft, ChevronRight, MapPin, Clock, Users } from 'lucide-react';

interface Tour {
  id: number;
  title: string;
  duration: string;
  nights: string;
  price: number;
  image: string;
  category: string;
}

const toursData: Tour[] = [
  {
    id: 1,
    title: "IMPERIAL CITIES 8 DAYS / 7 NIGHTS",
    duration: "8 DAYS",
    nights: "7 NIGHTS",
    price: 6750.00,
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/9954d743-8735-4b3b-868c-4bb1cfd3cbf8/generated_images/moroccan-desert-circuit-route-map-camel--94b81e3f-20251124020921.jpg",
    category: "circuits"
  },
  {
    id: 2,
    title: "THE GATEWAY TO THE DESERT 5 DAYS / 5 NIGHTS",
    duration: "5 DAYS",
    nights: "5 NIGHTS",
    price: 6500.00,
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/9954d743-8735-4b3b-868c-4bb1cfd3cbf8/generated_images/moroccan-sahara-desert-adventure-off-roa-54eb8f40-20251124020921.jpg",
    category: "circuits"
  },
  {
    id: 3,
    title: "BIG TOUR OF MAROKKO 13DAYS / 12NIGHTS",
    duration: "13 DAYS",
    nights: "12 NIGHTS",
    price: 10350.00,
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/9954d743-8735-4b3b-868c-4bb1cfd3cbf8/generated_images/spectacular-view-of-marrakech-morocco-vi-83509ed4-20251124020921.jpg",
    category: "circuits"
  },
  {
    id: 4,
    title: "THE GREAT SOUTH OF MAROCCO 8DAYS / 7NIGHTS",
    duration: "8 DAYS",
    nights: "7 NIGHTS",
    price: 6750.00,
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/9954d743-8735-4b3b-868c-4bb1cfd3cbf8/generated_images/atlas-mountains-morocco-travel-dramatic--8a07ba08-20251124020921.jpg",
    category: "marrakech"
  },
  {
    id: 5,
    title: "THE SOUTH OF MOROCCO IN 4X4 8DAYS / 7NIGHTS",
    duration: "8 DAYS",
    nights: "7 NIGHTS",
    price: 7450.00,
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/9954d743-8735-4b3b-868c-4bb1cfd3cbf8/generated_images/moroccan-sahara-desert-adventure-off-roa-54eb8f40-20251124020921.jpg",
    category: "agadir"
  },
  {
    id: 6,
    title: "TOUR IMPERIAL 8DAYS / 7NIGHTS",
    duration: "8 DAYS",
    nights: "7 NIGHTS",
    price: 6750.00,
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/9954d743-8735-4b3b-868c-4bb1cfd3cbf8/generated_images/moroccan-cultural-heritage-traditional-m-9fd652f0-20251124020921.jpg",
    category: "circuits"
  }
];

export default function ReservationContent() {
  const t = useTranslations();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10450 });
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 10)); // November 2025

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const filteredTours = toursData.filter(
    tour => tour.price >= priceRange.min && tour.price <= priceRange.max
  );

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-[330px_1fr] gap-8">
        {/* Left Sidebar - Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-24">
          <div className="mb-8">
            <button className="text-primary font-semibold text-sm hover:text-primary/80 transition-colors">
              {t('reservationPage.clearFilter')}
            </button>
          </div>

          {/* Calendar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <button onClick={previousMonth} className="p-1 hover:bg-gray-100 rounded">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="font-semibold text-base">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {[
                t('days.monday'),
                t('days.tuesday'),
                t('days.wednesday'),
                t('days.thursday'),
                t('days.friday'),
                t('days.saturday'),
                t('days.sunday')
              ].map((day, idx) => (
                <div key={idx} className="text-center text-xs font-semibold py-2 uppercase">
                  {day.substring(0, 3)}
                </div>
              ))}
              
              {Array.from({ length: startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1 }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isWeekend = ((startingDayOfWeek + i) % 7 === 0) || ((startingDayOfWeek + i) % 7 === 6);
                
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
                    className={`
                      text-center py-2 text-sm rounded hover:bg-accent/20 transition-colors
                      ${isWeekend ? 'text-red-500' : 'text-foreground'}
                      ${selectedDate?.getDate() === day ? 'bg-accent text-white' : ''}
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-base">{t('reservationPage.price')}</h3>
              <button className="text-primary text-sm hover:text-primary/80">{t('reservationPage.ok')}</button>
            </div>

            <div className="relative pt-6 pb-4">
              <Slider
                min={0}
                max={10450}
                step={50}
                value={[priceRange.max]}
                onValueChange={(value) => setPriceRange({ ...priceRange, max: value[0] })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between mt-4 text-sm">
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                />
                <span className="mx-2">-</span>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 10450 })}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Content - Tours Grid */}
        <div>
          <div className="mb-8">
            <h1 className="text-3xl font-display font-light mb-2">{t('reservationPage.title')}</h1>
            <p className="text-muted">{t('reservationPage.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTours.map((tour) => (
              <div
                key={tour.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-[250px]">
                  <Image
                    src={tour.image}
                    alt={tour.title}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
                    {tour.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-sm text-muted mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{tour.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{tour.nights}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary">
                      {tour.price.toFixed(2)} DHS
                    </div>
                    <button className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90 transition-colors text-sm font-semibold">
                      {t('common.bookNow')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTours.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted text-lg">{t('reservationPage.noTours')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}