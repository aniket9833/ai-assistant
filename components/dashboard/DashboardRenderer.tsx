import StatCard from './widgets/StatCard';
import IntegrationToggle from './widgets/IntegrationToggle';
import ConversationTable from './widgets/ConversationTable';
import { useStats } from '@/hooks/useStats';
import { useConversations } from '@/hooks/useConversations';

interface Section {
  title: string;
  order: number;
  widgets: Widget[];
}

interface Widget {
  widgetType: string;
  label: string;
  config: Record<string, unknown>;
  order: number;
}

interface DashboardConfig {
  sections?: Section[];
}

// Each widget component has different prop requirements, so we use any
// to accommodate the flexible widget mapping pattern
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WidgetComponentType = React.ComponentType<any>;

const WIDGET_MAP: Record<string, WidgetComponentType> = {
  stat_card: StatCard,
  integration_toggle: IntegrationToggle,
  conversation_table: ConversationTable,
};

interface Props {
  config: DashboardConfig | null;
  slug: string;
}

export default function DashboardRenderer({ config, slug }: Props) {
  const { data: stats } = useStats(slug);
  const { data: conversations = [] } = useConversations(slug);

  if (!config) {
    return (
      <div className="text-center py-16 text-gray-400 text-sm">
        No dashboard config found in MongoDB.
      </div>
    );
  }

  const sections = [...(config.sections ?? [])].sort(
    (a: Section, b: Section) => a.order - b.order,
  );

  return (
    <div className="space-y-10">
      {sections.map((section: Section) => {
        const widgets = [...(section.widgets ?? [])].sort(
          (a: Widget, b: Widget) => a.order - b.order,
        );
        return (
          <div key={section.title}>
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
              {section.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {widgets.map((widget: Widget, i: number) => {
                const Component = WIDGET_MAP[widget.widgetType];
                if (!Component) return null;
                return (
                  <Component
                    key={i}
                    label={widget.label}
                    config={widget.config}
                    stats={stats}
                    conversations={conversations}
                    slug={slug}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
