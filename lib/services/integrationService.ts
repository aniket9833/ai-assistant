export async function getIntegrationData(type: 'shopify' | 'crm') {
  if (type === 'shopify') {
    return {
      recentOrders: [{ id: 'ORD-001', total: 120, status: 'fulfilled' }],
    };
  }
  if (type === 'crm') {
    return {
      contacts: [{ name: 'Acme Corp', stage: 'negotiation', value: 5000 }],
    };
  }
}
