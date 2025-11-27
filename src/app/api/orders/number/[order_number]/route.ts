import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ order_number: string }> }
) {
  try {
    const { order_number } = await params;

    if (!order_number || order_number.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Order number is required',
          code: 'INVALID_ORDER_NUMBER' 
        },
        { status: 400 }
      );
    }

    const order = await db
      .select()
      .from(orders)
      .where(eq(orders.orderNumber, order_number))
      .limit(1);

    if (order.length === 0) {
      return NextResponse.json(
        { 
          error: 'Order not found',
          code: 'ORDER_NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json(order[0], { status: 200 });
  } catch (error) {
    console.error('GET order by number error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}