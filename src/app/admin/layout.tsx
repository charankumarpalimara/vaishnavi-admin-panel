"use client";

import React, { useState } from "react";
import { AdminProvider } from "./AdminContext";
import { AdminSidebar } from "@/components/admin/layout/Sidebar";
import { AdminHeader } from "@/components/admin/layout/Header";

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen h-dvh bg-[#faf7f5] text-stone-900 flex flex-col md:flex-row selection:bg-rose-200 overflow-hidden">
      {/* Sidebar Component from layout folder - fixed & independent on desktop */}
      <AdminSidebar
        mobileMenuOpen={mobileMenuOpen}
        onCloseMobileMenu={() => setMobileMenuOpen(false)}
      />

      {/* Main Area - header stays fixed at top, only content container scrolls */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header Component from layout folder */}
        <AdminHeader
          mobileMenuOpen={mobileMenuOpen}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        {/* Scrollable Page Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminProvider>
  );
}
