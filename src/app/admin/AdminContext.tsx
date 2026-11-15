"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  SERVICES as INITIAL_SERVICES,
  CATEGORIES as INITIAL_ALL_CATEGORIES,
} from "@/data/servicesData";
import { ServiceItem, ServiceCategory } from "@/types";

export interface BookingRecord {
  id: string;
  clientName: string;
  phone: string;
  altPhone?: string;
  serviceType: "home" | "studio";
  address: string;
  date: string;
  timeSlot: string;
  services: { title: string; price: number; quantity: number }[];
  totalAmount: number;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  notes?: string;
  createdAt: string;
}

const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    id: "VB-101",
    clientName: "Pooja Reddy",
    phone: "9876543210",
    serviceType: "home",
    address: "Flat 304, Block B, KCR Double Bed Rooms, Bahadurpally",
    date: "Today, 10 Nov",
    timeSlot: "10:00 AM - 12:00 PM",
    services: [
      { title: "Classic Box Pleats Saree Draping", price: 399, quantity: 1 },
      { title: "Signature HD Muhurtham Bridal Makeup", price: 4999, quantity: 1 },
    ],
    totalAmount: 5398,
    status: "Pending",
    notes: "Bride sister, needs neat box pleats and subtle peach makeup",
    createdAt: "10 mins ago",
  },
  {
    id: "VB-102",
    clientName: "Sravani K.",
    phone: "9988776655",
    serviceType: "home",
    address: "Villa 14, Near Mallampet Road, Bahadurpally",
    date: "Today, 10 Nov",
    timeSlot: "02:00 PM - 04:00 PM",
    services: [
      { title: "Party Ready Trio (Makeup + Hair + Saree)", price: 2799, quantity: 1 },
    ],
    totalAmount: 2799,
    status: "Confirmed",
    notes: "Reception party at 7 PM",
    createdAt: "1 hour ago",
  },
  {
    id: "VB-103",
    clientName: "Divya Varma",
    phone: "9123456789",
    serviceType: "studio",
    address: "Visiting Studio: Flat 324, 2nd Block, KCR Bahadurpally",
    date: "Tomorrow, 11 Nov",
    timeSlot: "08:00 AM - 10:00 AM",
    services: [
      { title: "South Indian Bridal Poola Jada & Braid", price: 1499, quantity: 1 },
      { title: "South Indian Bridal Silk Saree Draping", price: 599, quantity: 1 },
    ],
    totalAmount: 2098,
    status: "Confirmed",
    notes: "Bringing own fresh poola jada flowers",
    createdAt: "3 hours ago",
  },
  {
    id: "VB-104",
    clientName: "Lavanya M.",
    phone: "9012345678",
    serviceType: "home",
    address: "House 52, Bowrampet Near Gram Panchayat",
    date: "Yesterday",
    timeSlot: "04:00 PM - 06:00 PM",
    services: [
      { title: "Shahnaz Husain 24K Gold Radiance Facial", price: 1299, quantity: 1 },
      { title: "Full Arms + Underarms + Full Legs Honey Wax", price: 499, quantity: 1 },
    ],
    totalAmount: 1798,
    status: "Completed",
    createdAt: "Yesterday",
  },
  {
    id: "VB-105",
    clientName: "Ananya Rao",
    phone: "9849011223",
    serviceType: "home",
    address: "Flat 201, Srinivasa Heights, Gandimaisamma",
    date: "Tomorrow, 11 Nov",
    timeSlot: "04:00 PM - 06:00 PM",
    services: [
      { title: "Lehenga Dupatta Styling & Double Draping", price: 349, quantity: 1 },
      { title: "Party & Engagement Glam Makeup", price: 1999, quantity: 1 },
    ],
    totalAmount: 2348,
    status: "Pending",
    notes: "Please call 30 mins before arrival",
    createdAt: "4 hours ago",
  },
];

const LOCAL_STORAGE_BOOKINGS = "vaishnavi_admin_bookings";
const LOCAL_STORAGE_SERVICES = "vaishnavi_admin_services";
const LOCAL_STORAGE_CATEGORIES = "vaishnavi_admin_categories";

const INITIAL_REAL_CATEGORIES: ServiceCategory[] = INITIAL_ALL_CATEGORIES.filter(
  (c) => c.id !== "all"
);

interface AdminContextType {
  bookings: BookingRecord[];
  services: ServiceItem[];
  categories: ServiceCategory[];
  morningSlotActive: boolean;
  afternoonSlotActive: boolean;
  eveningSlotActive: boolean;
  emergencyHomeVisitActive: boolean;
  setMorningSlotActive: (val: boolean) => void;
  setAfternoonSlotActive: (val: boolean) => void;
  setEveningSlotActive: (val: boolean) => void;
  setEmergencyHomeVisitActive: (val: boolean) => void;
  updateBookingStatus: (id: string, status: BookingRecord["status"]) => void;
  updateServicePrice: (id: string, price: number) => void;
  updateService: (id: string, updated: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;
  addService: (service: Omit<ServiceItem, "id">) => void;
  addCategory: (category: Omit<ServiceCategory, "id">) => void;
  updateCategory: (id: string, updated: Partial<ServiceCategory>) => void;
  deleteCategory: (id: string) => void;
  addBooking: (
    booking: Omit<BookingRecord, "id" | "createdAt" | "status">
  ) => BookingRecord;
  stats: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    revenue: number;
  };
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<BookingRecord[]>(INITIAL_BOOKINGS);
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [categories, setCategories] = useState<ServiceCategory[]>(INITIAL_REAL_CATEGORIES);

  const [morningSlotActive, setMorningSlotActive] = useState(true);
  const [afternoonSlotActive, setAfternoonSlotActive] = useState(true);
  const [eveningSlotActive, setEveningSlotActive] = useState(true);
  const [emergencyHomeVisitActive, setEmergencyHomeVisitActive] = useState(true);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const storedBookings = localStorage.getItem(LOCAL_STORAGE_BOOKINGS);
      if (storedBookings) {
        setBookings(JSON.parse(storedBookings));
      }
      const storedServices = localStorage.getItem(LOCAL_STORAGE_SERVICES);
      if (storedServices) {
        setServices(JSON.parse(storedServices));
      }
      const storedCategories = localStorage.getItem(LOCAL_STORAGE_CATEGORIES);
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const updateBookingStatus = (
    id: string,
    status: BookingRecord["status"]
  ) => {
    setBookings((prev) => {
      const updated = prev.map((b) => (b.id === id ? { ...b, status } : b));
      try {
        localStorage.setItem(LOCAL_STORAGE_BOOKINGS, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const updateServicePrice = (id: string, price: number) => {
    setServices((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, price } : s));
      try {
        localStorage.setItem(LOCAL_STORAGE_SERVICES, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const updateService = (id: string, updatedFields: Partial<ServiceItem>) => {
    setServices((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, ...updatedFields } : s));
      try {
        localStorage.setItem(LOCAL_STORAGE_SERVICES, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const deleteService = (id: string) => {
    setServices((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      try {
        localStorage.setItem(LOCAL_STORAGE_SERVICES, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const addService = (newService: Omit<ServiceItem, "id">) => {
    const item: ServiceItem = {
      ...newService,
      id: `svc-${Date.now()}`,
    };
    setServices((prev) => {
      const updated = [item, ...prev];
      try {
        localStorage.setItem(LOCAL_STORAGE_SERVICES, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const addCategory = (categoryData: Omit<ServiceCategory, "id">) => {
    const slug = categoryData.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const newCategory: ServiceCategory = {
      ...categoryData,
      id: slug || `cat-${Date.now()}`,
    };
    setCategories((prev) => {
      const updated = [...prev, newCategory];
      try {
        localStorage.setItem(LOCAL_STORAGE_CATEGORIES, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const updateCategory = (id: string, updatedFields: Partial<ServiceCategory>) => {
    setCategories((prev) => {
      const updated = prev.map((cat) => (cat.id === id ? { ...cat, ...updatedFields } : cat));
      try {
        localStorage.setItem(LOCAL_STORAGE_CATEGORIES, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => {
      const updated = prev.filter((cat) => cat.id !== id);
      try {
        localStorage.setItem(LOCAL_STORAGE_CATEGORIES, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const addBooking = (
    bookingData: Omit<BookingRecord, "id" | "createdAt" | "status">
  ): BookingRecord => {
    const newRecord: BookingRecord = {
      ...bookingData,
      id: `VB-${Math.floor(100 + Math.random() * 900)}`,
      status: "Pending",
      createdAt: "Just now",
    };
    setBookings((prev) => {
      const updated = [newRecord, ...prev];
      try {
        localStorage.setItem(LOCAL_STORAGE_BOOKINGS, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    return newRecord;
  };

  const total = bookings.length;
  const pending = bookings.filter((b) => b.status === "Pending").length;
  const confirmed = bookings.filter((b) => b.status === "Confirmed").length;
  const completed = bookings.filter((b) => b.status === "Completed").length;
  const revenue = bookings
    .filter((b) => b.status !== "Cancelled")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const stats = { total, pending, confirmed, completed, revenue };

  return (
    <AdminContext.Provider
      value={{
        bookings,
        services,
        categories,
        morningSlotActive,
        afternoonSlotActive,
        eveningSlotActive,
        emergencyHomeVisitActive,
        setMorningSlotActive,
        setAfternoonSlotActive,
        setEveningSlotActive,
        setEmergencyHomeVisitActive,
        updateBookingStatus,
        updateServicePrice,
        updateService,
        deleteService,
        addService,
        addCategory,
        updateCategory,
        deleteCategory,
        addBooking,
        stats,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
