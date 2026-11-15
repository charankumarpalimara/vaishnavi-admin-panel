"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  MapPin,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useAdmin, BookingRecord } from "@/app/admin/AdminContext";
import { DayScheduleConfig, DayOfWeek } from "./WeeklySlotsModal";

interface SlotBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: string; // e.g. "2026-11-10"
  initialSlot?: string;
  weeklySchedule: DayScheduleConfig[];
  onBookingSuccess?: (booking: BookingRecord) => void;
}

const DAY_NAMES: DayOfWeek[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const SlotBookingModal: React.FC<SlotBookingModalProps> = ({
  isOpen,
  onClose,
  initialDate,
  initialSlot,
  weeklySchedule,
  onBookingSuccess,
}) => {
  const { services, addBooking } = useAdmin();

  const getTodayIso = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [date, setDate] = useState(initialDate || getTodayIso());
  const [selectedSlot, setSelectedSlot] = useState(initialSlot || "");
  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceType, setServiceType] = useState<"home" | "studio">("home");
  const [address, setAddress] = useState(
    "Flat 324, 2nd Block, KCR Double Bed Rooms, Bahadurpally"
  );
  const [selectedServiceId, setSelectedServiceId] = useState(
    services[0]?.id || ""
  );
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (initialDate) {
      setDate(initialDate);
    }
  }, [initialDate]);

  useEffect(() => {
    if (initialSlot) {
      setSelectedSlot(initialSlot);
    }
  }, [initialSlot]);

  if (!isOpen) return null;

  // Determine day of the week from the chosen date
  const parseSelectedDate = () => {
    try {
      const parts = date.split("-").map(Number);
      if (parts.length === 3) {
        return new Date(parts[0], parts[1] - 1, parts[2]);
      }
    } catch {
      // fallback
    }
    return new Date();
  };

  const selectedDateObj = parseSelectedDate();
  const dayOfWeekName = DAY_NAMES[selectedDateObj.getDay()];
  const dayConfig = weeklySchedule.find((d) => d.day === dayOfWeekName);
  const availableSlots =
    dayConfig?.slots.filter((s) => s.isActive) || [];

  const handleServiceTypeChange = (type: "home" | "studio") => {
    setServiceType(type);
    if (type === "studio") {
      setAddress("Visiting Studio: Flat 324, 2nd Block, KCR Bahadurpally");
    } else {
      setAddress("KCR Double Bed Rooms, Bahadurpally");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!clientName.trim()) {
      setFormError("Please enter client full name.");
      return;
    }

    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      setFormError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!selectedSlot) {
      setFormError("Please select a booking time slot.");
      return;
    }

    const chosenService = services.find((s) => s.id === selectedServiceId) || {
      title: "Custom Salon Service",
      price: 999,
    };

    const newBooking = addBooking({
      clientName: clientName.trim(),
      phone: phone.trim(),
      serviceType: serviceType,
      address: address.trim(),
      date: date,
      timeSlot: selectedSlot,
      services: [
        {
          title: chosenService.title,
          price: chosenService.price,
          quantity: 1,
        },
      ],
      totalAmount: chosenService.price,
      notes: notes.trim() || undefined,
    });

    setIsSuccess(true);
    if (onBookingSuccess) {
      onBookingSuccess(newBooking);
    }

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-md border border-stone-200/80 shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Fixed Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between shrink-0 bg-white">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#581c3c]" />
              <h2 className="text-lg font-medium font-serif text-stone-900">
                Book a Slot / New Appointment
              </h2>
            </div>
            <p className="text-xs text-stone-500 font-normal mt-0.5">
              Directly schedule a client slot across Monday to Sunday.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md hover:bg-stone-100 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6 space-y-4">
          {formError && (
            <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {isSuccess && (
            <div className="p-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Slot appointment booked successfully!</span>
            </div>
          )}

          <form id="slot-booking-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Date and Day of Week */}
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Appointment Date <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal"
                />
                <span className="px-3 py-2 bg-stone-100 border border-stone-200 rounded-md text-xs font-medium text-stone-700 shrink-0">
                  {dayOfWeekName}
                </span>
              </div>
              {dayConfig && !dayConfig.isOpen && (
                <p className="text-[11px] text-amber-700 mt-1 flex items-center gap-1 font-normal">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    Note: {dayOfWeekName} is marked as closed in weekly schedule, but you can still book a private slot.
                  </span>
                </p>
              )}
            </div>

            {/* Time Slot Selection (Dynamic from Monday - Sunday schedule) */}
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1.5">
                Select Time Slot ({dayOfWeekName}) <span className="text-rose-500">*</span>
              </label>

              {availableSlots.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableSlots.map((slot) => {
                    const isSelected = selectedSlot === slot.timeRange;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedSlot(slot.timeRange)}
                        className={`p-2.5 rounded-md border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "bg-[#581c3c] text-white border-[#581c3c] shadow-2xs"
                            : "bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200"
                        }`}
                      >
                        <div>
                          <div className="font-medium">{slot.timeRange}</div>
                          {slot.tag && (
                            <div
                              className={`text-[10px] ${
                                isSelected ? "text-stone-200" : "text-stone-400"
                              }`}
                            >
                              {slot.tag}
                            </div>
                          )}
                        </div>
                        <Clock className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-stone-400"}`} />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-3 rounded-md bg-stone-50 border border-dashed border-stone-200 text-xs text-stone-500 text-center">
                  No active slots configured for {dayOfWeekName}. Enter a custom slot below.
                </div>
              )}

              {/* Custom Slot input if needed */}
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Or enter custom time slot (e.g. 03:00 PM - 05:00 PM)"
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal"
                />
              </div>
            </div>

            {/* Client Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Client Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pooja Reddy"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-2.5 top-2.5" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal"
                  />
                </div>
              </div>
            </div>

            {/* Service Type Selection */}
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1.5">
                Service Location / Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleServiceTypeChange("home")}
                  className={`p-2.5 rounded-md border text-xs text-center cursor-pointer transition-colors ${
                    serviceType === "home"
                      ? "bg-[#581c3c] text-white border-[#581c3c] font-medium"
                      : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 font-normal"
                  }`}
                >
                  Doorstep Home Visit
                </button>
                <button
                  type="button"
                  onClick={() => handleServiceTypeChange("studio")}
                  className={`p-2.5 rounded-md border text-xs text-center cursor-pointer transition-colors ${
                    serviceType === "studio"
                      ? "bg-[#581c3c] text-white border-[#581c3c] font-medium"
                      : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 font-normal"
                  }`}
                >
                  Studio Visit (Bahadurpally)
                </button>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                {serviceType === "home" ? "Client Address" : "Studio Location"}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal"
                />
              </div>
            </div>

            {/* Service Selection */}
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Service Offering
              </label>
              <div className="relative">
                <Sparkles className="w-4 h-4 text-stone-400 absolute left-2.5 top-2.5" />
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal"
                >
                  {services.map((svc) => (
                    <option key={svc.id} value={svc.id}>
                      {svc.title} — ₹{svc.price} ({svc.durationMinutes} mins)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Booking Notes (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Saree pre-pleating required, bride sister makeup"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal"
              />
            </div>
          </form>
        </div>

        {/* Fixed Footer */}
        <div className="p-3 sm:px-6 sm:py-3.5 border-t border-stone-100 bg-stone-50/60 flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-stone-200 text-stone-700 text-xs sm:text-sm font-medium hover:bg-stone-100 cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="slot-booking-form"
            className="px-4 py-2 rounded-md bg-[#581c3c] hover:bg-[#481430] text-white text-xs sm:text-sm font-medium cursor-pointer shadow-2xs transition-colors"
          >
            Confirm & Book Slot
          </button>
        </div>
      </div>
    </div>
  );
};
