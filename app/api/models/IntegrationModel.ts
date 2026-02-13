import mongoose, { Schema, type Document, type Model, Types } from "mongoose";

export interface IIntegration extends Document {
  workspaceId: Types.ObjectId;
  type: "slack" | "discord";
  name: string;
  webhookUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const IntegrationSchema = new Schema<IIntegration>(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["slack", "discord"],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    webhookUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Integration: Model<IIntegration> =
  (mongoose.models.Integration as Model<IIntegration>) ||
  mongoose.model<IIntegration>("Integration", IntegrationSchema);

