import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SendMessageSchema } from '@/lib/schemas/chat';
import { sendChat } from '@/lib/services/chatService';
import {
  getProjectBySlug,
  getUserWithProject,
} from '@/lib/services/projectService';
import { canSendMessage } from '@/lib/access';

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const body = await req.json();
  const parsed = SendMessageSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: 'Invalid input', issues: parsed.error.issues },
      { status: 400 },
    );
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  if (!userId)
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const [project, user] = await Promise.all([
    getProjectBySlug(params.slug),
    getUserWithProject(userId),
  ]);

  if (!project || !user)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (!canSendMessage(user, project._id.toString()))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const result = await sendChat(
      parsed.data.conversationId,
      project._id.toString(),
      parsed.data.content,
    );
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
