import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useChat(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { conversationId: string; content: string }) =>
      fetch(`/api/${slug}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).then((r) => r.json()),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['messages', vars.conversationId] });
      qc.invalidateQueries({ queryKey: ['conversations', slug] });
    },
  });
}
