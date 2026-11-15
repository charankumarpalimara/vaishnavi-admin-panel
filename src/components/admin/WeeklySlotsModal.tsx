"use client";

import React, { useState } from "react";
import {
  X,
  Clock,
  Check,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  Copy,
  RotateCcw,
} from "lucide-react";

export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface DaySlotItem {
  id: string;
  timeRange: string;
  isActive: boolean;
  tag?: string;
}

export interface DayScheduleConfig {
  day: DayOfWeek;
  isOpen: boolean;
  startTime: string;
  endTime: string;
  maxBookingsPerSlot: number;
  serviceTypes: "all" | "home" | "studio";
  slots: DaySlotItem[];
}

export const DEFAULT_WEEKLY_SCHEDULE: DayScheduleConfig[] = [
  {
    day: "Monday",
    isOpen: true,
    startTime: "08:00 AM",
    endTime: "08:30 PM",
    maxBookingsPerSlot: 1,
    serviceTypes: "all",
    slots: [
      { id: "mon-1", timeRange: "08:00 AM - 10:00 AM", isActive: true, tag: "Muhurtham / Bridal" },
      { id: "mon-2", timeRange: "10:00 AM - 12:00 PM", isActive: true, tag: "Morning Standard" },
      { id: "mon-3", timeRange: "12:00 PM - 02:00 PM", isActive: true, tag: "Facial & Pre-pleating" },
      { id: "mon-4", timeRange: "02:00 PM - 04:00 PM", isActive: true, tag: "Grooming & Waxing" },
      { id: "mon-5", timeRange: "04:00 PM - 06:30 PM", isActive: true, tag: "Evening Party Glam" },
      { id: "mon-6", timeRange: "06:30 PM - 08:30 PM", isActive: true, tag: "Reception Styling" },
    ],
  },
  {
    day: "Tuesday",
    isOpen: true,
    startTime: "08:00 AM",
    endTime: "08:30 PM",
    maxBookingsPerSlot: 1,
    serviceTypes: "all",
    slots: [
      { id: "tue-1", timeRange: "08:00 AM - 10:00 AM", isActive: true, tag: "Muhurtham / Bridal" },
      { id: "tue-2", timeRange: "10:00 AM - 12:00 PM", isActive: true, tag: "Morning Standard" },
      { id: "tue-3", timeRange: "12:00 PM - 02:00 PM", isActive: true, tag: "Facial & Pre-pleating" },
      { id: "tue-4", timeRange: "02:00 PM - 04:00 PM", isActive: true, tag: "Grooming & Waxing" },
      { id: "tue-5", timeRange: "04:00 PM - 06:30 PM", isActive: true, tag: "Evening Party Glam" },
      { id: "tue-6", timeRange: "06:30 PM - 08:30 PM", isActive: true, tag: "Reception Styling" },
    ],
  },
  {
    day: "Wednesday",
    isOpen: true,
    startTime: "08:00 AM",
    endTime: "08:30 PM",
    maxBookingsPerSlot: 1,
    serviceTypes: "all",
    slots: [
      { id: "wed-1", timeRange: "08:00 AM - 10:00 AM", isActive: true, tag: "Muhurtham / Bridal" },
      { id: "wed-2", timeRange: "10:00 AM - 12:00 PM", isActive: true, tag: "Morning Standard" },
      { id: "wed-3", timeRange: "12:00 PM - 02:00 PM", isActive: true, tag: "Facial & Pre-pleating" },
      { id: "wed-4", timeRange: "02:00 PM - 04:00 PM", isActive: true, tag: "Grooming & Waxing" },
      { id: "wed-5", timeRange: "04:00 PM - 06:30 PM", isActive: true, tag: "Evening Party Glam" },
      { id: "wed-6", timeRange: "06:30 PM - 08:30 PM", isActive: true, tag: "Reception Styling" },
    ],
  },
  {
    day: "Thursday",
    isOpen: true,
    startTime: "08:00 AM",
    endTime: "08:30 PM",
    maxBookingsPerSlot: 1,
    serviceTypes: "all",
    slots: [
      { id: "thu-1", timeRange: "08:00 AM - 10:00 AM", isActive: true, tag: "Muhurtham / Bridal" },
      { id: "thu-2", timeRange: "10:00 AM - 12:00 PM", isActive: true, tag: "Morning Standard" },
      { id: "thu-3", timeRange: "12:00 PM - 02:00 PM", isActive: true, tag: "Facial & Pre-pleating" },
      { id: "thu-4", timeRange: "02:00 PM - 04:00 PM", isActive: true, tag: "Grooming & Waxing" },
      { id: "thu-5", timeRange: "04:00 PM - 06:30 PM", isActive: true, tag: "Evening Party Glam" },
      { id: "thu-6", timeRange: "06:30 PM - 08:30 PM", isActive: true, tag: "Reception Styling" },
    ],
  },
  {
    day: "Friday",
    isOpen: true,
    startTime: "08:00 AM",
    endTime: "08:30 PM",
    maxBookingsPerSlot: 1,
    serviceTypes: "all",
    slots: [
      { id: "fri-1", timeRange: "08:00 AM - 10:00 AM", isActive: true, tag: "Muhurtham / Bridal" },
      { id: "fri-2", timeRange: "10:00 AM - 12:00 PM", isActive: true, tag: "Morning Standard" },
      { id: "fri-3", timeRange: "12:00 PM - 02:00 PM", isActive: true, tag: "Facial & Pre-pleating" },
      { id: "fri-4", timeRange: "02:00 PM - 04:00 PM", isActive: true, tag: "Grooming & Waxing" },
      { id: "fri-5", timeRange: "04:00 PM - 06:30 PM", isActive: true, tag: "Evening Party Glam" },
      { id: "fri-6", timeRange: "06:30 PM - 08:30 PM", isActive: true, tag: "Reception Styling" },
    ],
  },
  {
    day: "Saturday",
    isOpen: true,
    startTime: "07:30 AM",
    endTime: "09:00 PM",
    maxBookingsPerSlot: 2,
    serviceTypes: "all",
    slots: [
      { id: "sat-1", timeRange: "07:30 AM - 10:00 AM", isActive: true, tag: "Bridal Peak" },
      { id: "sat-2", timeRange: "10:00 AM - 12:30 PM", isActive: true, tag: "Morning Trio" },
      { id: "sat-3", timeRange: "01:00 PM - 03:30 PM", isActive: true, tag: "Afternoon Prep" },
      { id: "sat-4", timeRange: "03:30 PM - 06:00 PM", isActive: true, tag: "Sangeet / Party" },
      { id: "sat-5", timeRange: "06:00 PM - 09:00 PM", isActive: true, tag: "Grand Reception" },
    ],
  },
  {
    day: "Sunday",
    isOpen: true,
    startTime: "07:30 AM",
    endTime: "09:00 PM",
    maxBookingsPerSlot: 2,
    serviceTypes: "all",
    slots: [
      { id: "sun-1", timeRange: "07:30 AM - 10:00 AM", isActive: true, tag: "Bridal Peak" },
      { id: "sun-2", timeRange: "10:00 AM - 12:30 PM", isActive: true, tag: "Morning Trio" },
      { id: "sun-3", timeRange: "01:00 PM - 03:30 PM", isActive: true, tag: "Afternoon Prep" },
      { id: "sun-4", timeRange: "03:30 PM - 06:00 PM", isActive: true, tag: "Sangeet / Party" },
      { id: "sun-5", timeRange: "06:00 PM - 09:00 PM", isActive: true, tag: "Grand Reception" },
    ],
  },
];

interface WeeklySlotsModalProps {
  isOpen: boolean;
  onClose: () => void;
  weeklySchedule: DayScheduleConfig[];
  onSave: (updatedSchedule: DayScheduleConfig[]) => void;
}

export const formatTime12h = (time24: string): string => {
  if (!time24) return "";
  const [hoursStr, minsStr] = time24.split(":");
  let hours = parseInt(hoursStr, 10);
  const mins = minsStr || "00";
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${String(hours).padStart(2, "0")}:${mins} ${period}`;
};

export const WeeklySlotsModal: React.FC<WeeklySlotsModalProps> = ({
  isOpen,
  onClose,
  weeklySchedule,
  onSave,
}) => {
  const [schedule, setSchedule] = useState<DayScheduleConfig[]>(weeklySchedule);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [newSlotStartTime, setNewSlotStartTime] = useState("");
  const [newSlotEndTime, setNewSlotEndTime] = useState("");
  const [newSlotTag, setNewSlotTag] = useState("");
  const [slotFormError, setSlotFormError] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentDay = schedule[selectedDayIndex];

  const handleToggleDayOpen = (dayName: DayOfWeek) => {
    setSchedule((prev) =>
      prev.map((item) =>
        item.day === dayName ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  };

  const handleToggleSlotActive = (slotId: string) => {
    setSchedule((prev) =>
      prev.map((item, idx) => {
        if (idx !== selectedDayIndex) return item;
        return {
          ...item,
          slots: item.slots.map((s) =>
            s.id === slotId ? { ...s, isActive: !s.isActive } : s
          ),
        };
      })
    );
  };

  const handleRemoveSlot = (slotId: string) => {
    setSchedule((prev) =>
      prev.map((item, idx) => {
        if (idx !== selectedDayIndex) return item;
        return {
          ...item,
          slots: item.slots.filter((s) => s.id !== slotId),
        };
      })
    );
  };

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    setSlotFormError("");

    if (!newSlotStartTime || !newSlotEndTime) {
      setSlotFormError("Please select both start time and end time.");
      return;
    }

    const timeRangeStr = `${formatTime12h(newSlotStartTime)} - ${formatTime12h(newSlotEndTime)}`;

    const newSlot: DaySlotItem = {
      id: `${currentDay.day.toLowerCase()}-${Date.now()}`,
      timeRange: timeRangeStr,
      isActive: true,
      tag: newSlotTag.trim() || undefined,
    };

    setSchedule((prev) =>
      prev.map((item, idx) => {
        if (idx !== selectedDayIndex) return item;
        return {
          ...item,
          slots: [...item.slots, newSlot],
        };
      })
    );

    setNewSlotStartTime("");
    setNewSlotEndTime("");
    setNewSlotTag("");
  };

  const handleCopyMondayToAll = () => {
    const mondayConfig = schedule.find((d) => d.day === "Monday");
    if (!mondayConfig) return;

    setSchedule((prev) =>
      prev.map((item) => ({
        ...item,
        startTime: mondayConfig.startTime,
        endTime: mondayConfig.endTime,
        maxBookingsPerSlot: mondayConfig.maxBookingsPerSlot,
        serviceTypes: mondayConfig.serviceTypes,
        slots: mondayConfig.slots.map((s, i) => ({
          ...s,
          id: `${item.day.toLowerCase()}-${i}`,
        })),
      }))
    );

    setNotice("Monday's slot schedule applied to all 7 days!");
    setTimeout(() => setNotice(null), 3500);
  };

  const handleSetAllOpen = () => {
    setSchedule((prev) => prev.map((item) => ({ ...item, isOpen: true })));
    setNotice("All 7 days marked as open.");
    setTimeout(() => setNotice(null), 3000);
  };

  const handleSetSundayOff = () => {
    setSchedule((prev) =>
      prev.map((item) =>
        item.day === "Sunday" ? { ...item, isOpen: false } : item
      )
    );
    setNotice("Sunday set to closed / day off.");
    setTimeout(() => setNotice(null), 3000);
  };

  const handleResetDefaults = () => {
    setSchedule(DEFAULT_WEEKLY_SCHEDULE);
    setNotice("Reset to default Vaishnavi Beauty weekly slots.");
    setTimeout(() => setNotice(null), 3000);
  };

  const handleSave = () => {
    onSave(schedule);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-md border border-stone-200/80 shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Fixed Header */}
        <div className="p-4 sm:p-6 border-b border-stone-100 flex items-center justify-between shrink-0 bg-white">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#581c3c]" />
              <h2 className="text-lg sm:text-xl font-medium font-serif text-stone-900">
                Weekly Slot Booking Configuration
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 font-normal mt-1">
              Configure open days, operating hours, and bookable time slots from Monday to Sunday.
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

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6 space-y-5 bg-stone-50/40">
          {/* Notice Banner */}
          {notice && (
            <div className="p-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium flex items-center justify-between">
              <span>{notice}</span>
              <button
                type="button"
                onClick={() => setNotice(null)}
                className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Quick Presets Toolbar */}
          <div className="bg-white p-3.5 sm:p-4 rounded-md border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-2.5">
            <span className="text-xs font-medium text-stone-700">Quick Actions:</span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyMondayToAll}
                className="px-3 py-1.5 rounded-md border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-medium cursor-pointer inline-flex items-center gap-1.5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5 text-[#581c3c]" />
                <span>Apply Monday Slots to All Days</span>
              </button>
              <button
                type="button"
                onClick={handleSetAllOpen}
                className="px-3 py-1.5 rounded-md border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-medium cursor-pointer transition-colors"
              >
                All 7 Days Open
              </button>
              <button
                type="button"
                onClick={handleSetSundayOff}
                className="px-3 py-1.5 rounded-md border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-medium cursor-pointer transition-colors"
              >
                Sunday Day Off
              </button>
            </div>
          </div>

          {/* Day of Week Navigation Tabs (Monday through Sunday) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {schedule.map((item, idx) => {
              const isSelected = idx === selectedDayIndex;
              const activeSlotsCount = item.slots.filter((s) => s.isActive).length;

              return (
                <button
                  key={item.day}
                  type="button"
                  onClick={() => setSelectedDayIndex(idx)}
                  className={`p-2.5 rounded-md border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#581c3c] bg-[#581c3c] text-white shadow-xs"
                      : "border-stone-200 bg-white hover:bg-stone-50 text-stone-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium">
                      {item.day.slice(0, 3)}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.isOpen
                          ? isSelected
                            ? "bg-emerald-300"
                            : "bg-emerald-500"
                          : isSelected
                          ? "bg-stone-400"
                          : "bg-stone-300"
                      }`}
                    />
                  </div>
                  <div
                    className={`text-[11px] font-normal mt-1 truncate ${
                      isSelected ? "text-stone-200" : "text-stone-500"
                    }`}
                  >
                    {item.isOpen ? `${activeSlotsCount} slots active` : "Closed"}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Day Detail Card */}
          <div className="bg-white p-5 sm:p-6 rounded-md border border-stone-200 shadow-2xs space-y-5">
            {/* Day Header & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-medium font-serif text-stone-900">
                    {currentDay.day} Schedule & Slots
                  </h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      currentDay.isOpen
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-stone-100 text-stone-600 border-stone-200"
                    }`}
                  >
                    {currentDay.isOpen ? "Open for Bookings" : "Closed / Day Off"}
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-normal mt-0.5">
                  Configure working hours and available appointment windows for {currentDay.day}.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleDayOpen(currentDay.day)}
                  className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium cursor-pointer transition-colors ${
                    currentDay.isOpen
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-stone-200 hover:bg-stone-300 text-stone-700"
                  }`}
                >
                  {currentDay.isOpen ? "Day is Open" : "Mark Day as Open"}
                </button>
              </div>
            </div>

            {currentDay.isOpen ? (
              <div className="space-y-5">
                {/* Working Hours & Capacity */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 p-3.5 rounded-md bg-stone-50 border border-stone-200/80">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Start Time
                    </label>
                    <input
                      type="text"
                      value={currentDay.startTime}
                      onChange={(e) =>
                        setSchedule((prev) =>
                          prev.map((item, idx) =>
                            idx === selectedDayIndex
                              ? { ...item, startTime: e.target.value }
                              : item
                          )
                        )
                      }
                      className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-md text-xs sm:text-sm focus:outline-none focus:border-[#581c3c] font-normal"
                      placeholder="08:00 AM"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      End Time
                    </label>
                    <input
                      type="text"
                      value={currentDay.endTime}
                      onChange={(e) =>
                        setSchedule((prev) =>
                          prev.map((item, idx) =>
                            idx === selectedDayIndex
                              ? { ...item, endTime: e.target.value }
                              : item
                          )
                        )
                      }
                      className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-md text-xs sm:text-sm focus:outline-none focus:border-[#581c3c] font-normal"
                      placeholder="08:30 PM"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Max Clients / Slot
                    </label>
                    <select
                      value={currentDay.maxBookingsPerSlot}
                      onChange={(e) =>
                        setSchedule((prev) =>
                          prev.map((item, idx) =>
                            idx === selectedDayIndex
                              ? { ...item, maxBookingsPerSlot: Number(e.target.value) }
                              : item
                          )
                        )
                      }
                      className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-md text-xs sm:text-sm focus:outline-none focus:border-[#581c3c] font-normal"
                    >
                      <option value={1}>1 Client (Private session)</option>
                      <option value={2}>2 Clients (Bridal + Guest)</option>
                      <option value={3}>3 Clients (Group Saree Draping)</option>
                    </select>
                  </div>
                </div>

                {/* Slot Booking Options Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-stone-900">
                        Bookable Time Slots for {currentDay.day}
                      </h4>
                      <p className="text-[11px] text-stone-500 font-normal">
                        Click on any slot to activate or pause booking. Paused slots won’t show up for customer selection.
                      </p>
                    </div>
                    <span className="text-xs text-stone-500 font-normal">
                      {currentDay.slots.filter((s) => s.isActive).length} of {currentDay.slots.length} active
                    </span>
                  </div>

                  {/* Slots Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentDay.slots.map((slot) => (
                      <div
                        key={slot.id}
                        className={`p-3 rounded-md border flex items-center justify-between gap-3 transition-colors ${
                          slot.isActive
                            ? "bg-stone-50/80 border-stone-200 hover:border-[#581c3c]/50"
                            : "bg-stone-100/60 border-stone-200 text-stone-400 opacity-75"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => handleToggleSlotActive(slot.id)}
                          className="flex items-center gap-2.5 text-left flex-1 cursor-pointer"
                        >
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 text-white transition-colors ${
                              slot.isActive ? "bg-emerald-600" : "bg-stone-300"
                            }`}
                          >
                            {slot.isActive && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <div
                              className={`text-xs sm:text-sm font-medium ${
                                slot.isActive
                                  ? "text-stone-900"
                                  : "text-stone-400 line-through"
                              }`}
                            >
                              {slot.timeRange}
                            </div>
                            {slot.tag && (
                              <div className="text-[11px] text-stone-500 font-normal">
                                {slot.tag}
                              </div>
                            )}
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveSlot(slot.id)}
                          className="p-1 rounded-md text-stone-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                          title="Delete this slot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add New Custom Slot Form */}
                  <form
                    onSubmit={handleAddSlot}
                    className="p-3.5 sm:p-4 rounded-md bg-stone-50 border border-stone-200 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-stone-800">
                        <Clock className="w-3.5 h-3.5 text-[#581c3c]" />
                        <span>Add Custom Slot for {currentDay.day}</span>
                      </div>
                      {slotFormError && (
                        <span className="text-[11px] text-rose-600 font-normal">
                          {slotFormError}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                      {/* Start Time Input */}
                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-medium text-stone-600 mb-1">
                          Start Time <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="time"
                          required
                          value={newSlotStartTime}
                          onChange={(e) => {
                            setNewSlotStartTime(e.target.value);
                            setSlotFormError("");
                          }}
                          className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-md text-xs sm:text-sm focus:outline-none focus:border-[#581c3c] font-normal"
                        />
                      </div>

                      {/* End Time Input */}
                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-medium text-stone-600 mb-1">
                          End Time <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="time"
                          required
                          value={newSlotEndTime}
                          onChange={(e) => {
                            setNewSlotEndTime(e.target.value);
                            setSlotFormError("");
                          }}
                          className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-md text-xs sm:text-sm focus:outline-none focus:border-[#581c3c] font-normal"
                        />
                      </div>

                      {/* Slot Tag */}
                      <div className="sm:col-span-4">
                        <label className="block text-[11px] font-medium text-stone-600 mb-1">
                          Slot Tag (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Bridal Trial / Saree Pre-pleat"
                          value={newSlotTag}
                          onChange={(e) => setNewSlotTag(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-md text-xs sm:text-sm focus:outline-none focus:border-[#581c3c] font-normal"
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="sm:col-span-2">
                        <button
                          type="submit"
                          disabled={!newSlotStartTime || !newSlotEndTime}
                          className="w-full px-3 py-2 bg-[#581c3c] hover:bg-[#481430] disabled:bg-stone-300 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-medium rounded-md cursor-pointer transition-colors inline-flex items-center justify-center gap-1.5 shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Slot</span>
                        </button>
                      </div>
                    </div>

                    {newSlotStartTime && newSlotEndTime && (
                      <div className="text-[11px] text-stone-500 font-normal pt-1 border-t border-stone-200/60 flex items-center gap-1.5">
                        <span>Slot Preview:</span>
                        <span className="font-medium text-[#581c3c]">
                          {formatTime12h(newSlotStartTime)} - {formatTime12h(newSlotEndTime)}
                        </span>
                        {newSlotTag && (
                          <span className="text-stone-400">({newSlotTag})</span>
                        )}
                      </div>
                    )}
                  </form>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center rounded-md bg-stone-50 border border-dashed border-stone-200 space-y-2">
                <AlertCircle className="w-6 h-6 text-stone-400 mx-auto" />
                <div className="text-sm font-medium text-stone-800">
                  {currentDay.day} is marked as Closed / Day Off
                </div>
                <p className="text-xs text-stone-500 font-normal max-w-md mx-auto">
                  No online booking slots will be open for customers on this day.
                  You can mark the day as open at any time.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleToggleDayOpen(currentDay.day)}
                    className="px-4 py-2 rounded-md bg-[#581c3c] text-white text-xs font-medium cursor-pointer hover:bg-[#481430] transition-colors"
                  >
                    Open {currentDay.day} for Bookings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="p-3 sm:px-6 sm:py-3.5 border-t border-stone-100 bg-stone-50/60 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3 py-1.5 text-stone-500 hover:text-stone-800 text-xs font-medium cursor-pointer inline-flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-stone-200 text-stone-700 text-xs sm:text-sm font-medium hover:bg-stone-100 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-md bg-[#581c3c] hover:bg-[#481430] text-white text-xs sm:text-sm font-medium cursor-pointer shadow-2xs transition-colors"
            >
              Save Weekly Slots
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

