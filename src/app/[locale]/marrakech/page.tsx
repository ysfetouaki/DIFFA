'use client';

import Header from '@/components/sections/header';
import Image from 'next/image';
import { ActivityGridWithCalendar } from '@/components/ActivityGridWithCalendar';
import { useTranslations } from '@/lib/i18n/hooks';
import { useState, useEffect } from 'react';

// Helper function to validate image URLs
const getValidImageUrl = (imageUrl: string): string => {
  if (!imageUrl || imageUrl === 'test' || imageUrl.trim() === '') {
    return 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=800&q=80';
  }
  
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  if (imageUrl.startsWith('/')) {
    return imageUrl;
  }
  
  return 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=800&q=80';
};

export default function MarrakechPage() {
  const t = useTranslations();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPrice, setShowPrice] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch excursions
        const excursionsResponse = await fetch('/api/excursions');
        if (!excursionsResponse.ok) {
          throw new Error('Failed to fetch excursions');
        }
        const excursionsResult = await excursionsResponse.json();
        const excursions = excursionsResult.data || [];
        
        // Fetch price visibility settings
        const settingsResponse = await fetch('/api/excursion-settings');
        if (settingsResponse.ok) {
          const settings = await settingsResponse.json();
          const marrakechSetting = settings.find((s: any) => s.section === 'marrakech');
          if (marrakechSetting) {
            setShowPrice(marrakechSetting.showPrice);
          }
        }
        
        // Filter excursions by location (MARRAKECH) or section
        const marrakechActivities = excursions
          .filter((excursion: any) => {
            const location = excursion.location?.toLowerCase() || '';
            const section = excursion.section?.toLowerCase() || '';
            
            // Check for both correct spelling and common typos
            return location.includes('marrakech') || 
                   location.includes('marrackech') || 
                   section.includes('marrakech');
          })
          .map((excursion: any) => {
            const rawImage = excursion.images?.[0] || excursion.image || '';
            return {
              id: excursion.id,
              name: excursion.name,
              image: getValidImageUrl(rawImage),
              priceMAD: excursion.priceMAD,
              location: excursion.location,
              productId: excursion.id,
              productSlug: excursion.id
            };
          });
        
        setActivities(marrakechActivities);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
          <Image
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/9954d743-8735-4b3b-868c-4bb1cfd3cbf8/generated_images/spectacular-view-of-marrakech-morocco-vi-83509ed4-20251124020921.jpg"
            alt={t('marrakechPage.hero.title')}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-4xl md:text-6xl font-display font-light mb-4">{t('marrakechPage.hero.title')}</h1>
              <p className="text-lg md:text-xl font-body max-w-2xl mx-auto">
                {t('marrakechPage.hero.description')}
              </p>
            </div>
          </div>
        </section>

        {/* Activity Grid with Calendar Sidebar */}
        <section className="py-16 md:py-24 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted">{t('common.loading')}</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">{error}</p>
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted">{t('excursions.noResults')}</p>
              </div>
            ) : (
              <ActivityGridWithCalendar 
                activities={activities}
                categoryName="Marrakech"
                showPrice={showPrice}
              />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}