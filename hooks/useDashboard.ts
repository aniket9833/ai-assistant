import { useQuery } from '@tanstack/react-query';

export function useDashboard(slug: string) {
  return useQuery({
    queryKey: ['dashboard', slug],
    queryFn: async () => {
      const res = await fetch(`/api/${slug}/admin/dashboard`);
      if (res.status === 403) throw new Error('Forbidden');
      if (!res.ok) throw new Error('Failed to load');
      return res.json();
    },
    enabled: !!slug,
    retry: false,
  });
}
