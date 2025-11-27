import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { clerk_id: string } }
) {
  try {
    const clerkId = params.clerk_id;

    // Validate clerk_id parameter
    if (!clerkId || clerkId.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          error: 'Clerk ID is required',
        },
        { status: 400 }
      );
    }

    // Query user by clerkId
    const user = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1);

    // Return 404 if user not found
    if (user.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    // Return user object
    return NextResponse.json(
      {
        success: true,
        data: user[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET user by Clerk ID error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      },
      { status: 500 }
    );
  }
}