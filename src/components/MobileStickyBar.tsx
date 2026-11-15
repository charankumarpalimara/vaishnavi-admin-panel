"use client";

import React from "react";
import { ShoppingBag, ArrowRight, Sparkles, MessageCircle, Phone } from "lucide-react";
import { BUSINESS_INFO } from "@/data/servicesData";
import { CartItem } from "@/types";

interface MobileStickyBarProps {
  cart: CartItem[];
  onOpenCart: () => void;
  onBookNow: () => void;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({
  cart,
  onOpenCart,
  onBookNow,
}) => {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.service.price * item.quantity,
    0
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden p-3 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-2xl">
      {totalItems > 0 ? (
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="relative p-2 rounded-xl bg-[#581c3c]/10 text-[#581c3c]">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-1.5 bg-[#581c3c] text-white text-[10px] font-medium w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            </div>
            <div>
              <div className="text-xs text-stone-500 font-normal">Total Price</div>
              <div className="text-base font-medium text-stone-900 leading-tight">
                ₹{totalPrice}
              </div>
            </div>
          </div>

          <button
            onClick={onOpenCart}
            className="flex-1 max-w-[200px] py-3 px-4 bg-[#581c3c] hover:bg-[#481430] text-white text-xs font-medium rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>View Cart</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2">
          <a
            href={`tel:${BUSINESS_INFO.phone1.replace(/\s+/g, "")}`}
            className="p-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl border border-stone-200 flex items-center justify-center"
            title="Call"
          >
            <Phone className="w-4 h-4 text-[#581c3c]" />
          </a>

          <a
            href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 flex items-center justify-center"
            title="WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>

          <button
            onClick={onBookNow}
            className="flex-1 py-3 px-4 bg-[#581c3c] hover:bg-[#481430] text-white text-xs font-medium rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Book Home Service</span>
          </button>
        </div>
      )}
    </div>
  );
};
