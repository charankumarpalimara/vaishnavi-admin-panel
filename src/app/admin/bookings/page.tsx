"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  Phone,
  MessageCircle,
  Home,
  Building2,
  Eye,
  X,
  Printer,
  Plus,
  CreditCard,
} from "lucide-react";
import { useAdmin, BookingRecord } from "../AdminContext";
import { DataTable, ColumnDef } from "@/components/ui";
import {
  SlotBookingModal,
  DEFAULT_WEEKLY_SCHEDULE,
  DayScheduleConfig,
} from "@/components/admin";

export default function BookingsManagementPage() {
  const { bookings, updateBookingStatus } = useAdmin();
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBookingForDetails, setSelectedBookingForDetails] =
    useState<BookingRecord | null>(null);

  // New appointment modal
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [weeklySchedule, setWeeklySchedule] =
    useState<DayScheduleConfig[]>(DEFAULT_WEEKLY_SCHEDULE);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("vaishnavi_admin_weekly_slots");
      if (stored) {
        setWeeklySchedule(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesStatus =
        statusFilter === "all" || b.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesType =
        serviceTypeFilter === "all" || b.serviceType === serviceTypeFilter;
      const matchesSearch =
        searchQuery === "" ||
        b.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.phone.includes(searchQuery) ||
        b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesType && matchesSearch;
    });
  }, [bookings, statusFilter, serviceTypeFilter, searchQuery]);

  // Columns for Table view
  const tableColumns: ColumnDef<BookingRecord>[] = [
    {
      key: "id",
      header: "Booking ID",
      sortable: true,
      render: (b) => (
        <span className="text-xs font-medium text-[#581c3c] bg-rose-50 px-2.5 py-1 rounded-md">
          {b.id}
        </span>
      ),
    },
    {
      key: "clientName",
      header: "Client Name",
      sortable: true,
      sortValue: (b) => b.clientName,
      render: (b) => (
        <div>
          <span className="font-medium text-stone-900 block text-sm sm:text-base">
            {b.clientName}
          </span>
          <a
            href={`tel:${b.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="text-stone-500 hover:text-[#581c3c] text-xs font-normal flex items-center gap-1 mt-0.5"
          >
            <Phone className="w-3 h-3 text-stone-400" />
            <span>{b.phone}</span>
          </a>
        </div>
      ),
    },
    {
      key: "date",
      header: "Date & Time",
      sortable: true,
      sortValue: (b) => b.date,
      render: (b) => (
        <div className="space-y-0.5 text-xs sm:text-sm">
          <div className="font-medium text-stone-800 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#581c3c]" />
            <span>{b.date}</span>
          </div>
          <div className="text-stone-500 text-xs flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>{b.timeSlot}</span>
          </div>
        </div>
      ),
    },
    {
      key: "serviceType",
      header: "Location",
      sortable: true,
      render: (b) => (
        <div className="max-w-xs text-xs sm:text-sm">
          <span className="text-stone-700 font-medium block">
            {b.serviceType === "home" ? "🏠 Doorstep Visit" : "🏢 Studio Visit"}
          </span>
          <span className="text-stone-500 text-xs line-clamp-1">
            {b.address}
          </span>
        </div>
      ),
    },
    {
      key: "services",
      header: "Services",
      render: (b) => (
        <div className="text-xs sm:text-sm max-w-xs">
          <span className="text-stone-800 block line-clamp-2">
            {b.services.map((s) => `${s.title}${s.quantity > 1 ? ` (×${s.quantity})` : ""}`).join(", ")}
          </span>
        </div>
      ),
    },
    {
      key: "totalAmount",
      header: "Amount",
      sortable: true,
      sortValue: (b) => b.totalAmount,
      render: (b) => (
        <span className="font-medium text-[#581c3c] text-sm sm:text-base font-serif">
          ₹{b.totalAmount}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (b) => (
        <span
          className={`text-xs px-2.5 py-1 rounded-md font-medium inline-block ${
            b.status === "Confirmed"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : b.status === "Pending"
              ? "bg-amber-50 text-amber-700 border border-amber-200"
              : b.status === "Completed"
              ? "bg-blue-50 text-blue-700 border border-blue-200"
              : "bg-stone-100 text-stone-500"
          }`}
        >
          {b.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (b) => (
        <div
          className="flex items-center justify-end gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setSelectedBookingForDetails(b)}
            className="p-1.5 rounded-md hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          <a
            href={`https://wa.me/91${b.phone}?text=${encodeURIComponent(
              `Hello ${b.clientName}, Anusha from Vaishnavi Beauty regarding appointment ${b.id}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors"
            title="WhatsApp Client"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
          </a>

          {b.status === "Pending" && (
            <button
              onClick={() => updateBookingStatus(b.id, "Confirmed")}
              className="px-2.5 py-1 rounded-md bg-[#581c3c] hover:bg-[#481430] text-white text-xs font-medium cursor-pointer"
            >
              Confirm
            </button>
          )}

          {b.status === "Confirmed" && (
            <button
              onClick={() => updateBookingStatus(b.id, "Completed")}
              className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium cursor-pointer"
            >
              Done
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium font-serif text-stone-900">
            Bookings & Schedule Management
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-normal mt-1">
            Review, confirm, or update appointments booked by clients in Bahadurpally & nearby.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsNewBookingModalOpen(true)}
            className="px-3.5 py-2 bg-[#581c3c] hover:bg-[#481430] text-white text-xs sm:text-sm font-medium rounded-md shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Appointment</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar (Clean, unboxed) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by client name, mobile, address, or booking ID..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={serviceTypeFilter}
            onChange={(e) => {
              setServiceTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-white border border-stone-200 rounded-md px-3 py-2 text-xs sm:text-sm text-stone-700 focus:outline-none focus:border-[#581c3c] cursor-pointer"
          >
            <option value="all">All Service Types</option>
            <option value="home">🏠 Doorstep Home Visit</option>
            <option value="studio">🏢 Studio Visit</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-white border border-stone-200 rounded-md px-3 py-2 text-xs sm:text-sm text-stone-700 focus:outline-none focus:border-[#581c3c] cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table with Reusable Pagination */}
      <DataTable
        data={filteredBookings}
        columns={tableColumns}
        keyExtractor={(item) => item.id}
        onRowClick={(item) => setSelectedBookingForDetails(item)}
        emptyTitle="No appointments match your filters"
        emptyDescription="Try clearing your search or choosing a different status."
        pagination={{
          currentPage,
          pageSize,
          totalItems: filteredBookings.length,
          onPageChange: setCurrentPage,
          onPageSizeChange: setPageSize,
          pageSizeOptions: [5, 10, 20, 50],
        }}
      />

      {/* Booking Details Modal */}
      {selectedBookingForDetails && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-md border border-stone-200/80 shadow-xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header (Fixed at top) */}
            <div className="flex items-center justify-between p-4 sm:px-6 sm:py-4 border-b border-stone-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-medium text-[#581c3c] bg-rose-50 px-2.5 py-1 rounded-md">
                  {selectedBookingForDetails.id}
                </span>
                <h2 className="text-base sm:text-lg font-medium font-serif text-stone-900">
                  Appointment Details
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBookingForDetails(null)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              {/* Badges / Meta row */}
              <div className="flex items-center gap-2 flex-wrap text-xs font-medium">
                <span
                  className={`px-2.5 py-1 rounded-md ${
                    selectedBookingForDetails.status === "Confirmed"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : selectedBookingForDetails.status === "Pending"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : selectedBookingForDetails.status === "Completed"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "bg-stone-100 text-stone-600"
                  }`}
                >
                  {selectedBookingForDetails.status}
                </span>

                <span
                  className={`px-2.5 py-1 rounded-md inline-flex items-center gap-1 ${
                    selectedBookingForDetails.serviceType === "home"
                      ? "bg-purple-50 text-purple-700 border border-purple-200"
                      : "bg-teal-50 text-teal-700 border border-teal-200"
                  }`}
                >
                  {selectedBookingForDetails.serviceType === "home" ? (
                    <>
                      <Home className="w-3.5 h-3.5" /> Doorstep Home Visit
                    </>
                  ) : (
                    <>
                      <Building2 className="w-3.5 h-3.5" /> Visiting Studio
                    </>
                  )}
                </span>

                <span className="text-stone-400 font-normal ml-auto text-[11px]">
                  Booked {selectedBookingForDetails.createdAt}
                </span>
              </div>

              {/* Client & Schedule info box */}
              <div className="bg-stone-50 p-4 rounded-md border border-stone-200/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-stone-200/60">
                  <div>
                    <div className="text-xs text-stone-400 font-normal">Client Name</div>
                    <div className="text-sm font-medium text-stone-900 mt-0.5">
                      {selectedBookingForDetails.clientName}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${selectedBookingForDetails.phone}`}
                      className="px-2.5 py-1.5 rounded-md bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-normal flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#581c3c]" />
                      <span>{selectedBookingForDetails.phone}</span>
                    </a>
                    <a
                      href={`https://wa.me/91${selectedBookingForDetails.phone}?text=${encodeURIComponent(
                        `Hello ${selectedBookingForDetails.clientName}, Anusha from Vaishnavi Beauty regarding appointment ${selectedBookingForDetails.id}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center gap-1 shadow-2xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-stone-400 font-normal flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#581c3c]" /> Date & Time Slot
                    </div>
                    <div className="text-stone-800 font-medium mt-1">
                      {selectedBookingForDetails.date} • {selectedBookingForDetails.timeSlot}
                    </div>
                  </div>

                  <div>
                    <div className="text-stone-400 font-normal flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#581c3c]" /> Service Location
                    </div>
                    <div className="text-stone-800 font-normal mt-1 leading-relaxed">
                      {selectedBookingForDetails.address}
                    </div>
                  </div>
                </div>

                {selectedBookingForDetails.notes && (
                  <div className="pt-2 border-t border-stone-200/60 text-xs">
                    <span className="text-stone-400 font-normal">Special Requests / Notes: </span>
                    <span className="text-stone-700 font-normal italic">
                      &quot;{selectedBookingForDetails.notes}&quot;
                    </span>
                  </div>
                )}
              </div>

              {/* Services Table */}
              <div className="space-y-2">
                <div className="text-xs font-medium uppercase tracking-wider text-stone-500">
                  Booked Services
                </div>
                <div className="border border-stone-200 rounded-md overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-normal">
                      <tr>
                        <th className="py-2 px-3 font-normal">Service</th>
                        <th className="py-2 px-3 text-center font-normal">Qty</th>
                        <th className="py-2 px-3 text-right font-normal">Price</th>
                        <th className="py-2 px-3 text-right font-normal">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {selectedBookingForDetails.services.map((s, idx) => (
                        <tr key={idx} className="text-stone-700">
                          <td className="py-2.5 px-3 font-medium text-stone-900">{s.title}</td>
                          <td className="py-2.5 px-3 text-center font-normal">{s.quantity}</td>
                          <td className="py-2.5 px-3 text-right font-normal">₹{s.price}</td>
                          <td className="py-2.5 px-3 text-right font-medium text-stone-900">
                            ₹{s.price * s.quantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-stone-50 border-t border-stone-200">
                      <tr>
                        <td colSpan={3} className="py-2.5 px-3 font-medium text-stone-900">
                          Grand Total
                        </td>
                        <td className="py-2.5 px-3 text-right text-sm font-medium text-[#581c3c] font-serif">
                          ₹{selectedBookingForDetails.totalAmount}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* Action Buttons (Fixed at bottom) */}
            <div className="flex items-center justify-between p-3 sm:px-6 sm:py-3.5 border-t border-stone-100 bg-stone-50/60 flex-wrap gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-stone-200 text-stone-700 text-xs font-normal hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-stone-500" />
                  <span>Print Receipt</span>
                </button>
                <Link
                  href="/admin/transactions"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-stone-200 text-stone-700 text-xs font-normal hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5 text-[#581c3c]" />
                  <span>View Payments</span>
                </Link>
              </div>

              <div className="flex items-center gap-2">
                {selectedBookingForDetails.status === "Pending" && (
                  <button
                    type="button"
                    onClick={() => {
                      updateBookingStatus(selectedBookingForDetails.id, "Confirmed");
                      setSelectedBookingForDetails({
                        ...selectedBookingForDetails,
                        status: "Confirmed",
                      });
                    }}
                    className="px-3 py-2 rounded-md bg-[#581c3c] hover:bg-[#481430] text-white text-xs font-medium transition-colors cursor-pointer shadow-2xs"
                  >
                    Confirm Slot
                  </button>
                )}

                {selectedBookingForDetails.status === "Confirmed" && (
                  <button
                    type="button"
                    onClick={() => {
                      updateBookingStatus(selectedBookingForDetails.id, "Completed");
                      setSelectedBookingForDetails({
                        ...selectedBookingForDetails,
                        status: "Completed",
                      });
                    }}
                    className="px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors cursor-pointer shadow-2xs"
                  >
                    Mark as Completed
                  </button>
                )}

                {selectedBookingForDetails.status !== "Cancelled" && (
                  <button
                    type="button"
                    onClick={() => {
                      updateBookingStatus(selectedBookingForDetails.id, "Cancelled");
                      setSelectedBookingForDetails({
                        ...selectedBookingForDetails,
                        status: "Cancelled",
                      });
                    }}
                    className="px-3 py-2 rounded-md border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-normal transition-colors cursor-pointer"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Slot Booking Modal */}
      <SlotBookingModal
        isOpen={isNewBookingModalOpen}
        onClose={() => setIsNewBookingModalOpen(false)}
        weeklySchedule={weeklySchedule}
        onBookingSuccess={() => {
          setIsNewBookingModalOpen(false);
        }}
      />
    </div>
  );
}
