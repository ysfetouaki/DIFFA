'use client';

import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from '@/lib/i18n/hooks';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/sections/header';
import Image from 'next/image';
import { Calendar, MapPin, Clock, Users, Star, ArrowLeft, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

export default function ExcursionDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const locale = params.locale as string;
  const t = useTranslations();
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const router = useRouter();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  const [ageGroups, setAgeGroups] = useState({
    '0-4': 0,
    '4-12': 0,
    'adult': 1
  });
  const [excursion, setExcursion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPrice, setShowPrice] = useState(true);

  // Fetch excursion data from API
  useEffect(() => {
    const fetchExcursion = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/excursions/${slug}`);
        
        if (!response.ok) {
          throw new Error('Excursion not found');
        }
        
        const result = await response.json();
        setExcursion(result.data);
        
        // Fetch price visibility settings
        const settingsResponse = await fetch('/api/excursion-settings');
        if (settingsResponse.ok) {
          const settings = await settingsResponse.json();
          const section = result.data.section?.toLowerCase();
          const setting = settings.find((s: any) => s.section === section);
          if (setting) {
            setShowPrice(setting.showPrice);
          }
        }
        
        // Initialize selected items
        if (result.data.items) {
          const initial: Record<string, boolean> = {};
          result.data.items.forEach((item: any) => {
            initial[item.id] = item.defaultChecked;
          });
          setSelectedItems(initial);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchExcursion();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 pt-32 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !excursion) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 pt-32 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-display mb-4">{t('excursionDetail.notFound.title')}</h1>
            <p className="text-muted mb-6">{t('excursionDetail.notFound.description')}</p>
            <Button onClick={() => router.push(`/${locale}/nos-excursions`)}>
              {locale === 'fr' ? 'Voir les excursions' : 'View Excursions'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const calculateTotal = () => {
    // Calculate base price per person type
    const totalPeople = ageGroups['0-4'] + ageGroups['4-12'] + ageGroups['adult'];
    
    if (totalPeople === 0) return 0;
    
    // Base price for all adults (children might have different pricing in future)
    let baseTotal = excursion.priceMAD * ageGroups['adult'];
    
    // Add children pricing (same as adult for now)
    baseTotal += excursion.priceMAD * ageGroups['4-12'];
    baseTotal += excursion.priceMAD * ageGroups['0-4'];
    
    // Add selected extra items cost
    let extrasTotal = 0;
    excursion.items?.forEach((item: any) => {
      if (selectedItems[item.id]) {
        extrasTotal += item.price * totalPeople;
      }
    });
    
    return baseTotal + extrasTotal;
  };

  const handleAddToCart = () => {
    if (!selectedDate) {
      toast.error(t('excursionDetail.pleaseSelectDate'));
      return;
    }
    
    const totalPeople = ageGroups['0-4'] + ageGroups['4-12'] + ageGroups['adult'];
    if (totalPeople === 0) {
      toast.error(locale === 'fr' ? 'Veuillez sélectionner au moins une personne' : 'Please select at least one person');
      return;
    }
    
    const selectedItemsList = excursion.items
      ?.filter((item: any) => selectedItems[item.id])
      .map((item: any) => ({
        id: item.id,
        label: item.label,
        price: item.price
      })) || [];
    
    const cartItem = {
      id: `${excursion.id}-${Date.now()}`,
      excursionId: excursion.id,
      excursionName: excursion.name,
      excursionImage: excursion.images[0],
      date: selectedDate,
      selectedItems: selectedItemsList,
      ageGroups: { ...ageGroups },
      priceMAD: excursion.priceMAD,
      total: calculateTotal()
    };
    
    addToCart(cartItem);
    toast.success(t('excursionDetail.addedToCart'));
    
    // Redirect to cart page
    router.push(`/${locale}/cart`);
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? excursion.images.length - 1 : prev - 1
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === excursion.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-foreground hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">{t('excursionDetail.backButton')}</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Image Gallery */}
            <div>
              {/* Main Image */}
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4 bg-secondary">
                <Image
                  src={excursion.images[currentImageIndex]}
                  alt={excursion.name}
                  fill
                  className="object-cover"
                  priority
                />
                {excursion.images.length > 1 && (
                  <>
                    <button
                      onClick={goToPreviousImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={goToNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Navigation */}
              {excursion.images.length > 1 && (
                <div className="flex gap-2 justify-center">
                  {excursion.images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? 'border-primary'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${excursion.name} - ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side - Booking Form */}
            <div className="bg-[#e8f4f8] rounded-lg p-6">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {excursion.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= excursion.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Price */}
              {showPrice ? (
                <div className="mb-6">
                  <div className="text-3xl font-bold text-foreground">
                    {formatPrice(excursion.priceMAD)}
                    <span className="text-sm font-normal text-muted ml-2">
                      {locale === 'fr' ? 'par personne' : 'per person'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <div className="text-lg font-semibold text-foreground italic">
                    {locale === 'fr' ? 'Prix sur demande' : 'Price on request'}
                  </div>
                  <p className="text-sm text-muted mt-1">
                    {locale === 'fr' ? 'Contactez-nous pour plus d\'informations' : 'Contact us for more information'}
                  </p>
                </div>
              )}

              {/* Item Selection */}
              {excursion.items && excursion.items.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-semibold mb-3 text-[#4a9fb8]">
                    {t('excursionDetail.selectMoreItems')}
                  </p>
                  <div className="space-y-3">
                    {excursion.items.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-2">
                        <Checkbox
                          id={item.id}
                          checked={selectedItems[item.id] || false}
                          onCheckedChange={(checked) =>
                            setSelectedItems((prev) => ({
                              ...prev,
                              [item.id]: checked as boolean
                            }))
                          }
                        />
                        <label
                          htmlFor={item.id}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {item.label} {showPrice && `(${formatPrice(item.price)})`}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Number of People */}
              <div className="mb-6">
                <p className="text-sm font-semibold mb-3">{t('excursionDetail.numberOfPeople')}</p>
                
                <div className="space-y-4">
                  {/* Adults */}
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      {t('excursionDetail.ageGroups.adult')} (12+ {locale === 'fr' ? 'ans' : 'years'})
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={ageGroups['adult']}
                      onChange={(e) =>
                        setAgeGroups((prev) => ({
                          ...prev,
                          adult: Math.max(0, parseInt(e.target.value) || 0)
                        }))
                      }
                      className="w-full px-3 py-2 border border-border rounded-md"
                    />
                  </div>

                  {/* Children 4-12 */}
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      {t('excursionDetail.ageGroups.child')} (4-12 {locale === 'fr' ? 'ans' : 'years'})
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={ageGroups['4-12']}
                      onChange={(e) =>
                        setAgeGroups((prev) => ({
                          ...prev,
                          '4-12': Math.max(0, parseInt(e.target.value) || 0)
                        }))
                      }
                      className="w-full px-3 py-2 border border-border rounded-md"
                    />
                  </div>

                  {/* Babies 0-4 */}
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      {t('excursionDetail.ageGroups.baby')} (0-4 {locale === 'fr' ? 'ans' : 'years'})
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={ageGroups['0-4']}
                      onChange={(e) =>
                        setAgeGroups((prev) => ({
                          ...prev,
                          '0-4': Math.max(0, parseInt(e.target.value) || 0)
                        }))
                      }
                      className="w-full px-3 py-2 border border-border rounded-md"
                    />
                  </div>
                </div>
              </div>

              {/* Date Selection */}
              <div className="mb-6">
                <label className="text-sm font-semibold block mb-2">
                  {t('excursionDetail.dateOfBooking')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Total Price Display */}
              {showPrice && (
                <div className="mb-4 p-4 bg-white rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{locale === 'fr' ? 'Prix total' : 'Total Price'}:</span>
                    <span className="text-2xl font-bold text-primary">{formatPrice(calculateTotal())}</span>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                className="w-full bg-primary hover:bg-primary/90 text-white py-3 mb-4"
                size="lg"
              >
                {t('excursionDetail.addToCart')}
              </Button>

              {/* Share with Friends */}
              <div className="pt-4 border-t border-border">
                <p className="text-sm font-medium mb-3">{t('excursionDetail.shareWithFriends')}</p>
                <div className="flex gap-3">
                  <button className="p-2 rounded-full hover:bg-white/50 transition-colors">
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-white/50 transition-colors">
                    <Twitter className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-white/50 transition-colors">
                    <Instagram className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-white/50 transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="mt-12 bg-white rounded-lg p-8">
            <h2 className="text-xl font-semibold mb-4 text-[#4a9fb8]">{t('excursionDetail.description')}</h2>
            <div className="prose max-w-none">
              <p className="text-muted leading-relaxed mb-6">{excursion.description}</p>

              {/* Highlights */}
              {excursion.highlights && excursion.highlights.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">{t('excursionDetail.highlights')}</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {excursion.highlights.map((highlight: string, index: number) => (
                      <li key={index} className="text-muted">{highlight}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* What's Included */}
              {excursion.included && excursion.included.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">{t('excursionDetail.included')}</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {excursion.included.map((item: string, index: number) => (
                      <li key={index} className="text-muted">{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Not Included */}
              {excursion.notIncluded && excursion.notIncluded.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">{t('excursionDetail.notIncluded')}</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {excursion.notIncluded.map((item: string, index: number) => (
                      <li key={index} className="text-muted">{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mb-6">
                <p className="font-medium mb-2">
                  {t('excursionDetail.time')}: {excursion.duration?.split(' ')[0] || '8:00'} - {parseInt(excursion.duration) + 1 || 5}:30PM
                </p>
                <p className="text-sm font-medium mb-1">
                  {t('excursionDetail.priceIncludes')}
                </p>
                <p className="text-sm text-muted mb-4">
                  {t('excursionDetail.priceIncludesText')}
                </p>
                <p className="text-sm text-muted italic">
                  {t('excursionDetail.cancellation')}
                </p>
                <p className="text-sm text-muted italic mt-2">
                  {t('excursionDetail.minParticipants')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}