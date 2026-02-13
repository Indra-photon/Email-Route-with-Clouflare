import mongoose, { Schema, type Document, type Model, Types } from "mongoose";

export interface IDomain extends Document {
  workspaceId: Types.ObjectId;
  domain: string;
  status: "pending_verification" | "active";
  createdAt: Date;
  updatedAt: Date;
}

const DomainSchema = new Schema<IDomain>(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },
    domain: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending_verification", "active"],
      default: "pending_verification",
    },
  },
  {
    timestamps: true,
  }
);

DomainSchema.index({ workspaceId: 1, domain: 1 }, { unique: true });

export const Domain: Model<IDomain> =
  (mongoose.models.Domain as Model<IDomain>) ||
  mongoose.model<IDomain>("Domain", DomainSchema);

