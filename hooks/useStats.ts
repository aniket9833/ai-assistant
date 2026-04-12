import { useQuery } from '@tanstack/react-query';

export function useStats(slug: string) {
  return useQuery({
    queryKey: ['stats', slug],
    queryFn: () => fetch(`/api/${slug}/stats`).then((r) => r.json()),
    enabled: !!slug,
    retry: false,
  });
}
