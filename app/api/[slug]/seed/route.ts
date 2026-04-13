import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Project } from '@/lib/models/Project';
import { User } from '@/lib/models/User';
import { ProductInstance } from '@/lib/models/ProductInstance';
import { DashboardConfig } from '@/lib/models/DashboardConfig';

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production')
    return NextResponse.json(
      { error: 'Disabled in production' },
      { status: 403 },
    );

  await connectDB();

  // Clear existing data
  await Promise.all([
    Project.deleteMany({}),
    User.deleteMany({}),
    ProductInstance.deleteMany({}),
    DashboardConfig.deleteMany({}),
  ]);

  const project = await Project.create({ name: 'Acme Corp', slug: 'acme' });

  const [alice, bob] = await Promise.all([
    User.create({
      name: 'Alice',
      email: 'alice@acme.com',
      projectId: project._id,
      role: 'admin',
    }),
    User.create({
      name: 'Bob',
      email: 'bob@acme.com',
      projectId: project._id,
      role: 'member',
    }),
  ]);

  await ProductInstance.create({
    projectId: project._id,
    name: 'AI Sales Assistant',
    productType: 'ai-sales-assistant',
    integrations: { shopify: { enabled: true }, crm: { enabled: true } },
  });

  await DashboardConfig.create({
    projectId: project._id,
    sections: [
      {
        title: 'Overview',
        order: 1,
        widgets: [
          {
            widgetType: 'stat_card',
            label: 'Total conversations',
            order: 1,
            config: { dataKey: 'totalConversations', icon: 'chat' },
          },
          {
            widgetType: 'stat_card',
            label: 'Active users',
            order: 2,
            config: { dataKey: 'activeUsers', icon: 'users' },
          },
          {
            widgetType: 'stat_card',
            label: 'Messages sent',
            order: 3,
            config: { dataKey: 'totalMessages', icon: 'message' },
          },
        ],
      },
      {
        title: 'Integrations',
        order: 2,
        widgets: [
          {
            widgetType: 'integration_toggle',
            label: 'Shopify',
            order: 1,
            config: {
              integration: 'shopify',
              description: 'E-commerce orders and product data',
            },
          },
          {
            widgetType: 'integration_toggle',
            label: 'CRM',
            order: 2,
            config: {
              integration: 'crm',
              description: 'Customer contacts and pipeline',
            },
          },
        ],
      },
      {
        title: 'Recent activity',
        order: 3,
        widgets: [
          {
            widgetType: 'conversation_table',
            label: 'Recent conversations',
            order: 1,
            config: {},
          },
        ],
      },
    ],
  });

  return NextResponse.json({
    ok: true,
    users: { alice: alice._id.toString(), bob: bob._id.toString() },
  });
}
