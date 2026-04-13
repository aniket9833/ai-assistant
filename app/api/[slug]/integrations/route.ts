import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { ProductInstance } from '@/lib/models/ProductInstance';
import {
  getProjectBySlug,
  getUserWithProject,
} from '@/lib/services/projectService';
import { canAccessProject, isAdminOfProject } from '@/lib/access';

const ToggleSchema = z.object({
  integration: z.enum(['shopify', 'crm']),
  enabled: z.boolean(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const cookieStore = await cookies();

  const userId = cookieStore.get('userId')?.value;
  if (!userId)
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const body = await req.json();
  const parsed = ToggleSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  await connectDB();
  const [project, user] = await Promise.all([
    getProjectBySlug(params.slug),
    getUserWithProject(userId),
  ]);

  if (!project || !user)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (
    !canAccessProject(user, project._id.toString()) ||
    !isAdminOfProject(user)
  )
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const updateKey = `integrations.${parsed.data.integration}.enabled`;
  await ProductInstance.findOneAndUpdate(
    { projectId: project._id },
    { $set: { [updateKey]: parsed.data.enabled } },
  );

  return NextResponse.json({ ok: true });
}

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

  const instance = await ProductInstance.findOne({
    projectId: project._id,
  }).lean();
  return NextResponse.json(instance?.integrations ?? {});
}
