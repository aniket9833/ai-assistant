import { useQuery } from '@tanstack/react-query';

export function useDashboard(slug: string) {
  return useQuery({
    queryKey: ['dashboard', slug],
    queryFn: () => fetch(`/api/${slug}/admin/dashboard`).then((r) => r.json()),
  });
}
