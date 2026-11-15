"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  Save,
  Plus,
  SlidersHorizontal,
  User,
  Phone,
  MapPin,
  Sparkles,
  Ban,
  MessageCircle,
} from "lucide-react";
import { useAdmin, BookingRecord } from "../AdminContext";
import {
  WeeklySlotsModal,
  SlotBookingModal,
  DEFAULT_WEEKLY_SCHEDULE,
  DayScheduleConfig,
  DayOfWeek,
} from "@/components/admin";

const LOCAL_STORAGE_WEEKLY_SLOTS = "vaishnavi_admin_weekly_slots";
const LOCAL_STORAGE_BLOCKED_DATES = "vaishnavi_admin_blocked_dates";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAY_NAMES: DayOfWeek[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function ScheduleManagementPage() {
  const {
    bookings,
    morningSlotActive,
    afternoonSlotActive,
    eveningSlotActive,
    emergencyHomeVisitActive,
    setMorningSlotActive,
    setAfternoonSlotActive,
    setEveningSlotActive,
    setEmergencyHomeVisitActive,
  } = useAdmin();

  // Weekly Schedule State (Monday - Sunday)
  const [weeklySchedule, setWeeklySchedule] = useState<DayScheduleConfig[]>(
    DEFAULT_WEEKLY_SCHEDULE
  );

  // Modals state
  const [isWeeklyModalOpen, setIsWeeklyModalOpen] = useState(false);
  const [isSlotBookingModalOpen, setIsSlotBookingModalOpen] = useState(false);
  const [bookingModalInitialSlot, setBookingModalInitialSlot] = useState<string | undefined>(undefined);

  // Calendar View State
  const [currentMonthDate, setCurrentMonthDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  // General Settings & Blocked Dates
  const [maxBookingsPerDay, setMaxBookingsPerDay] = useState("6");
  const [doorstepRadius, setDoorstepRadius] = useState("15");
  const [blockedDateInput, setBlockedDateInput] = useState("");
  const [blockedDatesList, setBlockedDatesList] = useState<string[]>([
    "2026-11-25 (Outstation Bridal Muhurtham)",
  ]);
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load weekly slots and blocked dates from localStorage
  useEffect(() => {
    try {
      const storedWeekly = localStorage.getItem(LOCAL_STORAGE_WEEKLY_SLOTS);
      if (storedWeekly) {
        setWeeklySchedule(JSON.parse(storedWeekly));
      }
      const storedBlocked = localStorage.getItem(LOCAL_STORAGE_BLOCKED_DATES);
      if (storedBlocked) {
        setBlockedDatesList(JSON.parse(storedBlocked));
      }
    } catch {
      // ignore
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveWeeklySchedule = (updated: DayScheduleConfig[]) => {
    setWeeklySchedule(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_WEEKLY_SLOTS, JSON.stringify(updated));
    } catch {
      // ignore
    }
    showToast("Monday to Sunday weekly slots updated successfully!");
  };

  const handleSaveSettings = () => {
    setIsSaved(true);
    try {
      localStorage.setItem(
        LOCAL_STORAGE_BLOCKED_DATES,
        JSON.stringify(blockedDatesList)
      );
    } catch {
      // ignore
    }
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleAddBlockedDate = () => {
    if (!blockedDateInput) return;
    const updated = [...blockedDatesList, `${blockedDateInput} (Fully Booked)`];
    setBlockedDatesList(updated);
    try {
      localStorage.setItem(
        LOCAL_STORAGE_BLOCKED_DATES,
        JSON.stringify(updated)
      );
    } catch {
      // ignore
    }
    setBlockedDateInput("");
    showToast(`Date ${blockedDateInput} blocked successfully.`);
  };

  const handleRemoveBlockedDate = (index: number) => {
    const updated = blockedDatesList.filter((_, i) => i !== index);
    setBlockedDatesList(updated);
    try {
      localStorage.setItem(
        LOCAL_STORAGE_BLOCKED_DATES,
        JSON.stringify(updated)
      );
    } catch {
      // ignore
    }
    showToast("Blocked date removed.");
  };

  // Date Helpers
  const formatIsoDate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const isDateBlocked = (dateObj: Date) => {
    const iso = formatIsoDate(dateObj);
    return blockedDatesList.some((item) => item.includes(iso));
  };

  const handleToggleBlockSelectedDate = () => {
    const iso = formatIsoDate(selectedDate);
    const existingIndex = blockedDatesList.findIndex((item) =>
      item.includes(iso)
    );

    if (existingIndex >= 0) {
      handleRemoveBlockedDate(existingIndex);
    } else {
      const updated = [
        ...blockedDatesList,
        `${iso} (Custom Blocked Date)`,
      ];
      setBlockedDatesList(updated);
      try {
        localStorage.setItem(
          LOCAL_STORAGE_BLOCKED_DATES,
          JSON.stringify(updated)
        );
      } catch {
        // ignore
      }
      showToast(`Date ${iso} blocked for bookings.`);
    }
  };

  // Matches bookings to a specific calendar date
  const getBookingsForDate = (targetDate: Date) => {
    const iso = formatIsoDate(targetDate);
    const today = new Date();
    const isToday = isSameDay(targetDate, today);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const isTomorrow = isSameDay(targetDate, tomorrow);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const isYesterday = isSameDay(targetDate, yesterday);

    const monthAbbr = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const shortDayMonth = `${targetDate.getDate()} ${monthAbbr[targetDate.getMonth()]}`.toLowerCase();

    return bookings.filter((b) => {
      if (!b.date) return false;
      const bDateLower = b.date.toLowerCase();
      if (b.date === iso || b.date.includes(iso)) return true;
      if (isToday && bDateLower.includes("today")) return true;
      if (isTomorrow && bDateLower.includes("tomorrow")) return true;
      if (isYesterday && bDateLower.includes("yesterday")) return true;
      if (bDateLower.includes(shortDayMonth)) return true;
      return false;
    });
  };

  // Calendar navigation
  const handlePrevMonth = () => {
    setCurrentMonthDate(
      new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(
      new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1)
    );
  };

  const handleJumpToToday = () => {
    const now = new Date();
    setCurrentMonthDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(now);
  };

  // Build calendar matrix (Monday to Sunday)
  const calendarCells = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    // Monday is column 0 (dayOfWeek: Sunday=0, Monday=1, ... Saturday=6)
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const mondayOffset = (firstDayOfWeek + 6) % 7;

    const cells: {
      date: Date;
      isCurrentMonth: boolean;
      isToday: boolean;
      isSelected: boolean;
      isBlocked: boolean;
      bookings: BookingRecord[];
      dayName: DayOfWeek;
    }[] = [];

    const today = new Date();

    // Previous month filler days
    for (let i = mondayOffset - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, daysInPrevMonth - i);
      const dayName = WEEKDAY_NAMES[d.getDay()];
      cells.push({
        date: d,
        isCurrentMonth: false,
        isToday: isSameDay(d, today),
        isSelected: isSameDay(d, selectedDate),
        isBlocked: isDateBlocked(d),
        bookings: getBookingsForDate(d),
        dayName,
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      const dayName = WEEKDAY_NAMES[d.getDay()];
      cells.push({
        date: d,
        isCurrentMonth: true,
        isToday: isSameDay(d, today),
        isSelected: isSameDay(d, selectedDate),
        isBlocked: isDateBlocked(d),
        bookings: getBookingsForDate(d),
        dayName,
      });
    }

    // Next month filler days to complete rows of 7
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      const dayName = WEEKDAY_NAMES[d.getDay()];
      cells.push({
        date: d,
        isCurrentMonth: false,
        isToday: isSameDay(d, today),
        isSelected: isSameDay(d, selectedDate),
        isBlocked: isDateBlocked(d),
        bookings: getBookingsForDate(d),
        dayName,
      });
    }

    return cells;
  }, [currentMonthDate, selectedDate, bookings, blockedDatesList]);

  // Selected date information
  const selectedDayName = WEEKDAY_NAMES[selectedDate.getDay()];
  const selectedDayConfig = weeklySchedule.find((d) => d.day === selectedDayName);
  const selectedDayBookings = getBookingsForDate(selectedDate);
  const isSelectedDateBlocked = isDateBlocked(selectedDate);

  const handleOpenBookingModalForSlot = (slotTime?: string) => {
    setBookingModalInitialSlot(slotTime);
    setIsSlotBookingModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium font-serif text-stone-900">
            Slot Availability & Schedule
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-normal mt-1">
            Interactive calendar view, Monday–Sunday slot configuration, and daily capacity rules in Bahadurpally.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Weekly Slots Monday-to-Sunday Modal Button */}
          <button
            type="button"
            onClick={() => setIsWeeklyModalOpen(true)}
            className="px-3.5 py-2 rounded-md border border-[#581c3c]/20 bg-[#581c3c]/5 hover:bg-[#581c3c]/10 text-[#581c3c] text-xs sm:text-sm font-medium flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
            title="Configure working hours & slots for Monday through Sunday"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Weekly Slots (Mon - Sun)</span>
          </button>

          {/* Book Slot Modal Button */}
          <button
            type="button"
            onClick={() => handleOpenBookingModalForSlot(undefined)}
            className="px-3.5 py-2 rounded-md bg-[#581c3c] hover:bg-[#481430] text-white text-xs sm:text-sm font-medium flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Book a Slot</span>
          </button>

          {/* Save Settings Button */}
          <button
            type="button"
            onClick={handleSaveSettings}
            className="px-3.5 py-2 rounded-md border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs sm:text-sm font-medium flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
          >
            <Save className="w-4 h-4 text-stone-500" />
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

      {isSaved && (
        <div className="p-3.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Schedule & capacity settings saved successfully.</span>
        </div>
      )}

      {/* Main Calendar & Schedule Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Month Calendar (Col 8) */}
        <div className="lg:col-span-8 bg-white rounded-md border border-stone-200/80 shadow-2xs p-4 sm:p-6 space-y-4">
          {/* Calendar Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#581c3c]" />
              <h2 className="text-lg sm:text-xl font-medium font-serif text-stone-900">
                {MONTH_NAMES[currentMonthDate.getMonth()]} {currentMonthDate.getFullYear()}
              </h2>
            </div>

            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <button
                type="button"
                onClick={handleJumpToToday}
                className="px-2.5 py-1 text-xs font-medium rounded-md border border-stone-200 hover:bg-stone-50 text-stone-700 cursor-pointer transition-colors"
              >
                Today
              </button>
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-md border border-stone-200 hover:bg-stone-50 text-stone-600 cursor-pointer transition-colors"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-md border border-stone-200 hover:bg-stone-50 text-stone-600 cursor-pointer transition-colors"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar Day-of-Week Headers (Mon - Sun) */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((dayName) => (
              <div
                key={dayName}
                className="py-1.5 text-xs font-medium text-stone-500 uppercase tracking-wider"
              >
                {dayName}
              </div>
            ))}
          </div>

          {/* Calendar Grid Matrix */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {calendarCells.map((cell, idx) => {
              const bookingCount = cell.bookings.length;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedDate(cell.date)}
                  className={`min-h-[85px] sm:min-h-[100px] p-1.5 sm:p-2 rounded-md border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    cell.isSelected
                      ? "border-[#581c3c] bg-[#581c3c]/5 ring-1.5 ring-[#581c3c]"
                      : cell.isCurrentMonth
                      ? "border-stone-200/90 bg-white hover:border-[#581c3c]/40 hover:bg-stone-50/50"
                      : "border-stone-100 bg-stone-50/40 text-stone-300 opacity-60 hover:opacity-100"
                  }`}
                >
                  {/* Top Bar inside cell: Date number & indicators */}
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs sm:text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center transition-colors ${
                        cell.isToday
                          ? "bg-[#581c3c] text-white"
                          : cell.isSelected
                          ? "text-[#581c3c] font-medium"
                          : cell.isCurrentMonth
                          ? "text-stone-800"
                          : "text-stone-400"
                      }`}
                    >
                      {cell.date.getDate()}
                    </span>

                    {/* Blocked indicator */}
                    {cell.isBlocked && (
                      <span
                        className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-rose-100 text-rose-800"
                        title="Blocked date"
                      >
                        Blocked
                      </span>
                    )}
                  </div>

                  {/* Cell Body: Booking summaries */}
                  <div className="mt-1 space-y-1 w-full overflow-hidden">
                    {bookingCount > 0 ? (
                      <div className="space-y-0.5">
                        <div className="px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] sm:text-[11px] font-medium truncate flex items-center justify-between">
                          <span>
                            {bookingCount} {bookingCount === 1 ? "Booking" : "Bookings"}
                          </span>
                        </div>
                        {cell.bookings.slice(0, 1).map((b) => (
                          <div
                            key={b.id}
                            className="text-[10px] text-stone-500 font-normal truncate hidden sm:block"
                          >
                            {b.clientName}
                          </div>
                        ))}
                      </div>
                    ) : (
                      cell.isCurrentMonth &&
                      !cell.isBlocked && (
                        <div className="text-[10px] text-stone-400 font-normal truncate hidden sm:block">
                          Slots open
                        </div>
                      )
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Calendar Legend */}
          <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center gap-4 text-xs text-stone-500 font-normal">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#581c3c]" />
              <span>Today</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm border border-[#581c3c] bg-[#581c3c]/10" />
              <span>Selected Day</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-100 border border-emerald-300" />
              <span>Has Bookings</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-100 border border-rose-300" />
              <span>Blocked / Leave</span>
            </div>
          </div>
        </div>

        {/* Right Column: Selected Date Schedule & Slots Panel (Col 4) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Selected Date Summary Card */}
          <div className="bg-white rounded-md border border-stone-200/80 shadow-2xs p-5 space-y-4">
            <div className="pb-3 border-b border-stone-100">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-stone-400 font-medium">
                  {selectedDayName}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                    isSelectedDateBlocked
                      ? "bg-rose-50 text-rose-800 border-rose-200"
                      : selectedDayConfig?.isOpen
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-stone-100 text-stone-600 border-stone-200"
                  }`}
                >
                  {isSelectedDateBlocked
                    ? "Day Blocked"
                    : selectedDayConfig?.isOpen
                    ? "Open for Bookings"
                    : "Day Off"}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-medium font-serif text-stone-900 mt-1">
                {selectedDate.getDate()} {MONTH_NAMES[selectedDate.getMonth()]}{" "}
                {selectedDate.getFullYear()}
              </h3>
            </div>

            {/* Quick Actions for Selected Date */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenBookingModalForSlot(undefined)}
                className="flex-1 px-3 py-2 bg-[#581c3c] hover:bg-[#481430] text-white rounded-md text-xs font-medium cursor-pointer transition-colors inline-flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Book Slot</span>
              </button>

              <button
                type="button"
                onClick={handleToggleBlockSelectedDate}
                className={`px-3 py-2 rounded-md text-xs font-medium border cursor-pointer transition-colors inline-flex items-center gap-1.5 ${
                  isSelectedDateBlocked
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100"
                    : "bg-rose-50 border-rose-200 text-rose-800 hover:bg-rose-100"
                }`}
                title={isSelectedDateBlocked ? "Unblock this date" : "Block this date"}
              >
                <Ban className="w-3.5 h-3.5" />
                <span>{isSelectedDateBlocked ? "Unblock" : "Block"}</span>
              </button>
            </div>

            {/* Scheduled Appointments on Selected Date */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs text-stone-600 font-medium">
                <span>Appointments ({selectedDayBookings.length})</span>
              </div>

              {selectedDayBookings.length > 0 ? (
                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {selectedDayBookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-3 rounded-md bg-stone-50 border border-stone-200/90 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-stone-900 flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-[#581c3c]" />
                          {b.clientName}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                            b.status === "Confirmed"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : b.status === "Pending"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-stone-100 text-stone-600 border-stone-200"
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-stone-600 font-normal text-[11px]">
                        <Clock className="w-3 h-3 text-stone-400" />
                        <span>{b.timeSlot}</span>
                      </div>

                      <div className="text-[11px] text-stone-500 font-normal truncate">
                        {b.services.map((s) => s.title).join(", ")}
                      </div>

                      <div className="pt-1 border-t border-stone-200/60 flex items-center justify-between text-[11px]">
                        <span className="font-medium text-stone-800 font-serif">
                          ₹{b.totalAmount}
                        </span>
                        <a
                          href={`https://wa.me/91${b.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                            `Hello ${b.clientName}, Anusha here from Vaishnavi Beauty regarding your appointment on ${b.date} (${b.timeSlot}).`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-700 hover:underline"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>Chat</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-md bg-stone-50 border border-dashed border-stone-200 text-center text-xs text-stone-400 font-normal">
                  No appointments scheduled for this date.
                </div>
              )}
            </div>

            {/* Bookable Time Windows for Selected Day (Configured Monday - Sunday) */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-stone-700">
                  {selectedDayName}&apos;s Configured Slots
                </span>
                <button
                  type="button"
                  onClick={() => setIsWeeklyModalOpen(true)}
                  className="text-[11px] text-[#581c3c] hover:underline font-medium cursor-pointer"
                >
                  Edit Slots
                </button>
              </div>

              {selectedDayConfig && selectedDayConfig.isOpen ? (
                <div className="space-y-1.5">
                  {selectedDayConfig.slots
                    .filter((s) => s.isActive)
                    .map((slot) => {
                      const isSlotBooked = selectedDayBookings.some((b) =>
                        b.timeSlot.toLowerCase().includes(slot.timeRange.toLowerCase().slice(0, 5))
                      );

                      return (
                        <div
                          key={slot.id}
                          className="p-2 rounded-md border border-stone-200 flex items-center justify-between text-xs bg-stone-50/60"
                        >
                          <div>
                            <div className="font-medium text-stone-800">
                              {slot.timeRange}
                            </div>
                            {slot.tag && (
                              <div className="text-[10px] text-stone-400 font-normal">
                                {slot.tag}
                              </div>
                            )}
                          </div>

                          {isSlotBooked ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                              Booked
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleOpenBookingModalForSlot(slot.timeRange)}
                              className="px-2 py-1 rounded bg-[#581c3c]/10 hover:bg-[#581c3c] text-[#581c3c] hover:text-white text-[11px] font-medium cursor-pointer transition-colors"
                            >
                              Book
                            </button>
                          )}
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="p-3 rounded-md bg-stone-50 border border-stone-200 text-xs text-stone-500 font-normal text-center">
                  {selectedDayName} is marked as Closed / Day Off in weekly schedule.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Daily Timeframes & Blocked Dates Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: General Slot Windows (Morning, Afternoon, Evening) */}
        <div className="lg:col-span-8 bg-white p-5 sm:p-6 rounded-md border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg sm:text-xl font-medium text-stone-900 font-serif">
                Broad Slot Windows
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 font-normal mt-0.5">
                Master switch for customer morning, afternoon, and evening bookings.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsWeeklyModalOpen(true)}
              className="text-xs font-medium text-[#581c3c] hover:underline cursor-pointer self-start sm:self-auto"
            >
              Open Monday–Sunday Slots Matrix →
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {/* Morning */}
            <div className="p-3.5 sm:p-4 rounded-md border border-stone-200 flex items-center justify-between gap-4">
              <div>
                <div className="text-sm sm:text-base font-medium text-stone-900">
                  Morning Slots (08:00 AM - 12:00 PM)
                </div>
                <div className="text-xs sm:text-sm text-stone-500 font-normal mt-0.5">
                  Ideal for wedding muhurtham and morning silk saree draping.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMorningSlotActive(!morningSlotActive)}
                className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium cursor-pointer transition-colors ${
                  morningSlotActive
                    ? "bg-emerald-600 text-white"
                    : "bg-stone-200 text-stone-600"
                }`}
              >
                {morningSlotActive ? "Active" : "Paused"}
              </button>
            </div>

            {/* Afternoon */}
            <div className="p-3.5 sm:p-4 rounded-md border border-stone-200 flex items-center justify-between gap-4">
              <div>
                <div className="text-sm sm:text-base font-medium text-stone-900">
                  Afternoon Slots (12:00 PM - 04:00 PM)
                </div>
                <div className="text-xs sm:text-sm text-stone-500 font-normal mt-0.5">
                  Popular for facials, grooming, wax sessions, and pre-pleating.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAfternoonSlotActive(!afternoonSlotActive)}
                className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium cursor-pointer transition-colors ${
                  afternoonSlotActive
                    ? "bg-emerald-600 text-white"
                    : "bg-stone-200 text-stone-600"
                }`}
              >
                {afternoonSlotActive ? "Active" : "Paused"}
              </button>
            </div>

            {/* Evening */}
            <div className="p-3.5 sm:p-4 rounded-md border border-stone-200 flex items-center justify-between gap-4">
              <div>
                <div className="text-sm sm:text-base font-medium text-stone-900">
                  Evening Slots (04:00 PM - 08:30 PM)
                </div>
                <div className="text-xs sm:text-sm text-stone-500 font-normal mt-0.5">
                  High demand for reception glam, sangeet makeup, and party hairstyling.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEveningSlotActive(!eveningSlotActive)}
                className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium cursor-pointer transition-colors ${
                  eveningSlotActive
                    ? "bg-emerald-600 text-white"
                    : "bg-stone-200 text-stone-600"
                }`}
              >
                {eveningSlotActive ? "Active" : "Paused"}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Blocked Dates & Vacation Bookouts */}
        <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-md border border-stone-200/80 shadow-2xs space-y-4">
          <h2 className="text-lg sm:text-xl font-medium text-stone-900 font-serif">
            Blocked Dates & Bookouts
          </h2>
          <p className="text-xs text-stone-500 font-normal">
            Block full dates for outstation bridal orders or personal holidays.
          </p>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={blockedDateInput}
              min={formatIsoDate(new Date())}
              onChange={(e) => setBlockedDateInput(e.target.value)}
              className="flex-1 px-3 py-2 border border-stone-300 rounded-md text-xs outline-hidden focus:border-[#581c3c] font-normal"
            />
            <button
              type="button"
              onClick={handleAddBlockedDate}
              className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-md text-xs font-medium cursor-pointer transition-colors shrink-0"
            >
              Block Date
            </button>
          </div>

          <div className="space-y-2 pt-2 max-h-[180px] overflow-y-auto">
            {blockedDatesList.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-md bg-stone-50 border border-stone-200 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2 text-stone-800 font-normal truncate mr-2">
                  <Ban className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span className="truncate">{item}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveBlockedDate(idx)}
                  className="text-stone-400 hover:text-rose-700 text-xs cursor-pointer font-normal shrink-0"
                >
                  Unblock
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Capacity & Operational Rules */}
      <div className="bg-white p-5 sm:p-6 rounded-md border border-stone-200/80 shadow-2xs space-y-4">
        <h2 className="text-lg sm:text-xl font-medium text-stone-900 font-serif">
          Capacity & Doorstep Coverage Rules
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm font-normal">
          <div>
            <label className="block text-stone-700 font-medium mb-1">
              Max Bookings Per Day
            </label>
            <input
              type="number"
              value={maxBookingsPerDay}
              onChange={(e) => setMaxBookingsPerDay(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-md outline-hidden focus:border-[#581c3c]"
            />
            <span className="text-xs text-stone-400 mt-1 block">
              Limits automatic slots to preserve personalized bridal attention.
            </span>
          </div>

          <div>
            <label className="block text-stone-700 font-medium mb-1">
              Doorstep Radius (KM)
            </label>
            <input
              type="number"
              value={doorstepRadius}
              onChange={(e) => setDoorstepRadius(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-md outline-hidden focus:border-[#581c3c]"
            />
            <span className="text-xs text-stone-400 mt-1 block">
              Coverage around Bahadurpally, Gandimaisamma, and Mallampet.
            </span>
          </div>

          <div className="flex flex-col justify-between p-3.5 rounded-md bg-stone-50 border border-stone-200">
            <div>
              <div className="text-xs sm:text-sm font-medium text-stone-900">
                Emergency Home Visits
              </div>
              <div className="text-[11px] text-stone-500 font-normal">
                Accept urgent 2-hour rush requests for muhurtham.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setEmergencyHomeVisitActive(!emergencyHomeVisitActive)}
              className={`mt-2 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors self-start ${
                emergencyHomeVisitActive
                  ? "bg-emerald-600 text-white"
                  : "bg-stone-200 text-stone-600"
              }`}
            >
              {emergencyHomeVisitActive ? "Active" : "Off"}
            </button>
          </div>
        </div>
      </div>

      {/* Weekly Slots Modal (Monday through Sunday) */}
      <WeeklySlotsModal
        isOpen={isWeeklyModalOpen}
        onClose={() => setIsWeeklyModalOpen(false)}
        weeklySchedule={weeklySchedule}
        onSave={handleSaveWeeklySchedule}
      />

      {/* Manual Slot Booking Modal */}
      <SlotBookingModal
        isOpen={isSlotBookingModalOpen}
        onClose={() => setIsSlotBookingModalOpen(false)}
        initialDate={formatIsoDate(selectedDate)}
        initialSlot={bookingModalInitialSlot}
        weeklySchedule={weeklySchedule}
        onBookingSuccess={() => {
          showToast("Appointment slot booked and added to schedule.");
        }}
      />
    </div>
  );
}
