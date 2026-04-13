'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface Props {
  label: string;
  config: { integration: 'shopify' | 'crm'; description?: string };
  slug: string;
}

export default function IntegrationToggle({ label, config, slug }: Props) {
  const qc = useQueryClient();

  const { data: integrations } = useQuery({
    queryKey: ['integrations', slug],
    queryFn: () => fetch(`/api/${slug}/integrations`).then((r) => r.json()),
  });

  const toggle = useMutation({
    mutationFn: (enabled: boolean) =>
      fetch(`/api/${slug}/integrations`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ integration: config.integration, enabled }),
      }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['integrations', slug] }),
  });

  const enabled = integrations?.[config.integration]?.enabled ?? false;

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-800">{label}</p>
          {config.description && (
            <p className="text-xs text-gray-400 mt-0.5">{config.description}</p>
          )}
        </div>
        <button
          onClick={() => toggle.mutate(!enabled)}
          disabled={toggle.isPending}
          className={`relative shrink-0 w-11 h-6 rounded-full transition-colors ${
            enabled ? 'bg-indigo-500' : 'bg-gray-200'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
              enabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
      <div
        className={`mt-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
          enabled ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-400'}`}
        />
        {enabled ? 'Active' : 'Inactive'}
      </div>
    </div>
  );
}
