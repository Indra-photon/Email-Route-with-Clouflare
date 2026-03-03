import mongoose, { Schema, type Document, type Model, Types } from "mongoose";

export interface IChatConversation extends Document {
    widgetId: Types.ObjectId;
    workspaceId: Types.ObjectId;
    visitorId: string;
    visitorPage: string;
    status: "open" | "closed";
    lastMessageAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ChatConversationSchema = new Schema<IChatConversation>(
    {
        widgetId: {
            type: Schema.Types.ObjectId,
            ref: "ChatWidget",
            required: true,
            index: true,
        },
        workspaceId: {
            type: Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
            index: true,
        },
        visitorId: {
            type: String,
            required: true,
            index: true,
        },
        visitorPage: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: ["open", "closed"],
            default: "open",
        },
        lastMessageAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

ChatConversationSchema.index({ widgetId: 1, visitorId: 1 });
ChatConversationSchema.index({ workspaceId: 1, lastMessageAt: -1 });

export const ChatConversation: Model<IChatConversation> =
    (mongoose.models.ChatConversation as Model<IChatConversation>) ||
    mongoose.model<IChatConversation>("ChatConversation", ChatConversationSchema);
