"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Layers,
  Sparkles,
  Clock,
  TrendingUp,
  Receipt,
  Settings,
  ExternalLink,
  X,
  User,
  LogOut,
} from "lucide-react";
import { useAdmin } from "@/app/admin/AdminContext";
import { BUSINESS_INFO } from "@/data/servicesData";

interface AdminSidebarProps {
  mobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  mobileMenuOpen,
  onCloseMobileMenu,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { stats } = useAdmin();

  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const handleLogout = () => {
    setIsLogoutConfirmOpen(false);
    router.push("/");
  };

  const navItems = [
    {
      name: "Dashboard Overview",
      href: "/admin",
      icon: LayoutDashboard,
      badge: null,
      exact: true,
    },
    {
      name: "Bookings & Schedule",
      href: "/admin/bookings",
      icon: Calendar,
      badge: stats.pending > 0 ? `${stats.pending} new` : null,
      exact: false,
    },
    {
      name: "Service Categories",
      href: "/admin/categories",
      icon: Layers,
      badge: null,
      exact: false,
    },
    {
      name: "Services & Pricing",
      href: "/admin/services",
      icon: Sparkles,
      badge: null,
      exact: false,
    },
    {
      name: "Slot Availability",
      href: "/admin/schedule",
      icon: Clock,
      badge: null,
      exact: false,
    },
    {
      name: "Revenue & Insights",
      href: "/admin/revenue",
      icon: TrendingUp,
      badge: null,
      exact: false,
    },
    {
      name: "Transactions",
      href: "/admin/transactions",
      icon: Receipt,
      badge: null,
      exact: false,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      badge: null,
      exact: false,
    },
  ];

  const isLinkActive = (itemHref: string, exact: boolean) => {
    if (exact) {
      return pathname === itemHref;
    }
    return pathname.startsWith(itemHref);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={onCloseMobileMenu}
          className="fixed inset-0 z-40 bg-stone-900/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Aside - fixed height, sticky, with independent internal scrolling */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-stone-200 flex flex-col justify-between transition-transform duration-200 md:static md:translate-x-0 md:h-screen md:shrink-0 overflow-y-auto ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-5 flex-1">
          {/* Brand header */}
          <div className="flex items-center justify-between pb-6 border-b border-stone-100">
            <Link href="/admin" className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="Vaishnavi Beauty Services"
                className="w-9 h-9 object-contain rounded-md"
              />
              <div className="flex flex-col">
                <span className="text-xl font-medium tracking-tight text-[#581c3c] font-serif">
                  VAISHNAVI
                </span>
                <span className="text-[10px] font-normal tracking-wider text-stone-500 uppercase -mt-0.5">
                  Admin Panel • Partner Portal
                </span>
              </div>
            </Link>

            <button
              type="button"
              onClick={onCloseMobileMenu}
              className="md:hidden p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links with real Next.js routing */}
          <nav className="mt-6 space-y-1">
            <div className="text-[10px] uppercase font-normal text-stone-400 px-3 mb-2 tracking-wider">
              Management
            </div>
            {navItems.map((item) => {
              const active = isLinkActive(item.href, item.exact);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobileMenu}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-colors ${active
                    ? "bg-[#581c3c] text-white shadow-2xs"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${active ? "text-amber-300" : "text-stone-400"}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${active
                        ? "bg-amber-400 text-stone-900"
                        : "bg-amber-100 text-amber-800"
                        }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3.5 border-t border-stone-200/80 bg-stone-50/50 space-y-2 shrink-0">
          {/* Profile Option Button */}
          {/* Profile Option Link */}
          <Link
            href="/admin/profile"
            className="w-full flex items-center gap-2.5 p-2 rounded-lg bg-white hover:bg-stone-50 border border-stone-200 text-left transition-colors cursor-pointer group shadow-2xs"
            title="View Admin Profile & Studio Details"
          >
            <div className="w-8 h-8 rounded-full bg-[#581c3c] text-white flex items-center justify-center font-serif text-xs font-medium shrink-0 shadow-2xs group-hover:bg-[#481430] transition-colors">
              A
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-stone-900 truncate">
                {BUSINESS_INFO.leadArtist}
              </div>
              <div className="text-[10px] text-stone-500 font-normal truncate">
                Profile & Settings
              </div>
            </div>
            <User className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#581c3c] transition-colors shrink-0" />
          </Link>



          {/* Logout Button */}
          <button
            type="button"
            onClick={() => setIsLogoutConfirmOpen(true)}
            className="w-full flex items-center justify-center gap-1.5 p-2 rounded-lg bg-white hover:bg-rose-50 text-stone-600 hover:text-rose-700 text-xs font-medium border border-stone-200 hover:border-rose-200 transition-colors cursor-pointer group"
          >
            <LogOut className="w-3.5 h-3.5 text-stone-400 group-hover:text-rose-600" />
            <span>Sign Out / Log Out</span>
          </button>

          <div className="text-[10px] text-stone-400 text-center font-normal pt-0.5">
            Bahadurpally, Hyderabad
          </div>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-md border border-stone-200/80 shadow-xl max-w-sm w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 text-rose-600">
              <LogOut className="w-5 h-5 shrink-0" />
              <h3 className="text-base font-medium text-stone-900">
                Sign Out of Admin Dashboard?
              </h3>
            </div>
            <p className="text-xs text-stone-600 font-normal">
              You will be redirected back to the live customer website.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setIsLogoutConfirmOpen(false)}
                className="px-3.5 py-1.5 rounded-md border border-stone-200 text-stone-700 text-xs font-medium hover:bg-stone-100 cursor-pointer"
              >
                Stay Here
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-3.5 py-1.5 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium cursor-pointer shadow-2xs"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;

