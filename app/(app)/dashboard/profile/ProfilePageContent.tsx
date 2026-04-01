"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  IconUser,
  IconLock,
  IconAlertTriangle,
  IconCheck,
  IconCamera,
  IconMail,
  IconCalendar,
  IconShield,
} from "@tabler/icons-react";

// ─── Easing ───────────────────────────────────────────────────────────────────
const easeOutQuint = [0.23, 1, 0.32, 1] as const;

// ─── Tab config ───────────────────────────────────────────────────────────────
type Tab = "profile" | "security" | "danger";
const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "profile",  label: "Profile",  icon: <IconUser size={14} /> },
  { id: "security", label: "Security", icon: <IconLock size={14} /> },
  { id: "danger",   label: "Danger Zone", icon: <IconAlertTriangle size={14} /> },
];

// ─── Reusable form field ──────────────────────────────────────────────────────
function Field({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  readOnly,
  hint,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-schibsted font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full rounded-lg border px-3 py-2.5 text-sm font-schibsted transition-colors duration-100 outline-none focus:outline-none [box-shadow:none] focus:[box-shadow:none] ${
          readOnly
            ? "bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
            : "bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:border-sky-600 dark:focus:border-sky-500"
        }`}
      />
      {hint && (
        <p className="text-[11px] font-schibsted text-neutral-400 dark:text-neutral-500">{hint}</p>
      )}
    </div>
  );
}

// ─── Save button ──────────────────────────────────────────────────────────────
function SaveButton({
  state,
  onClick,
  label = "Save changes",
}: {
  state: "idle" | "loading" | "success" | "error";
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      disabled={state === "loading" || state === "success"}
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-schibsted font-semibold transition-all duration-150 focus:outline-none disabled:cursor-not-allowed cursor-pointer ${
        state === "success"
          ? "bg-green-600 text-white"
          : state === "error"
          ? "bg-red-600 text-white hover:bg-red-700"
          : "bg-sky-700 hover:bg-sky-600 text-white"
      }`}
    >
      {state === "loading" && (
        <span className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      )}
      {state === "success" && <IconCheck size={14} strokeWidth={2.5} />}
      {state === "loading" ? "Saving…" : state === "success" ? "Saved!" : state === "error" ? "Retry" : label}
    </button>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-2">
        <h3 className="font-schibsted text-sm font-bold text-neutral-800 dark:text-neutral-100">{title}</h3>
        {description && (
          <p className="text-xs font-schibsted text-neutral-400 dark:text-neutral-500 mt-0.5">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────
function ProfileTab() {
  const { user, isLoaded } = useUser();
  const fileRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [saveState, setSaveState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [avatarState, setAvatarState] = useState<"idle" | "loading" | "success">("idle");

  // Sync clerk data once loaded
  useEffect(() => {
    if (isLoaded && user) {
      setFirstName(user.firstName ?? "");
      setLastName(user.lastName   ?? "");
    }
  }, [isLoaded, user]);

  const getInitials = (first?: string | null, last?: string | null) => {
    return [(first ?? "")[0], (last ?? "")[0]].filter(Boolean).join("").toUpperCase() || "U";
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setAvatarState("loading");
    try {
      await user.setProfileImage({ file });
      setAvatarState("success");
      setTimeout(() => setAvatarState("idle"), 2000);
    } catch {
      setAvatarState("idle");
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaveState("loading");
    try {
      await user.update({ firstName: firstName.trim(), lastName: lastName.trim() });
      setSaveState("success");
      setTimeout(() => setSaveState("idle"), 2500);
    } catch {
      setSaveState("error");
      setTimeout(() => setSaveState("idle"), 2500);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-16">
        <span className="size-6 border-2 border-sky-300 border-t-sky-700 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-xl">
      {/* Avatar */}
      <Section title="Profile Picture" description="Upload a photo to personalise your account.">
        <div className="flex items-center gap-5">
          <div className="relative shrink-0">
            <Avatar className="size-16 border-2 border-sky-200 dark:border-sky-800">
              <AvatarImage src={user?.imageUrl} alt={user?.fullName ?? "User"} />
              <AvatarFallback className="bg-sky-700 text-white text-lg font-schibsted font-semibold">
                {getInitials(user?.firstName, user?.lastName)}
              </AvatarFallback>
            </Avatar>
            {avatarState === "loading" && (
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                <span className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </div>
          <div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={avatarState === "loading"}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-sm font-schibsted font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <IconCamera size={14} />
              {avatarState === "loading" ? "Uploading…" : avatarState === "success" ? "Done!" : "Change photo"}
            </button>
            <p className="text-[11px] font-schibsted text-neutral-400 mt-1.5">JPG, PNG or GIF · Max 10 MB</p>
          </div>
        </div>
      </Section>

      {/* Name */}
      <Section title="Name" description="Update your display name.">
        <div className="grid grid-cols-2 gap-4">
          <Field id="firstName" label="First name" value={firstName} onChange={setFirstName} placeholder="John" />
          <Field id="lastName"  label="Last name"  value={lastName}  onChange={setLastName}  placeholder="Doe" />
        </div>
        <SaveButton state={saveState} onClick={handleSave} />
      </Section>

      {/* Read-only info */}
      <Section title="Account Info" description="Read-only details managed by your sign-in provider.">
        <div className="space-y-3">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700">
            <IconMail size={14} className="text-neutral-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-schibsted font-semibold uppercase tracking-wide text-neutral-400">Email</p>
              <p className="text-sm font-schibsted text-neutral-700 dark:text-neutral-200 truncate">
                {user?.primaryEmailAddress?.emailAddress ?? "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700">
            <IconCalendar size={14} className="text-neutral-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-schibsted font-semibold uppercase tracking-wide text-neutral-400">Member since</p>
              <p className="text-sm font-schibsted text-neutral-700 dark:text-neutral-200">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                  : "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700">
            <IconShield size={14} className="text-neutral-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-schibsted font-semibold uppercase tracking-wide text-neutral-400">User ID</p>
              <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400 truncate">{user?.id ?? "—"}</p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

// ─── Security Tab ─────────────────────────────────────────────────────────────
function SecurityTab() {
  const { user, isLoaded } = useUser();

  const [current,  setCurrent]  = useState("");
  const [next,     setNext]     = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [saveState, setSaveState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const handleSave = async () => {
    setError("");
    if (!next.trim() || !confirm.trim()) { setError("All fields are required."); return; }
    if (next !== confirm) { setError("New passwords do not match."); return; }
    if (next.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (!user) return;

    setSaveState("loading");
    try {
      await user.updatePassword({ currentPassword: current, newPassword: next, signOutOfOtherSessions: true });
      setSaveState("success");
      setCurrent(""); setNext(""); setConfirm("");
      setTimeout(() => setSaveState("idle"), 3000);
    } catch (err: any) {
      setSaveState("error");
      setError(err?.errors?.[0]?.message ?? "Failed to update password. Check your current password.");
      setTimeout(() => setSaveState("idle"), 3000);
    }
  };

  // Check if user has a password (not purely OAuth)
  const hasPassword = isLoaded && (user?.passwordEnabled ?? false);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-16">
        <span className="size-6 border-2 border-sky-300 border-t-sky-700 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-xl">
      <Section title="Change Password" description={hasPassword ? "Update your account password." : "Password management is not available for accounts signed in via Google or GitHub."}>
        {hasPassword ? (
          <>
            <div className="space-y-4">
              <Field id="currentPw" label="Current password" type="password" value={current} onChange={setCurrent} placeholder="••••••••" />
              <Field id="newPw"     label="New password"     type="password" value={next}    onChange={setNext}    placeholder="••••••••" hint="Min. 8 characters." />
              <Field id="confirmPw" label="Confirm password" type="password" value={confirm} onChange={setConfirm} placeholder="••••••••" />
            </div>
            {error && (
              <p className="text-xs font-schibsted text-red-600 dark:text-red-400 flex items-center gap-1.5">
                <IconAlertTriangle size={12} />
                {error}
              </p>
            )}
            <SaveButton state={saveState} onClick={handleSave} label="Update password" />
          </>
        ) : (
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <IconAlertTriangle size={16} className="text-amber-500 shrink-0" />
            <p className="text-sm font-schibsted text-amber-700 dark:text-amber-400">
              Your account uses a social provider (Google / GitHub). Password management is handled externally.
            </p>
          </div>
        )}
      </Section>

      {/* Active sessions count */}
      <Section title="Sessions" description="You are currently signed in on this device.">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700">
          <IconShield size={14} className="text-sky-500 shrink-0" />
          <p className="text-sm font-schibsted text-neutral-700 dark:text-neutral-200">
            Active session on this browser
          </p>
          <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-schibsted font-semibold px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
            <span className="size-1.5 rounded-full bg-green-500" />
            Active
          </span>
        </div>
      </Section>
    </div>
  );
}

// ─── Danger Zone Tab ──────────────────────────────────────────────────────────
function DangerTab() {
  const { user, isLoaded } = useUser();
  const [confirm, setConfirm] = useState("");
  const [delState, setDelState] = useState<"idle" | "loading">("idle");

  const CONFIRM_WORD = "DELETE";
  const [deleteError, setDeleteError] = useState("");

  const handleDelete = async () => {
    if (confirm !== CONFIRM_WORD || !user) return;
    setDeleteError("");
    setDelState("loading");
    try {
      // Calls server — wipes all MongoDB data AND deletes Clerk account server-side.
      // Works even if the user closes the tab mid-request.
      const res = await fetch("/api/user/delete", { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to delete account. Please try again.");
      }

      // Hard redirect to homepage — clears Clerk session cookie automatically
      // since the Clerk account is already gone on the server.
      window.location.href = "/";
    } catch (err: any) {
      setDelState("idle");
      setDeleteError(err.message ?? "Something went wrong.");
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-16">
        <span className="size-6 border-2 border-sky-300 border-t-sky-700 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-xl">
      <Section title="Delete Account">
        <div className="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50/60 dark:bg-red-900/10 p-4 space-y-4">
          <div className="flex items-start gap-3">
            <IconAlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-schibsted font-semibold text-red-700 dark:text-red-400">This action is permanent</p>
              <p className="text-xs font-schibsted text-red-600/80 dark:text-red-500/80 mt-0.5">
                Deleting your account will remove all your workspaces, domains, aliases, tickets, and integrations. This cannot be undone.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="deleteConfirm" className="text-xs font-schibsted font-semibold text-red-600 dark:text-red-400">
              Type <span className="font-mono font-bold">{CONFIRM_WORD}</span> to confirm
            </label>
            <input
              id="deleteConfirm"
              type="text"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder={CONFIRM_WORD}
              className="w-full rounded-lg border border-red-300 dark:border-red-800 bg-white dark:bg-neutral-900 px-3 py-2.5 text-sm font-mono text-red-700 dark:text-red-400 placeholder-red-300 dark:placeholder-red-900 outline-none focus:outline-none focus:border-red-500 transition-colors [box-shadow:none] focus:[box-shadow:none]"
            />
          </div>

          <button
            type="button"
            disabled={confirm !== CONFIRM_WORD || delState === "loading"}
            onClick={handleDelete}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-schibsted font-semibold transition-all duration-150 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-red-600 hover:bg-red-700 text-white"
          >
            {delState === "loading" && (
              <span className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {delState === "loading" ? "Deleting…" : "Delete my account"}
          </button>

          {deleteError && (
            <p className="text-xs font-schibsted text-red-600 dark:text-red-400 flex items-center gap-1.5 pt-1">
              <IconAlertTriangle size={12} />
              {deleteError}
            </p>
          )}
        </div>
      </Section>
    </div>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────
export default function ProfilePageContent() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  return (
    <div className="space-y-6 border border-neutral-400 rounded-lg p-4">
      <Card className="min-h-[300px] overflow-hidden">

        {/* Tab bar */}
        <div className="flex items-center gap-1.5 pb-4 border-b border-neutral-100 dark:border-neutral-800 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-schibsted font-semibold transition-all duration-150 focus:outline-none cursor-pointer ${
                activeTab === tab.id
                  ? "text-white"
                  : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              } ${tab.id === "danger" && activeTab !== "danger" ? "hover:text-red-500" : ""}`}
            >
              {activeTab === tab.id && (
                <motion.span
                  layoutId="profile-tab-bg"
                  className={`absolute inset-0 rounded-lg z-0 shadow-sm ${
                    tab.id === "danger"
                      ? "bg-linear-to-r from-red-700 to-red-600"
                      : "bg-linear-to-r from-sky-800 to-cyan-700"
                  }`}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {tab.icon}
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="pt-5">
          <AnimatePresence mode="wait" initial={false}>
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: easeOutQuint }}
              >
                <ProfileTab />
              </motion.div>
            )}
            {activeTab === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: easeOutQuint }}
              >
                <SecurityTab />
              </motion.div>
            )}
            {activeTab === "danger" && (
              <motion.div
                key="danger"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: easeOutQuint }}
              >
                <DangerTab />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </Card>
    </div>
  );
}
