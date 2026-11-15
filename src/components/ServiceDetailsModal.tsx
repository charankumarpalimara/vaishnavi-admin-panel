"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Star, Clock, X, Check, ShieldCheck, Plus, Minus, Sparkles } from "lucide-react";
import { ServiceItem } from "@/types";

interface ServiceDetailsModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  quantityInCart: number;
  onAddToCart: (service: ServiceItem) => void;
  onRemoveFromCart: (serviceId: string) => void;
  onBookDirect: (service: ServiceItem) => void;
}

export const ServiceDetailsModal: React.FC<ServiceDetailsModalProps> = ({
  service,
  onClose,
  quantityInCart,
  onAddToCart,
  onRemoveFromCart,
  onBookDirect,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (service) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [service]);

  // Handle native light dismiss per modern-web-guidance
  const handlePointerDown = (e: React.PointerEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const r = dialog.getBoundingClientRect();
    const isOutside =
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom;
    if (isOutside) {
      onClose();
    }
  };

  if (!service) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="service-modal-title"
      onCancel={onClose}
      onPointerDown={handlePointerDown}
      className="m-auto p-0 rounded-3xl max-w-lg w-full bg-white shadow-2xl backdrop:bg-black/60 border border-stone-200 outline-hidden overflow-hidden"
    >
      <div className="relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close dialog"
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-xs transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Media */}
        <div className="relative aspect-16/9 w-full bg-stone-100">
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <span className="text-[11px] font-medium tracking-wider text-amber-300 uppercase">
              {service.categoryName}
            </span>
            <h2 id="service-modal-title" className="text-xl sm:text-2xl font-normal font-serif leading-tight">
              {service.title}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[60vh] overflow-y-auto">
          {/* Quick specs */}
          <div className="flex items-center gap-4 text-xs font-normal text-stone-600 pb-3 border-b border-stone-100">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span className="text-stone-900 font-medium">{service.rating}</span>
              <span className="text-stone-400">({service.reviewsCount} reviews)</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#581c3c]" />
              <span>{service.durationMinutes} Minutes</span>
            </div>
            <span>•</span>
            <div className="text-emerald-700 font-medium">Doorstep Service</div>
          </div>

          {/* Description */}
          <div className="mt-4">
            <h3 className="text-xs font-medium uppercase text-stone-400 tracking-wider">
              About This Service
            </h3>
            <p className="mt-1 text-sm text-stone-700 leading-relaxed font-normal">
              {service.description}
            </p>
          </div>

          {/* Inclusions list */}
          <div className="mt-5">
            <h3 className="text-xs font-medium uppercase text-stone-400 tracking-wider mb-2">
              What&apos;s Included
            </h3>
            <div className="space-y-2">
              {service.inclusions.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700 font-normal">
                  <div className="p-0.5 rounded-full bg-emerald-100 text-emerald-700 mt-0.5 shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hygiene Guarantee */}
          <div className="mt-5 p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-start gap-3 text-xs text-stone-600">
            <ShieldCheck className="w-5 h-5 text-[#581c3c] shrink-0 mt-0.5" />
            <div className="font-normal">
              <span className="block text-stone-900 font-medium">
                Vaishnavi Hygiene & Quality Assurance
              </span>
              All makeup and tools are sterilized before every appointment. Only genuine, branded cosmetics (MAC, Kryolan, Forever 52) used.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200/80 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] text-stone-500 font-normal">Total Price</div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-medium text-stone-900">
                ₹{service.price}
              </span>
              {service.originalPrice && (
                <span className="text-xs text-stone-400 line-through font-normal">
                  ₹{service.originalPrice}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {quantityInCart === 0 ? (
              <button
                onClick={() => onAddToCart(service)}
                className="px-5 py-2.5 bg-[#581c3c] hover:bg-[#481430] text-white text-xs sm:text-sm font-medium rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add to Cart
              </button>
            ) : (
              <div className="flex items-center bg-[#581c3c] text-white rounded-xl shadow-xs overflow-hidden">
                <button
                  onClick={() => onRemoveFromCart(service.id)}
                  className="px-3 py-2 hover:bg-[#481430] transition-colors cursor-pointer"
                  aria-label="Remove one"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 py-2 text-xs font-medium min-w-[28px] text-center">
                  {quantityInCart}
                </span>
                <button
                  onClick={() => onAddToCart(service)}
                  className="px-3 py-2 hover:bg-[#481430] transition-colors cursor-pointer"
                  aria-label="Add one more"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              onClick={() => onBookDirect(service)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-900 text-xs sm:text-sm font-medium rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" /> Book Now
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};
