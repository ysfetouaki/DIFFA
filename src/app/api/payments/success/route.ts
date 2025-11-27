import { NextRequest, NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const orderId = formData.get('oid') as string;
    const response = formData.get('Response') as string;

    console.log('Payment success callback:', { orderId, response });

    // Redirect to order confirmation page
    const locale = request.cookies.get('NEXT_LOCALE')?.value || 'fr';
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${locale}/order-confirmation/${orderId}?payment=success`);
  } catch (error) {
    console.error('Success callback error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/fr`);
  }
}

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get('oid');
  const locale = request.cookies.get('NEXT_LOCALE')?.value || 'fr';
  
  if (orderId) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${locale}/order-confirmation/${orderId}?payment=success`);
  }
  
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${locale}`);
}
