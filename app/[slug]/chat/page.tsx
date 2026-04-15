'use client';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function NewChatPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const qc = useQueryClient();

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

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-indigo-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-1">
        Start a conversation
      </h2>
      <p className="text-sm text-gray-500 mb-6 max-w-xs">
        Ask anything — your AI assistant has access to your connected
        integrations.
      </p>
      <button
        onClick={() => createConvo.mutate()}
        disabled={createConvo.isPending}
        className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 transition-colors"
      >
        {createConvo.isPending ? 'Creating...' : 'New conversation'}
      </button>
    </div>
  );
}
