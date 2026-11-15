"use client";

import React from "react";
import Image from "next/image";
import { Star, Sparkles, MapPin, MessageCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import { BUSINESS_INFO, CATEGORIES } from "@/data/servicesData";
import { ServiceCategory } from "@/types";

interface HeroProps {
  onSelectCategory: (id: string) => void;
  selectedCategory: string;
  onBookNow: () => void;
  categories?: ServiceCategory[];
}

export const Hero: React.FC<HeroProps> = ({
  onSelectCategory,
  selectedCategory,
  onBookNow,
  categories,
}) => {
  const displayCategories = categories && categories.length > 0 ? categories : CATEGORIES;
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#faf4f0] via-[#fdfbf9] to-white pt-8 pb-12 border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left copy */}
          <div className="lg:col-span-7 flex flex-col gap-4 text-center lg:text-left">
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 self-center lg:self-start bg-[#581c3c]/10 text-[#581c3c] text-xs font-medium px-3.5 py-1.5 rounded-full border border-[#581c3c]/15">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <span>Doorstep Salon for Women in Bahadurpally</span>
              <span className="text-[#581c3c]/40">•</span>
              <span className="text-amber-800 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> 4.94
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 tracking-tight font-serif leading-tight">
              Salon & Bridal Services at the Comfort of{" "}
              <span className="text-[#581c3c] italic">
                Your Home
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-2xl font-normal leading-relaxed">
              Professional Saree Draping, HD Bridal & Event Makeup, Poola Jada Hairstyling, and Luxury Facials by certified expert <span className="text-stone-900 font-medium">Anusha</span>. Single-use hygienic kits & branded cosmetics brought right to your door.
            </p>

            {/* Quick value proposition points */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-2 text-left">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-stone-700">
                  <span className="font-medium block text-stone-900">Zero Spill Home Visit</span>
                  <span className="text-stone-500 font-normal">Protective mats & cleanup</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-stone-700">
                  <span className="font-medium block text-stone-900">Original Branded Kits</span>
                  <span className="text-stone-500 font-normal">MAC, Kryolan, Forever 52</span>
                </div>
              </div>
              <div className="flex items-start gap-2 col-span-2 sm:col-span-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-stone-700">
                  <span className="font-medium block text-stone-900">Specialist Saree Draping</span>
                  <span className="text-stone-500 font-normal">Comfortable for 12+ hrs</span>
                </div>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={onBookNow}
                className="px-6 py-3.5 bg-[#581c3c] hover:bg-[#481430] text-white text-sm sm:text-base font-medium rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                Book Home Service
              </button>

              <a
                href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(
                  "Hello Anusha! I would like to book a beauty service at home."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm sm:text-base font-medium rounded-xl shadow-xs transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Booking
              </a>

              <a
                href="#services-section"
                className="px-5 py-3.5 bg-white hover:bg-stone-50 text-stone-700 text-sm font-medium rounded-xl border border-stone-300 shadow-2xs transition-all flex items-center gap-2"
              >
                Explore Services
              </a>
            </div>

            {/* Service Location Notice */}
            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs text-stone-500 pt-1 font-normal">
              <MapPin className="w-3.5 h-3.5 text-[#581c3c]" />
              <span>
                Based at <span className="text-stone-700">{BUSINESS_INFO.address}</span> (Within 15 km)
              </span>
            </div>
          </div>

          {/* Right Hero Image (Clean, high-end bridal / saree styling photography, NOT the card) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-md aspect-4/5 rounded-3xl overflow-hidden shadow-xl border border-stone-200/80 bg-stone-100">
              <Image
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80"
                alt="Saree draping and bridal styling at Vaishnavi Beauty Services"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/10 to-transparent" />

              {/* Floating Badge 1: Top Right */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md text-xs font-medium text-stone-800 flex items-center gap-1.5 border border-stone-200/60">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Certified Artist</span>
              </div>

              {/* Floating Badge 2: Bottom Overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-stone-200/60 text-stone-900">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-[#581c3c]">
                      Anusha • Lead Beautician
                    </div>
                    <div className="text-xs text-stone-500 font-normal">
                      Saree Draping & Bridal Specialist
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium text-amber-700 flex items-center gap-1 justify-end">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> 4.94
                    </div>
                    <div className="text-[11px] text-stone-400 font-normal">
                      450+ Appointments
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-10 pt-6 border-t border-stone-200/80">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-medium uppercase tracking-wider text-stone-500">
              Browse by Service Category
            </h2>
            <span className="text-xs text-stone-500 font-normal">
              {Math.max(0, displayCategories.length - 1)} Specializations
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {displayCategories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#581c3c] text-white shadow-xs"
                      : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
                  }`}
                >
                  <span>{cat.name}</span>
                  {cat.badge && (
                    <span
                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                        isSelected
                          ? "bg-amber-400 text-stone-900"
                          : "bg-rose-100 text-[#581c3c]"
                      }`}
                    >
                      {cat.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
