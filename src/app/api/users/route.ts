import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq, like, or } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clerkId, email, name, phone } = body;

    // Validate required fields
    if (!clerkId || !email) {
      return NextResponse.json({ 
        error: 'clerkId and email are required',
        code: 'MISSING_REQUIRED_FIELDS'
      }, { status: 400 });
    }

    // Trim and normalize inputs
    const trimmedClerkId = clerkId.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name?.trim();
    const trimmedPhone = phone?.trim();

    // Validate clerkId is not empty after trim
    if (!trimmedClerkId) {
      return NextResponse.json({ 
        error: 'clerkId cannot be empty',
        code: 'INVALID_CLERK_ID'
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json({ 
        error: 'Invalid email format',
        code: 'INVALID_EMAIL'
      }, { status: 400 });
    }

    // Check if user with clerkId already exists
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.clerkId, trimmedClerkId))
      .limit(1);

    if (existingUser.length > 0) {
      // Update existing user
      const updated = await db.update(users)
        .set({
          email: trimmedEmail,
          name: trimmedName || existingUser[0].name,
          phone: trimmedPhone || existingUser[0].phone,
          updatedAt: new Date().toISOString()
        })
        .where(eq(users.clerkId, trimmedClerkId))
        .returning();

      return NextResponse.json(updated[0], { status: 200 });
    } else {
      // Create new user
      const newUser = await db.insert(users)
        .values({
          clerkId: trimmedClerkId,
          email: trimmedEmail,
          name: trimmedName,
          phone: trimmedPhone,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .returning();

      return NextResponse.json(newUser[0], { status: 201 });
    }
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');

    let query: any = db.select().from(users);

    // Apply search filter if provided
    if (search) {
      const searchTerm = `%${search}%`;
      query = query.where(
        or(
          like(users.name, searchTerm),
          like(users.email, searchTerm)
        )
      );
    }

    // Execute query with pagination
    const results = await query.limit(limit).offset(offset);

    // Get total count for pagination
    let countQuery: any = db.select().from(users);
    if (search) {
      const searchTerm = `%${search}%`;
      countQuery = countQuery.where(
        or(
          like(users.name, searchTerm),
          like(users.email, searchTerm)
        )
      );
    }
    const totalCount = (await countQuery).length;

    return NextResponse.json({
      users: results,
      total: totalCount,
      limit,
      offset
    }, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}