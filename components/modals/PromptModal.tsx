"use client";

import { useEffect, useState } from "react";

interface PromptModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  defaultValue?: string;
  placeholder?: string;
  onCancel: () => void;
  onConfirm: (value: string) => void;
}

export default function PromptModal({
  isOpen,
  title = "Enter a value",
  message,
  defaultValue = "",
  placeholder = "Enter text...",
  onCancel,
  onConfirm,
}: PromptModalProps) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (isOpen) setValue(defaultValue || "");
  }, [isOpen, defaultValue]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-background dark:bg-dark-surface p-6 rounded-lg max-w-sm w-full border border-border dark:border-dark-border shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-text dark:text-dark-text">{title}</h2>
        {message && <p className="text-sm text-muted dark:text-dark-muted mb-4">{message}</p>}
        <input
          type="text"
          className="w-full px-4 py-2 rounded border border-border dark:border-dark-border bg-transparent text-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary mb-4"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded border text-text dark:text-dark-text border-border dark:border-dark-border hover:bg-border/20"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(value)}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
