'use client';
import { useParams } from 'next/navigation';
import { useDashboard } from '@/hooks/useDashboard';
import DashboardRenderer from '@/components/dashboard/DashboardRenderer';

export default function AdminPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = useDashboard(slug);

  if (isLoading) {
    return (
      <div className="flex-1 p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-gray-200 rounded w-48" />
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-gray-500">
            {error?.message === 'Forbidden'
              ? 'Admin access required.'
              : 'Could not load dashboard config.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Project dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Layout is config-driven from MongoDB — edit the DashboardConfig
            document to change this page.
          </p>
        </div>
        <DashboardRenderer config={data} slug={slug} />
      </div>
    </div>
  );
}
