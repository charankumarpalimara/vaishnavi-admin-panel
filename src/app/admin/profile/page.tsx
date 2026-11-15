"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  User,
  Phone,
  MapPin,
  Clock,
  Star,
  CheckCircle2,
  Save,
  Camera,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { BUSINESS_INFO } from "@/data/servicesData";

const LOCAL_STORAGE_PROFILE = "vaishnavi_admin_profile";

interface ProfileData {
  name: string;
  title: string;
  phone1: string;
  phone2: string;
  email: string;
  bio: string;
  address: string;
  landmark: string;
  serviceRadius: string;
  operatingHours: string;
  upiId: string;
  isAcceptingBookings: boolean;
  emergencyVisitsActive: boolean;
  specializations: string[];
  photoUrl?: string;
}

const DEFAULT_PROFILE_DATA: ProfileData = {
  name: BUSINESS_INFO.leadArtist,
  title: "Lead Beautician & Bridal Saree Draping Specialist",
  phone1: BUSINESS_INFO.phone1,
  phone2: BUSINESS_INFO.phone2,
  email: "vaishnavibeauty.hyd@gmail.com",
  bio: "Experienced certified bridal stylist and beautician based in Bahadurpally, Hyderabad. Expert in classic box pleating, south indian silk saree draping, HD muhurtham glam, poola jada braiding, and luxury doorstep salon treatments.",
  address: BUSINESS_INFO.address,
  landmark: "Near Mallampet Road & Gram Panchayat",
  serviceRadius: "15",
  operatingHours: BUSINESS_INFO.operatingHours,
  upiId: "9618409290@upi",
  isAcceptingBookings: true,
  emergencyVisitsActive: true,
  specializations: [
    "Classic Box Pleats",
    "South Indian Bridal Silk Saree",
    "HD Muhurtham Makeup",
    "Poola Jada Braiding",
    "Shahnaz Husain 24K Gold Facial",
    "Full Body Honey Waxing",
    "Pre-Pleating & Ironing",
    "Party & Sangeet Hairstyling",
  ],
};

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE_DATA);
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [newTagInput, setNewTagInput] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PROFILE);
      if (stored) {
        setProfile({ ...DEFAULT_PROFILE_DATA, ...JSON.parse(stored) });
      }
    } catch {
      // ignore
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(LOCAL_STORAGE_PROFILE, JSON.stringify(profile));
    } catch {
      // ignore
    }
    setIsSaved(true);
    showToast("Profile & studio settings updated successfully.");
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleResetDefaults = () => {
    setProfile(DEFAULT_PROFILE_DATA);
    try {
      localStorage.removeItem(LOCAL_STORAGE_PROFILE);
    } catch {
      // ignore
    }
    showToast("Reset to default profile details.");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please upload an image file (PNG, JPG, WEBP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setProfile((prev) => ({ ...prev, photoUrl: dataUrl }));
        showToast("Profile photo updated.");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveSpecialization = (tagToRemove: string) => {
    setProfile((prev) => ({
      ...prev,
      specializations: prev.specializations.filter((t) => t !== tagToRemove),
    }));
  };

  const handleAddSpecialization = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagInput.trim()) return;
    if (profile.specializations.includes(newTagInput.trim())) {
      setNewTagInput("");
      return;
    }
    setProfile((prev) => ({
      ...prev,
      specializations: [...prev.specializations, newTagInput.trim()],
    }));
    setNewTagInput("");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium font-serif text-stone-900">
            Artist & Studio Profile
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-normal mt-1">
            Manage your professional identity, studio address, emergency visit radius, and contact information.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-md border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs sm:text-sm font-medium flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
            <span>Reset</span>
          </button>

          <button
            type="submit"
            form="profile-form"
            className="px-4 py-2 bg-[#581c3c] hover:bg-[#481430] text-white text-xs sm:text-sm font-medium rounded-md shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
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

      {/* Profile Overview Card */}
      <div className="bg-white rounded-md border border-stone-200/80 shadow-2xs p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 border-b border-stone-100">
          <div className="flex items-center gap-4">
            {/* Avatar with Upload Trigger */}
            <div className="relative group">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="profile-photo-input"
              />
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-stone-100 border-2 border-stone-200 flex items-center justify-center font-serif text-xl sm:text-2xl font-medium text-[#581c3c] shrink-0 shadow-2xs">
                {profile.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.photoUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{profile.name.charAt(0)}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-stone-900/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Change photo"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-medium font-serif text-stone-900">
                  {profile.name}
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-[#581c3c] border border-rose-200">
                  Certified Lead Artist
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 font-normal mt-0.5">
                {profile.title}
              </p>
              <div className="flex items-center gap-3 text-xs text-stone-500 font-normal mt-2 flex-wrap">
                <span className="flex items-center gap-1 text-amber-700">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>4.94 Rating</span>
                </span>
                <span>•</span>
                <span>450+ Verified Bookings</span>
                <span>•</span>
                <span>Bahadurpally Studio</span>
              </div>
            </div>
          </div>

          {/* Booking Availability Toggle */}
          <div className="flex items-center gap-3 self-start sm:self-auto bg-stone-50 p-2.5 rounded-md border border-stone-200">
            <div>
              <div className="text-xs font-medium text-stone-800">
                Booking Status
              </div>
              <div className="text-[11px] text-stone-500 font-normal">
                {profile.isAcceptingBookings
                  ? "Accepting new client appointments"
                  : "Paused / Away"}
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                setProfile((prev) => ({
                  ...prev,
                  isAcceptingBookings: !prev.isAcceptingBookings,
                }))
              }
              className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                profile.isAcceptingBookings
                  ? "bg-emerald-600 text-white"
                  : "bg-stone-200 text-stone-700"
              }`}
            >
              {profile.isAcceptingBookings ? "Online" : "Away"}
            </button>
          </div>
        </div>

        {/* Quick Links Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 text-xs">
          <Link
            href="/admin/schedule"
            className="p-3 rounded-md bg-stone-50 hover:bg-stone-100 border border-stone-200 flex items-center justify-between text-stone-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#581c3c]" />
              <div>
                <span className="font-medium block">Working Slots & Calendar</span>
                <span className="text-[11px] text-stone-400 font-normal">Mon–Sun slot controls</span>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
          </Link>

          <Link
            href="/admin/transactions"
            className="p-3 rounded-md bg-stone-50 hover:bg-stone-100 border border-stone-200 flex items-center justify-between text-stone-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#581c3c]" />
              <div>
                <span className="font-medium block">UPI & Transactions</span>
                <span className="text-[11px] text-stone-400 font-normal">GPay, PhonePe, & Cash settlements</span>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
          </Link>

          <Link
            href="/admin/bookings"
            className="p-3 rounded-md bg-stone-50 hover:bg-stone-100 border border-stone-200 flex items-center justify-between text-stone-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#581c3c]" />
              <div>
                <span className="font-medium block">Client Appointments</span>
                <span className="text-[11px] text-stone-400 font-normal">Manage upcoming bookings</span>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
          </Link>
        </div>
      </div>

      {/* Main Profile Form */}
      <form id="profile-form" onSubmit={handleSaveProfile} className="space-y-6">
        {/* Section 1: Contact Information */}
        <div className="bg-white p-5 sm:p-6 rounded-md border border-stone-200/80 shadow-2xs space-y-4">
          <h3 className="text-lg font-medium font-serif text-stone-900 border-b border-stone-100 pb-3">
            Contact & Artist Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Professional Title
              </label>
              <input
                type="text"
                value={profile.title}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Primary Phone (Calling & WhatsApp) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  required
                  value={profile.phone1}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, phone1: e.target.value }))
                  }
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Secondary Phone (Alternate / UPI)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  value={profile.phone2}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, phone2: e.target.value }))
                  }
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-stone-700 mb-1">
                About & Artist Bio
              </label>
              <textarea
                rows={3}
                value={profile.bio}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, bio: e.target.value }))
                }
                className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Studio Location & Doorstep Radius */}
        <div className="bg-white p-5 sm:p-6 rounded-md border border-stone-200/80 shadow-2xs space-y-4">
          <h3 className="text-lg font-medium font-serif text-stone-900 border-b border-stone-100 pb-3">
            Studio Location & Service Coverage
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Studio Address (Visiting Clients) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={profile.address}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, address: e.target.value }))
                  }
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Landmark & Directions
              </label>
              <input
                type="text"
                value={profile.landmark}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, landmark: e.target.value }))
                }
                className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Doorstep Travel Radius (KM)
              </label>
              <input
                type="number"
                value={profile.serviceRadius}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, serviceRadius: e.target.value }))
                }
                className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Operating Hours & Urgent Muhurtham Visits */}
        <div className="bg-white p-5 sm:p-6 rounded-md border border-stone-200/80 shadow-2xs space-y-4">
          <h3 className="text-lg font-medium font-serif text-stone-900 border-b border-stone-100 pb-3">
            Operating Schedule & Rush Muhurtham Requests
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Daily Operating Hours
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={profile.operatingHours}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      operatingHours: e.target.value,
                    }))
                  }
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-md bg-stone-50 border border-stone-200">
              <div>
                <div className="text-xs font-medium text-stone-900">
                  Emergency Home Visits
                </div>
                <div className="text-[11px] text-stone-500 font-normal">
                  Accept 2-hour rush bridal requests
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setProfile((prev) => ({
                    ...prev,
                    emergencyVisitsActive: !prev.emergencyVisitsActive,
                  }))
                }
                className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                  profile.emergencyVisitsActive
                    ? "bg-emerald-600 text-white"
                    : "bg-stone-200 text-stone-700"
                }`}
              >
                {profile.emergencyVisitsActive ? "Active" : "Off"}
              </button>
            </div>
          </div>
        </div>

        {/* Section 4: Payment Details */}
        <div className="bg-white p-5 sm:p-6 rounded-md border border-stone-200/80 shadow-2xs space-y-4">
          <h3 className="text-lg font-medium font-serif text-stone-900 border-b border-stone-100 pb-3">
            Payment & UPI Settings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                UPI ID (Google Pay / PhonePe / Paytm)
              </label>
              <input
                type="text"
                value={profile.upiId}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, upiId: e.target.value }))
                }
                className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Accepted Payment Methods
              </label>
              <div className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-md text-xs text-stone-700 font-normal">
                UPI (GPay / PhonePe) & Cash on Delivery
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Specializations */}
        <div className="bg-white p-5 sm:p-6 rounded-md border border-stone-200/80 shadow-2xs space-y-4">
          <h3 className="text-lg font-medium font-serif text-stone-900 border-b border-stone-100 pb-3">
            Service Specializations & Core Skills
          </h3>

          <div className="flex flex-wrap gap-2">
            {profile.specializations.map((spec) => (
              <span
                key={spec}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-stone-50 border border-stone-200 text-stone-800"
              >
                <span>{spec}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSpecialization(spec)}
                  className="text-stone-400 hover:text-rose-600 cursor-pointer"
                  title="Remove"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              placeholder="Add skill (e.g. Sangeet Hair Styling)"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal flex-1 max-w-xs"
            />
            <button
              type="button"
              onClick={handleAddSpecialization}
              disabled={!newTagInput.trim()}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-md cursor-pointer transition-colors disabled:opacity-50"
            >
              Add Skill
            </button>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#581c3c] hover:bg-[#481430] text-white text-xs sm:text-sm font-medium rounded-md shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}

