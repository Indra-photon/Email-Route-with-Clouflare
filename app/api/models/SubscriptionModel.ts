import mongoose, { Schema, type Document, type Model, Types } from "mongoose";
import type { PlanId } from "./WorkspaceModel";

export interface ISubscription extends Document {
  workspaceId: Types.ObjectId;
  planId: PlanId;
  status: "active" | "trialing" | "past_due" | "cancelled" | "inactive";

  /** Dodo Payments identifiers */
  dodoCustomerId: string | null;
  dodoSubscriptionId: string | null;

  /** Current billing period */
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;

  /**
   * Set when a downgrade is scheduled.
   * On subscription.cancelled webhook → auto-start new subscription for this plan.
   */
  pendingPlanId: PlanId | null;

  /** Monthly usage counters — reset on payment.succeeded webhook */
  ticketCountInbound: number;
  ticketCountOutbound: number;
  usagePeriodStart: Date;

  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      unique: true,
      index: true,
    },
    planId: {
      type: String,
      enum: ["starter", "growth", "scale"],
      required: true,
      default: "starter",
    },
    status: {
      type: String,
      enum: ["active", "trialing", "past_due", "cancelled", "inactive"],
      default: "inactive",
    },
    dodoCustomerId: {
      type: String,
      default: null,
    },
    dodoSubscriptionId: {
      type: String,
      default: null,
      index: true,
      sparse: true,
    },
    currentPeriodStart: {
      type: Date,
      default: null,
    },
    currentPeriodEnd: {
      type: Date,
      default: null,
    },
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },
    pendingPlanId: {
      type: String,
      enum: ["starter", "growth", "scale", null],
      default: null,
    },
    ticketCountInbound: {
      type: Number,
      default: 0,
      min: 0,
    },
    ticketCountOutbound: {
      type: Number,
      default: 0,
      min: 0,
    },
    usagePeriodStart: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Subscription: Model<ISubscription> =
  (mongoose.models.Subscription as Model<ISubscription>) ||
  mongoose.model<ISubscription>("Subscription", SubscriptionSchema);
