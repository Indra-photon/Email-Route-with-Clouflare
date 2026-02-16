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

export interface IMxRecord {
  type: string;
  name: string;
  value: string;
  priority: number;
  ttl: string;
}

export interface IDomain extends Document {
  workspaceId: Types.ObjectId;
  domain: string;
  status: "pending_verification" | "active" | "verified";
  verifiedForSending?: boolean;
  verifiedForReceiving?: boolean;
  resendDomainId?: string;
  dnsRecords?: IDnsRecord[];
  receivingEnabled?: boolean;
  receivingEnabledAt?: Date | null;
  receivingRequestId?: Types.ObjectId;
  receivingMxRecords?: IMxRecord[];
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
    receivingEnabled: {
      type: Boolean,
      default: false,
    },
    receivingEnabledAt: {
      type: Date,
      default: null,
    },
    receivingRequestId: {
      type: Schema.Types.ObjectId,
      ref: "ReceivingRequest",
      default: null,
    },
    receivingMxRecords: [
      {
        type: {
          type: String,
          default: "MX",
        },
        name: {
          type: String,
        },
        value: {
          type: String,
        },
        priority: {
          type: Number,
        },
        ttl: {
          type: String,
        },
      },
    ],
    dnsRecords: {
      type: [Schema.Types.Mixed],
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

// export const Domain: Model<IDomain> =
//   (mongoose.models.Domain as Model<IDomain>) ||
//   mongoose.model<IDomain>("Domain", DomainSchema);

// Delete old cached model if it exists
if (mongoose.models.Domain) {
  delete mongoose.models.Domain;
}

// Always create fresh model with new schema
export const Domain: Model<IDomain> = mongoose.model<IDomain>("Domain", DomainSchema);

