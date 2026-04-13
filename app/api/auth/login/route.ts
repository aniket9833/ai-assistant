import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';

export async function POST(req: NextRequest) {
  const { userId } = await req.json();
  if (!userId)
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

  await connectDB();
  const user = await User.findById(userId).lean();
  if (!user)
    return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const res = NextResponse.json({ ok: true });
  res.cookies.set('userId', userId, {
    httpOnly: true,
    path: '/',
    maxAge: 86400,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete('userId');
  return res;
}
