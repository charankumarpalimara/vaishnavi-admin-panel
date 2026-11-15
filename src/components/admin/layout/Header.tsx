"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Clock,
  User,
  Settings,
  Calendar,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { BUSINESS_INFO } from "@/data/servicesData";

interface AdminHeaderProps {
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

interface SmartProfilePopoverProps {
  onClose: () => void;
  className?: string;
}

const SmartProfilePopover: React.FC<SmartProfilePopoverProps> = ({
  onClose,
  className = "",
}) => {
  return (
    <>
      {/* Click-outside backdrop to dismiss */}
      <div
        className="fixed inset-0 z-40 bg-stone-900/10 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Floating Smart Popover positioned right near the profile button */}
      <div
        className={`absolute right-0 top-full mt-2 w-64 sm:w-72 bg-white rounded-xl border border-stone-200/90 shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 py-1.5 ${className}`}
        role="dialog"
        aria-label="Lead Artist Profile"
      >
        {/* Simple User Identity Header */}
        <div className="px-4 py-3 border-b border-stone-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#581c3c] text-white flex items-center justify-center font-serif text-sm font-medium shrink-0 shadow-2xs">
            A
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-stone-900 truncate">
              {BUSINESS_INFO.leadArtist}
            </div>
            <div className="text-xs text-stone-500 font-normal truncate">
              {BUSINESS_INFO.title}
            </div>
            <div className="text-[10px] text-emerald-700 font-normal flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Active • Bahadurpally Studio</span>
            </div>
          </div>
        </div>

        {/* Clean Menu Items */}
        <div className="p-1.5 space-y-0.5 text-xs">
          <Link
            href="/admin/profile"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2 rounded-lg text-stone-700 hover:text-[#581c3c] hover:bg-stone-50 transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-stone-400 group-hover:text-[#581c3c] transition-colors" />
              <span className="font-normal">Artist Profile</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-500 transition-colors" />
          </Link>

          <Link
            href="/admin/settings"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2 rounded-lg text-stone-700 hover:text-[#581c3c] hover:bg-stone-50 transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4 text-stone-400 group-hover:text-[#581c3c] transition-colors" />
              <span className="font-normal">Studio Settings</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-500 transition-colors" />
          </Link>

          <Link
            href="/admin/schedule"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2 rounded-lg text-stone-700 hover:text-[#581c3c] hover:bg-stone-50 transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-stone-400 group-hover:text-[#581c3c] transition-colors" />
              <span className="font-normal">Weekly Slots & Schedule</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-500 transition-colors" />
          </Link>

          <Link
            href="/admin/transactions"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2 rounded-lg text-stone-700 hover:text-[#581c3c] hover:bg-stone-50 transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-4 h-4 text-stone-400 group-hover:text-[#581c3c] transition-colors" />
              <span className="font-normal">Transactions & Payments</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-500 transition-colors" />
          </Link>
        </div>
      </div>
    </>
  );
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  mobileMenuOpen,
  onToggleMobileMenu,
}) => {
  const [currentDateTime, setCurrentDateTime] = useState<string>("");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const datePart = now.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const timePart = now.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setCurrentDateTime(`${datePart} • ${timePart}`);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close smart popover on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsProfileModalOpen(false);
      }
    };
    if (isProfileModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isProfileModalOpen]);

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40 shrink-0">
        <Link href="/admin" className="flex flex-col">
          <span className="text-lg font-medium text-[#581c3c] font-serif">
            VAISHNAVI
          </span>
          <span className="text-[10px] text-stone-500 font-normal uppercase -mt-0.5">
            Admin Panel
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Mobile Profile Trigger (Anchored Smart Popover) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfileModalOpen((prev) => !prev)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer"
              title="Open Artist Profile"
              aria-expanded={isProfileModalOpen}
            >
              <div className="w-6 h-6 rounded-full bg-[#581c3c] text-white flex items-center justify-center font-serif text-[10px] font-medium">
                A
              </div>
              <div className="text-left">
                <div className="text-[11px] font-medium text-stone-800 leading-tight">
                  Anusha
                </div>
                <div className="text-[9px] text-emerald-700 font-normal flex items-center gap-1 leading-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Profile
                </div>
              </div>
            </button>

            {isProfileModalOpen && (
              <SmartProfilePopover
                onClose={() => setIsProfileModalOpen(false)}
                className="w-64 max-w-[calc(100vw-2rem)] -right-1"
              />
            )}
          </div>

          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="p-2 rounded-lg bg-stone-100 text-stone-700 cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Desktop Topbar */}
      <header className="hidden md:flex bg-white/95 backdrop-blur-md border-b border-stone-200 px-8 py-3.5 items-center justify-between sticky top-0 z-30 shrink-0">
        <div className="flex items-center gap-2 text-xs font-normal text-stone-500">
          <Clock className="w-3.5 h-3.5 text-stone-400" />
          <span suppressHydrationWarning>
            {currentDateTime || "Loading date & time..."}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Desktop Profile Card Trigger (Anchored Smart Popover) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfileModalOpen((prev) => !prev)}
              className="px-3 py-1.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200/80 flex items-center gap-2.5 transition-colors cursor-pointer group shadow-2xs"
              title="Open Artist Profile & Quick Actions"
              aria-expanded={isProfileModalOpen}
            >
              <div className="w-8 h-8 rounded-full bg-[#581c3c] text-white flex items-center justify-center font-serif text-xs font-medium group-hover:bg-[#481430] transition-colors shadow-2xs">
                A
              </div>
              <div className="min-w-0 text-left">
                <div className="text-xs font-medium text-stone-900 leading-tight flex items-center gap-1.5">
                  <span>Anusha</span>
                  <User className="w-3 h-3 text-stone-400 group-hover:text-[#581c3c] transition-colors" />
                </div>
                <div className="text-[10px] text-emerald-700 font-normal flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Lead Artist Profile
                </div>
              </div>
            </button>

            {isProfileModalOpen && (
              <SmartProfilePopover
                onClose={() => setIsProfileModalOpen(false)}
                className="w-64 sm:w-72"
              />
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default AdminHeader;
