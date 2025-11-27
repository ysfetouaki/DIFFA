import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { reviews, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clerk_id: string }> }
) {
  try {
    const { clerk_id: clerkId } = await params;

    if (!clerkId || clerkId.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          error: 'Clerk ID is required',
          code: 'MISSING_CLERK_ID'
        },
        { status: 400 }
      );
    }

    // Find user by clerkId
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    const user = userResult[0];

    // Get pagination parameters
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Query reviews for this user
    const userReviews = await db
      .select()
      .from(reviews)
      .where(eq(reviews.userId, user.id))
      .orderBy(desc(reviews.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(
      {
        success: true,
        data: userReviews,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET reviews by clerk_id error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}