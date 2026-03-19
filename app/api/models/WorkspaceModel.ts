import mongoose, { Schema, type Document, type Model, Types } from "mongoose";

export type PlanId = "starter" | "growth" | "scale";

export interface IWorkspace extends Document {
  ownerUserId: string;
  name: string;
  planId: PlanId | null;           // null = no paid plan yet
  subscriptionId?: Types.ObjectId;
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
    planId: {
      type: String,
      enum: ["starter", "growth", "scale", null],
      default: null,   // null = no active subscription (must purchase)
    },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Workspace: Model<IWorkspace> =
  (mongoose.models.Workspace as Model<IWorkspace>) ||
  mongoose.model<IWorkspace>("Workspace", WorkspaceSchema);

