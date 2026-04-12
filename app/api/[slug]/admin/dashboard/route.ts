import { NextRequest, NextResponse } from 'next/server';
import {
  getProjectBySlug,
  getUserWithProject,
} from '@/lib/services/projectService';
import { isAdminOfProject, canAccessProject } from '@/lib/access';
import { getDashboardConfig } from '@/lib/services/dashboardService';
import { cookies } from 'next/headers';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const userId = (await cookies()).get('userId')?.value;
  if (!userId)
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

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

  const config = await getDashboardConfig(project._id.toString());
  return NextResponse.json(config);
}
