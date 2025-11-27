import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { excursionSettings, users } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { 
          error: 'Authentication required',
          code: 'UNAUTHORIZED' 
        },
        { status: 401 }
      );
    }

    // Get user from database and verify admin role
    const user = await db.select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json(
        { 
          error: 'User not found',
          code: 'USER_NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    if (user[0].role !== 'admin') {
      return NextResponse.json(
        { 
          error: 'Access denied. Admin role required',
          code: 'FORBIDDEN' 
        },
        { status: 403 }
      );
    }

    // Get all excursion settings ordered by section
    const settings = await db.select()
      .from(excursionSettings)
      .orderBy(asc(excursionSettings.section));

    return NextResponse.json(settings, { status: 200 });

  } catch (error) {
    console.error('GET excursion settings error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}