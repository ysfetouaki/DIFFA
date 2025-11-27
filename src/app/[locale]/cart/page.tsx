'use client';

import Header from '@/components/sections/header';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from '@/lib/i18n/hooks';

export default function CartPage() {
  const { cart, removeFromCart, cartTotal, cartCount } = useCart();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();

  const emptyCartTitle = (() => {
    const l = String(locale);
    if (l === 'fr') return 'Votre panier est vide';
    if (l === 'ar') return 'سلة التسوق فارغة';
    return 'Your cart is empty';
  })();

  if (cartCount === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <ShoppingBag className="w-24 h-24 mx-auto text-muted opacity-50" />
        </div>
        <h1 className="text-4xl font-bold mb-4">
          {emptyCartTitle}
        </h1>
        <p className="text-lg text-muted mb-8">
          {String(locale) === 'fr'
            ? 'Découvrez nos excursions et ajoutez-les à votre panier'
            : String(locale) === 'ar'
              ? 'اكتشف رحلاتنا وأضفها إلى سلة التسوق'
              : 'Discover our excursions and add them to your cart'}
        </p>
        <Button
          onClick={() => router.push(`/${locale}/nos-excursions`)}
          size="lg"
          className="bg-primary hover:bg-primary/90"
        >
          {String(locale) === 'fr' ? 'Voir les excursions' : String(locale) === 'ar' ? 'عرض الرحلات' : 'View Excursions'}
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background">
      <Header />
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              {String(locale) === 'fr' ? 'Votre Panier' : String(locale) === 'ar' ? 'سلة التسوق' : 'Your Cart'}
            </h1>
            <p className="text-lg text-muted">
              {String(locale) === 'fr' 
                ? `${cartCount} article${cartCount > 1 ? 's' : ''} dans votre panier`
                : String(locale) === 'ar'
                ? `${cartCount} عنصر في سلة التسوق`
                : `${cartCount} item${cartCount > 1 ? 's' : ''} in your cart`}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-card rounded-lg shadow-md overflow-hidden border border-border"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Image */}
                    <div className="relative w-full sm:w-48 h-48 flex-shrink-0">
                      <Image
                        src={item.excursionImage}
                        alt={item.excursionName}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{item.excursionName}</h3>
                          <p className="text-sm text-muted mb-2">
                            {String(locale) === 'fr' ? 'Date:' : String(locale) === 'ar' ? 'التاريخ:' : 'Date:'} {new Date(item.date).toLocaleDateString(locale)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>

                      {/* Age Groups */}
                      <div className="space-y-1 mb-3">
                        {item.ageGroups['0-4'] > 0 && (
                          <p className="text-sm text-muted">
                            {String(locale) === 'fr' ? '0-4 ans:' : String(locale) === 'ar' ? '0-4 سنوات:' : '0-4 years:'} {item.ageGroups['0-4']}
                          </p>
                        )}
                        {item.ageGroups['4-12'] > 0 && (
                          <p className="text-sm text-muted">
                            {String(locale) === 'fr' ? '4-12 ans:' : String(locale) === 'ar' ? '4-12 سنة:' : '4-12 years:'} {item.ageGroups['4-12']}
                          </p>
                        )}
                        {item.ageGroups['adult'] > 0 && (
                          <p className="text-sm text-muted">
                            {String(locale) === 'fr' ? 'Adultes:' : String(locale) === 'ar' ? 'البالغين:' : 'Adults:'} {item.ageGroups['adult']}
                          </p>
                        )}
                      </div>

                      {/* Selected Items */}
                      {item.selectedItems.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-medium mb-1">
                            {String(locale) === 'fr' ? 'Options:' : String(locale) === 'ar' ? 'الخيارات:' : 'Options:'}
                          </p>
                          <ul className="text-sm text-muted space-y-1">
                            {item.selectedItems.map((selectedItem) => (
                              <li key={selectedItem.id}>
                                • {selectedItem.label} (+{selectedItem.price} MAD)
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Price */}
                      <div className="flex justify-between items-center pt-3 border-t border-border">
                        <span className="text-sm text-muted">
                          {String(locale) === 'fr' ? 'Prix unitaire:' : String(locale) === 'ar' ? 'السعر الأساسي:' : 'Base price:'} {item.priceMAD} MAD
                        </span>
                        <span className="text-xl font-bold text-primary">
                          {item.total} MAD
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg shadow-md border border-border p-6 sticky top-32">
                <h2 className="text-2xl font-bold mb-6">
                  {String(locale) === 'fr' ? 'Résumé' : String(locale) === 'ar' ? 'الملخص' : 'Summary'}
                </h2>

                <div className="space-y-3 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between text-muted">
                    <span>{String(locale) === 'fr' ? 'Sous-total' : String(locale) === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                    <span>{cartTotal} MAD</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>{String(locale) === 'fr' ? 'Articles' : String(locale) === 'ar' ? 'العناصر' : 'Items'}</span>
                    <span>{cartCount}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6 text-xl font-bold">
                  <span>{String(locale) === 'fr' ? 'Total' : String(locale) === 'ar' ? 'المجموع' : 'Total'}</span>
                  <span className="text-primary">{cartTotal} MAD</span>
                </div>

                <Button 
                  onClick={() => router.push(`/${locale}/checkout`)}
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                  size="lg"
                >
                  {String(locale) === 'fr' ? 'Procéder au paiement' : String(locale) === 'ar' ? 'متابعة الدفع' : 'Proceed to Checkout'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>

                <Button
                  onClick={() => router.push(`/${locale}/nos-excursions`)}
                  variant="outline"
                  className="w-full mt-3"
                >
                  {String(locale) === 'fr' ? 'Continuer les achats' : String(locale) === 'ar' ? 'متابعة التسوق' : 'Continue Shopping'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}