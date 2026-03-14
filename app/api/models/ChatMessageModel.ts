import mongoose, { Schema, type Document, type Model, Types } from "mongoose";

export interface IChatMessage extends Document {
    conversationId: Types.ObjectId;
    widgetId: Types.ObjectId;
    sender: "visitor" | "agent";
    body: string;
    type: "text" | "image" | "pdf";
    mediaUrl: string;
    slackEventId?: string | null;
    slackMessageTs?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
    {
        conversationId: {
            type: Schema.Types.ObjectId,
            ref: "ChatConversation",
            required: true,
            index: true,
        },
        widgetId: {
            type: Schema.Types.ObjectId,
            ref: "ChatWidget",
            required: true,
        },
        sender: {
            type: String,
            enum: ["visitor", "agent"],
            required: true,
        },
        body: {
            type: String,
            default: '',
        },
        type: {
            type: String,
            enum: ["text", "image", "pdf"],
            default: "text",
        },
        mediaUrl: {
            type: String,
            default: '',
        },
        slackEventId: {
            type: String,
            default: null,
        },
        slackMessageTs: {
            type: String,
            default: null,
            index: true,
            sparse: true,
        },
    },
    {
        timestamps: true,
    }
);

ChatMessageSchema.index({ conversationId: 1, createdAt: 1 });
// Prevent duplicate agent messages for the same Slack event (race condition guard)
ChatMessageSchema.index({ slackEventId: 1 }, { unique: true, sparse: true });

export const ChatMessage: Model<IChatMessage> =
    (mongoose.models.ChatMessage as Model<IChatMessage>) ||
    mongoose.model<IChatMessage>("ChatMessage", ChatMessageSchema);
