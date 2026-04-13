import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  getProjectBySlug,
  getUserWithProject,
} from '@/lib/services/projectService';
import { canAccessProject } from '@/lib/access';
import { connectDB } from '@/lib/db';
import { Conversation } from '@/lib/models/Conversation';
import { ProductInstance } from '@/lib/models/ProductInstance';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } },
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

  const conversations = await Conversation.find({ projectId: project._id })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return NextResponse.json(conversations);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } },
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

  const instance = await ProductInstance.findOne({
    projectId: project._id,
  }).lean();
  if (!instance)
    return NextResponse.json({ error: 'No product instance' }, { status: 400 });

  const convo = await Conversation.create({
    projectId: project._id,
    productInstanceId: instance._id,
    title: 'New conversation',
  });

  return NextResponse.json(convo);
}
