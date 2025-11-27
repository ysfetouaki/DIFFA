'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/sections/header';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useTranslations } from '@/lib/i18n/hooks';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, CreditCard, Banknote, Info } from 'lucide-react';

type AccommodationType = 'hotel' | 'riad';
type PaymentMethod = 'cash' | 'cmi';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<'personal' | 'confirm'>('personal');
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmingOrder, setIsConfirmingOrder] = useState(false);
  
  // Check if CMI payment is enabled (based on environment variable)
  const [isCMIEnabled, setIsCMIEnabled] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    passport: '',
    city: '',
    accommodationType: 'hotel' as AccommodationType,
    hotelName: '',
    address: '',
    ageConfirmed: false,
    termsAccepted: false,
    paymentMethod: 'cash' as PaymentMethod,
  });

  // Check if CMI is configured
  useEffect(() => {
    // Check if CMI credentials are available
    fetch('/api/payment/cmi/status')
      .then(res => res.json())
      .then(data => setIsCMIEnabled(data.enabled))
      .catch(() => setIsCMIEnabled(false));
  }, []);

  // Wait for cart to load from localStorage before checking
  useEffect(() => {
    // Small delay to ensure cart is loaded from localStorage
    const timer = setTimeout(() => {
      setIsCartLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Redirect if cart is empty (only after cart is loaded and not confirming order)
  useEffect(() => {
    if (isCartLoaded && cart.length === 0 && !isConfirmingOrder) {
      router.push(`/${locale}/cart`);
    }
  }, [cart, locale, router, isCartLoaded, isConfirmingOrder]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validatePersonalInfo = () => {
    if (!formData.firstName.trim()) {
      toast.error(t('checkout.validation.firstName'));
      return false;
    }
    if (!formData.lastName.trim()) {
      toast.error(t('checkout.validation.lastName'));
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error(t('checkout.validation.phone'));
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast.error(t('checkout.validation.email'));
      return false;
    }
    if (!formData.passport.trim()) {
      toast.error(t('checkout.validation.passport'));
      return false;
    }
    if (!formData.city.trim()) {
      toast.error(t('checkout.validation.city'));
      return false;
    }
    if (!formData.ageConfirmed) {
      toast.error(t('checkout.validation.age'));
      return false;
    }
    if (!formData.termsAccepted) {
      toast.error(t('checkout.validation.terms'));
      return false;
    }
    return true;
  };

  const handleContinue = () => {
    if (validatePersonalInfo()) {
      setCurrentStep('confirm');
    }
  };

  const handleConfirmOrder = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setIsConfirmingOrder(true); // Prevent cart redirect
    
    try {
      const orderData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        passport: formData.passport.trim(),
        city: formData.city.trim(),
        accommodationType: formData.accommodationType,
        hotelName: formData.hotelName?.trim() || null,
        address: formData.address?.trim() || null,
        paymentMethod: formData.paymentMethod,
        cartItems: JSON.stringify(cart),
        totalMad: cartTotal,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create order');
      }

      const order = await response.json();
      
      // If CMI payment, redirect to payment gateway
      if (formData.paymentMethod === 'cmi' && order.paymentUrl) {
        window.location.href = order.paymentUrl;
        return;
      }
      
      // Clear cart and redirect to order confirmation (for cash payment)
      clearCart();
      router.push(`/${locale}/order-confirmation/${order.orderNumber}`);
    } catch (error) {
      console.error('Order creation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create order');
      setIsSubmitting(false);
      setIsConfirmingOrder(false); // Reset if error occurs
    }
  };

  // Show loading state while cart is loading
  if (!isCartLoaded) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-screen pt-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => currentStep === 'personal' ? router.push(`/${locale}/cart`) : setCurrentStep('personal')}
            className="flex items-center gap-2 text-foreground hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">
              {currentStep === 'personal' 
                ? (locale === 'fr' ? 'Retour au panier' : 'Back to Cart')
                : (locale === 'fr' ? 'Retour aux informations' : 'Back to Information')}
            </span>
          </button>

          {/* Tabs */}
          <div className="flex justify-center mb-8 border-b border-border">
            <button
              onClick={() => setCurrentStep('personal')}
              className={`px-6 py-3 font-medium transition-colors ${
                currentStep === 'personal'
                  ? 'text-foreground border-b-2 border-foreground'
                  : 'text-muted'
              }`}
            >
              {t('checkout.tabs.personal')}
            </button>
            <button
              onClick={() => currentStep === 'confirm' && setCurrentStep('confirm')}
              className={`px-6 py-3 font-medium transition-colors ${
                currentStep === 'confirm'
                  ? 'text-foreground border-b-2 border-foreground'
                  : 'text-muted'
              }`}
              disabled={currentStep === 'personal'}
            >
              {t('checkout.tabs.confirm')}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {currentStep === 'personal' ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-display mb-6">{t('checkout.personalInfo.title')}</h2>

                  <div className="space-y-4">
                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('checkout.personalInfo.firstName')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('checkout.personalInfo.lastName')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('checkout.personalInfo.phone')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('checkout.personalInfo.email')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>

                    {/* Passport or CIN */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('checkout.personalInfo.passport')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.passport}
                        onChange={(e) => handleInputChange('passport', e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('checkout.personalInfo.city')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>

                    {/* Accommodation Type */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('checkout.personalInfo.accommodationType')}
                      </label>
                      <div className="flex gap-6">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="accommodationType"
                            value="hotel"
                            checked={formData.accommodationType === 'hotel'}
                            onChange={(e) => handleInputChange('accommodationType', e.target.value)}
                            className="mr-2"
                          />
                          {t('checkout.personalInfo.hotel')}
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="accommodationType"
                            value="riad"
                            checked={formData.accommodationType === 'riad'}
                            onChange={(e) => handleInputChange('accommodationType', e.target.value)}
                            className="mr-2"
                          />
                          {t('checkout.personalInfo.riad')}
                        </label>
                      </div>
                    </div>

                    {/* Hotel Name */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('checkout.personalInfo.hotelName')}
                      </label>
                      <input
                        type="text"
                        value={formData.hotelName}
                        onChange={(e) => handleInputChange('hotelName', e.target.value)}
                        placeholder={t('checkout.personalInfo.hotelNamePlaceholder')}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('checkout.personalInfo.address')}
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder={t('checkout.personalInfo.addressPlaceholder')}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    {/* Age Confirmation */}
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.ageConfirmed}
                          onChange={(e) => handleInputChange('ageConfirmed', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm">{t('checkout.personalInfo.ageConfirm')} <span className="text-red-500">*</span></span>
                      </label>
                    </div>

                    {/* Terms */}
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.termsAccepted}
                          onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm">
                          {t('checkout.personalInfo.termsAccept')}{' '}
                          <a href={`/${locale}/terms`} className="text-primary hover:underline">
                            {t('checkout.personalInfo.termsLink')}
                          </a>
                          <span className="text-red-500"> *</span>
                        </span>
                      </label>
                    </div>

                    {/* Continue Button */}
                    <Button
                      onClick={handleContinue}
                      className="w-full bg-primary hover:bg-primary/90 text-white mt-6"
                      size="lg"
                    >
                      {t('checkout.continue')}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Information Summary */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-display mb-4">{t('checkout.confirm.information')}</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">{t('checkout.personalInfo.name')}:</span> {formData.firstName} {formData.lastName}</p>
                      <p><span className="font-medium">{t('checkout.personalInfo.email')}:</span> {formData.email}</p>
                      <p><span className="font-medium">{t('checkout.personalInfo.phone')}:</span> {formData.phone}</p>
                      <p><span className="font-medium">{t('checkout.personalInfo.passport')}:</span> {formData.passport}</p>
                      <p><span className="font-medium">{t('checkout.personalInfo.type')}:</span> {formData.accommodationType === 'hotel' ? t('checkout.personalInfo.hotel') : t('checkout.personalInfo.riad')}</p>
                      {formData.hotelName && <p><span className="font-medium">{t('checkout.personalInfo.hotelName')}:</span> {formData.hotelName}</p>}
                      <p><span className="font-medium">{t('checkout.personalInfo.city')}:</span> {formData.city}</p>
                      {formData.address && <p><span className="font-medium">{t('checkout.personalInfo.address')}:</span> {formData.address}</p>}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-display mb-4">
                      {locale === 'fr' ? 'Méthode de paiement' : 'Payment Method'}
                    </h3>
                    <div className="space-y-4">
                      {/* Cash Payment */}
                      <label className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        formData.paymentMethod === 'cash' 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash"
                          checked={formData.paymentMethod === 'cash'}
                          onChange={(e) => handleInputChange('paymentMethod', e.target.value as PaymentMethod)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Banknote className="w-5 h-5 text-primary" />
                            <span className="font-medium">
                              {locale === 'fr' ? 'Paiement en espèces' : 'Cash Payment'}
                            </span>
                          </div>
                          <p className="text-sm text-muted">
                            {locale === 'fr' 
                              ? 'Payez en espèces lors de la prise en charge' 
                              : 'Pay in cash upon pickup'}
                          </p>
                        </div>
                      </label>

                      {/* CMI Online Payment */}
                      <label className={`flex items-start gap-3 p-4 border rounded-lg transition-colors ${
                        !isCMIEnabled 
                          ? 'opacity-50 cursor-not-allowed bg-gray-50' 
                          : formData.paymentMethod === 'cmi'
                            ? 'border-primary bg-primary/5 cursor-pointer'
                            : 'border-border hover:border-primary/50 cursor-pointer'
                      }`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cmi"
                          checked={formData.paymentMethod === 'cmi'}
                          onChange={(e) => handleInputChange('paymentMethod', e.target.value as PaymentMethod)}
                          disabled={!isCMIEnabled}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <CreditCard className="w-5 h-5 text-primary" />
                            <span className="font-medium">
                              {locale === 'fr' ? 'Paiement en ligne CMI' : 'CMI Online Payment'}
                            </span>
                            {!isCMIEnabled && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                                {locale === 'fr' ? 'Bientôt disponible' : 'Coming Soon'}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted">
                            {locale === 'fr' 
                              ? 'Payez en ligne de manière sécurisée avec votre carte bancaire' 
                              : 'Pay online securely with your credit card'}
                          </p>
                          {!isCMIEnabled && (
                            <div className="flex items-start gap-2 mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
                              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                              <span>
                                {locale === 'fr'
                                  ? 'Le paiement en ligne sera bientôt disponible. Pour le moment, veuillez utiliser le paiement en espèces.'
                                  : 'Online payment will be available soon. For now, please use cash payment.'}
                              </span>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-display mb-4">{t('checkout.confirm.orderItems')}</h3>
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.id} className="flex gap-4 pb-4 border-b border-border last:border-b-0">
                          <div className="relative w-20 h-20 flex-shrink-0">
                            <Image
                              src={item.excursionImage}
                              alt={item.excursionName}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm mb-1">{new Date(item.date).toLocaleDateString(locale)}</p>
                            <h4 className="font-semibold mb-1">{item.excursionName}</h4>
                            <p className="text-sm font-bold text-primary">{formatPrice(item.total)}</p>
                            {item.selectedItems.length > 0 && (
                              <p className="text-xs text-muted mt-1">
                                {t('checkout.confirm.youSelected')}: {item.selectedItems.map(si => si.label).join(', ')}
                              </p>
                            )}
                            <p className="text-xs text-muted">
                              {t('checkout.confirm.adults')}: ({item.ageGroups['adult']} * {formatPrice(item.priceMAD)})
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{formatPrice(item.total)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-32">
                <h3 className="text-xl font-display mb-4">{t('checkout.summary.title')}</h3>
                <div className="space-y-2 mb-4 pb-4 border-b border-border">
                  <div className="flex justify-between text-lg font-bold">
                    <span>{t('checkout.summary.total')}:</span>
                    <span className="text-primary">{formatPrice(cartTotal)}</span>
                  </div>
                </div>

                {currentStep === 'confirm' && (
                  <Button
                    onClick={handleConfirmOrder}
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                    size="lg"
                  >
                    {isSubmitting ? 'Processing...' : t('checkout.confirmButton')}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}