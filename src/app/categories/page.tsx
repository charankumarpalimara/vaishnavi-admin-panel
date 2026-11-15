"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Sparkle,
  Palette,
  Scissors,
  Gift,
  Smile,
  Feather,
  Heart,
  Crown,
  Flower2,
  Gem,
  Layers,
  MapPin,
  Clock,
  ShieldCheck,
  Phone,
  MessageCircle,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { BookingModal } from "@/components/BookingModal";
import { Toast } from "@/components/Toast";
import { CATEGORIES, SERVICES, BUSINESS_INFO } from "@/data/servicesData";
import { CartItem, ServiceCategory, ServiceItem } from "@/types";

const getCategoryIcon = (iconName?: string) => {
  switch ((iconName || "").toLowerCase()) {
    case "sparkle":
    case "sparkles":
      return Sparkles;
    case "palette":
      return Palette;
    case "scissors":
      return Scissors;
    case "gift":
      return Gift;
    case "smile":
      return Smile;
    case "feather":
      return Feather;
    case "heart":
      return Heart;
    case "crown":
      return Crown;
    case "flower":
    case "flower2":
      return Flower2;
    case "gem":
      return Gem;
    default:
      return Layers;
  }
};

export default function CustomerCategoriesPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);

  // Dynamic categories & services synchronized with Admin catalog
  const [categoriesList, setCategoriesList] = useState<ServiceCategory[]>(
    CATEGORIES.filter((c) => c.id !== "all")
  );
  const [servicesList, setServicesList] = useState<ServiceItem[]>(SERVICES);

  useEffect(() => {
    try {
      const storedCategories = localStorage.getItem("vaishnavi_admin_categories");
      if (storedCategories) {
        const parsed: ServiceCategory[] = JSON.parse(storedCategories);
        setCategoriesList(parsed.filter((c) => c.id !== "all"));
      }
      const storedServices = localStorage.getItem("vaishnavi_admin_services");
      if (storedServices) {
        setServicesList(JSON.parse(storedServices));
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const categoriesWithData = useMemo(() => {
    return categoriesList.map((cat) => {
      const catServices = servicesList.filter((s) => s.categoryId === cat.id);
      const minPrice =
        catServices.length > 0
          ? Math.min(...catServices.map((s) => s.price))
          : 0;
      return {
        ...cat,
        servicesCount: catServices.length,
        startingPrice: minPrice,
        topServices: catServices.slice(0, 3),
      };
    });
  }, [categoriesList, servicesList]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf9] text-stone-900 selection:bg-rose-200 selection:text-[#581c3c]">
      {/* 1. Header */}
      <Header
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumb & Title */}
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-400 font-normal mb-2">
              <Link href="/" className="hover:text-stone-700 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-[#581c3c] font-medium">Categories</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#581c3c]" />
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal font-serif text-stone-900">
                    Service Categories
                  </h1>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 font-normal mt-1.5 max-w-2xl">
                  Explore our comprehensive salon, bridal, and grooming categories. Certified lead artist Anusha provides door-to-door hygiene-guaranteed appointments across Bahadurpally & nearby localities.
                </p>
              </div>

              {/* Highlights Pill */}
              <div className="flex items-center gap-3 text-xs text-stone-600 bg-stone-100/80 px-4 py-2 rounded-xl self-start md:self-auto border border-stone-200/80 font-normal">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% Hygienic Kits</span>
                </div>
                <span className="text-stone-300">•</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#581c3c]" />
                  <span>On-time Doorstep</span>
                </div>
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoriesWithData.map((cat) => {
              const Icon = getCategoryIcon(cat.iconName);
              return (
                <div
                  key={cat.id}
                  className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-6">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-3">
                      {cat.image ? (
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200 group-hover:scale-105 transition-transform">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-[#581c3c]/10 text-[#581c3c] flex items-center justify-center shrink-0 border border-[#581c3c]/15 group-hover:scale-105 transition-transform">
                          <Icon className="w-6 h-6" />
                        </div>
                      )}

                      {cat.badge && (
                        <span className="text-xs px-2.5 py-1 rounded-md font-medium inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
                          <Sparkle className="w-3 h-3 text-amber-600 fill-amber-500" />
                          <span>{cat.badge}</span>
                        </span>
                      )}
                    </div>

                    {/* Title & Description */}
                    <div className="mt-4">
                      <h2 className="text-lg sm:text-xl font-medium font-serif text-stone-900 group-hover:text-[#581c3c] transition-colors">
                        {cat.name}
                      </h2>
                      <p className="text-xs sm:text-sm text-stone-500 font-normal mt-1.5 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>

                    {/* Key Offerings Preview */}
                    <div className="mt-4 pt-4 border-t border-stone-100 space-y-2">
                      <div className="text-[11px] uppercase tracking-wider text-stone-400 font-normal">
                        Popular in {cat.name}
                      </div>
                      <div className="space-y-1.5">
                        {cat.topServices.map((svc) => (
                          <div
                            key={svc.id}
                            className="flex items-center justify-between text-xs text-stone-700 font-normal"
                          >
                            <span className="truncate pr-2">{svc.title}</span>
                            <span className="font-medium text-[#581c3c] font-serif shrink-0">
                              ₹{svc.price}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-4 sm:p-5 bg-stone-50/70 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-stone-400 font-normal block">
                        {cat.servicesCount} services
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-stone-900 font-serif">
                        Starts at ₹{cat.startingPrice}
                      </span>
                    </div>

                    <Link
                      href={`/?category=${cat.id}#services-section`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#581c3c] hover:bg-[#481430] text-white text-xs font-medium transition-colors shadow-2xs cursor-pointer"
                    >
                      <span>Browse Services</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Doorstep Service CTA Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-[#581c3c] to-[#3a0f26] text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-2 text-center md:text-left">
              <span className="inline-block text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/15 text-amber-200 font-medium">
                Bahadurpally & Surrounding Localities
              </span>
              <h3 className="text-xl sm:text-2xl font-normal font-serif text-white">
                Need a Custom Bridal or Event Package?
              </h3>
              <p className="text-xs sm:text-sm text-rose-100 font-normal max-w-xl">
                Chat directly with lead artist Anusha on WhatsApp for group bookings, muhurtham timing coordination, or personalized beauty trials.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <a
                href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(
                  "Hello Anusha, I would like to inquire about booking beauty & bridal services from your categories list."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Anusha</span>
              </a>

              <a
                href={`tel:${BUSINESS_INFO.phone1.replace(/\s+/g, "")}`}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-normal flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Call Directly</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onAddToCart={(service) => {
          setCart((prev) => {
            const existing = prev.find((item) => item.service.id === service.id);
            if (existing) {
              return prev.map((item) =>
                item.service.id === service.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              );
            }
            return [...prev, { service, quantity: 1 }];
          });
        }}
        onRemoveFromCart={(serviceId) => {
          setCart((prev) => {
            const existing = prev.find((item) => item.service.id === serviceId);
            if (!existing) return prev;
            if (existing.quantity === 1) {
              return prev.filter((item) => item.service.id !== serviceId);
            }
            return prev.map((item) =>
              item.service.id === serviceId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            );
          });
        }}
        onClearCart={() => setCart([])}
        onProceedToBooking={() => {
          setIsCartOpen(false);
          setIsBookingOpen(true);
        }}
      />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        cart={cart}
        onBookingComplete={() => {
          setCart([]);
          setIsBookingOpen(false);
          setToastMessage("Booking request sent successfully via WhatsApp!");
          setIsToastVisible(true);
        }}
      />

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        isVisible={isToastVisible}
        onClose={() => setIsToastVisible(false)}
        onViewCart={() => setIsCartOpen(true)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
