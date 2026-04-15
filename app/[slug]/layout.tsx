import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  getProjectBySlug,
  getUserWithProject,
} from '@/lib/services/projectService';
import ChatShell from '@/components/chat/ChatShell';

export default async function SlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const cookiesStore = await cookies();
  const userId = cookiesStore.get('userId')?.value;
  if (!userId) redirect('/login');

  const [project, user] = await Promise.all([
    getProjectBySlug(params.slug),
    getUserWithProject(userId),
  ]);

  if (!project) redirect('/login');
  if (!user || user.projectId.toString() !== project._id.toString()) {
    redirect('/login');
  }

  return (
    <ChatShell
      slug={params.slug}
      projectName={project.name}
      userRole={user.role}
      userName={user.name}
    >
      {children}
    </ChatShell>
  );
}
