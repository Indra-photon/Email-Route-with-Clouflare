import mongoose, { Schema, type Document, type Model, Types } from "mongoose";

export type PlanId = "starter" | "growth" | "scale";

export interface IWorkspace extends Document {
  ownerUserId: string;
  name: string;
  planId: PlanId | null;           // null = no paid plan yet
  subscriptionId?: Types.ObjectId;
  ticketCounter: number;           // auto-increments per workspace for ticket numbering
  // Full AI tag list for this workspace.
  // Seeded with DEFAULT_AI_TAGS on first use, then fully editable by the owner.
  // Users can add/remove any tag (including the defaults) via the dashboard.
  aiTags: string[];
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
    ticketCounter: {
      type: Number,
      default: 0,   // incremented atomically via $inc on each new root ticket
    },
    // Full AI tag list — empty means "not yet configured", webhook will seed from DEFAULT_AI_TAGS
    aiTags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Workspace: Model<IWorkspace> =
  (mongoose.models.Workspace as Model<IWorkspace>) ||
  mongoose.model<IWorkspace>("Workspace", WorkspaceSchema);
