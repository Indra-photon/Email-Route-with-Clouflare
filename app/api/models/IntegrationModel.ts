import mongoose, { Schema, type Document, type Model, Types } from "mongoose";

export interface IIntegration extends Document {
  workspaceId: Types.ObjectId;
  type: "slack" | "discord";
  name: string;
  webhookUrl: string;
  // OAuth vs plain webhook
  authMethod: "webhook" | "oauth";
  // Slack OAuth fields (populated when authMethod === "oauth")
  slackAccessToken?: string | null;
  slackChannelId?: string | null;
  slackChannelName?: string | null;
  slackTeamId?: string | null;
  slackTeamName?: string | null;
  slackBotUserId?: string | null;
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
      default: "",
    },
    authMethod: {
      type: String,
      enum: ["webhook", "oauth"],
      default: "webhook",
    },
    slackAccessToken: { type: String, default: null },
    slackChannelId:   { type: String, default: null },
    slackChannelName: { type: String, default: null },
    slackTeamId:      { type: String, default: null },
    slackTeamName:    { type: String, default: null },
    slackBotUserId:   { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

export const Integration: Model<IIntegration> =
  (mongoose.models.Integration as Model<IIntegration>) ||
  mongoose.model<IIntegration>("Integration", IntegrationSchema);

