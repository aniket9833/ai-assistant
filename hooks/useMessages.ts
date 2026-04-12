import { useQuery } from '@tanstack/react-query';

export function useMessages(slug: string, conversationId: string) {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () =>
      fetch(`/api/${slug}/conversations/${conversationId}/messages`).then((r) =>
        r.json(),
      ),
    enabled: !!conversationId,
    refetchInterval: false,
  });
}
