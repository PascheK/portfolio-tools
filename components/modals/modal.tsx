"use client";

import { X } from "lucide-react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-background/60 backdrop-blur-sm">
      <div className="bg-surface dark:bg-dark-surface w-full lg:max-w-2xl sm:max-w-md  mx-4 rounded shadow-lg overflow-hidden ">
        <div className="flex justify-between items-center md:p-4 p-1 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} aria-label="Fermer">
            <X size={20} />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
