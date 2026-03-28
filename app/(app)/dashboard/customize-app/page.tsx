"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploadField } from "@/components/dashboard/ImageUploadField";
import { Loader2, Palette } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type Domain = {
  _id: string;
  domain: string;
  botName?: string | null;
  botAvatar?: string | null;
  botDescription?: string | null;
};

type FormStatus = "idle" | "loading" | "success";

export default function CustomizeAppPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedDomainId, setSelectedDomainId] = useState<string>("");
  const [isLoadingDomains, setIsLoadingDomains] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");

  // Form fields
  const [botName, setBotName] = useState("");
  const [botAvatar, setBotAvatar] = useState<string | null>(null);
  const [botDescription, setBotDescription] = useState("");

  // Load domains on mount
  useEffect(() => {
    loadDomains();
  }, []);

  // Load customization when domain is selected
  useEffect(() => {
    if (selectedDomainId) {
      loadCustomization(selectedDomainId);
    } else {
      // Reset form
      setBotName("");
      setBotAvatar(null);
      setBotDescription("");
    }
  }, [selectedDomainId]);

  const loadDomains = async () => {
    try {
      const response = await fetch("/api/domains");
      if (!response.ok) throw new Error("Failed to fetch domains");
      
      const data = await response.json();
      setDomains(data);
      
      // Auto-select first domain if available
      if (data.length > 0) {
        setSelectedDomainId(data[0].id);
      }
    } catch (error) {
      console.error("Error loading domains:", error);
      toast.error("Failed to load domains");
    } finally {
      setIsLoadingDomains(false);
    }
  };

  const loadCustomization = async (domainId: string) => {
    try {
      const response = await fetch(`/api/domains/update-customization?domainId=${domainId}`);
      if (!response.ok) {
        // Domain exists but no customization yet
        setBotName("");
        setBotAvatar(null);
        setBotDescription("");
        return;
      }

      const data = await response.json();
      setBotName(data.domain?.botName || "");
      setBotAvatar(data.domain?.botAvatar || null);
      setBotDescription(data.domain?.botDescription || "");
    } catch (error) {
      console.error("Error loading customization:", error);
    }
  };

  const handleSave = async () => {
    if (!selectedDomainId) {
      toast.error("Please select a domain");
      return;
    }

    setIsSaving(true);
    setFormStatus("loading");

    try {
      const response = await fetch("/api/domains/update-customization", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domainId: selectedDomainId,
          botName: botName.trim() || null,
          botAvatar: botAvatar || null,
          botDescription: botDescription.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save customization");
      }

      setFormStatus("success");
      toast.success("Customization saved successfully!");
      
      // Reset to idle after 2 seconds
      setTimeout(() => setFormStatus("idle"), 2000);
    } catch (error) {
      console.error("Error saving customization:", error);
      toast.error("Failed to save customization");
      setFormStatus("idle");
    } finally {
      setIsSaving(false);
    }
  };

  const selectedDomain = domains.find((d) => d._id === selectedDomainId);

  if (isLoadingDomains) {
    return (
      <div className="border border-neutral-400 rounded-lg p-4 min-h-screen flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (domains.length === 0) {
    return (
      <div className="border border-neutral-400 rounded-lg p-4 min-h-screen">
        <div className="mb-6">
          <Heading variant="muted" className="font-bold text-neutral-900 dark:text-neutral-100">
            Customize App
          </Heading>
          <Paragraph className="text-sm text-neutral-600 dark:text-neutral-400">
            Customize how your Slack bot appears when posting email notifications.
          </Paragraph>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>No Domains Found</CardTitle>
            <CardDescription>
              You need to add a domain first before customizing the app.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a
              href="/dashboard/domains"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-schibsted text-sm font-medium transition-colors duration-150"
            >
              Add Domain
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="border border-neutral-400 rounded-lg p-4 min-h-screen">
      <div className="mb-6">
        <Heading variant="muted" className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <Palette className="size-5" />
          Customize App
        </Heading>
        <Paragraph className="text-sm text-neutral-600 dark:text-neutral-400">
          Customize how your Slack bot appears when posting email notifications.
        </Paragraph>
      </div>

      <div className="max-w-3xl">
        {/* Domain Selector */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Domain</CardTitle>
            <CardDescription>
              Choose which domain's bot appearance you want to customize.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {domains.map((domain) => (
                <button
                  key={domain._id}
                  onClick={() => setSelectedDomainId(domain._id)}
                  disabled={isSaving}
                  className={`px-4 py-2 rounded-lg border font-schibsted text-sm font-medium transition-all duration-150 ${
                    selectedDomainId === domain._id
                      ? "border-sky-600 bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400"
                      : "border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400"
                  } ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {domain.domain}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customization Form */}
        {selectedDomain && (
          <motion.div
            key={selectedDomainId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Bot Appearance for {selectedDomain.domain}</CardTitle>
                <CardDescription>
                  All fields are optional. If not set, default values will be used.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Bot Name */}
                <div className="flex flex-col space-y-2">
                  <label className="text-lg font-schibsted text-neutral-700 dark:text-neutral-300">
                    Bot Name
                  </label>
                  <input
                    type="text"
                    value={botName}
                    onChange={(e) => setBotName(e.target.value)}
                    disabled={isSaving}
                    placeholder="e.g., Customer Support Bot"
                    className="rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm font-schibsted text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 transition-colors duration-100 focus:border-sky-600 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    The name that will appear when the bot posts messages to Slack.
                  </p>
                </div>

                {/* Bot Avatar */}
                <div className="flex flex-col space-y-2">
                  <label className="text-lg font-schibsted text-neutral-700 dark:text-neutral-300">
                    Bot Avatar
                  </label>
                  <ImageUploadField
                    value={botAvatar}
                    onChange={setBotAvatar}
                    disabled={isSaving}
                  />
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    The avatar image that will appear when the bot posts messages to Slack.
                  </p>
                </div>

                {/* Bot Description */}
                <div className="flex flex-col space-y-2">
                  <label className="text-lg font-schibsted text-neutral-700 dark:text-neutral-300">
                    Description
                  </label>
                  <textarea
                    value={botDescription}
                    onChange={(e) => setBotDescription(e.target.value)}
                    disabled={isSaving}
                    placeholder="e.g., Handles customer support emails for acme.com"
                    rows={3}
                    className="rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm font-schibsted text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 transition-colors duration-100 focus:border-sky-600 outline-none disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                  />
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Optional description for your reference (not shown in Slack).
                  </p>
                </div>

                {/* Save Button */}
                <div className="flex items-center gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    disabled={isSaving || formStatus !== "idle"}
                    className={`relative inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-schibsted text-sm font-medium transition-all duration-200 overflow-hidden ${
                      formStatus === "success"
                        ? "bg-green-600 text-white"
                        : "bg-sky-600 hover:bg-sky-700 text-white"
                    } disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]`}
                  >
                    <AnimatePresence mode="wait">
                      {formStatus === "loading" && (
                        <motion.span
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <Loader2 className="size-4 animate-spin" />
                          Saving...
                        </motion.span>
                      )}
                      {formStatus === "success" && (
                        <motion.span
                          key="success"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          ✓ Saved!
                        </motion.span>
                      )}
                      {formStatus === "idle" && (
                        <motion.span
                          key="idle"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          Save Changes
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>

                  {(botName || botAvatar || botDescription) && (
                    <button
                      onClick={() => {
                        setBotName("");
                        setBotAvatar(null);
                        setBotDescription("");
                      }}
                      disabled={isSaving}
                      className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-schibsted text-sm font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
