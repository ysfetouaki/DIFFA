import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { excursionSettings } from '@/db/schema';
import { asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const settings = await db.select()
      .from(excursionSettings)
      .orderBy(asc(excursionSettings.section));

    const formattedSettings = settings.map(setting => ({
      ...setting,
      showPrice: Boolean(setting.showPrice)
    }));

    return NextResponse.json(formattedSettings, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}