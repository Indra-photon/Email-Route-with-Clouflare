import mongoose, { Schema, type Document, type Model, Types } from "mongoose";

export interface IWorkspace extends Document {
  ownerUserId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const WorkspaceSchema = new Schema<IWorkspace>(
  {
    ownerUserId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      default: "Default Workspace",
    },
  },
  {
    timestamps: true,
  }
);

export const Workspace: Model<IWorkspace> =
  (mongoose.models.Workspace as Model<IWorkspace>) ||
  mongoose.model<IWorkspace>("Workspace", WorkspaceSchema);

