"use client";

import React from "react";
import Image from "next/image";
import { Star, Clock, Plus, Minus, Check, Sparkles } from "lucide-react";
import { ServiceItem } from "@/types";

interface ServiceCardProps {
  service: ServiceItem;
  quantityInCart: number;
  onAddToCart: (service: ServiceItem) => void;
  onRemoveFromCart: (serviceId: string) => void;
  onViewDetails: (service: ServiceItem) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  quantityInCart,
  onAddToCart,
  onRemoveFromCart,
  onViewDetails,
}) => {
  const discountPercent = service.originalPrice
    ? Math.round(
        ((service.originalPrice - service.price) / service.originalPrice) * 100
      )
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      {/* Top Media & Tags */}
      <div>
        <div className="relative aspect-16/10 w-full overflow-hidden bg-stone-100">
          <Image
            src={service.image}
            alt={service.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-102 transition-transform duration-300"
          />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
            {service.tag && (
              <span className="bg-[#581c3c] text-white text-[10px] font-medium tracking-wider px-2.5 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                {service.tag}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="bg-emerald-600 text-white text-[10px] font-medium px-2 py-0.5 rounded-md shadow-xs">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Rating Pill */}
          <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-xs text-stone-900 text-xs font-medium px-2 py-1 rounded-md shadow-xs flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span>{service.rating}</span>
            <span className="text-[10px] text-stone-500 font-normal">
              ({service.reviewsCount})
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-medium text-[#581c3c] tracking-wider text-[11px] uppercase">
              {service.categoryName}
            </span>
            <span className="flex items-center gap-1 font-normal">
              <Clock className="w-3.5 h-3.5" />
              {service.durationMinutes} mins
            </span>
          </div>

          <h3 className="font-medium text-base sm:text-lg text-stone-900 line-clamp-1 group-hover:text-[#581c3c] transition-colors">
            {service.title}
          </h3>

          <p className="text-xs text-stone-500 line-clamp-2 mt-1.5 leading-relaxed font-normal">
            {service.description}
          </p>

          {/* Key inclusions checklist */}
          <div className="mt-3 pt-3 border-t border-stone-100 flex flex-col gap-1 text-xs text-stone-600 font-normal">
            {service.inclusions.slice(0, 2).map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="line-clamp-1">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer / Pricing & Actions */}
      <div className="p-4 sm:p-5 pt-0 border-t border-stone-100 mt-2 bg-stone-50/50">
        <div className="flex items-center justify-between pt-3">
          {/* Price */}
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-medium text-stone-900">
                ₹{service.price}
              </span>
              {service.originalPrice && (
                <span className="text-xs text-stone-400 line-through font-normal">
                  ₹{service.originalPrice}
                </span>
              )}
            </div>
            <button
              onClick={() => onViewDetails(service)}
              className="text-[11px] font-medium text-[#581c3c] hover:underline cursor-pointer block mt-0.5"
            >
              View Details
            </button>
          </div>

          {/* Action button */}
          <div>
            {quantityInCart === 0 ? (
              <button
                onClick={() => onAddToCart(service)}
                className="px-4 py-2 bg-white hover:bg-[#581c3c] text-[#581c3c] hover:text-white border border-[#581c3c] text-xs sm:text-sm font-medium rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            ) : (
              <div className="flex items-center bg-[#581c3c] text-white rounded-xl shadow-xs overflow-hidden border border-[#581c3c]">
                <button
                  onClick={() => onRemoveFromCart(service.id)}
                  className="px-2.5 py-1.5 hover:bg-[#481430] transition-colors cursor-pointer"
                  title="Remove one"
                  aria-label="Remove one"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-2.5 py-1 text-xs font-medium min-w-[24px] text-center">
                  {quantityInCart}
                </span>
                <button
                  onClick={() => onAddToCart(service)}
                  className="px-2.5 py-1.5 hover:bg-[#481430] transition-colors cursor-pointer"
                  title="Add one more"
                  aria-label="Add one more"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
