import mongoose, { Schema, type Document, type Model, Types } from "mongoose";

export interface IDnsRecord {
  record: string;
  name: string;
  type: string;
  value?: string;
  status: string;
  ttl?: string;
  priority?: number;
}

export interface IDomain extends Document {
  workspaceId: Types.ObjectId;
  domain: string;
  status: "pending_verification" | "active" | "verified";
  verifiedForSending?: boolean;
  verifiedForReceiving?: boolean;
  resendDomainId?: string;
  dnsRecords?: IDnsRecord[];
  lastCheckedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const DomainSchema = new Schema<IDomain>(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },
    domain: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending_verification", "active", "verified"],
      default: "pending_verification",
    },
    verifiedForSending: {
      type: Boolean,
      default: false,
    },
    verifiedForReceiving: {
      type: Boolean,
      default: false,
    },
    resendDomainId: {
      type: String,
      default: null,
    },
    dnsRecords: {
      type: [
        {
          record: String,
          name: String,
          type: String,
          value: String,
          status: String,
          ttl: String,
          priority: Number,
        },
      ],
      default: [],
    },
    lastCheckedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

DomainSchema.index({ workspaceId: 1, domain: 1 }, { unique: true });

export const Domain: Model<IDomain> =
  (mongoose.models.Domain as Model<IDomain>) ||
  mongoose.model<IDomain>("Domain", DomainSchema);

