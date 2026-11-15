"use client";

import React from "react";
import Link from "next/link";
import { Phone, MessageCircle, MapPin, Clock } from "lucide-react";
import { BUSINESS_INFO } from "@/data/servicesData";

interface FooterProps {
  onSelectCategory?: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
}) => {
  const handleCategoryClick = (id: string) => {
    if (onSelectCategory) {
      onSelectCategory(id);
    } else if (typeof window !== "undefined") {
      window.location.href = `/?category=${id}#services-section`;
    }
  };
  return (
    <footer className="bg-[#1c131a] text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-stone-800">
          {/* Brand info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Vaishnavi Beauty Services"
                className="w-11 h-11 object-contain bg-white rounded-lg p-0.5"
              />
              <div>
                <span className="text-2xl font-medium text-white font-serif tracking-tight">
                  VAISHNAVI
                </span>
                <span className="block text-xs uppercase tracking-widest text-amber-400 font-normal">
                  Beauty Services • By Anusha
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 max-w-sm leading-relaxed font-normal">
              Your trusted doorstep beauty partner for South Indian Bridal makeup, precision saree draping, hair styling, and rejuvenating facials in Hyderabad.
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              <a
                href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href={`tel:${BUSINESS_INFO.phone1.replace(/\s+/g, "")}`}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call {BUSINESS_INFO.phone1}</span>
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-medium uppercase tracking-wider text-amber-400">
              Popular Services
            </h3>
            <ul className="space-y-2 text-xs font-normal">
              <li>
                <button
                  onClick={() => handleCategoryClick("saree")}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Saree Draping & Box Pleating
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick("makeup")}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  HD Bridal & Muhurtham Makeup
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick("hair")}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Poola Jada & Hair Styling
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick("facial")}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  24K Gold & O3+ Facials
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick("packages")}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  All-in-One Bridal Combos
                </button>
              </li>
              <li className="pt-1">
                <Link
                  href="/categories"
                  className="text-amber-400 hover:underline transition-colors flex items-center gap-1 font-medium"
                >
                  <span>View All Categories →</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-medium uppercase tracking-wider text-amber-400">
              Contact & Studio Location
            </h3>
            <div className="space-y-2.5 text-xs text-stone-300 font-normal">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white block font-medium">Studio Address:</span>
                  <span>{BUSINESS_INFO.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white block font-medium">Phone Numbers:</span>
                  <div className="space-x-2">
                    <a href={`tel:${BUSINESS_INFO.phone1.replace(/\s+/g, "")}`} className="hover:text-amber-300">
                      {BUSINESS_INFO.phone1}
                    </a>
                    <span>|</span>
                    <a href={`tel:${BUSINESS_INFO.phone2.replace(/\s+/g, "")}`} className="hover:text-amber-300">
                      {BUSINESS_INFO.phone2}
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white block font-medium">Operating Hours:</span>
                  <span>{BUSINESS_INFO.operatingHours}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 font-normal">
          <div>
            © {new Date().getFullYear()} Vaishnavi Beauty Services. All rights reserved.
          </div>
          <div className="flex items-center gap-3 text-stone-400">
            <span>Crafted with care for women in Hyderabad</span>
            <span className="text-stone-700">•</span>
            <Link
              href="/admin"
              className="text-stone-400 hover:text-amber-300 transition-colors font-normal inline-flex items-center gap-1"
            >
              <span>Partner Admin Portal</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
