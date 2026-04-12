import { NextRequest, NextResponse } from 'next/server';
import { SendMessageSchema } from '@/lib/schemas/chat';
import { sendChat } from '@/lib/services/chatService';
import {
  getProjectBySlug,
  getUserWithProject,
} from '@/lib/services/projectService';
import { canSendMessage } from '@/lib/access';
import { cookies } from 'next/headers';

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const body = await req.json();
  const parsed = SendMessageSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  const userId = (await cookies()).get('userId')?.value;
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

  const result = await sendChat(
    parsed.data.conversationId,
    project._id.toString(),
    parsed.data.content,
  );
  return NextResponse.json(result);
}
