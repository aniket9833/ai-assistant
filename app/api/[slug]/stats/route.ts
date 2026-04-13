import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/db';
import { Conversation } from '@/lib/models/Conversation';
import { Message } from '@/lib/models/Message';
import { User } from '@/lib/models/User';
import {
  getProjectBySlug,
  getUserWithProject,
} from '@/lib/services/projectService';
import { canAccessProject, isAdminOfProject } from '@/lib/access';

type Params = {
  slug: string;
};

export async function GET(req: NextRequest, context: { params: Params }) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  await connectDB();

  const { slug } = context.params;

  const [project, user] = await Promise.all([
    getProjectBySlug(slug),
    getUserWithProject(userId),
  ]);

  if (!project || !user) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const projectId = project._id.toString();

  if (!canAccessProject(user, projectId) || !isAdminOfProject(user)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const conversations = await Conversation.find({ projectId })
    .select('_id')
    .lean();
  const conversationIds = conversations.map((c) => c._id);

  const [totalConversations, totalMessages, activeUsers] = await Promise.all([
    Conversation.countDocuments({ projectId }),
    Message.countDocuments({ conversationId: { $in: conversationIds } }),
    User.countDocuments({ projectId }),
  ]);

  return NextResponse.json({
    totalConversations,
    totalMessages,
    activeUsers,
  });
}
