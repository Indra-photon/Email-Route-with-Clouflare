import mongoose, { Schema, type Document, type Model, Types } from "mongoose";

export interface IEmailTemplate extends Document {
  workspaceId: Types.ObjectId;
  name: string;       // Template display name
  subject: string;    // Email subject (supports variables)
  body: string;       // Plain text body (shown and editable in Slack modal)
  htmlBody?: string;  // Optional full HTML/CSS version (sent as email HTML)
  variables: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const EmailTemplateSchema = new Schema<IEmailTemplate>(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    subject: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },
    body: {
      type: String,
      required: false,
      default: "",
      trim: true,
      maxlength: 20000,
    },
    htmlBody: {
      type: String,
      default: "",
      // Full HTML/CSS email — if provided, used as the html param to Resend.
      // If empty, a minimal wrapper is built around `body` at send time.
    },
    variables: {
      type: [String],
      default: ["name", "email", "subject", "date", "agent"],
    },
    createdBy: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

EmailTemplateSchema.index({ workspaceId: 1, createdAt: -1 });

// Delete the cached model so schema changes (e.g. body becoming optional)
// take effect immediately without requiring a full server restart.
if (mongoose.models.EmailTemplate) {
  delete mongoose.models.EmailTemplate;
}

export const EmailTemplate: Model<IEmailTemplate> =
  mongoose.model<IEmailTemplate>("EmailTemplate", EmailTemplateSchema);
