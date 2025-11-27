import { connectDB } from '@/lib/mongodb';
import { Excursion } from '@/models/Excursion';
import { NextResponse } from 'next/server';

// GET all excursions (public route)
export async function GET() {
  try {
    await connectDB();
    const excursions = await Excursion.find({}).sort({ createdAt: -1 }).lean();
    
    return NextResponse.json({ success: true, data: excursions });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch excursions' },
      { status: 500 }
    );
  }
}
