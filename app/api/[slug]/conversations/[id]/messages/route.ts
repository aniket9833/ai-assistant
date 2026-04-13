import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  getProjectBySlug,
  getUserWithProject,
} from '@/lib/services/projectService';
import { canAccessProject } from '@/lib/access';
import { connectDB } from '@/lib/db';
import { Message } from '@/lib/models/Message';
import { Conversation } from '@/lib/models/Conversation';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string; id: string } },
) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  if (!userId)
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  await connectDB();
  const [project, user] = await Promise.all([
    getProjectBySlug(params.slug),
    getUserWithProject(userId),
  ]);

  if (!project || !user)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (!canAccessProject(user, project._id.toString()))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const convo = await Conversation.findById(params.id).lean();
  if (!convo || convo.projectId.toString() !== project._id.toString())
    return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const messages = await Message.find({ conversationId: params.id })
    .sort({ createdAt: 1 })
    .lean();

  return NextResponse.json(messages);
}
