"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ImageUploadFieldProps {
  value: string | null;
  onChange: (url: string | null) => void;
  disabled?: boolean;
}

export function ImageUploadField({ value, onChange, disabled }: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only images (JPG, PNG, GIF, WebP) are allowed");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be smaller than 2MB");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/chat/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      onChange(data.url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* Avatar Preview */}
      <div className="relative">
        <Avatar className="size-20">
          {value ? (
            <AvatarImage src={value} alt="Bot avatar" />
          ) : (
            <AvatarFallback className="bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 text-xl">
              <Upload size={24} />
            </AvatarFallback>
          )}
        </Avatar>

        {/* Remove button */}
        {value && !disabled && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 size-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors duration-150"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Upload Button */}
      <div className="flex-1">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled || isUploading}
          className="hidden"
          id="avatar-upload"
        />
        <label
          htmlFor="avatar-upload"
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border font-schibsted text-sm font-medium transition-all duration-150 cursor-pointer ${
            disabled || isUploading
              ? "opacity-50 cursor-not-allowed border-neutral-300 bg-neutral-100 text-neutral-500"
              : "border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:border-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/10"
          }`}
        >
          {isUploading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload size={16} />
              {value ? "Change Image" : "Upload Image"}
            </>
          )}
        </label>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
          JPG, PNG, GIF, or WebP. Max 2MB.
        </p>
      </div>
    </div>
  );
}
