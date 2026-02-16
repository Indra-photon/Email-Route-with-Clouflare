import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Interface for MX Record
export interface IMxRecord {
  type: string;
  name: string;
  value: string;
  priority: number;
  ttl: string;
}

// Interface for ReceivingRequest document
export interface IReceivingRequest extends Document {
  _id: Types.ObjectId;
  domainId: Types.ObjectId;
  workspaceId: Types.ObjectId;
  requestedBy: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
  mxRecords?: IMxRecord[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema
const ReceivingRequestSchema = new Schema<IReceivingRequest>(
  {
    domainId: {
      type: Schema.Types.ObjectId,
      ref: "Domain",
      required: true,
      index: true,
    },
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },
    requestedBy: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      required: true,
      index: true,
    },
    requestedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    reviewedBy: {
      type: String,
      default: null,
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    mxRecords: [
      {
        type: {
          type: String,
          default: "MX",
        },
        name: {
          type: String,
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
        priority: {
          type: Number,
          required: true,
        },
        ttl: {
          type: String,
          default: "Auto",
        },
      },
    ],
    notes: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
ReceivingRequestSchema.index({ domainId: 1, status: 1 });
ReceivingRequestSchema.index({ workspaceId: 1, status: 1 });
ReceivingRequestSchema.index({ status: 1, requestedAt: -1 });

// Export the model
const ReceivingRequest: Model<IReceivingRequest> =
  mongoose.models.ReceivingRequest ||
  mongoose.model<IReceivingRequest>("ReceivingRequest", ReceivingRequestSchema);

export default ReceivingRequest;
