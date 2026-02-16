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
  status: "open" | "replied" | "resolved";

  discordMessageId: string | null;
  discordChannelId: string | null;

  // Ticket assignment fields
  assignedTo?: string;
  assignedToEmail?: string;
  assignedToName?: string;
  claimedAt?: Date;

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
      index: true,
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

    direction: {
      type: String,
      enum: ["inbound", "outbound"],
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "replied", "resolved"],
      default: "open",
    },

    discordMessageId: {
      type: String,
      default: null,
    },
    discordChannelId: {
      type: String,
      default: null,
    },

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

export const EmailThread: Model<IEmailThread> =
  (mongoose.models.EmailThread as Model<IEmailThread>) ||
  mongoose.model<IEmailThread>("EmailThread", EmailThreadSchema);
