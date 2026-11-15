"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, MapPin, Phone, MessageCircle, ShoppingBag, Search, Layers } from "lucide-react";
import { BUSINESS_INFO } from "@/data/servicesData";
import { CartItem } from "@/types";

interface HeaderProps {
  cart: CartItem[];
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cart,
  onOpenCart,
  searchQuery,
  onSearchChange,
}) => {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.service.price * item.quantity,
    0
  );

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      {/* Top bar */}
      <div className="bg-[#581c3c] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-medium text-amber-300">
              <Sparkles className="w-3.5 h-3.5" /> Doorstep Salon Available
            </span>
            <span className="hidden sm:inline text-rose-200/70">|</span>
            <span className="hidden sm:inline text-rose-100 font-normal">
              Saree Draping • Makeup • Hair Styling • Facials
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-normal">
            <span className="text-rose-200 hidden sm:inline">Bahadurpally & Nearby Areas</span>
            <a
              href={`tel:${BUSINESS_INFO.phone1.replace(/\s+/g, "")}`}
              className="hover:text-amber-200 transition-colors flex items-center gap-1 font-medium"
            >
              <Phone className="w-3 h-3" /> {BUSINESS_INFO.phone1}
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <img
                src="/logo.png"
                alt="Vaishnavi Beauty Services"
                className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-md"
              />
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-medium tracking-tight text-[#581c3c] font-serif group-hover:text-[#481430] transition-colors">
                  VAISHNAVI
                </span>
                <span className="text-[10px] sm:text-xs font-normal tracking-wider text-stone-500 uppercase -mt-0.5">
                  Beauty Services • By Anusha
                </span>
              </div>
            </Link>

            {/* Nav Links */}
            <div className="hidden lg:flex items-center gap-2">
              <Link
                href="/categories"
                className="flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs py-1 px-3 rounded-full border border-stone-200 font-normal transition-colors"
              >
                <Layers className="w-3.5 h-3.5 text-[#581c3c]" />
                <span>Categories</span>
              </Link>
            </div>

            {/* Location selector */}
            <div className="hidden lg:flex items-center gap-1.5 bg-stone-100 text-stone-700 text-xs py-1 px-3 rounded-full border border-stone-200 font-normal">
              <MapPin className="w-3.5 h-3.5 text-[#581c3c]" />
              <span className="font-medium text-stone-800">Bahadurpally</span>
              <span className="text-stone-500">(Doorstep)</span>
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search saree draping, bridal makeup, facial..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-stone-100 hover:bg-stone-100/80 focus:bg-white border border-stone-200 focus:border-[#581c3c] rounded-full outline-hidden transition-all placeholder:text-stone-400 text-stone-800 font-normal"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* WhatsApp direct */}
            <a
              href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(
                "Hello Anusha, I would like to inquire about Vaishnavi Beauty Services."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-full transition-colors"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600/20" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            {/* Call button */}
            <a
              href={`tel:${BUSINESS_INFO.phone1.replace(/\s+/g, "")}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-full transition-colors"
            >
              <Phone className="w-4 h-4 text-[#581c3c]" />
              <span className="hidden sm:inline">Call</span>
            </a>

            {/* Cart button */}
            <button
              onClick={onOpenCart}
              className={`relative inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-full shadow-xs transition-all cursor-pointer ${
                totalItems > 0
                  ? "bg-[#581c3c] text-white hover:bg-[#481430]"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200"
              }`}
              aria-label={`Cart with ${totalItems} items`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">
                {totalItems > 0 ? `Cart (₹${totalPrice})` : "Cart"}
              </span>
              {totalItems > 0 && (
                <span className="bg-amber-400 text-stone-900 text-[11px] font-medium px-1.5 py-0.2 rounded-full sm:hidden">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="mt-2.5 md:hidden">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search saree draping, bridal makeup, facial..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-stone-100 border border-stone-200 rounded-full outline-hidden focus:border-[#581c3c] placeholder:text-stone-400 text-stone-800 font-normal"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
