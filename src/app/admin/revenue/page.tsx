"use client";

import React from "react";
import Link from "next/link";
import { TrendingUp, MapPin } from "lucide-react";
import { useAdmin } from "../AdminContext";

export default function RevenueInsightsPage() {
  const { stats } = useAdmin();

  const averageBookingValue =
    stats.total > 0 ? Math.round(stats.revenue / stats.total) : 0;

  return (
    <div className="space-y-6">
      {/* Title & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium font-serif text-stone-900">
            Revenue & Service Insights
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-normal mt-1">
            Overview of customer earnings, ticket sizes, and neighborhood coverage in Hyderabad.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3 py-1.5 rounded-md bg-stone-100 text-stone-700 text-xs font-medium border border-stone-200">
            Last 30 Days
          </span>
          <Link
            href="/admin/transactions"
            className="px-3.5 py-1.5 bg-[#581c3c] hover:bg-[#481430] text-white text-xs font-medium rounded-md shadow-xs transition-colors"
          >
            Transactions
          </Link>
          <Link
            href="/admin/bookings"
            className="px-3.5 py-1.5 border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-medium rounded-md shadow-xs transition-colors"
          >
            All Bookings
          </Link>
        </div>
      </div>

      {/* Revenue KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white p-5 sm:p-6 rounded-md border border-stone-200/80 shadow-2xs">
          <div className="text-sm text-stone-600 font-normal">Total Booking Value</div>
          <div className="mt-3 text-3xl sm:text-4xl font-medium text-[#581c3c] font-serif">
            ₹{stats.revenue.toLocaleString("en-IN")}
          </div>
          <div className="text-xs sm:text-sm text-emerald-700 mt-1.5 font-normal flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18% from last week
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-md border border-stone-200/80 shadow-2xs">
          <div className="text-sm text-stone-600 font-normal">Average Ticket Size</div>
          <div className="mt-3 text-3xl sm:text-4xl font-medium text-stone-900 font-serif">
            ₹{averageBookingValue.toLocaleString("en-IN")}
          </div>
          <div className="text-xs sm:text-sm text-stone-500 mt-1.5 font-normal">
            Per client appointment
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-md border border-stone-200/80 shadow-2xs">
          <div className="text-sm text-stone-600 font-normal">Completed Services</div>
          <div className="mt-3 text-3xl sm:text-4xl font-medium text-emerald-700 font-serif">
            {stats.completed}
          </div>
          <div className="text-xs sm:text-sm text-stone-500 mt-1.5 font-normal">
            100% satisfaction rate
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-md border border-stone-200/80 shadow-2xs">
          <div className="text-sm text-stone-600 font-normal">Active Clients</div>
          <div className="mt-3 text-3xl sm:text-4xl font-medium text-stone-900 font-serif">
            {stats.total}
          </div>
          <div className="text-xs sm:text-sm text-stone-500 mt-1.5 font-normal">
            Bahadurpally & nearby
          </div>
        </div>
      </div>

      {/* Two Column Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top revenue drivers */}
        <div className="bg-white p-5 sm:p-6 rounded-md border border-stone-200/80 shadow-2xs space-y-4">
          <h2 className="text-lg sm:text-xl font-medium text-stone-900 font-serif">
            Revenue by Service Category
          </h2>

          <div className="space-y-4 text-xs sm:text-sm font-normal">
            <div>
              <div className="flex justify-between text-stone-700 mb-1.5">
                <span>Bridal & HD Makeup (Muhurtham & Reception)</span>
                <span className="font-medium text-stone-900">48% (₹6,998)</span>
              </div>
              <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#581c3c] h-full rounded-full" style={{ width: "48%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-stone-700 mb-1.5">
                <span>Saree Draping & Pre-Pleating</span>
                <span className="font-medium text-stone-900">24% (₹3,495)</span>
              </div>
              <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-600 h-full rounded-full" style={{ width: "24%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-stone-700 mb-1.5">
                <span>Party Combos & Special Packages</span>
                <span className="font-medium text-stone-900">18% (₹2,799)</span>
              </div>
              <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: "18%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-stone-700 mb-1.5">
                <span>Facials, Waxing & Skin Care</span>
                <span className="font-medium text-stone-900">10% (₹1,498)</span>
              </div>
              <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full" style={{ width: "10%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Neighborhood Coverage */}
        <div className="bg-white p-5 sm:p-6 rounded-md border border-stone-200/80 shadow-2xs space-y-4">
          <h2 className="text-lg sm:text-xl font-medium text-stone-900 font-serif">
            Client Location Distribution
          </h2>

          <div className="space-y-3 text-xs sm:text-sm font-normal">
            <div className="p-3.5 rounded-md bg-stone-50 border border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-stone-800">
                <MapPin className="w-4 h-4 text-[#581c3c]" />
                <span>KCR Double Bed Rooms Colony (Bahadurpally)</span>
              </div>
              <span className="font-medium text-[#581c3c]">45% Appointments</span>
            </div>

            <div className="p-3.5 rounded-md bg-stone-50 border border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-stone-800">
                <MapPin className="w-4 h-4 text-[#581c3c]" />
                <span>Mallampet Road & Bowrampet</span>
              </div>
              <span className="font-medium text-[#581c3c]">25% Appointments</span>
            </div>

            <div className="p-3.5 rounded-md bg-stone-50 border border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-stone-800">
                <MapPin className="w-4 h-4 text-[#581c3c]" />
                <span>Gandimaisamma & Dulapally</span>
              </div>
              <span className="font-medium text-[#581c3c]">18% Appointments</span>
            </div>

            <div className="p-3.5 rounded-md bg-stone-50 border border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-stone-800">
                <MapPin className="w-4 h-4 text-[#581c3c]" />
                <span>Suraram & Surrounding Areas (Within 15km)</span>
              </div>
              <span className="font-medium text-[#581c3c]">12% Appointments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modes Reassurance */}
      <div className="p-5 bg-stone-50 rounded-md border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm font-normal">
        <div>
          <span className="text-stone-900 font-medium block">
            Payment & Settlement Modes
          </span>
          <span className="text-stone-500">
            Clients pay directly via Google Pay, PhonePe, Paytm, or Cash upon service completion.
          </span>
        </div>
        <div className="flex items-center gap-2 text-stone-700 font-medium text-xs sm:text-sm">
          <span className="px-3 py-1 bg-white border border-stone-200 rounded-md">UPI</span>
          <span className="px-3 py-1 bg-white border border-stone-200 rounded-md">Cash</span>
          <span className="px-3 py-1 bg-white border border-stone-200 rounded-md">WhatsApp Pay</span>
        </div>
      </div>
    </div>
  );
}
