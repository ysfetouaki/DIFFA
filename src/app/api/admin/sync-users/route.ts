import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST() {
  try {
    // Authentication check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if requesting user is admin
    const requestingUser = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    // If user doesn't exist in DB yet, check Clerk metadata
    let isAdmin = false;
    if (requestingUser.length === 0) {
      const client = await clerkClient();
      const clerkUser = await client.users.getUser(userId);
      isAdmin = clerkUser.publicMetadata?.role === 'admin';
    } else {
      isAdmin = requestingUser[0].role === 'admin';
    }

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Fetch all users from Clerk
    const client = await clerkClient();
    const clerkUsers = await client.users.getUserList({ limit: 100 });

    let synced = 0;
    let updated = 0;
    let skipped = 0;

    for (const clerkUser of clerkUsers.data) {
      try {
        // Check if user exists in database
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.clerkId, clerkUser.id))
          .limit(1);

        const userData = {
          clerkId: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          name: clerkUser.firstName && clerkUser.lastName 
            ? `${clerkUser.firstName} ${clerkUser.lastName}` 
            : clerkUser.firstName || clerkUser.lastName || null,
          phone: clerkUser.phoneNumbers[0]?.phoneNumber || null,
          role: (clerkUser.publicMetadata?.role as string) || 'user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        if (existingUser.length === 0) {
          // Insert new user
          await db.insert(users).values(userData);
          synced++;
        } else {
          // Update existing user
          await db
            .update(users)
            .set({
              email: userData.email,
              name: userData.name,
              phone: userData.phone,
              role: userData.role,
              updatedAt: new Date().toISOString(),
            })
            .where(eq(users.clerkId, clerkUser.id));
          updated++;
        }
      } catch (error) {
        console.error(`Error syncing user ${clerkUser.id}:`, error);
        skipped++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${synced} new users, updated ${updated} users${skipped > 0 ? `, skipped ${skipped} users` : ''}`,
      synced,
      updated,
      skipped,
      total: clerkUsers.data.length
    });

  } catch (error) {
    console.error('Sync users error:', error);
    return NextResponse.json(
      { error: 'Failed to sync users: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}