'use client';
import { useParams, usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useConversations } from '@/hooks/useConversations';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface Conversation {
  _id: string;
  title?: string;
}

interface Props {
  children: React.ReactNode;
  slug: string;
  projectName: string;
  userRole: string;
  userName: string;
}

export default function ChatShell({
  children,
  slug,
  projectName,
  userRole,
  userName,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const qc = useQueryClient();
  const { data: conversations = [] } = useConversations(slug);

  const createConvo = useMutation({
    mutationFn: () =>
      fetch(`/api/${slug}/conversations`, { method: 'POST' }).then((r) =>
        r.json(),
      ),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['conversations', slug] });
      router.push(`/${slug}/chat/${data._id}`);
    },
  });

  function logout() {
    document.cookie = 'userId=; path=/; max-age=0';
    router.push('/login');
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col bg-gray-950 text-gray-300 flex-shrink-0">
        {/* Project header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
              {projectName[0]}
            </div>
            <div>
              <p className="text-sm font-medium text-white leading-none">
                {projectName}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 capitalize">
                {userRole}
              </p>
            </div>
          </div>
        </div>

        {/* New chat button */}
        <div className="p-3">
          <button
            onClick={() => createConvo.mutate()}
            disabled={createConvo.isPending}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New chat
          </button>
        </div>

        {/* Conversations */}
        <nav className="flex-1 overflow-y-auto px-3 pb-2 space-y-0.5">
          {conversations.length === 0 && (
            <p className="text-xs text-gray-600 px-2 py-3">
              No conversations yet
            </p>
          )}
          {conversations.map((c: Conversation) => {
            const href = `/${slug}/chat/${c._id}`;
            const active = pathname === href;
            return (
              <Link
                key={c._id}
                href={href}
                className={`block px-2 py-2 rounded-lg text-sm truncate transition-colors ${
                  active
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }`}
              >
                {c.title || 'New conversation'}
              </Link>
            );
          })}
        </nav>

        {/* Bottom nav */}
        <div className="border-t border-gray-800 p-3 space-y-0.5">
          {userRole === 'admin' && (
            <Link
              href={`/${slug}/admin`}
              className={`flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-colors ${
                pathname.includes('/admin')
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Dashboard
            </Link>
          )}
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="text-xs">{userName} · Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">{children}</main>
    </div>
  );
}
