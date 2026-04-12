import { useQuery } from '@tanstack/react-query';

export function useConversations(slug: string) {
  return useQuery({
    queryKey: ['conversations', slug],
    queryFn: () => fetch(`/api/${slug}/conversations`).then((r) => r.json()),
    enabled: !!slug,
  });
}
