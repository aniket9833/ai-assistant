import { connectDB } from '../db';
import { Project } from '../models/Project';
import { User } from '../models/User';

export async function getProjectBySlug(slug: string) {
  await connectDB();
  return Project.findOne({ slug }).lean();
}

export async function getUserWithProject(userId: string) {
  await connectDB();
  return User.findById(userId).lean();
}
