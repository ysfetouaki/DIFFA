import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { services, users } from '@/db/schema';
import { eq, desc, asc } from 'drizzle-orm';

interface MultilingualText {
  en: string;
  fr: string;
  es: string;
  it: string;
}

function validateMultilingualText(value: any, fieldName: string): { valid: boolean; error?: string } {
  if (!value || typeof value !== 'object') {
    return { valid: false, error: `${fieldName} must be an object` };
  }

  const requiredKeys = ['en', 'fr', 'es', 'it'];
  for (const key of requiredKeys) {
    if (!(key in value)) {
      return { valid: false, error: `${fieldName} must contain ${key} key` };
    }
    if (typeof value[key] !== 'string' || value[key].trim() === '') {
      return { valid: false, error: `${fieldName}.${key} must be a non-empty string` };
    }
  }

  return { valid: true };
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required', code: 'UNAUTHORIZED' }, { status: 401 });
    }

    const requestingUser = await db.select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (requestingUser.length === 0 || requestingUser[0].role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required', code: 'FORBIDDEN' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const activeParam = searchParams.get('active');

    let query: any = db.select().from(services);

    if (activeParam !== null) {
      const activeValue = activeParam === 'true';
      query = query.where(eq(services.active, activeValue));
    }

    const results = await query
      .orderBy(asc(services.order), desc(services.createdAt))
      .limit(limit)
      .offset(offset);

    const parsedResults = results.map((service: any) => ({
      ...service,
      title: typeof service.title === 'string' ? JSON.parse(service.title) : service.title,
      description: typeof service.description === 'string' ? JSON.parse(service.description) : service.description,
      active: Boolean(service.active)
    }));

    return NextResponse.json(parsedResults);
  } catch (error) {
    console.error('GET services error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required', code: 'UNAUTHORIZED' }, { status: 401 });
    }

    const requestingUser = await db.select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (requestingUser.length === 0 || requestingUser[0].role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required', code: 'FORBIDDEN' }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, icon, order = 0, active = true } = body;

    if (!title) {
      return NextResponse.json({ 
        error: 'Title is required', 
        code: 'MISSING_TITLE' 
      }, { status: 400 });
    }

    if (!description) {
      return NextResponse.json({ 
        error: 'Description is required', 
        code: 'MISSING_DESCRIPTION' 
      }, { status: 400 });
    }

    if (!icon || typeof icon !== 'string' || icon.trim() === '') {
      return NextResponse.json({ 
        error: 'Icon is required and must be a non-empty string', 
        code: 'INVALID_ICON' 
      }, { status: 400 });
    }

    const titleValidation = validateMultilingualText(title, 'title');
    if (!titleValidation.valid) {
      return NextResponse.json({ 
        error: titleValidation.error, 
        code: 'INVALID_TITLE_FORMAT' 
      }, { status: 400 });
    }

    const descriptionValidation = validateMultilingualText(description, 'description');
    if (!descriptionValidation.valid) {
      return NextResponse.json({ 
        error: descriptionValidation.error, 
        code: 'INVALID_DESCRIPTION_FORMAT' 
      }, { status: 400 });
    }

    if (typeof order !== 'number' || order < 0 || !Number.isInteger(order)) {
      return NextResponse.json({ 
        error: 'Order must be an integer greater than or equal to 0', 
        code: 'INVALID_ORDER' 
      }, { status: 400 });
    }

    if (typeof active !== 'boolean') {
      return NextResponse.json({ 
        error: 'Active must be a boolean', 
        code: 'INVALID_ACTIVE' 
      }, { status: 400 });
    }

    const now = new Date().toISOString();

    const newService = await db.insert(services)
      .values({
        title: JSON.stringify(title),
        description: JSON.stringify(description),
        icon: icon.trim(),
        order,
        active: active,
        createdAt: now,
        updatedAt: now
      })
      .returning();

    const parsedService = {
      ...newService[0],
      title: typeof newService[0].title === 'string' ? JSON.parse(newService[0].title) : newService[0].title,
      description: typeof newService[0].description === 'string' ? JSON.parse(newService[0].description) : newService[0].description,
      active: Boolean(newService[0].active)
    };

    return NextResponse.json(parsedService, { status: 201 });
  } catch (error) {
    console.error('POST services error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}