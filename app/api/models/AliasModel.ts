import mongoose, { Schema, type Document, type Model, Types } from "mongoose";

export interface IAlias extends Document {
  workspaceId: Types.ObjectId;
  domainId: Types.ObjectId;
  localPart: string;
  email: string;
  status: "active" | "inactive";
  integrationId?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const AliasSchema = new Schema<IAlias>(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },
    domainId: {
      type: Schema.Types.ObjectId,
      ref: "Domain",
      required: true,
      index: true,
    },
    localPart: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    integrationId: {
      type: Schema.Types.ObjectId,
      ref: "Integration",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

AliasSchema.index(
  { workspaceId: 1, domainId: 1, localPart: 1 },
  { unique: true }
);

export const Alias: Model<IAlias> =
  (mongoose.models.Alias as Model<IAlias>) ||
  mongoose.model<IAlias>("Alias", AliasSchema);


