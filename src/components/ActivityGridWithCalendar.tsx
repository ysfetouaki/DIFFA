'use client';

import { useState } from 'react';
import { Calendar, Clock, Users } from 'lucide-react';
import { useTranslations } from '@/lib/i18n/hooks';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface Activity {
  id: string;
  name: string;
  image: string;
  priceMAD: number;
  location: string;
  productId?: number;
  productSlug?: string;
}

interface ActivityGridWithCalendarProps {
  activities: Activity[];
  categoryName: string;
  showPrice?: boolean;
}

// Helper function to validate and get proper image URL
const getValidImageUrl = (imageUrl: string): string => {
  if (!imageUrl || imageUrl === 'test' || imageUrl.trim() === '') {
    // Return placeholder image
    return 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=800&q=80';
  }
  
  // Check if it's a valid absolute URL
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Check if it starts with a leading slash
  if (imageUrl.startsWith('/')) {
    return imageUrl;
  }
  
  // If none of the above, return placeholder
  return 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=800&q=80';
};

export const ActivityGridWithCalendar = ({ activities, categoryName, showPrice = true }: ActivityGridWithCalendarProps) => {
  const t = useTranslations();
  const { formatPrice } = useCurrency();
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1080]);

  const monthNames = [
    t('months.january'), t('months.february'), t('months.march'),
    t('months.april'), t('months.may'), t('months.june'),
    t('months.july'), t('months.august'), t('months.september'),
    t('months.october'), t('months.november'), t('months.december')
  ];

  const dayAbbreviations = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7;

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToCurrentMonth = () => {
    setCurrentDate(new Date());
  };

  const goToNextYear = () => {
    setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth()));
  };

  const isDatePast = (date: Date | null) => {
    if (!date) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
  };

  const isSameDay = (date1: Date | null, date2: Date | null) => {
    if (!date1 || !date2) return false;
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isWeekend = (date: Date | null) => {
    if (!date) return false;
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const clearFilters = () => {
    setSelectedDate(null);
    setPriceRange([0, 1080]);
  };

  const formatDateForURL = (date: Date | null) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleActivityClick = (activity: Activity) => {
    if (!activity.id) return;
    
    // Navigate to internal excursion detail page
    router.push(`/${locale}/excursion/${activity.id}`);
  };

  const days = getDaysInMonth(currentDate);

  // Filter activities based on price range (only if showPrice is true)
  const filteredActivities = showPrice 
    ? activities.filter(activity => activity.priceMAD >= priceRange[0] && activity.priceMAD <= priceRange[1])
    : activities;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Filter */}
      <aside className="w-full lg:w-80 flex-shrink-0">
        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
          {/* Clear Filter Button */}
          <button
            onClick={clearFilters}
            className="w-full text-left text-sm text-muted hover:text-foreground transition-colors mb-6"
          >
            {t('reservationPage.clearFilter')}
          </button>

          {/* Calendar */}
          <div className="mb-6">
            {/* Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={goToCurrentMonth}
                className="text-xs hover:text-primary transition-colors"
                title="Go to current month"
              >
                «
              </button>
              <button
                onClick={goToPreviousMonth}
                className="p-1 hover:bg-secondary rounded transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h5 className="text-sm font-semibold text-foreground">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h5>
              <button
                onClick={goToNextMonth}
                className="p-1 hover:bg-secondary rounded transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={goToNextYear}
                className="text-xs hover:text-primary transition-colors"
                title="Go to next year"
              >
                »
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayAbbreviations.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold text-foreground py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => (
                <button
                  key={index}
                  disabled={!day || isDatePast(day)}
                  onClick={() => {
                    if (day) {
                      setSelectedDate(isSameDay(day, selectedDate) ? null : day);
                    }
                  }}
                  className={`
                    aspect-square p-1 text-xs rounded transition-all text-center
                    ${!day ? 'invisible' : ''}
                    ${isDatePast(day) ? 'text-muted/30 cursor-not-allowed' : 'hover:bg-secondary cursor-pointer'}
                    ${isWeekend(day) && !isDatePast(day) ? 'text-destructive font-semibold' : 'text-foreground'}
                    ${isSameDay(day, selectedDate) ? 'bg-primary text-white hover:bg-primary font-bold' : ''}
                  `}
                >
                  {day?.getDate()}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider - Only show if prices are visible */}
          {showPrice && (
            <div className="border-t border-border pt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-foreground">{t('reservationPage.price')}</span>
                <button
                  onClick={() => setPriceRange([0, 1080])}
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  {t('reservationPage.ok')}
                </button>
              </div>
              
              <div className="relative mb-6">
                <input
                  type="range"
                  min="0"
                  max="1080"
                  step="10"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="absolute w-full h-2 bg-transparent appearance-none z-20 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#4ade80] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-[18px] [&::-moz-range-thumb]:h-[18px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#4ade80] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
                />
                <input
                  type="range"
                  min="0"
                  max="1080"
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="absolute w-full h-2 bg-transparent appearance-none z-20 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#4ade80] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-[18px] [&::-moz-range-thumb]:h-[18px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#4ade80] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
                />
                <div className="relative w-full h-2 bg-border rounded-full">
                  <div
                    className="absolute h-2 bg-primary rounded-full"
                    style={{
                      left: `${(priceRange[0] / 1080) * 100}%`,
                      right: `${100 - (priceRange[1] / 1080) * 100}%`,
                    }}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground font-semibold">{priceRange[0]}</span>
                <span className="text-muted">-</span>
                <span className="text-foreground font-semibold">{priceRange[1]}</span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Activities Grid */}
      <main className="flex-1">
        {filteredActivities.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-muted text-lg">{t('reservationPage.noTours')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                onClick={() => handleActivityClick(activity)}
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={getValidImageUrl(activity.image)}
                    alt={activity.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-foreground uppercase tracking-wider">
                      {activity.location}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2 min-h-[3.5rem]">
                    {activity.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    {showPrice ? (
                      <div>
                        <p className="text-2xl font-bold text-foreground">
                          {formatPrice(activity.priceMAD)}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-muted italic">
                          {locale === 'fr' ? 'Prix sur demande' : 'Price on request'}
                        </p>
                      </div>
                    )}
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleActivityClick(activity);
                      }}
                    >
                      {t('common.book_now')}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};