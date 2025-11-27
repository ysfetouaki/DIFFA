import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { services, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

async function validateAdmin(userId: string) {
  const user = await db.select()
    .from(users)
    .where(eq(users.clerkId, userId))
    .limit(1);

  if (user.length === 0) {
    return { authorized: false, error: 'User not found', status: 404 };
  }

  if (user[0].role !== 'admin') {
    return { authorized: false, error: 'Admin access required', status: 403 };
  }

  return { authorized: true };
}

function validateMultilingualField(field: any, fieldName: string): { valid: boolean; error?: string } {
  if (typeof field !== 'object' || field === null || Array.isArray(field)) {
    return { valid: false, error: `${fieldName} must be an object` };
  }

  const requiredKeys = ['en', 'fr', 'es', 'it'];
  for (const key of requiredKeys) {
    if (!(key in field)) {
      return { valid: false, error: `${fieldName} must contain '${key}' key` };
    }
    if (typeof field[key] !== 'string' || field[key].trim() === '') {
      return { valid: false, error: `${fieldName}.${key} must be a non-empty string` };
    }
  }

  return { valid: true };
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const adminCheck = await validateAdmin(userId);
    if (!adminCheck.authorized) {
      return NextResponse.json(
        { error: adminCheck.error, code: 'FORBIDDEN' },
        { status: adminCheck.status }
      );
    }

    const { id } = await params;
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const serviceId = parseInt(id);

    const existingService = await db.select()
      .from(services)
      .where(eq(services.id, serviceId))
      .limit(1);

    if (existingService.length === 0) {
      return NextResponse.json(
        { error: 'Service not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { title, description, icon, order, active } = body;

    const updates: Partial<{
      updatedAt: string;
      title: string;
      description: string;
      icon: string;
      order: number;
      active: boolean;
    }> = {
      updatedAt: new Date().toISOString()
    };

    if (title !== undefined) {
      const titleValidation = validateMultilingualField(title, 'title');
      if (!titleValidation.valid) {
        return NextResponse.json(
          { error: titleValidation.error, code: 'INVALID_TITLE' },
          { status: 400 }
        );
      }
      updates.title = JSON.stringify(title);
    }

    if (description !== undefined) {
      const descValidation = validateMultilingualField(description, 'description');
      if (!descValidation.valid) {
        return NextResponse.json(
          { error: descValidation.error, code: 'INVALID_DESCRIPTION' },
          { status: 400 }
        );
      }
      updates.description = JSON.stringify(description);
    }

    if (icon !== undefined) {
      if (typeof icon !== 'string' || icon.trim() === '') {
        return NextResponse.json(
          { error: 'Icon must be a non-empty string', code: 'INVALID_ICON' },
          { status: 400 }
        );
      }
      updates.icon = icon.trim();
    }

    if (order !== undefined) {
      if (!Number.isInteger(order) || order < 0) {
        return NextResponse.json(
          { error: 'Order must be an integer >= 0', code: 'INVALID_ORDER' },
          { status: 400 }
        );
      }
      updates.order = order;
    }

    if (active !== undefined) {
      if (typeof active !== 'boolean') {
        return NextResponse.json(
          { error: 'Active must be a boolean', code: 'INVALID_ACTIVE' },
          { status: 400 }
        );
      }
      updates.active = active;
    }

    const updatedService = await db.update(services)
      .set(updates)
      .where(eq(services.id, serviceId))
      .returning();

    if (updatedService.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update service', code: 'UPDATE_FAILED' },
        { status: 500 }
      );
    }

    const result = {
      ...updatedService[0],
      title: updatedService[0].title ? JSON.parse(updatedService[0].title as string) : null,
      description: updatedService[0].description ? JSON.parse(updatedService[0].description as string) : null,
      active: Boolean(updatedService[0].active)
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const adminCheck = await validateAdmin(userId);
    if (!adminCheck.authorized) {
      return NextResponse.json(
        { error: adminCheck.error, code: 'FORBIDDEN' },
        { status: adminCheck.status }
      );
    }

    const { id } = await params;
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const serviceId = parseInt(id);

    const existingService = await db.select()
      .from(services)
      .where(eq(services.id, serviceId))
      .limit(1);

    if (existingService.length === 0) {
      return NextResponse.json(
        { error: 'Service not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deletedService = await db.delete(services)
      .where(eq(services.id, serviceId))
      .returning();

    if (deletedService.length === 0) {
      return NextResponse.json(
        { error: 'Failed to delete service', code: 'DELETE_FAILED' },
        { status: 500 }
      );
    }

    const result = {
      ...deletedService[0],
      title: deletedService[0].title ? JSON.parse(deletedService[0].title as string) : null,
      description: deletedService[0].description ? JSON.parse(deletedService[0].description as string) : null,
      active: Boolean(deletedService[0].active)
    };

    return NextResponse.json(
      {
        message: 'Service deleted successfully',
        service: result
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}