"use client";

import React from "react";
import { ShieldCheck, Sparkles, Home, Award } from "lucide-react";
import { BUSINESS_INFO } from "@/data/servicesData";

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-16 bg-[#faf6f0] border-t border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-medium uppercase tracking-wider text-[#581c3c] bg-rose-100/60 px-3 py-1 rounded-full border border-rose-200/50">
            The Vaishnavi Standard
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-normal text-stone-900 font-serif">
            Why Women in Hyderabad Choose Vaishnavi Beauty
          </h2>
          <p className="mt-2 text-sm text-stone-600 font-normal">
            Enjoy premium salon quality without travelling. Certified artist Anusha delivers perfection right to your living room.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-[#581c3c] flex items-center justify-center mb-4">
              <Home className="w-6 h-6" />
            </div>
            <h3 className="text-base font-medium text-stone-900 mb-2">
              Doorstep Service
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed font-normal">
              No traffic jams, no parlor waiting time. Relax at your home while our artist arrives with all required tools, lighting, and floor protection.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-medium text-stone-900 mb-2">
              Branded & Original Kits
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed font-normal">
              We exclusively use authentic products from MAC, Kryolan, Forever 52, Shahnaz Husain, and Raaga for sweat-proof and long-lasting beauty.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-medium text-stone-900 mb-2">
              Single-Use Disposables
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed font-normal">
              Hygienic single-use bedsheets, waxing spatulas, sterilized brushes, and fresh safety pins ensure zero contamination and total peace of mind.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-medium text-stone-900 mb-2">
              Master Saree Drapist
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed font-normal">
              Box pleats, South Indian bridal silks, or trendy pre-stitched styles — draped seamlessly to stay comfortable and picture-perfect all day.
            </p>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="mt-12 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-medium text-[#581c3c] font-serif">
              {BUSINESS_INFO.totalBookings}
            </div>
            <div className="text-xs text-stone-500 font-normal mt-1">Happy Clients Served</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-medium text-[#581c3c] font-serif">
              {BUSINESS_INFO.rating} ★
            </div>
            <div className="text-xs text-stone-500 font-normal mt-1">Average Customer Rating</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-medium text-[#581c3c] font-serif">
              {BUSINESS_INFO.experienceYears}
            </div>
            <div className="text-xs text-stone-500 font-normal mt-1">Industry Experience</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-medium text-[#581c3c] font-serif">
              100%
            </div>
            <div className="text-xs text-stone-500 font-normal mt-1">Mess-Free Cleanup</div>
          </div>
        </div>
      </div>
    </section>
  );
};
