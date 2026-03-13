import mongoose, { Schema, type Document, type Model, Types } from "mongoose";

export interface ICannedResponse extends Document {
  workspaceId: Types.ObjectId;
  aliasId: Types.ObjectId;
  title: string;
  body: string;
  createdBy: string; // Clerk user ID
  createdAt: Date;
  updatedAt: Date;
}

const CannedResponseSchema = new Schema<ICannedResponse>(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },
    aliasId: {
      type: Schema.Types.ObjectId,
      ref: "Alias",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    createdBy: {
      type: String,
      required: true, // Clerk user ID
    },
  },
  {
    timestamps: true,
  }
);

// Fetch all canned responses for a given alias efficiently
CannedResponseSchema.index({ workspaceId: 1, aliasId: 1 });

export const CannedResponse: Model<ICannedResponse> =
  (mongoose.models.CannedResponse as Model<ICannedResponse>) ||
  mongoose.model<ICannedResponse>("CannedResponse", CannedResponseSchema);