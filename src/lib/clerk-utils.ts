import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Sync Clerk user with database
 * Creates or updates user in database when they sign in
 */
export async function syncUserWithDatabase() {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return null;
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress;
    if (!email) {
      return null;
    }

    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkUser.id))
      .limit(1);

    if (existingUser.length > 0) {
      // Update existing user
      const updated = await db
        .update(users)
        .set({
          email,
          name: clerkUser.firstName && clerkUser.lastName 
            ? `${clerkUser.firstName} ${clerkUser.lastName}` 
            : clerkUser.firstName || clerkUser.username || null,
          phone: clerkUser.phoneNumbers[0]?.phoneNumber || null,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(users.clerkId, clerkUser.id))
        .returning();

      return updated[0];
    } else {
      // Create new user
      const newUser = await db
        .insert(users)
        .values({
          clerkId: clerkUser.id,
          email,
          name: clerkUser.firstName && clerkUser.lastName 
            ? `${clerkUser.firstName} ${clerkUser.lastName}` 
            : clerkUser.firstName || clerkUser.username || null,
          phone: clerkUser.phoneNumbers[0]?.phoneNumber || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .returning();

      return newUser[0];
    }
  } catch (error) {
    console.error('Error syncing user with database:', error);
    return null;
  }
}
