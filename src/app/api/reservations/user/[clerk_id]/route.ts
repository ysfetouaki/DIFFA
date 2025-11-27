import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { reservations, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clerk_id: string }> }
) {
  try {
    const { clerk_id: clerkId } = await params;

    // Validate clerk_id
    if (!clerkId || typeof clerkId !== 'string' || clerkId.trim() === '') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Valid Clerk ID is required',
          code: 'INVALID_CLERK_ID' 
        },
        { status: 400 }
      );
    }

    // Get pagination parameters
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // First, find the user by clerkId
    const userResult = await db.select()
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

    // Get all reservations for this user
    const userReservations = await db.select()
      .from(reservations)
      .where(eq(reservations.userId, user.id))
      .orderBy(desc(reservations.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(
      {
        success: true,
        data: userReservations,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('GET reservations by clerk_id error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}