import { connectDB } from '../db';
import { DashboardConfig } from '../models/DashboardConfig';

export async function getDashboardConfig(projectId: string) {
  await connectDB();
  return DashboardConfig.findOne({ projectId }).lean();
}
