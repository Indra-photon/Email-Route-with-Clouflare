import mongoose, { Schema, type Document, type Model, Types } from "mongoose";

export interface IEmailThread extends Document {
  workspaceId: Types.ObjectId;
  aliasId: Types.ObjectId;

  originalEmailId: string;
  messageId: string;
  inReplyTo: string | null;
  references: string[];

  from: string;
  fromName: string;
  to: string;
  subject: string;
  textBody: string;
  htmlBody: string;

  direction: "inbound" | "outbound";
  status: "open" | "in_progress" | "waiting" | "resolved";
  priority: "urgent" | "moderate" | "not-urgent";

  attachments: Array<{
    id: string;
    filename: string;
    content_type: string;
    download_url?: string;
    size?: number;
  }>;

  discordMessageId: string | null;
  discordChannelId: string | null;

  // Slack thread tracking (for bidirectional Slack reply → email flow)
  slackMessageTs?: string | null;
  slackChannelId?: string | null;
  slackEventId?: string | null;  // for deduplication — Slack retries if no 3s response

  // Ticket assignment fields
  assignedTo?: string;
  assignedToEmail?: string;
  assignedToName?: string;
  claimedAt?: Date;

  // Status tracking fields
  statusUpdatedAt?: Date;
  resolvedAt?: Date;
  resolvedBy?: string;

  receivedAt: Date;
  repliedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const EmailThreadSchema = new Schema<IEmailThread>(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Workspace",
      index: true,
    },
    aliasId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Alias",
    },

    originalEmailId: {
      type: String,
      required: true,
    },
    messageId: {
      type: String,
      required: true,
    },
    inReplyTo: {
      type: String,
      default: null,
    },
    references: {
      type: [String],
      default: [],
    },

    from: {
      type: String,
      required: true,
    },
    fromName: {
      type: String,
      default: "",
    },
    to: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    textBody: {
      type: String,
      default: "",
    },
    htmlBody: {
      type: String,
      default: "",
    },

    attachments: {
      type: [
        {
          id: { type: String, required: true },
          filename: { type: String, required: true },
          content_type: { type: String, default: "application/octet-stream" },
          download_url: { type: String },
          size: { type: Number },
        },
      ],
      default: [],
    },

    direction: {
      type: String,
      enum: ["inbound", "outbound"],
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "waiting", "resolved"],
      default: "open",
      index: true,
    },
    priority: {
      type: String,
      enum: ["urgent", "moderate", "not-urgent"],
      default: "moderate",
      index: true,
    },

    discordMessageId: {
      type: String,
      default: null,
    },
    discordChannelId: {
      type: String,
      default: null,
    },

    // Slack thread tracking
    slackMessageTs: { type: String, default: null, index: true },
    slackChannelId: { type: String, default: null },
    slackEventId:   { type: String, default: null },

    // Ticket assignment fields
    assignedTo: {
      type: String,
      default: null,
      index: true,
    },
    assignedToEmail: {
      type: String,
      default: null,
    },
    assignedToName: {
      type: String,
      default: null,
    },
    claimedAt: {
      type: Date,
      default: null,
    },

    // Status tracking fields
    statusUpdatedAt: {
      type: Date,
      default: Date.now,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    resolvedBy: {
      type: String,
      default: null,
    },

    receivedAt: {
      type: Date,
      default: Date.now,
    },
    repliedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

EmailThreadSchema.index({ workspaceId: 1, createdAt: -1 });
EmailThreadSchema.index({ originalEmailId: 1 });
// Prevent duplicate outbound records for the same Slack event (race condition guard)
EmailThreadSchema.index(
  { slackEventId: 1 },
  { unique: true, sparse: true, partialFilterExpression: { direction: "outbound" } }
);

export const EmailThread: Model<IEmailThread> =
  (mongoose.models.EmailThread as Model<IEmailThread>) ||
  mongoose.model<IEmailThread>("EmailThread", EmailThreadSchema);
