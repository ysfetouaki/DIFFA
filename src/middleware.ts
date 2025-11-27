import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './lib/i18n/config';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/:locale',
  '/:locale/sign-in(.*)',
  '/:locale/sign-up(.*)',
  '/:locale/qui-sommes-nous(.*)',
  '/:locale/nos-excursions(.*)',
  '/:locale/excursion(.*)',
  '/:locale/autres-services(.*)',
  '/:locale/contact(.*)',
  '/:locale/le-riad(.*)',
  '/:locale/chambre-et-suites(.*)',
  '/:locale/le-restaurant(.*)',
  '/:locale/carte(.*)',
  '/:locale/marrakech(.*)',
  '/:locale/agadir(.*)',
  '/:locale/taghazout(.*)',
  '/:locale/circuits(.*)',
]);

const isAdminRoute = createRouteMatcher([
  '/api/admin(.*)',
  '/:locale/admin(.*)',
]);

export default clerkMiddleware(async (auth, request: NextRequest) => {
  const pathname = request.nextUrl.pathname;

  // Skip locale handling for API routes, static files, and Next.js internals
  if (pathname.startsWith('/api') || pathname.startsWith('/_next')) {
    // Protect admin routes
    if (isAdminRoute(request)) {
      await auth.protect();
    }
    return NextResponse.next();
  }

  // Protect admin routes
  if (isAdminRoute(request)) {
    await auth.protect();
  }

  // Protect non-public routes
  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Redirect to default locale if no locale is present
  const locale = defaultLocale;
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};