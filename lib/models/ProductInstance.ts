import { Schema, model, models } from 'mongoose';

const ProductInstanceSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  name: String,
  productType: { type: String, default: 'ai-sales-assistant' },
  integrations: {
    shopify: { enabled: { type: Boolean, default: false } },
    crm: { enabled: { type: Boolean, default: false } },
  },
});

export const ProductInstance =
  models.ProductInstance || model('ProductInstance', ProductInstanceSchema);
