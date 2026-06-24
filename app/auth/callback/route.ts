import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data?.user) {
      const user = data.user;

      // Sync user profile into PostgreSQL database via Prisma
      try {
        const existingUser = await prisma.user.findUnique({
          where: { id: user.id }
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              id: user.id,
              name: user.user_metadata.full_name || user.email?.split('@')[0] || 'Explorer',
              email: user.email!,
              avatar: user.user_metadata.avatar_url || 'backpack',
              role: 'student', // Default role for signup
            }
          });
        }
      } catch (dbError) {
        console.error('Error syncing user to database in callback:', dbError);
      }
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
