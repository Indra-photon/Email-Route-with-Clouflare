"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface PlanLimits {
  domains: number;
  aliasesPerDomain: number;
  chatWidgets: number;
  ticketsPerMonth: number;
  dataRetentionDays: number;
}

interface PricingFeature {
  label: string;
  included: boolean;
  soon?: boolean;
  note?: string;
}

interface PricingPlanDoc {
  id: string;
  name: string;
  price: number;
  description: string;
  highlight: boolean;
  ctaLabel: string;
  dodoPriceId: string;
  limits: PlanLimits;
  features: PricingFeature[];
  sortOrder: number;
  isVisible: boolean;
}

function UnlimitedToggle({
  value,
  onChange,
  label,
}: {
  value: number;
  label: string;
  onChange: (v: number) => void;
}) {
  const unlimited = value === -1;
  return (
    <div className="flex items-center gap-2">
      <label className="font-schibsted text-xs text-neutral-600 w-36 shrink-0">{label}</label>
      <input
        type="number"
        disabled={unlimited}
        value={unlimited ? "" : value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-24 border border-neutral-200 rounded-lg px-2 py-1.5 font-schibsted text-sm focus:outline-none focus:border-sky-400 disabled:bg-neutral-50 disabled:text-neutral-400"
        placeholder="—"
      />
      <button
        onClick={() => onChange(unlimited ? 1 : -1)}
        className={`px-2 py-1 rounded-md font-schibsted text-xs font-medium transition-colors ${
          unlimited
            ? "bg-sky-100 text-sky-700 border border-sky-200"
            : "bg-neutral-100 text-neutral-500 border border-neutral-200 hover:bg-neutral-200"
        }`}
      >
        ∞
      </button>
    </div>
  );
}

function PlanEditor({
  plan,
  onSave,
  saving,
}: {
  plan: PricingPlanDoc;
  onSave: (updated: PricingPlanDoc) => Promise<void>;
  saving: boolean;
}) {
  const [draft, setDraft] = useState<PricingPlanDoc>(plan);

  const setField = <K extends keyof PricingPlanDoc>(k: K, v: PricingPlanDoc[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  const setLimit = <K extends keyof PlanLimits>(k: K, v: number) =>
    setDraft((d) => ({ ...d, limits: { ...d.limits, [k]: v } }));

  const setFeature = (i: number, f: PricingFeature) =>
    setDraft((d) => {
      const features = [...d.features];
      features[i] = f;
      return { ...d, features };
    });

  const addFeature = () =>
    setDraft((d) => ({
      ...d,
      features: [...d.features, { label: "New feature", included: true }],
    }));

  const removeFeature = (i: number) =>
    setDraft((d) => ({
      ...d,
      features: d.features.filter((_, idx) => idx !== i),
    }));

  return (
    <div className="rounded-2xl border border-neutral-200 overflow-hidden">
      {/* Card header */}
      <div className={`px-5 py-4 ${draft.highlight ? "bg-sky-800" : "bg-neutral-800"} flex items-center justify-between`}>
        <div>
          <input
            value={draft.name}
            onChange={(e) => setField("name", e.target.value)}
            className="font-schibsted text-base font-semibold text-white bg-transparent border-b border-white/30 focus:outline-none focus:border-white w-36"
          />
          <div className="flex items-center gap-3 mt-1">
            <span className="text-white/70 text-xs font-schibsted">$</span>
            <input
              type="number"
              value={draft.price}
              onChange={(e) => setField("price", Number(e.target.value))}
              className="font-schibsted text-2xl font-semibold text-white bg-transparent border-b border-white/30 focus:outline-none focus:border-white w-20"
            />
            <span className="text-white/70 text-xs font-schibsted">/mo</span>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 items-end">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <span className="font-schibsted text-xs text-white/70">Highlighted</span>
            <div
              onClick={() => setField("highlight", !draft.highlight)}
              className={`w-8 h-4 rounded-full transition-colors ${draft.highlight ? "bg-white" : "bg-white/30"}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${draft.highlight ? "translate-x-4" : ""}`} style={{ boxShadow: "0 1px 3px rgba(0,0,0,.3)" }} />
            </div>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <span className="font-schibsted text-xs text-white/70">Visible</span>
            <div
              onClick={() => setField("isVisible", !draft.isVisible)}
              className={`w-8 h-4 rounded-full transition-colors ${draft.isVisible ? "bg-white" : "bg-white/30"}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${draft.isVisible ? "translate-x-4" : ""}`} style={{ boxShadow: "0 1px 3px rgba(0,0,0,.3)" }} />
            </div>
          </label>
        </div>
      </div>

      <div className="px-5 py-5 space-y-5">
        {/* Description + CTA text */}
        <div className="space-y-3">
          <div>
            <label className="font-schibsted text-xs text-neutral-500 block mb-1">Description tagline</label>
            <input
              value={draft.description}
              onChange={(e) => setField("description", e.target.value)}
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 font-schibsted text-sm focus:outline-none focus:border-sky-400"
            />
          </div>
          <div>
            <label className="font-schibsted text-xs text-neutral-500 block mb-1">CTA button label</label>
            <input
              value={draft.ctaLabel}
              onChange={(e) => setField("ctaLabel", e.target.value)}
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 font-schibsted text-sm focus:outline-none focus:border-sky-400"
            />
          </div>
          <div>
            <label className="font-schibsted text-xs text-neutral-500 block mb-1">Dodo Price ID</label>
            <input
              value={draft.dodoPriceId}
              onChange={(e) => setField("dodoPriceId", e.target.value)}
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 font-schibsted text-sm font-mono focus:outline-none focus:border-sky-400"
              placeholder="price_xxx"
            />
          </div>
        </div>

        {/* Limits */}
        <div>
          <p className="font-schibsted text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-3">Limits</p>
          <div className="space-y-2">
            <UnlimitedToggle label="Domains"          value={draft.limits.domains}           onChange={(v) => setLimit("domains", v)} />
            <UnlimitedToggle label="Aliases / domain" value={draft.limits.aliasesPerDomain}  onChange={(v) => setLimit("aliasesPerDomain", v)} />
            <UnlimitedToggle label="Tickets / month"  value={draft.limits.ticketsPerMonth}   onChange={(v) => setLimit("ticketsPerMonth", v)} />
            <UnlimitedToggle label="Chat widgets"     value={draft.limits.chatWidgets}       onChange={(v) => setLimit("chatWidgets", v)} />
            <UnlimitedToggle label="Retention (days)" value={draft.limits.dataRetentionDays} onChange={(v) => setLimit("dataRetentionDays", v)} />
          </div>
        </div>

        {/* Features */}
        <div>
          <p className="font-schibsted text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-3">Features</p>
          <div className="space-y-2">
            {draft.features.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <button
                  onClick={() => setFeature(i, { ...f, included: !f.included })}
                  className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center border transition-colors ${f.included ? "bg-sky-600 border-sky-600" : "bg-neutral-200 border-neutral-300"}`}
                >
                  {f.included && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
                <input
                  value={f.label}
                  onChange={(e) => setFeature(i, { ...f, label: e.target.value })}
                  className="flex-1 border border-neutral-200 rounded-lg px-2 py-1 font-schibsted text-sm focus:outline-none focus:border-sky-400"
                />
                <button
                  onClick={() => setFeature(i, { ...f, soon: !f.soon })}
                  className={`px-1.5 py-0.5 rounded text-xs font-schibsted font-medium transition-colors ${f.soon ? "bg-indigo-100 text-indigo-600" : "bg-neutral-100 text-neutral-400"}`}
                >
                  Soon
                </button>
                <button
                  onClick={() => removeFeature(i)}
                  className="text-neutral-300 hover:text-red-400 transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={addFeature}
              className="text-xs font-schibsted text-sky-600 hover:underline"
            >
              + Add feature row
            </button>
          </div>
        </div>

        {/* Save */}
        <button
          onClick={() => onSave(draft)}
          disabled={saving}
          className="w-full rounded-xl bg-neutral-900 text-white font-schibsted text-sm font-semibold py-2.5 hover:bg-neutral-700 transition-colors disabled:opacity-60"
        >
          {saving ? "Saving…" : `Save ${draft.name}`}
        </button>
      </div>
    </div>
  );
}

export default function AdminPricingPage() {
  const [plans, setPlans] = useState<PricingPlanDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/pricing")
      .then((r) => r.json())
      .then(setPlans)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (plan: PricingPlanDoc) => {
    setSavingId(plan.id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/pricing/${plan.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plan),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      setPlans((ps) => ps.map((p) => (p.id === plan.id ? data : p)));
      setSuccessId(plan.id);
      setTimeout(() => setSuccessId(null), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-schibsted text-2xl font-semibold text-neutral-900">Pricing Plans</h1>
          <p className="font-schibsted text-sm text-neutral-500 mt-0.5">
            Changes are saved to MongoDB and reflected on the pricing page within 60 seconds — no code deploy needed.
          </p>
        </div>
        {successId && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-green-100 border border-green-300 text-green-700 font-schibsted text-sm px-4 py-2 rounded-xl"
          >
            ✓ Saved — pricing page updated
          </motion.div>
        )}
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 font-schibsted text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-6 h-6 border-2 border-sky-800 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <PlanEditor
              key={plan.id}
              plan={plan}
              onSave={handleSave}
              saving={savingId === plan.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
