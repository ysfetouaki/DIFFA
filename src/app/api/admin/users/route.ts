import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq, like, or, and, desc, count } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // Fetch requesting user from database
    const requestingUser = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (requestingUser.length === 0) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Authorization check - admin only
    if (requestingUser[0].role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required', code: 'FORBIDDEN' },
        { status: 403 }
      );
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const roleFilter = searchParams.get('role');

    // Validate parameters
    if (isNaN(limit) || limit < 1) {
      return NextResponse.json(
        { error: 'Invalid limit parameter', code: 'INVALID_LIMIT' },
        { status: 400 }
      );
    }

    if (isNaN(offset) || offset < 0) {
      return NextResponse.json(
        { error: 'Invalid offset parameter', code: 'INVALID_OFFSET' },
        { status: 400 }
      );
    }

    if (roleFilter && !['admin', 'user'].includes(roleFilter)) {
      return NextResponse.json(
        { error: 'Invalid role filter. Must be "admin" or "user"', code: 'INVALID_ROLE_FILTER' },
        { status: 400 }
      );
    }

    // Build query conditions
    const conditions = [];

    // Add search condition
    if (search) {
      const searchTerm = `%${search}%`;
      conditions.push(
        or(
          like(users.name, searchTerm),
          like(users.email, searchTerm)
        )
      );
    }

    // Add role filter
    if (roleFilter) {
      conditions.push(eq(users.role, roleFilter));
    }

    // Combine conditions
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Execute query with pagination
    let query: any = db
      .select()
      .from(users);

    if (whereClause) {
      query = query.where(whereClause);
    }

    query = query
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);

    const usersList = await query;

    // Get total count
    let countQuery: any = db
      .select({ count: count() })
      .from(users);

    if (whereClause) {
      countQuery = countQuery.where(whereClause);
    }

    const totalResult = await countQuery;
    const total = totalResult[0]?.count ?? 0;

    // Return response
    return NextResponse.json({
      users: usersList,
      total,
      limit,
      offset
    });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}