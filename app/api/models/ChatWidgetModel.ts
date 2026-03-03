import mongoose, { Schema, type Document, type Model, Types } from "mongoose";
import crypto from "crypto";

export interface IChatWidget extends Document {
    workspaceId: Types.ObjectId;
    activationKey: string;
    domain: string;
    integrationId: Types.ObjectId;
    welcomeMessage: string;
    accentColor: string;
    status: "active" | "inactive";
    createdAt: Date;
    updatedAt: Date;
}

const ChatWidgetSchema = new Schema<IChatWidget>(
    {
        workspaceId: {
            type: Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
            index: true,
        },
        activationKey: {
            type: String,
            required: true,
            unique: true,
            default: () => "cw_" + crypto.randomBytes(12).toString("hex"),
        },
        domain: {
            type: String,
            required: true,
        },
        integrationId: {
            type: Schema.Types.ObjectId,
            ref: "Integration",
            required: true,
        },
        welcomeMessage: {
            type: String,
            default: "Hi! How can we help you today?",
        },
        accentColor: {
            type: String,
            default: "#0ea5e9",
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

ChatWidgetSchema.index({ workspaceId: 1, domain: 1 });

export const ChatWidget: Model<IChatWidget> =
    (mongoose.models.ChatWidget as Model<IChatWidget>) ||
    mongoose.model<IChatWidget>("ChatWidget", ChatWidgetSchema);
