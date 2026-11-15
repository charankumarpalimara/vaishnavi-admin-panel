"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MapPin,
  ArrowRight,
  MessageCircle,
  Phone,
  Sparkles,
} from "lucide-react";
import { useAdmin } from "./AdminContext";

export default function AdminOverviewPage() {
  const { bookings, stats, updateBookingStatus } = useAdmin();

  const todayBookings = bookings.filter((b) => b.date.includes("Today"));

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium font-serif text-stone-900">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-normal mt-1">
            Welcome back, Anusha. Here is your daily beauty service summary for Bahadurpally.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/bookings"
            className="px-4 py-2.5 bg-[#581c3c] hover:bg-[#481430] text-white text-xs sm:text-sm font-medium rounded-md shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Calendar className="w-4 h-4" />
            <span>Manage All Bookings</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white p-5 sm:p-6 rounded-md border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-stone-600 text-sm font-normal">
            <span>Today&apos;s Appointments</span>
            <Calendar className="w-5 h-5 text-[#581c3c]" />
          </div>
          <div className="mt-3 text-3xl sm:text-4xl font-medium text-stone-900 font-serif">
            {todayBookings.length}
          </div>
          <div className="text-xs sm:text-sm text-emerald-700 mt-1.5 font-normal">
            1 Doorstep • 1 Studio visit
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-md border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-stone-600 text-sm font-normal">
            <span>Pending Review</span>
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="mt-3 text-3xl sm:text-4xl font-medium text-amber-700 font-serif">
            {stats.pending}
          </div>
          <div className="text-xs sm:text-sm text-stone-500 mt-1.5 font-normal">
            Awaiting your confirmation
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-md border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-stone-600 text-sm font-normal">
            <span>Confirmed Bookings</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="mt-3 text-3xl sm:text-4xl font-medium text-stone-900 font-serif">
            {stats.confirmed}
          </div>
          <div className="text-xs sm:text-sm text-stone-500 mt-1.5 font-normal">
            Active on schedule
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-md border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-stone-600 text-sm font-normal">
            <span>Total Booking Value</span>
            <TrendingUp className="w-5 h-5 text-[#581c3c]" />
          </div>
          <div className="mt-3 text-3xl sm:text-4xl font-medium text-[#581c3c] font-serif">
            ₹{stats.revenue.toLocaleString("en-IN")}
          </div>
          <div className="text-xs sm:text-sm text-stone-500 mt-1.5 font-normal">
            {stats.total} total bookings
          </div>
        </div>
      </div>

      {/* Main Section: Today's Appointments & Studio Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Today's Appointments */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-medium text-stone-900 font-serif flex items-center gap-2">
              <span>Today&apos;s Appointments</span>
              <span className="text-xs sm:text-sm px-2.5 py-0.5 rounded-full bg-rose-100 text-[#581c3c] font-medium">
                {todayBookings.length} scheduled
              </span>
            </h2>
            <Link
              href="/admin/bookings"
              className="text-xs sm:text-sm text-[#581c3c] hover:underline flex items-center gap-1 font-normal"
            >
              <span>View All Bookings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3.5">
            {todayBookings.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-md border border-stone-200 text-stone-500 text-xs sm:text-sm font-normal">
                <Calendar className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                <div className="text-sm font-medium text-stone-800">
                  No appointments scheduled for today.
                </div>
                <div className="text-xs text-stone-500 mt-1 font-normal">
                  Check upcoming bookings or adjust your slot availability.
                </div>
                <Link
                  href="/admin/bookings"
                  className="mt-4 inline-flex items-center gap-1 px-4 py-2 bg-[#581c3c] text-white text-xs font-medium rounded-md hover:bg-[#481430] transition-colors"
                >
                  Go to All Bookings
                </Link>
              </div>
            ) : (
              todayBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white p-5 rounded-md border border-stone-200/80 shadow-2xs space-y-3.5"
                >
                  {/* Top row */}
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="px-2.5 py-1 rounded-md bg-rose-50 text-[#581c3c] font-medium text-xs">
                        {b.id}
                      </span>
                      <span className="font-medium text-sm sm:text-base text-stone-900">
                        {b.clientName}
                      </span>
                      <span className="text-stone-400 font-normal">•</span>
                      <span className="text-stone-700 font-medium text-xs sm:text-sm flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#581c3c]" />
                        {b.timeSlot}
                      </span>
                      <span className="text-stone-400 font-normal">•</span>
                      <span className="text-stone-500 font-normal text-xs">
                        {b.serviceType === "home" ? "🏠 Doorstep Visit" : "🏢 Studio Visit"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                          b.status === "Confirmed"
                            ? "bg-emerald-100 text-emerald-800"
                            : b.status === "Completed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {b.status}
                      </span>
                      <span className="text-sm sm:text-base font-medium text-[#581c3c] font-serif ml-1">
                        ₹{b.totalAmount}
                      </span>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="text-xs sm:text-sm text-stone-600 font-normal flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#581c3c] shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{b.address}</span>
                  </div>

                  {/* Services */}
                  <div className="text-xs sm:text-sm text-stone-500 font-normal">
                    <span className="text-stone-700 font-medium">Services: </span>
                    {b.services.map((s) => `${s.title}${s.quantity > 1 ? ` (×${s.quantity})` : ""}`).join(", ")}
                  </div>

                  {/* Notes */}
                  {b.notes && (
                    <div className="text-xs sm:text-sm text-amber-800 bg-amber-50/80 border border-amber-200/60 px-3 py-1.5 rounded-md font-normal">
                      <span className="font-medium text-amber-900">Client Note: </span>
                      {b.notes}
                    </div>
                  )}

                  {/* Action row */}
                  <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/91${b.phone}?text=${encodeURIComponent(
                          `Hello ${b.clientName}, Anusha here from Vaishnavi Beauty regarding your appointment today (${b.timeSlot}).`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-medium flex items-center gap-1.5 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>WhatsApp Client</span>
                      </a>
                      <a
                        href={`tel:${b.phone}`}
                        className="px-3.5 py-1.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 font-normal flex items-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#581c3c]" />
                        <span>Call {b.phone}</span>
                      </a>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {b.status !== "Completed" && (
                        <button
                          onClick={() => updateBookingStatus(b.id, "Completed")}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md text-xs sm:text-sm cursor-pointer transition-colors"
                        >
                          Mark Completed
                        </button>
                      )}
                      {b.status === "Pending" && (
                        <button
                          onClick={() => updateBookingStatus(b.id, "Confirmed")}
                          className="px-4 py-1.5 bg-[#581c3c] hover:bg-[#481430] text-white font-medium rounded-md text-xs sm:text-sm cursor-pointer transition-colors"
                        >
                          Confirm Slot
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Quick Controls & Studio Location Info */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-lg sm:text-xl font-medium text-stone-900 font-serif">
            Studio & Operations
          </h2>

          <div className="bg-white p-5 rounded-md border border-stone-200/80 shadow-2xs space-y-3.5">
            <div className="space-y-2.5 text-xs sm:text-sm font-normal text-stone-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#581c3c] shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-stone-800 block">Studio Address:</span>
                  <span>Flat 324, 2nd Block, KCR Double Bed Rooms, Bahadurpally</span>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-2 border-t border-stone-100">
                <Clock className="w-4 h-4 text-[#581c3c] shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-stone-800 block">Doorstep Service Radius:</span>
                  <span>Up to 15 km across Bahadurpally, Mallampet, Gandimaisamma</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs sm:text-sm text-stone-500 font-normal">
              <span>Slot Controls</span>
              <Link href="/admin/schedule" className="text-[#581c3c] hover:underline font-medium">
                Adjust Availability
              </Link>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-gradient-to-r from-[#581c3c] to-[#70244f] text-white p-5 sm:p-6 rounded-md shadow-xs space-y-3.5">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-amber-300 font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Quick Navigation</span>
            </div>
            <h3 className="text-base sm:text-lg font-normal font-serif leading-tight">
              Manage Services, Prices & Availability
            </h3>
            <p className="text-xs sm:text-sm text-rose-100 font-normal leading-relaxed">
              Update pricing for saree draping, add festival combos, or block dates when booked for outstation weddings.
            </p>

            <div className="pt-2 flex flex-wrap gap-2.5 text-xs sm:text-sm font-medium">
              <Link
                href="/admin/services"
                className="px-3.5 py-2 bg-white text-stone-900 rounded-md hover:bg-stone-100 transition-colors"
              >
                Services & Rates
              </Link>
              <Link
                href="/admin/schedule"
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors"
              >
                Slot Controls
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
