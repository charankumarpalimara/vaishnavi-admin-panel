"use client";

import React, { useEffect } from "react";
import { CheckCircle, ShoppingBag, X } from "lucide-react";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  onViewCart: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  isVisible,
  onClose,
  onViewCart,
}) => {
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 z-50 max-w-sm w-full bg-stone-900 text-white rounded-2xl p-3.5 shadow-2xl border border-stone-800 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="p-1.5 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
          <CheckCircle className="w-4 h-4" />
        </div>
        <p className="text-xs font-medium text-stone-200 truncate">
          {message}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onViewCart}
          className="px-2.5 py-1 bg-amber-400 hover:bg-amber-500 text-stone-900 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
        >
          <ShoppingBag className="w-3 h-3" />
          <span>Cart</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="p-1 text-stone-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Close notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
