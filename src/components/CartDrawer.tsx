"use client";

import React from "react";
import Image from "next/image";
import { X, Trash2, Plus, Minus, Clock, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { CartItem } from "@/types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onAddToCart: (service: CartItem["service"]) => void;
  onRemoveFromCart: (serviceId: string) => void;
  onClearCart: () => void;
  onProceedToBooking: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onClearCart,
  onProceedToBooking,
}) => {
  if (!isOpen) return null;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const itemsTotal = cart.reduce(
    (sum, item) => sum + item.service.price * item.quantity,
    0
  );
  const originalTotal = cart.reduce(
    (sum, item) =>
      sum + (item.service.originalPrice || item.service.price) * item.quantity,
    0
  );
  const totalSavings = originalTotal - itemsTotal;
  const totalDuration = cart.reduce(
    (sum, item) => sum + item.service.durationMinutes * item.quantity,
    0
  );

  const doorstepFee = itemsTotal >= 499 ? 0 : 49;
  const grandTotal = itemsTotal + doorstepFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-stone-200">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
            <div>
              <h2 className="text-lg font-medium text-stone-900 flex items-center gap-2">
                <span>Selected Services</span>
                <span className="bg-[#581c3c] text-white text-xs px-2 py-0.5 rounded-full font-medium">
                  {totalItems}
                </span>
              </h2>
              <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5 font-normal">
                <Clock className="w-3.5 h-3.5 text-[#581c3c]" />
                <span>Estimated duration: ~{totalDuration} mins</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/50 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart items list */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-rose-50 text-[#581c3c] flex items-center justify-center mb-3">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-base font-medium text-stone-900">
                  Your cart is empty
                </h3>
                <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto font-normal">
                  Explore our saree draping, bridal makeup and salon packages to book your doorstep service.
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 px-5 py-2.5 bg-[#581c3c] text-white text-xs font-medium rounded-xl shadow-xs hover:bg-[#481430] cursor-pointer"
                >
                  Explore Services
                </button>
              </div>
            ) : (
              <>
                {/* Savings callout */}
                {totalSavings > 0 && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium p-2.5 rounded-xl flex items-center justify-between">
                    <span>You save ₹{totalSavings} with package discounts</span>
                  </div>
                )}

                {/* Items */}
                <div className="space-y-3">
                  {cart.map(({ service, quantity }) => (
                    <div
                      key={service.id}
                      className="p-3.5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs flex items-center justify-between gap-3"
                    >
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-stone-100">
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-medium text-stone-900 truncate">
                          {service.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5 font-normal">
                          <span>{service.durationMinutes} mins</span>
                          <span>•</span>
                          <span className="font-medium text-stone-900">
                            ₹{service.price * quantity}
                          </span>
                        </div>
                      </div>

                      {/* Quantity modifier */}
                      <div className="flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200">
                        <button
                          onClick={() => onRemoveFromCart(service.id)}
                          className="p-1 hover:bg-white rounded-md text-stone-700 cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-medium px-2 text-stone-900">
                          {quantity}
                        </span>
                        <button
                          onClick={() => onAddToCart(service)}
                          className="p-1 hover:bg-white rounded-md text-stone-700 cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Clear Cart link */}
                <div className="text-right">
                  <button
                    onClick={onClearCart}
                    className="text-xs text-rose-700 hover:underline inline-flex items-center gap-1 cursor-pointer font-normal"
                  >
                    <Trash2 className="w-3 h-3" /> Clear Cart
                  </button>
                </div>

                {/* Hygiene reassurance */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 flex items-start gap-2.5 text-xs text-stone-600 font-normal">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <span className="font-medium text-stone-900">Doorstep Hygiene Promise:</span> Single-use disposables, sanitized equipment, and cleanup after service.
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 space-y-3">
              {/* Bill Details */}
              <div className="space-y-1.5 text-xs text-stone-600 font-normal">
                <div className="flex justify-between">
                  <span>Item Total</span>
                  <span className="font-medium text-stone-900">₹{itemsTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Doorstep Visit & Travel</span>
                  {doorstepFee === 0 ? (
                    <span className="text-emerald-700 font-medium">FREE</span>
                  ) : (
                    <span>₹{doorstepFee}</span>
                  )}
                </div>
                {doorstepFee > 0 && (
                  <p className="text-[11px] text-stone-400">
                    Add ₹{499 - itemsTotal} more for FREE doorstep visit
                  </p>
                )}
                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm sm:text-base font-medium text-stone-900">
                  <span>Grand Total</span>
                  <span className="text-[#581c3c]">₹{grandTotal}</span>
                </div>
              </div>

              {/* Proceed CTA */}
              <button
                onClick={onProceedToBooking}
                className="w-full py-3.5 bg-[#581c3c] hover:bg-[#481430] text-white text-sm font-medium rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Select Slot & Book Service</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
