"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { X, MapPin, Phone, User, MessageCircle, CheckCircle, CheckCircle2, Home, Building2, ChevronRight, ArrowLeft, AlertCircle } from "lucide-react";
import { BUSINESS_INFO } from "@/data/servicesData";
import { CartItem } from "@/types";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onBookingComplete?: () => void;
}

const TIME_SLOTS = [
  { label: "08:00 AM - 10:00 AM", period: "Morning" },
  { label: "10:00 AM - 12:00 PM", period: "Morning" },
  { label: "12:00 PM - 02:00 PM", period: "Afternoon" },
  { label: "02:00 PM - 04:00 PM", period: "Afternoon" },
  { label: "04:00 PM - 06:00 PM", period: "Evening" },
  { label: "06:00 PM - 08:30 PM", period: "Evening" },
];

const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  cart,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [selectedDateOption, setSelectedDateOption] = useState<"today" | "tomorrow" | "custom">("today");
  const [customDate, setCustomDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[1].label);

  // Synchronized admin weekly slots & blocked dates
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [weeklySlots, setWeeklySlots] = useState<any[] | null>(null);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);

  useEffect(() => {
    try {
      const storedWeekly = localStorage.getItem("vaishnavi_admin_weekly_slots");
      if (storedWeekly) {
        setWeeklySlots(JSON.parse(storedWeekly));
      }
      const storedBlocked = localStorage.getItem("vaishnavi_admin_blocked_dates");
      if (storedBlocked) {
        setBlockedDates(JSON.parse(storedBlocked));
      }
    } catch {
      // ignore
    }
  }, [isOpen]);
  
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [flatNo, setFlatNo] = useState("");
  const [address, setAddress] = useState("KCR Double Bed Rooms, Bahadurpally");
  const [landmark, setLandmark] = useState("");
  const [serviceType, setServiceType] = useState<"home" | "studio">("home");
  const [specialNotes, setSpecialNotes] = useState("");

  const [formError, setFormError] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedId, setConfirmedId] = useState("");

  const handleConfirmAndSave = () => {
    const newId = `VB-${Math.floor(100 + Math.random() * 900)}`;
    const newRecord = {
      id: newId,
      clientName: fullName,
      phone: phone,
      altPhone: altPhone || undefined,
      serviceType: serviceType,
      address:
        serviceType === "home"
          ? `Flat ${flatNo}, ${address}${landmark ? `, Near ${landmark}` : ""}`
          : "Studio Visit: Flat 324, 2nd Block, KCR Double Bed Rooms, Bahadurpally",
      date: getEffectiveDate(),
      timeSlot: selectedSlot,
      services: cart.map((item) => ({
        title: item.service.title,
        price: item.service.price,
        quantity: item.quantity,
      })),
      totalAmount: grandTotal,
      status: "Pending",
      notes: specialNotes || undefined,
      createdAt: "Just now",
    };

    try {
      const stored = localStorage.getItem("vaishnavi_admin_bookings");
      const currentList = stored ? JSON.parse(stored) : [];
      localStorage.setItem(
        "vaishnavi_admin_bookings",
        JSON.stringify([newRecord, ...currentList])
      );
    } catch {
      // ignore
    }

    setConfirmedId(newId);
    setIsConfirmed(true);
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
        setStep(1);
        setIsConfirmed(false);
        setFormError("");
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const r = dialog.getBoundingClientRect();
    const isOutside =
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom;
    if (isOutside) {
      onClose();
    }
  };

  const itemsTotal = cart.reduce((sum, item) => sum + item.service.price * item.quantity, 0);
  const doorstepFee = itemsTotal >= 499 ? 0 : 49;
  const grandTotal = itemsTotal + doorstepFee;

  const getEffectiveDate = () => {
    const today = new Date();
    if (selectedDateOption === "today") {
      return today.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } else if (selectedDateOption === "tomorrow") {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
    return customDate || "Custom Date";
  };

  const getSelectedDateObj = () => {
    const today = new Date();
    if (selectedDateOption === "today") return today;
    if (selectedDateOption === "tomorrow") {
      const t = new Date(today);
      t.setDate(t.getDate() + 1);
      return t;
    }
    if (customDate) {
      const parts = customDate.split("-").map(Number);
      if (parts.length === 3) return new Date(parts[0], parts[1] - 1, parts[2]);
    }
    return today;
  };

  const selectedDateObj = getSelectedDateObj();
  const selectedYear = selectedDateObj.getFullYear();
  const selectedMonth = String(selectedDateObj.getMonth() + 1).padStart(2, "0");
  const selectedDay = String(selectedDateObj.getDate()).padStart(2, "0");
  const selectedIsoStr = `${selectedYear}-${selectedMonth}-${selectedDay}`;

  const isSelectedDateBlocked = blockedDates.some((b) => b.includes(selectedIsoStr));

  const selectedDayName = WEEKDAY_NAMES[selectedDateObj.getDay()];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentDaySchedule = weeklySlots?.find((d: any) => d.day === selectedDayName);

  const dynamicSlots = useMemo<{ label: string; period: string }[]>(() => {
    if (currentDaySchedule && currentDaySchedule.slots) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const active = currentDaySchedule.slots
        .filter((s: { isActive: boolean }) => s.isActive)
        .map((s: { timeRange: string; tag?: string }) => ({
          label: s.timeRange,
          period: s.tag || (s.timeRange.includes("AM") ? "Morning" : "Afternoon / Evening"),
        }));
      if (active.length > 0) return active;
    }
    return TIME_SLOTS;
  }, [currentDaySchedule]);

  useEffect(() => {
    if (dynamicSlots.length > 0 && !dynamicSlots.some((s: { label: string }) => s.label === selectedSlot)) {
      setSelectedSlot(dynamicSlots[0].label);
    }
  }, [dynamicSlots, selectedSlot]);

  const handleProceedToStep2 = () => {
    if (selectedDateOption === "custom" && !customDate) {
      setFormError("Please select a date for your appointment.");
      return;
    }
    if (isSelectedDateBlocked) {
      setFormError("The selected date is fully booked for wedding orders. Please choose another date.");
      return;
    }
    setFormError("");
    setStep(2);
  };

  const handleProceedToStep3 = () => {
    if (!fullName.trim()) {
      setFormError("Please enter your name.");
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      setFormError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (serviceType === "home" && !flatNo.trim()) {
      setFormError("Please enter your Flat / House number.");
      return;
    }
    setFormError("");
    setStep(3);
  };

  const generateWhatsAppMessage = () => {
    const serviceList = cart
      .map((item, idx) => `${idx + 1}. ${item.service.title} (x${item.quantity}) - ₹${item.service.price * item.quantity}`)
      .join("\n");

    const message = `*🌸 VAISHNAVI BEAUTY SERVICES - NEW BOOKING 🌸*

*Client Name:* ${fullName}
*Phone:* ${phone}${altPhone ? ` / ${altPhone}` : ""}
*Service Type:* ${serviceType === "home" ? "🏠 Home Service" : "🏢 Studio Visit"}
*Date:* ${getEffectiveDate()}
*Time Slot:* ${selectedSlot}

*📍 Address:*
${serviceType === "home" ? `Flat No: ${flatNo}\n${address}${landmark ? `\nLandmark: ${landmark}` : ""}` : "Visiting Studio at KCR Double Bed Rooms, Bahadurpally"}

*Selected Services:*
${serviceList}

*Subtotal:* ₹${itemsTotal}
*Travel & Hygiene:* ${doorstepFee === 0 ? "FREE" : `₹${doorstepFee}`}
*Grand Total:* ₹${grandTotal}

${specialNotes ? `*Special Request:* ${specialNotes}\n` : ""}
_Please confirm slot availability. Thank you!_`;

    return encodeURIComponent(message);
  };

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="booking-modal-title"
      onCancel={onClose}
      onPointerDown={handlePointerDown}
      className="m-auto p-0 rounded-3xl max-w-lg w-full bg-white shadow-2xl backdrop:bg-black/60 border border-stone-200 outline-hidden overflow-hidden"
    >
      <div className="relative">
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#581c3c] to-[#70244f] text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-amber-300">
              {step === 1 && "Step 1 of 3: Choose Slot"}
              {step === 2 && "Step 2 of 3: Address & Details"}
              {step === 3 && "Step 3 of 3: Booking Summary"}
            </span>
            <h2 id="booking-modal-title" className="text-lg sm:text-xl font-normal font-serif leading-tight">
              {step === 1 && "Select Date & Time Slot"}
              {step === 2 && "Where Should We Arrive?"}
              {step === 3 && "Confirm Your Booking"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              ⚠️ {formError}
            </div>
          )}

          {/* STEP 1: DATE & TIME */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Date selection */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-stone-600 mb-2">
                  Select Date
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedDateOption("today")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      selectedDateOption === "today"
                        ? "bg-[#581c3c] text-white border-[#581c3c] shadow-xs"
                        : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    Today
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedDateOption("tomorrow")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      selectedDateOption === "tomorrow"
                        ? "bg-[#581c3c] text-white border-[#581c3c] shadow-xs"
                        : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    Tomorrow
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedDateOption("custom")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      selectedDateOption === "custom"
                        ? "bg-[#581c3c] text-white border-[#581c3c] shadow-xs"
                        : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    Pick Date
                  </button>
                </div>

                {selectedDateOption === "custom" && (
                  <div className="mt-2">
                    <input
                      type="date"
                      value={customDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setCustomDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl outline-hidden focus:border-[#581c3c]"
                    />
                  </div>
                )}
              </div>

              {/* Blocked Date Notice */}
              {isSelectedDateBlocked && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-normal flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <div>
                    <span className="font-medium block">Date Reserved for Outstation Wedding</span>
                    <span>
                      This date is fully booked for bridal muhurtham orders. Please select another date or contact Anusha directly on WhatsApp.
                    </span>
                  </div>
                </div>
              )}

              {/* Time Slots */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-medium uppercase tracking-wider text-stone-600">
                    Select Time Slot ({selectedDayName})
                  </label>
                  {currentDaySchedule && !currentDaySchedule.isOpen && (
                    <span className="text-[11px] text-amber-700 font-normal">
                      Day marked off
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {dynamicSlots.map((slot) => {
                    const isSelected = selectedSlot === slot.label;
                    return (
                      <button
                        key={slot.label}
                        type="button"
                        onClick={() => setSelectedSlot(slot.label)}
                        className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#581c3c]/10 border-[#581c3c] text-[#581c3c]"
                            : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
                        }`}
                      >
                        <span className="block text-[10px] uppercase font-normal text-stone-400">
                          {slot.period}
                        </span>
                        <span className="text-xs font-medium">{slot.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-stone-600 mb-2">
                  Service Location Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setServiceType("home")}
                    className={`p-3 rounded-xl text-left border flex items-center gap-2.5 transition-all cursor-pointer ${
                      serviceType === "home"
                        ? "bg-[#581c3c] text-white border-[#581c3c]"
                        : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    <Home className="w-4 h-4 shrink-0" />
                    <div>
                      <div className="text-xs font-medium">At Your Home</div>
                      <div className={`text-[10px] ${serviceType === "home" ? "text-rose-200" : "text-stone-400"}`}>
                        Doorstep visit by Anusha
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setServiceType("studio")}
                    className={`p-3 rounded-xl text-left border flex items-center gap-2.5 transition-all cursor-pointer ${
                      serviceType === "studio"
                        ? "bg-[#581c3c] text-white border-[#581c3c]"
                        : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    <Building2 className="w-4 h-4 shrink-0" />
                    <div>
                      <div className="text-xs font-medium">Visit Studio</div>
                      <div className={`text-[10px] ${serviceType === "studio" ? "text-rose-200" : "text-stone-400"}`}>
                        Bahadurpally KCR Block
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DETAILS & ADDRESS */}
          {step === 2 && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-xl outline-hidden focus:border-[#581c3c] font-normal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit number"
                      maxLength={10}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-xl outline-hidden focus:border-[#581c3c] font-normal"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Alternate Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={altPhone}
                    onChange={(e) => setAltPhone(e.target.value)}
                    placeholder="Alternate number"
                    maxLength={10}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-xl outline-hidden focus:border-[#581c3c] font-normal"
                  />
                </div>
              </div>

              {serviceType === "home" && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Flat / House No. *
                      </label>
                      <input
                        type="text"
                        value={flatNo}
                        onChange={(e) => setFlatNo(e.target.value)}
                        placeholder="e.g. Flat 304, Block B"
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-xl outline-hidden focus:border-[#581c3c] font-normal"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Landmark
                      </label>
                      <input
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="e.g. Near Water Tank"
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-xl outline-hidden focus:border-[#581c3c] font-normal"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Area / Society / Colony
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Bahadurpally / nearby area"
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-xl outline-hidden focus:border-[#581c3c] font-normal"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Special Notes or Saree Fabric Details (Optional)
                </label>
                <textarea
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  rows={2}
                  placeholder="e.g. Silk saree with heavy gold border, or skin allergies if any"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-xl outline-hidden focus:border-[#581c3c] font-normal"
                />
              </div>
            </div>
          )}

          {/* STEP 3: SUMMARY & CONFIRMATION */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 font-normal">
                <div className="font-medium flex items-center gap-1.5 text-sm mb-1 text-emerald-800">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Booking Details Ready
                </div>
                Send your booking via WhatsApp to Anusha for instant slot confirmation and artist assignment.
              </div>

              {/* Summary card */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2 text-xs font-normal">
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Client:</span>
                  <span className="font-medium text-stone-900">{fullName} ({phone})</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Date & Slot:</span>
                  <span className="font-medium text-stone-900">{getEffectiveDate()} • {selectedSlot}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Location:</span>
                  <span className="font-medium text-stone-900 text-right">
                    {serviceType === "home" ? `${flatNo}, ${address}` : "Studio: Bahadurpally"}
                  </span>
                </div>
                <div className="pt-1">
                  <span className="text-stone-500 block mb-1">Services ({cart.length}):</span>
                  <div className="space-y-1">
                    {cart.map((item) => (
                      <div key={item.service.id} className="flex justify-between">
                        <span>{item.service.title} × {item.quantity}</span>
                        <span>₹{item.service.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between font-medium text-stone-900 text-sm">
                  <span>Grand Total:</span>
                  <span className="text-[#581c3c]">₹{grandTotal}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                {isConfirmed && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between font-normal">
                    <span>Recorded under Reference:</span>
                    <span className="font-medium text-[#581c3c]">{confirmedId}</span>
                  </div>
                )}

                <a
                  href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${generateWhatsAppMessage()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleConfirmAndSave}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Confirm on WhatsApp with Anusha</span>
                </a>

                <a
                  href={`tel:${BUSINESS_INFO.phone1.replace(/\s+/g, "")}`}
                  className="w-full py-2.5 bg-white hover:bg-stone-50 text-stone-800 font-medium text-xs rounded-xl border border-stone-300 shadow-2xs transition-all flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#581c3c]" />
                  <span>Call {BUSINESS_INFO.phone1}</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer / Navigation Buttons */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3 font-normal">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as 1 | 2)}
              className="px-4 py-2.5 text-xs font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div className="text-xs text-stone-500">
              Total: <span className="text-stone-900 font-medium">₹{grandTotal}</span>
            </div>
          )}

          {step === 1 && (
            <button
              type="button"
              onClick={handleProceedToStep2}
              className="px-5 py-2.5 bg-[#581c3c] hover:bg-[#481430] text-white text-xs sm:text-sm font-medium rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer ml-auto"
            >
              <span>Next: Address Details</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {step === 2 && (
            <button
              type="button"
              onClick={handleProceedToStep3}
              className="px-5 py-2.5 bg-[#581c3c] hover:bg-[#481430] text-white text-xs sm:text-sm font-medium rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer ml-auto"
            >
              <span>Review & Confirm</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {step === 3 && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-normal text-stone-500 hover:text-stone-800 cursor-pointer"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </dialog>
  );
};
