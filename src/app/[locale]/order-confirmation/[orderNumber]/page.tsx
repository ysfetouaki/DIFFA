'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const orderNumber = params.orderNumber as string;

  useEffect(() => {
    // Redirect to payment page immediately
    router.push(`/${locale}/payment/${orderNumber}`);
  }, [locale, orderNumber, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted">Redirecting to payment...</p>
      </div>
    </div>
  );
}