import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { auth } from "@/../auth";
import { db } from '@/lib/db';

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename || !request.body) {
    return new NextResponse('No filename or file body provided', { status: 400 });
  }

  const blob = await put(filename, request.body, {
    access: 'public',
  });

  // Update user's image in the database
  await db.user.update({
    where: { id: session.user.id },
    data: { image: blob.url },
  });

  return NextResponse.json(blob);
}
