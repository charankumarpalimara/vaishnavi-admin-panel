"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Settings,
  Save,
  CheckCircle2,
  RotateCcw,
  User,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  ShieldCheck,
  CreditCard,
  Calendar,
  Sparkles,
  ArrowRight,
  LogOut,
} from "lucide-react";
import { BUSINESS_INFO } from "@/data/servicesData";

const LOCAL_STORAGE_SETTINGS = "vaishnavi_admin_settings";

interface AppSettings {
  studioName: string;
  leadArtist: string;
  primaryPhone: string;
  secondaryPhone: string;
  studioAddress: string;
  doorstepRadius: string;
  maxBookingsPerDay: string;
  emergencyVisitsEnabled: boolean;
  minNoticeHours: string;
  autoConfirmBookings: boolean;
  whatsappConfirmationMessage: string;
  whatsappReminderMessage: string;
  upiId: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  studioName: BUSINESS_INFO.name,
  leadArtist: BUSINESS_INFO.leadArtist,
  primaryPhone: BUSINESS_INFO.phone1,
  secondaryPhone: BUSINESS_INFO.phone2,
  studioAddress: BUSINESS_INFO.address,
  doorstepRadius: "15",
  maxBookingsPerDay: "6",
  emergencyVisitsEnabled: true,
  minNoticeHours: "2",
  autoConfirmBookings: false,
  whatsappConfirmationMessage:
    "Hello {clientName}, thank you for choosing Vaishnavi Beauty Services! Your appointment for {service} on {date} at {time} is confirmed. Lead artist Anusha will arrive on time.",
  whatsappReminderMessage:
    "Namaste {clientName}! Gentle reminder about your beauty appointment with Anusha today at {time}. Please keep silk saree and jewelry ready.",
  upiId: "9618409290@upi",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_SETTINGS);
      if (stored) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      }
    } catch {
      // ignore
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(LOCAL_STORAGE_SETTINGS, JSON.stringify(settings));
    } catch {
      // ignore
    }
    setIsSaved(true);
    showToast("Settings saved successfully.");
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.removeItem(LOCAL_STORAGE_SETTINGS);
    } catch {
      // ignore
    }
    showToast("Reset settings to defaults.");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#581c3c]" />
            <h1 className="text-2xl sm:text-3xl font-medium font-serif text-stone-900">
              Settings & Studio Configuration
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 font-normal mt-1">
            Manage operational rules, doorstep radius, automated WhatsApp messaging, and studio defaults.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-md border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs sm:text-sm font-medium flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
            <span>Reset</span>
          </button>

          <button
            type="submit"
            form="settings-form"
            className="px-4 py-2 bg-[#581c3c] hover:bg-[#481430] text-white text-xs sm:text-sm font-medium rounded-md shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {toastMessage && (
        <div className="p-3.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link
          href="/admin/profile"
          className="p-4 rounded-md bg-white border border-stone-200/80 shadow-2xs hover:border-[#581c3c]/40 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#581c3c]/10 text-[#581c3c] flex items-center justify-center font-serif text-sm font-medium">
              A
            </div>
            <div>
              <span className="text-xs sm:text-sm font-medium text-stone-900 block">
                Artist Profile & Bio
              </span>
              <span className="text-[11px] text-stone-400 font-normal">
                Anusha • 4.94 ★ rating
              </span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-stone-400" />
        </Link>

        <Link
          href="/admin/schedule"
          className="p-4 rounded-md bg-white border border-stone-200/80 shadow-2xs hover:border-[#581c3c]/40 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-medium text-stone-900 block">
                Monday–Sunday Slots
              </span>
              <span className="text-[11px] text-stone-400 font-normal">
                Weekly calendar & hours
              </span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-stone-400" />
        </Link>

        <Link
          href="/admin/transactions"
          className="p-4 rounded-md bg-white border border-stone-200/80 shadow-2xs hover:border-[#581c3c]/40 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-medium text-stone-900 block">
                Payment Settlements
              </span>
              <span className="text-[11px] text-stone-400 font-normal">
                UPI & Cash records
              </span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-stone-400" />
        </Link>
      </div>

      {/* Main Settings Form */}
      <form id="settings-form" onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Studio Details */}
        <div className="bg-white p-5 sm:p-6 rounded-md border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h2 className="text-lg font-medium font-serif text-stone-900">
              Studio & Contact Information
            </h2>
            <Link
              href="/admin/profile"
              className="text-xs font-medium text-[#581c3c] hover:underline"
            >
              Open Full Profile →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Studio / Business Name
              </label>
              <input
                type="text"
                required
                value={settings.studioName}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    studioName: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Lead Beautician Name
              </label>
              <input
                type="text"
                required
                value={settings.leadArtist}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    leadArtist: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Primary Phone (Calling & WhatsApp)
              </label>
              <input
                type="tel"
                required
                value={settings.primaryPhone}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    primaryPhone: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Secondary Phone (Alternate & UPI)
              </label>
              <input
                type="tel"
                value={settings.secondaryPhone}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    secondaryPhone: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Studio Address (Bahadurpally)
              </label>
              <input
                type="text"
                required
                value={settings.studioAddress}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    studioAddress: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Operational & Doorstep Rules */}
        <div className="bg-white p-5 sm:p-6 rounded-md border border-stone-200/80 shadow-2xs space-y-4">
          <h2 className="text-lg font-medium font-serif text-stone-900 border-b border-stone-100 pb-3">
            Operational & Doorstep Service Rules
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Max Bookings Per Day
              </label>
              <input
                type="number"
                value={settings.maxBookingsPerDay}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    maxBookingsPerDay: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal"
              />
              <span className="text-[11px] text-stone-400 font-normal mt-1 block">
                Preserves personalized attention for each bride.
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Doorstep Travel Radius (KM)
              </label>
              <input
                type="number"
                value={settings.doorstepRadius}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    doorstepRadius: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal"
              />
              <span className="text-[11px] text-stone-400 font-normal mt-1 block">
                Covers Bahadurpally, Mallampet, Bowrampet, & Gandimaisamma.
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Minimum Booking Lead Time (Hours)
              </label>
              <input
                type="number"
                value={settings.minNoticeHours}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    minNoticeHours: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal"
              />
              <span className="text-[11px] text-stone-400 font-normal mt-1 block">
                Advance notice for standard appointments.
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs sm:text-sm font-medium text-stone-900">
                Emergency Home Visits (2-Hour Rush Muhurtham)
              </div>
              <div className="text-xs text-stone-500 font-normal">
                Allow customers to place urgent requests for early morning saree draping.
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                setSettings((prev) => ({
                  ...prev,
                  emergencyVisitsEnabled: !prev.emergencyVisitsEnabled,
                }))
              }
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${settings.emergencyVisitsEnabled
                  ? "bg-emerald-600 text-white"
                  : "bg-stone-200 text-stone-700"
                }`}
            >
              {settings.emergencyVisitsEnabled ? "Enabled" : "Disabled"}
            </button>
          </div>
        </div>

        {/* Section 3: Automated WhatsApp Messaging */}
        <div className="bg-white p-5 sm:p-6 rounded-md border border-stone-200/80 shadow-2xs space-y-4">
          <h2 className="text-lg font-medium font-serif text-stone-900 border-b border-stone-100 pb-3">
            Automated WhatsApp Message Templates
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Booking Confirmation Template
              </label>
              <textarea
                rows={2}
                value={settings.whatsappConfirmationMessage}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    whatsappConfirmationMessage: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal"
              />
              <span className="text-[11px] text-stone-400 font-normal mt-1 block">
                Variables: &#123;clientName&#125;, &#123;service&#125;, &#123;date&#125;, &#123;time&#125;
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Appointment Reminder Template
              </label>
              <textarea
                rows={2}
                value={settings.whatsappReminderMessage}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    whatsappReminderMessage: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#581c3c] hover:bg-[#481430] text-white text-xs sm:text-sm font-medium rounded-md shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}

