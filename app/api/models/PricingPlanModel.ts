import mongoose, { Schema, type Document, type Model } from "mongoose";
import type { PlanId } from "./WorkspaceModel";

// ─── Feature row ──────────────────────────────────────────────────────────────

export interface IPricingFeature {
  label: string;
  included: boolean;
  soon?: boolean;
  note?: string;
}

// ─── Plan limits ──────────────────────────────────────────────────────────────

export interface IPlanLimits {
  domains: number | -1;            // -1 = unlimited
  aliasesPerDomain: number | -1;
  chatWidgets: number | -1;
  ticketsPerMonth: number | -1;
  dataRetentionDays: number | -1;
}

// ─── Pricing plan document ────────────────────────────────────────────────────

export interface IPricingPlan extends Document {
  id: PlanId;                        // slug: "starter" | "growth" | "scale"
  name: string;                      // Display name e.g. "Growth"
  price: number;                     // Monthly USD price
  description: string;               // Tagline under plan name
  highlight: boolean;                // true = "recommended" card styling
  ctaLabel: string;                  // Button text e.g. "Start free trial"
  dodoPriceId: string;               // Dodo Payments product price ID
  limits: IPlanLimits;
  features: IPricingFeature[];
  sortOrder: number;                 // Display order (0 = first)
  isVisible: boolean;                // Hide without deleting
  updatedAt: Date;
  createdAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const PricingFeatureSchema = new Schema<IPricingFeature>(
  {
    label:    { type: String, required: true },
    included: { type: Boolean, required: true },
    soon:     { type: Boolean, default: false },
    note:     { type: String, default: "" },
  },
  { _id: false }
);

const PlanLimitsSchema = new Schema<IPlanLimits>(
  {
    domains:          { type: Number, required: true, default: 1 },   // -1 = unlimited
    aliasesPerDomain: { type: Number, required: true, default: 3 },
    chatWidgets:      { type: Number, required: true, default: 1 },
    ticketsPerMonth:  { type: Number, required: true, default: 200 },
    dataRetentionDays:{ type: Number, required: true, default: 15 },
  },
  { _id: false }
);

const PricingPlanSchema = new Schema<IPricingPlan>(
  {
    id:           { type: String, enum: ["starter", "growth", "scale"], required: true, unique: true, index: true },
    name:         { type: String, required: true },
    price:        { type: Number, required: true, min: 0 },
    description:  { type: String, default: "" },
    highlight:    { type: Boolean, default: false },
    ctaLabel:     { type: String, default: "Get started" },
    dodoPriceId:  { type: String, default: "" },
    limits:       { type: PlanLimitsSchema, required: true },
    features:     { type: [PricingFeatureSchema], default: [] },
    sortOrder:    { type: Number, default: 0 },
    isVisible:    { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const PricingPlan: Model<IPricingPlan> =
  (mongoose.models.PricingPlan as Model<IPricingPlan>) ||
  mongoose.model<IPricingPlan>("PricingPlan", PricingPlanSchema);
