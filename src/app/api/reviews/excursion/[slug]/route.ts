import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { reviews } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          error: 'Excursion slug is required',
          code: 'MISSING_SLUG',
        },
        { status: 400 }
      );
    }

    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const isVerifiedParam = searchParams.get('is_verified');

    const conditions = [eq(reviews.excursionSlug, slug)];

    if (isVerifiedParam !== null) {
      const isVerified = isVerifiedParam === 'true';
      conditions.push(eq(reviews.isVerified, isVerified));
    }

    const whereCondition = conditions.length > 1 ? and(...conditions) : conditions[0];

    const reviewsData = await db
      .select()
      .from(reviews)
      .where(whereCondition)
      .orderBy(desc(reviews.createdAt))
      .limit(limit)
      .offset(offset);

    const allReviewsForExcursion = await db
      .select()
      .from(reviews)
      .where(eq(reviews.excursionSlug, slug));

    const totalReviews = allReviewsForExcursion.length;

    let averageRating = 0;
    if (totalReviews > 0) {
      const sumRatings = allReviewsForExcursion.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      averageRating = parseFloat((sumRatings / totalReviews).toFixed(1));
    }

    return NextResponse.json(
      {
        success: true,
        data: reviewsData,
        averageRating,
        totalReviews,
        excursionSlug: slug,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET reviews error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error: ' + (error as Error).message,
      },
      { status: 500 }
    );
  }
}