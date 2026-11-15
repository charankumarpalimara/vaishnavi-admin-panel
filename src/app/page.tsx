"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Phone,
  MessageCircle,
  Search,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ServiceCard } from "@/components/ServiceCard";
import { ServiceDetailsModal } from "@/components/ServiceDetailsModal";
import { CartDrawer } from "@/components/CartDrawer";
import { BookingModal } from "@/components/BookingModal";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { GallerySection } from "@/components/GallerySection";
import { Toast } from "@/components/Toast";
import { ReviewsSection, FaqSection } from "@/components/ReviewsAndFaq";
import { Footer } from "@/components/Footer";
import { MobileStickyBar } from "@/components/MobileStickyBar";
import { SERVICES, CATEGORIES, BUSINESS_INFO } from "@/data/servicesData";
import { ServiceItem, CartItem, ServiceCategory } from "@/types";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeModalService, setActiveModalService] = useState<ServiceItem | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);

  // Dynamic services & categories synchronized with Admin catalog
  const [allServices, setAllServices] = useState<ServiceItem[]>(SERVICES);
  const [allCategories, setAllCategories] = useState<ServiceCategory[]>(CATEGORIES);

  useEffect(() => {
    try {
      const storedServices = localStorage.getItem("vaishnavi_admin_services");
      if (storedServices) {
        setAllServices(JSON.parse(storedServices));
      }
      const storedCategories = localStorage.getItem("vaishnavi_admin_categories");
      if (storedCategories) {
        const parsed: ServiceCategory[] = JSON.parse(storedCategories);
        setAllCategories([
          {
            id: "all",
            name: "All Services",
            description: "Explore all beauty, bridal, and salon services.",
          },
          ...parsed,
        ]);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  // Sync category from URL parameter if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get("category");
      if (catParam) {
        setSelectedCategory(catParam);
        setTimeout(() => {
          const el = document.getElementById("services-section");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, []);

  // Cart operations
  const handleAddToCart = (service: ServiceItem) => {
    setToastMessage(`Added "${service.title}" to cart`);
    setIsToastVisible(true);
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.service.id === service.id);
      if (existing) {
        return prevCart.map((item) =>
          item.service.id === service.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { service, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (serviceId: string) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.service.id === serviceId);
      if (!existing) return prevCart;
      if (existing.quantity === 1) {
        return prevCart.filter((item) => item.service.id !== serviceId);
      }
      return prevCart.map((item) =>
        item.service.id === serviceId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const getQuantityInCart = (serviceId: string) => {
    const item = cart.find((i) => i.service.id === serviceId);
    return item ? item.quantity : 0;
  };

  const handleBookDirect = (service: ServiceItem) => {
    if (getQuantityInCart(service.id) === 0) {
      handleAddToCart(service);
    }
    setActiveModalService(null);
    setIsBookingOpen(true);
  };

  // Filtered services
  const filteredServices = useMemo(() => {
    return SERVICES.filter((service) => {
      const matchesCategory =
        selectedCategory === "all" || service.categoryId === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.inclusions.some((inc) =>
          inc.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf9] text-stone-900 selection:bg-rose-200 selection:text-[#581c3c]">
      {/* 1. Header */}
      <Header
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1 pb-20 lg:pb-0">
        {/* 2. Hero Section */}
        <Hero
          onSelectCategory={(id) => {
            setSelectedCategory(id);
            const el = document.getElementById("services-section");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          selectedCategory={selectedCategory}
          categories={allCategories}
          onBookNow={() => {
            if (cart.length === 0) {
              const el = document.getElementById("services-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            } else {
              setIsBookingOpen(true);
            }
          }}
        />

        {/* 3. Main Services Catalog */}
        <section id="services-section" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#581c3c]" />
                <h2 className="text-2xl sm:text-3xl font-normal font-serif text-stone-900">
                  {selectedCategory === "all"
                    ? "Available Beauty & Bridal Services"
                    : allCategories.find((c) => c.id === selectedCategory)?.name || "Services"}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 font-normal">
                Showing {filteredServices.length} verified doorstep beauty services
                {searchQuery ? ` matching "${searchQuery}"` : " in Bahadurpally & nearby"}
              </p>
            </div>

            {/* Quick Category filter buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {allCategories.slice(0, 6).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
                    selectedCategory === cat.id
                      ? "bg-[#581c3c] text-white"
                      : "bg-stone-100 hover:bg-stone-200 text-stone-700 font-normal"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Services Grid */}
          {filteredServices.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-stone-200">
              <Search className="w-10 h-10 text-stone-300 mx-auto mb-3" />
              <h3 className="text-base font-medium text-stone-800">
                No matching services found
              </h3>
              <p className="text-xs text-stone-500 mt-1 font-normal">
                Try searching for &quot;saree&quot;, &quot;facial&quot;, &quot;makeup&quot;, or clear your filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="mt-4 px-4 py-2 bg-[#581c3c] text-white text-xs font-medium rounded-xl cursor-pointer"
              >
                View All Services
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  quantityInCart={getQuantityInCart(service.id)}
                  onAddToCart={handleAddToCart}
                  onRemoveFromCart={handleRemoveFromCart}
                  onViewDetails={setActiveModalService}
                />
              ))}
            </div>
          )}
        </section>

        {/* 4. Consultation & Custom Bridal Booking Banner */}
        <section className="py-12 bg-gradient-to-r from-[#581c3c] to-[#3a0d25] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-4 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-medium border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5" /> Direct Artist Booking
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal font-serif leading-tight">
                Plan Your Bridal & Event Beauty with Anusha
              </h2>
              <p className="text-xs sm:text-sm text-rose-100 leading-relaxed font-normal">
                Have a wedding, sangeet, or family event coming up? We take advance slot reservations for brides, bridesmaids, and group saree draping across Hyderabad.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <a
                  href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(
                    "Hello Anusha, I would like to check availability for an upcoming event."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs sm:text-sm rounded-xl shadow-xs flex items-center gap-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp Anusha
                </a>

                <a
                  href={`tel:${BUSINESS_INFO.phone1.replace(/\s+/g, "")}`}
                  className="px-5 py-3 bg-white hover:bg-stone-100 text-stone-900 font-medium text-xs sm:text-sm rounded-xl shadow-xs flex items-center gap-2 transition-all"
                >
                  <Phone className="w-4 h-4 text-[#581c3c]" /> Call {BUSINESS_INFO.phone1}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Bridal & Styling Portfolio Gallery */}
        <GallerySection />

        {/* 6. Why Choose Us (Urban Company standard) */}
        <WhyChooseUs />

        {/* 7. Customer Reviews */}
        <ReviewsSection />

        {/* 8. FAQs */}
        <FaqSection />
      </main>

      {/* 9. Footer */}
      <Footer
        onSelectCategory={(id) => {
          setSelectedCategory(id);
          const el = document.getElementById("services-section");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* 10. Mobile Sticky Action Bar */}
      <MobileStickyBar
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        onBookNow={() => {
          if (cart.length === 0) {
            const el = document.getElementById("services-section");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          } else {
            setIsBookingOpen(true);
          }
        }}
      />

      {/* 11. Modals */}
      <ServiceDetailsModal
        service={activeModalService}
        onClose={() => setActiveModalService(null)}
        quantityInCart={activeModalService ? getQuantityInCart(activeModalService.id) : 0}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
        onBookDirect={handleBookDirect}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onProceedToBooking={() => {
          setIsCartOpen(false);
          setIsBookingOpen(true);
        }}
      />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        cart={
          cart.length > 0
            ? cart
            : [
                {
                  service: SERVICES[0],
                  quantity: 1,
                },
              ]
        }
      />

      {/* 12. Toast Notifications */}
      <Toast
        message={toastMessage}
        isVisible={isToastVisible}
        onClose={() => setIsToastVisible(false)}
        onViewCart={() => setIsCartOpen(true)}
      />
    </div>
  );
}
