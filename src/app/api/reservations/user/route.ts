import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { reservations } from '@/db/schema';
import { eq, like, or, and, desc } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      excursionSlug,
      excursionName,
      destination,
      reservationDate,
      reservationTime,
      adults,
      totalPriceMad,
      children,
      selectedItems,
      notes
    } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json({
        error: 'User ID is required',
        code: 'MISSING_USER_ID'
      }, { status: 400 });
    }

    if (!excursionSlug || typeof excursionSlug !== 'string' || excursionSlug.trim() === '') {
      return NextResponse.json({
        error: 'Excursion slug is required',
        code: 'MISSING_EXCURSION_SLUG'
      }, { status: 400 });
    }

    if (!excursionName || typeof excursionName !== 'string' || excursionName.trim() === '') {
      return NextResponse.json({
        error: 'Excursion name is required',
        code: 'MISSING_EXCURSION_NAME'
      }, { status: 400 });
    }

    if (!destination || typeof destination !== 'string' || destination.trim() === '') {
      return NextResponse.json({
        error: 'Destination is required',
        code: 'MISSING_DESTINATION'
      }, { status: 400 });
    }

    if (!reservationDate || typeof reservationDate !== 'string' || reservationDate.trim() === '') {
      return NextResponse.json({
        error: 'Reservation date is required',
        code: 'MISSING_RESERVATION_DATE'
      }, { status: 400 });
    }

    if (!reservationTime || typeof reservationTime !== 'string' || reservationTime.trim() === '') {
      return NextResponse.json({
        error: 'Reservation time is required',
        code: 'MISSING_RESERVATION_TIME'
      }, { status: 400 });
    }

    if (adults === undefined || adults === null) {
      return NextResponse.json({
        error: 'Number of adults is required',
        code: 'MISSING_ADULTS'
      }, { status: 400 });
    }

    if (totalPriceMad === undefined || totalPriceMad === null) {
      return NextResponse.json({
        error: 'Total price is required',
        code: 'MISSING_TOTAL_PRICE'
      }, { status: 400 });
    }

    // Validate field values
    const adultsNum = parseInt(adults);
    if (isNaN(adultsNum) || adultsNum < 1) {
      return NextResponse.json({
        error: 'Number of adults must be at least 1',
        code: 'INVALID_ADULTS'
      }, { status: 400 });
    }

    const childrenNum = children !== undefined && children !== null ? parseInt(children) : 0;
    if (isNaN(childrenNum) || childrenNum < 0) {
      return NextResponse.json({
        error: 'Number of children cannot be negative',
        code: 'INVALID_CHILDREN'
      }, { status: 400 });
    }

    const totalPrice = parseFloat(totalPriceMad);
    if (isNaN(totalPrice) || totalPrice <= 0) {
      return NextResponse.json({
        error: 'Total price must be greater than 0',
        code: 'INVALID_TOTAL_PRICE'
      }, { status: 400 });
    }

    // Validate selectedItems is valid JSON if provided
    if (selectedItems !== undefined && selectedItems !== null) {
      try {
        if (typeof selectedItems === 'string') {
          JSON.parse(selectedItems);
        } else {
          JSON.stringify(selectedItems);
        }
      } catch {
        return NextResponse.json({
          error: 'Selected items must be valid JSON',
          code: 'INVALID_SELECTED_ITEMS'
        }, { status: 400 });
      }
    }

    // Prepare insert data
    const now = new Date().toISOString();
    const bookingDateNow = new Date().toISOString().split('T')[0];

    const insertData = {
      userId: parseInt(userId),
      excursionSlug: excursionSlug.trim(),
      excursionName: excursionName.trim(),
      destination: destination.trim(),
      reservationDate: reservationDate.trim(),
      reservationTime: reservationTime.trim(),
      bookingDate: bookingDateNow,
      adults: adultsNum,
      children: childrenNum,
      totalPriceMad: totalPrice,
      selectedItems: selectedItems ? (typeof selectedItems === 'string' ? selectedItems : JSON.stringify(selectedItems)) : null,
      status: 'pending',
      paymentStatus: 'pending',
      notes: notes ? notes.trim() : null,
      createdAt: now,
      updatedAt: now
    };

    const newReservation = await db.insert(reservations)
      .values(insertData)
      .returning();

    return NextResponse.json(newReservation[0], { status: 201 });

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
    
    // Pagination parameters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    
    // Filter parameters
    const userIdParam = searchParams.get('user_id');
    const statusParam = searchParams.get('status');
    const search = searchParams.get('search');

    // Build query
    let query: any = db.select().from(reservations);

    // Build WHERE conditions
    const conditions = [];

    if (userIdParam) {
      const userIdNum = parseInt(userIdParam);
      if (!isNaN(userIdNum)) {
        conditions.push(eq(reservations.userId, userIdNum));
      }
    }

    if (statusParam) {
      conditions.push(eq(reservations.status, statusParam.trim()));
    }

    if (search) {
      const searchTerm = `%${search}%`;
      conditions.push(
        or(
          like(reservations.excursionName, searchTerm),
          like(reservations.destination, searchTerm)
        )
      );
    }

    // Apply WHERE conditions
    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }

    // Apply ordering and pagination
    const results = await query
      .orderBy(desc(reservations.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}