import mongoose, { Schema, type Document, type Model, Types } from "mongoose";

export interface IEmailTemplate extends Document {
  workspaceId: Types.ObjectId;
  name: string;           // Template display name
  subject: string;        // Email subject (supports variables)
  body: string;           // Plain text body (supports variables like {name}, {email}, etc.)
  htmlWrapper: string;    // Optional HTML wrapper — injected around plain text before sending
  variables: string[];    // List of supported variable names (e.g. ["name", "email", "subject"])
  createdBy: string;      // Clerk user ID
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
      required: true,
      trim: true,
      maxlength: 200,
      default: "",
    },
    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10000,
    },
    htmlWrapper: {
      type: String,
      default: "",   // If empty, body is sent as plain text inside a minimal HTML wrapper
    },
    variables: {
      type: [String],
      default: ["name", "email", "subject", "date"],
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

EmailTemplateSchema.index({ workspaceId: 1, createdAt: -1 });

export const EmailTemplate: Model<IEmailTemplate> =
  (mongoose.models.EmailTemplate as Model<IEmailTemplate>) ||
  mongoose.model<IEmailTemplate>("EmailTemplate", EmailTemplateSchema);
