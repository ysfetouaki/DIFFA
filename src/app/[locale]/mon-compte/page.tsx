'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/sections/header';
import { User, Mail, Phone, MapPin, Calendar, Settings, LogOut, BookOpen, Star, Clock, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter, useParams } from 'next/navigation';
import { useCurrency } from '@/contexts/CurrencyContext';
import { toast } from 'sonner';
import { useTranslations } from '@/lib/i18n/hooks';

interface Reservation {
  id: number;
  excursionName: string;
  destination: string;
  reservationDate: string;
  reservationTime: string;
  adults: number;
  children: number;
  totalPriceMad: number;
  status: string;
  paymentStatus: string;
  bookingDate: string;
  excursionSlug: string;
}

interface Review {
  id: number;
  excursionName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  excursionSlug: string;
  isVerified: boolean;
}

export default function MonComptePage() {
  const { user, isLoaded } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'fr';
  const { formatPrice } = useCurrency();
  const t = useTranslations();
  
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReservations, setIsLoadingReservations] = useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'reservations' | 'reviews'>('info');

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (isLoaded && !user) {
      router.push(`/${locale}/sign-in`);
    }
  }, [isLoaded, user, router, locale]);

  // Fetch reservations
  useEffect(() => {
    if (user?.id) {
      fetchReservations();
    }
  }, [user?.id]);

  // Fetch reviews
  useEffect(() => {
    if (user?.id) {
      fetchReviews();
    }
  }, [user?.id]);

  const fetchReservations = async () => {
    try {
      setIsLoadingReservations(true);
      const response = await fetch(`/api/reservations/user/${user?.id}`);
      const result = await response.json();
      
      if (result.success) {
        setReservations(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast.error(t('account.reservations.loadingError'));
    } finally {
      setIsLoadingReservations(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setIsLoadingReviews(true);
      const response = await fetch(`/api/reviews/user/${user?.id}`);
      const result = await response.json();
      
      if (result.success) {
        setReviews(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error(t('account.reviews.loadingError'));
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push(`/${locale}`);
  };

  const handleManageProfile = () => {
    openUserProfile();
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const statusKey = status as 'confirmed' | 'pending' | 'completed' | 'cancelled';
    return t(`account.status.${statusKey}`);
  };

  const ongoingReservations = reservations.filter(r => r.status === 'confirmed' || r.status === 'pending');
  const pastReservations = reservations.filter(r => r.status === 'completed' || r.status === 'cancelled');

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-32 pb-16 min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-display font-light mb-2">{t('account.title')}</h1>
            <p className="text-muted">{t('account.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-28">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                    {user.imageUrl ? (
                      <img src={user.imageUrl} alt={user.fullName || 'User'} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-primary" />
                    )}
                  </div>
                  <h2 className="font-display text-2xl text-center mb-1">{user.fullName || user.firstName || 'User'}</h2>
                  <p className="text-muted text-sm">{t('account.memberSince')} {new Date(user.createdAt || '').toLocaleDateString(locale, { month: 'long', year: 'numeric' })}</p>
                </div>

                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('info')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'info' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-secondary text-foreground'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    {t('account.tabs.personalInfo')}
                  </button>
                  <button
                    onClick={() => setActiveTab('reservations')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'reservations' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-secondary text-foreground'
                    }`}
                  >
                    <BookOpen className="w-5 h-5" />
                    {t('account.tabs.reservations')}
                    {reservations.length > 0 && (
                      <span className="ml-auto bg-primary text-white text-xs rounded-full px-2 py-0.5">
                        {reservations.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'reviews' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-secondary text-foreground'
                    }`}
                  >
                    <Star className="w-5 h-5" />
                    {t('account.tabs.reviews')}
                    {reviews.length > 0 && (
                      <span className="ml-auto bg-primary text-white text-xs rounded-full px-2 py-0.5">
                        {reviews.length}
                      </span>
                    )}
                  </button>
                  
                  <div className="border-t border-border my-2"></div>
                  
                  <button 
                    onClick={handleManageProfile}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent/10 text-accent transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                    {t('account.buttons.manageProfile')}
                  </button>
                  <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    {t('account.buttons.signOut')}
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Personal Info Tab */}
              {activeTab === 'info' && (
                <>
                  <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-6">
                    <h3 className="font-display text-2xl mb-6">{t('account.personalInfo.title')}</h3>
                    
                    <div className="space-y-6">
                      <div className="flex items-start gap-4 p-4 border border-border rounded-lg">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <label className="text-sm text-muted mb-1 block">{t('account.personalInfo.fullName')}</label>
                          <p className="font-medium">{user.fullName || user.firstName || t('account.personalInfo.notProvided')}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 border border-border rounded-lg">
                        <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-accent" />
                        </div>
                        <div className="flex-1">
                          <label className="text-sm text-muted mb-1 block">{t('account.personalInfo.email')}</label>
                          <p className="font-medium">{user.primaryEmailAddress?.emailAddress || t('account.personalInfo.notProvided')}</p>
                        </div>
                      </div>

                      {user.primaryPhoneNumber && (
                        <div className="flex items-start gap-4 p-4 border border-border rounded-lg">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <Phone className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <label className="text-sm text-muted mb-1 block">{t('account.personalInfo.phone')}</label>
                            <p className="font-medium">{user.primaryPhoneNumber.phoneNumber}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats Card */}
                  <div className="bg-gradient-to-br from-primary to-accent rounded-lg shadow-lg p-6 md:p-8 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display text-2xl">{t('account.activity.title')}</h3>
                      <Calendar className="w-8 h-8 opacity-80" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-white/80 text-sm mb-1">{t('account.activity.totalReservations')}</p>
                        <p className="text-4xl font-display font-bold">{reservations.length}</p>
                      </div>
                      <div>
                        <p className="text-white/80 text-sm mb-1">{t('account.activity.publishedReviews')}</p>
                        <p className="text-4xl font-display font-bold">{reviews.length}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Reservations Tab */}
              {activeTab === 'reservations' && (
                <div className="space-y-6">
                  {/* Ongoing Reservations */}
                  {ongoingReservations.length > 0 && (
                    <div>
                      <h3 className="font-display text-2xl mb-4 flex items-center gap-2">
                        <Clock className="w-6 h-6 text-primary" />
                        {t('account.reservations.ongoing')}
                      </h3>
                      <div className="space-y-4">
                        {ongoingReservations.map((reservation) => (
                          <div key={reservation.id} className="bg-white rounded-lg shadow-lg p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h4 className="font-display text-xl mb-1">{reservation.excursionName}</h4>
                                <p className="text-sm text-muted">{t('account.reservations.reservationNumber')} #{reservation.id}</p>
                              </div>
                              <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(reservation.status)}`}>
                                {getStatusIcon(reservation.status)}
                                {getStatusLabel(reservation.status)}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span className="text-sm">{reservation.destination}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-accent" />
                                <span className="text-sm">{new Date(reservation.reservationDate).toLocaleDateString(locale)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                <span className="text-sm">{reservation.reservationTime}</span>
                              </div>
                              <div className="text-sm font-semibold text-primary">
                                {formatPrice(reservation.totalPriceMad)}
                              </div>
                            </div>
                            <Link 
                              href={`/${locale}/excursion/${reservation.excursionSlug}`}
                              className="inline-block text-sm text-primary hover:underline"
                            >
                              {t('account.reservations.viewDetails')} →
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Past Reservations */}
                  {pastReservations.length > 0 && (
                    <div>
                      <h3 className="font-display text-2xl mb-4">{t('account.reservations.history')}</h3>
                      <div className="space-y-4">
                        {pastReservations.map((reservation) => (
                          <div key={reservation.id} className="bg-white rounded-lg shadow-lg p-6 opacity-75">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h4 className="font-display text-xl mb-1">{reservation.excursionName}</h4>
                                <p className="text-sm text-muted">{t('account.reservations.reservationNumber')} #{reservation.id}</p>
                              </div>
                              <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(reservation.status)}`}>
                                {getStatusIcon(reservation.status)}
                                {getStatusLabel(reservation.status)}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span className="text-sm">{reservation.destination}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-accent" />
                                <span className="text-sm">{new Date(reservation.reservationDate).toLocaleDateString(locale)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                <span className="text-sm">{reservation.reservationTime}</span>
                              </div>
                              <div className="text-sm font-semibold text-primary">
                                {formatPrice(reservation.totalPriceMad)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {isLoadingReservations && (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  )}

                  {!isLoadingReservations && reservations.length === 0 && (
                    <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                      <BookOpen className="w-16 h-16 text-primary/30 mx-auto mb-4" />
                      <h3 className="font-display text-2xl mb-2">{t('account.reservations.none')}</h3>
                      <p className="text-muted mb-6">{t('account.reservations.noneDescription')}</p>
                      <Link 
                        href={`/${locale}/nos-excursions`}
                        className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                      >
                        {t('account.reservations.viewExcursions')}
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-2xl">{t('account.reviews.title')}</h3>
                  </div>

                  {isLoadingReviews && (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  )}

                  {!isLoadingReviews && reviews.length > 0 && (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="bg-white rounded-lg shadow-lg p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-display text-xl mb-1">{review.excursionName}</h4>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`w-4 h-4 ${i < review.rating ? 'fill-primary text-primary' : 'text-gray-300'}`}
                                    />
                                  ))}
                                </div>
                                {review.isVerified && (
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                    {t('account.reviews.verified')}
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-muted">{new Date(review.createdAt).toLocaleDateString(locale)}</p>
                          </div>
                          {review.title && <h5 className="font-semibold mb-2">{review.title}</h5>}
                          <p className="text-muted">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {!isLoadingReviews && reviews.length === 0 && (
                    <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                      <Star className="w-16 h-16 text-primary/30 mx-auto mb-4" />
                      <h3 className="font-display text-2xl mb-2">{t('account.reviews.none')}</h3>
                      <p className="text-muted mb-6">{t('account.reviews.noneDescription')}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}