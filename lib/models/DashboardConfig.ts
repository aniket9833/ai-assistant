import { Schema, model, models } from 'mongoose';

const WidgetSchema = new Schema(
  {
    widgetType: String,
    label: String,
    order: Number,
    config: Schema.Types.Mixed, // arbitrary per-widget config
  },
  { _id: false },
);

const SectionSchema = new Schema(
  {
    title: String,
    order: Number,
    widgets: [WidgetSchema],
  },
  { _id: false },
);

const DashboardConfigSchema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    unique: true,
  },
  sections: [SectionSchema],
});

export const DashboardConfig =
  models.DashboardConfig || model('DashboardConfig', DashboardConfigSchema);
