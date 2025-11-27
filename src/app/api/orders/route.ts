import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders } from '@/db/schema';
import { eq, like, or, and, desc } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single order by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const order = await db
        .select()
        .from(orders)
        .where(eq(orders.id, parseInt(id)))
        .limit(1);

      if (order.length === 0) {
        return NextResponse.json(
          { error: 'Order not found', code: 'ORDER_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(order[0], { status: 200 });
    }

    // List orders with pagination and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const userClerkId = searchParams.get('userClerkId');

    const baseQuery = db.select().from(orders);
    const conditions = [];

    // Search filter
    if (search) {
      conditions.push(
        or(
          like(orders.firstName, `%${search}%`),
          like(orders.lastName, `%${search}%`),
          like(orders.email, `%${search}%`),
          like(orders.orderNumber, `%${search}%`)
        )
      );
    }

    // Status filter
    if (status) {
      conditions.push(eq(orders.status, status));
    }

    // User Clerk ID filter
    if (userClerkId) {
      conditions.push(eq(orders.userClerkId, userClerkId));
    }

    // Build final query without reassigning incompatible select types
        let finalQuery: any = baseQuery;
        if (conditions.length > 0) {
          finalQuery = (baseQuery.where(and(...(conditions as any[]))) as any);
        }

    const results = await finalQuery
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'passport',
      'city',
      'accommodationType',
      'paymentMethod',
      'cartItems',
      'totalMad',
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            error: `${field} is required`,
            code: 'MISSING_REQUIRED_FIELD',
          },
          { status: 400 }
        );
      }
    }

    // Validate field types and formats
    const {
      firstName,
      lastName,
      email,
      phone,
      passport,
      city,
      accommodationType,
      hotelName,
      address,
      paymentMethod,
      cartItems,
      totalMad,
      userClerkId,
      status,
    } = body;

    // Validate non-empty strings
    if (
      typeof firstName !== 'string' ||
      firstName.trim() === '' ||
      typeof lastName !== 'string' ||
      lastName.trim() === '' ||
      typeof email !== 'string' ||
      email.trim() === '' ||
      typeof phone !== 'string' ||
      phone.trim() === '' ||
      typeof passport !== 'string' ||
      passport.trim() === '' ||
      typeof city !== 'string' ||
      city.trim() === ''
    ) {
      return NextResponse.json(
        {
          error: 'All required text fields must be non-empty strings',
          code: 'INVALID_FIELD_TYPE',
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format', code: 'INVALID_EMAIL' },
        { status: 400 }
      );
    }

    // Validate accommodationType
    if (!['hotel', 'riad'].includes(accommodationType)) {
      return NextResponse.json(
        {
          error: 'accommodationType must be "hotel" or "riad"',
          code: 'INVALID_ACCOMMODATION_TYPE',
        },
        { status: 400 }
      );
    }

    // Validate paymentMethod
    if (!['cash', 'cmi', 'bank_transfer'].includes(paymentMethod)) {
      return NextResponse.json(
        {
          error: 'paymentMethod must be "cash", "cmi", or "bank_transfer"',
          code: 'INVALID_PAYMENT_METHOD',
        },
        { status: 400 }
      );
    }

    // Validate totalMad
    if (typeof totalMad !== 'number' || totalMad <= 0) {
      return NextResponse.json(
        {
          error: 'totalMad must be a positive number',
          code: 'INVALID_TOTAL_MAD',
        },
        { status: 400 }
      );
    }

    // Validate cartItems is valid JSON string
    if (typeof cartItems !== 'string') {
      return NextResponse.json(
        {
          error: 'cartItems must be a JSON string',
          code: 'INVALID_CART_ITEMS',
        },
        { status: 400 }
      );
    }

    try {
      JSON.parse(cartItems);
    } catch {
      return NextResponse.json(
        {
          error: 'cartItems must be valid JSON',
          code: 'INVALID_CART_ITEMS_JSON',
        },
        { status: 400 }
      );
    }

    // Validate status if provided
    const validStatuses = ['pending', 'confirmed', 'paid', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: `status must be one of: ${validStatuses.join(', ')}`,
          code: 'INVALID_STATUS',
        },
        { status: 400 }
      );
    }

    // Generate orderNumber and timestamps
    const orderNumber = randomUUID();
    const timestamp = new Date().toISOString();

    // Prepare insert data
    const insertData = {
      orderNumber,
      userClerkId: userClerkId || null,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      passport: passport.trim(),
      city: city.trim(),
      accommodationType,
      hotelName: hotelName?.trim() || null,
      address: address?.trim() || null,
      paymentMethod,
      cartItems,
      totalMad,
      status: status || 'pending',
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const newOrder = await db.insert(orders).values(insertData).returning();

    return NextResponse.json(newOrder[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}