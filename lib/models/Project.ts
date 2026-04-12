import { Schema, model, models, Types } from 'mongoose';

const ProjectSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

export const Project = models.Project || model('Project', ProjectSchema);
export type ProjectType = {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
};
