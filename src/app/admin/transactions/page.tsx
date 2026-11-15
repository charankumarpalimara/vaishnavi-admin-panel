"use client";

import React, { useState, useEffect, useMemo, useId } from "react";
import {
  Receipt,
  Search,
  Plus,
  Download,
  CheckCircle2,
  Clock,
  Banknote,
  Smartphone,
  CreditCard,
  Printer,
  MessageCircle,
  X,
  Phone,
  Calendar,
  AlertCircle,
  Trash2,
  Share2,
} from "lucide-react";
import { DataTable, ColumnDef } from "@/components/ui";
import { useAdmin } from "../AdminContext";
import { BUSINESS_INFO } from "@/data/servicesData";

export interface TransactionRecord {
  id: string;
  bookingId?: string;
  clientName: string;
  phone: string;
  date: string;
  time: string;
  serviceSummary: string;
  amount: number;
  paymentMethod: "UPI (GPay / PhonePe)" | "Cash" | "Bank Transfer";
  paymentType: "Full Payment" | "Advance Token (50%)" | "Balance Settlement";
  status: "Completed" | "Pending" | "Refunded";
  referenceNumber?: string;
  notes?: string;
}

const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: "TXN-8492",
    bookingId: "VB-101",
    clientName: "Pooja Reddy",
    phone: "9876543210",
    date: "10 Nov 2026",
    time: "11:45 AM",
    serviceSummary: "Classic Box Pleats Saree Draping + HD Muhurtham Makeup",
    amount: 5398,
    paymentMethod: "UPI (GPay / PhonePe)",
    paymentType: "Full Payment",
    status: "Completed",
    referenceNumber: "UPI-438920194821",
    notes: "GPay transfer to 9618409290 after doorstep session",
  },
  {
    id: "TXN-8491",
    bookingId: "VB-102",
    clientName: "Sravani K.",
    phone: "9988776655",
    date: "10 Nov 2026",
    time: "03:30 PM",
    serviceSummary: "Party Ready Trio (Makeup + Hair + Saree)",
    amount: 2799,
    paymentMethod: "Cash",
    paymentType: "Full Payment",
    status: "Completed",
    notes: "Cash collected at Bahadurpally doorstep",
  },
  {
    id: "TXN-8490",
    bookingId: "VB-103",
    clientName: "Divya Varma",
    phone: "9123456789",
    date: "09 Nov 2026",
    time: "09:15 AM",
    serviceSummary: "Bridal Poola Jada & South Indian Silk Saree Draping",
    amount: 1049,
    paymentMethod: "UPI (GPay / PhonePe)",
    paymentType: "Advance Token (50%)",
    status: "Completed",
    referenceNumber: "UPI-438810294119",
    notes: "50% advance for fresh poola jada booking",
  },
  {
    id: "TXN-8489",
    bookingId: "VB-104",
    clientName: "Lavanya M.",
    phone: "9012345678",
    date: "08 Nov 2026",
    time: "05:40 PM",
    serviceSummary: "Shahnaz Husain 24K Gold Radiance Facial + Honey Wax",
    amount: 1798,
    paymentMethod: "Cash",
    paymentType: "Full Payment",
    status: "Completed",
    notes: "Doorstep visit in Bowrampet",
  },
  {
    id: "TXN-8488",
    bookingId: "VB-105",
    clientName: "Ananya Rao",
    phone: "9849011223",
    date: "11 Nov 2026",
    time: "10:00 AM",
    serviceSummary: "Lehenga Dupatta Styling & Double Draping + Glam Makeup",
    amount: 2348,
    paymentMethod: "UPI (GPay / PhonePe)",
    paymentType: "Full Payment",
    status: "Pending",
    notes: "Payment due upon doorstep completion in Gandimaisamma",
  },
  {
    id: "TXN-8487",
    clientName: "Deepika Sharma",
    phone: "9871234560",
    date: "07 Nov 2026",
    time: "02:15 PM",
    serviceSummary: "Pre-Bridal Charcoal Facial & Arms Waxing",
    amount: 1499,
    paymentMethod: "UPI (GPay / PhonePe)",
    paymentType: "Full Payment",
    status: "Completed",
    referenceNumber: "UPI-438729103982",
  },
  {
    id: "TXN-8486",
    clientName: "Kavitha N.",
    phone: "9812345671",
    date: "06 Nov 2026",
    time: "12:30 PM",
    serviceSummary: "Silk Saree Ironing & Box Pleating Service",
    amount: 399,
    paymentMethod: "Cash",
    paymentType: "Full Payment",
    status: "Completed",
  },
  {
    id: "TXN-8485",
    clientName: "Swapna V.",
    phone: "9988112233",
    date: "05 Nov 2026",
    time: "06:00 PM",
    serviceSummary: "Engagement HD Makeup Trial",
    amount: 800,
    paymentMethod: "UPI (GPay / PhonePe)",
    paymentType: "Balance Settlement",
    status: "Completed",
    referenceNumber: "UPI-438510293810",
  },
];

const LOCAL_STORAGE_TRANSACTIONS = "vaishnavi_admin_transactions";

export default function TransactionsManagementPage() {
  const { bookings } = useAdmin();
  const searchInputId = useId();

  const [transactions, setTransactions] = useState<TransactionRecord[]>(
    INITIAL_TRANSACTIONS
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals state
  const [selectedTxnForReceipt, setSelectedTxnForReceipt] =
    useState<TransactionRecord | null>(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [txnToDelete, setTxnToDelete] = useState<TransactionRecord | null>(null);

  // New transaction form state
  const [formClientName, setFormClientName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formBookingId, setFormBookingId] = useState("");
  const [formMethod, setFormMethod] =
    useState<TransactionRecord["paymentMethod"]>("UPI (GPay / PhonePe)");
  const [formType, setFormType] =
    useState<TransactionRecord["paymentType"]>("Full Payment");
  const [formStatus, setFormStatus] =
    useState<TransactionRecord["status"]>("Completed");
  const [formRefNumber, setFormRefNumber] = useState("");
  const [formServiceSummary, setFormServiceSummary] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formError, setFormError] = useState("");

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_TRANSACTIONS);
      if (stored) {
        setTransactions(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveTransactionsToStorage = (updated: TransactionRecord[]) => {
    setTransactions(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_TRANSACTIONS, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      const matchesStatus =
        statusFilter === "all" ||
        txn.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesMethod =
        methodFilter === "all" ||
        txn.paymentMethod.toLowerCase().includes(methodFilter.toLowerCase());

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === "" ||
        txn.id.toLowerCase().includes(query) ||
        (txn.bookingId && txn.bookingId.toLowerCase().includes(query)) ||
        txn.clientName.toLowerCase().includes(query) ||
        txn.phone.includes(query) ||
        (txn.referenceNumber &&
          txn.referenceNumber.toLowerCase().includes(query)) ||
        txn.serviceSummary.toLowerCase().includes(query);

      return matchesStatus && matchesMethod && matchesSearch;
    });
  }, [transactions, statusFilter, methodFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const completedList = transactions.filter((t) => t.status === "Completed");
    const totalCollected = completedList.reduce((sum, t) => sum + t.amount, 0);

    const upiList = completedList.filter(
      (t) => t.paymentMethod === "UPI (GPay / PhonePe)"
    );
    const upiTotal = upiList.reduce((sum, t) => sum + t.amount, 0);

    const cashList = completedList.filter((t) => t.paymentMethod === "Cash");
    const cashTotal = cashList.reduce((sum, t) => sum + t.amount, 0);

    const pendingList = transactions.filter((t) => t.status === "Pending");
    const pendingTotal = pendingList.reduce((sum, t) => sum + t.amount, 0);

    return {
      totalCollected,
      completedCount: completedList.length,
      upiTotal,
      upiCount: upiList.length,
      cashTotal,
      cashCount: cashList.length,
      pendingTotal,
      pendingCount: pendingList.length,
    };
  }, [transactions]);

  // Handle Mark as Completed
  const handleMarkAsCompleted = (txnId: string) => {
    const updated = transactions.map((t) =>
      t.id === txnId ? { ...t, status: "Completed" as const } : t
    );
    saveTransactionsToStorage(updated);
    showToast(`Transaction ${txnId} marked as completed.`);
  };

  // Handle Delete Transaction
  const handleConfirmDelete = () => {
    if (!txnToDelete) return;
    const updated = transactions.filter((t) => t.id !== txnToDelete.id);
    saveTransactionsToStorage(updated);
    showToast(`Transaction ${txnToDelete.id} removed.`);
    setTxnToDelete(null);
  };

  // Handle Record New Transaction
  const handleSaveNewTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formClientName.trim()) {
      setFormError("Please enter client name.");
      return;
    }

    if (!formPhone.trim() || formPhone.replace(/\D/g, "").length < 10) {
      setFormError("Please enter a valid 10-digit mobile number.");
      return;
    }

    const numAmount = Number(formAmount);
    if (!formAmount || isNaN(numAmount) || numAmount <= 0) {
      setFormError("Please enter a valid amount (₹).");
      return;
    }

    const now = new Date();
    const dateFormatted = now.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const timeFormatted = now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const newTxn: TransactionRecord = {
      id: `TXN-${Math.floor(8000 + Math.random() * 1900)}`,
      bookingId: formBookingId.trim() || undefined,
      clientName: formClientName.trim(),
      phone: formPhone.trim(),
      date: dateFormatted,
      time: timeFormatted,
      serviceSummary:
        formServiceSummary.trim() || "Vaishnavi Beauty & Bridal Service",
      amount: numAmount,
      paymentMethod: formMethod,
      paymentType: formType,
      status: formStatus,
      referenceNumber: formRefNumber.trim() || undefined,
      notes: formNotes.trim() || undefined,
    };

    const updated = [newTxn, ...transactions];
    saveTransactionsToStorage(updated);

    showToast(`Payment ${newTxn.id} recorded successfully.`);
    setIsRecordModalOpen(false);

    // Reset form
    setFormClientName("");
    setFormPhone("");
    setFormAmount("");
    setFormBookingId("");
    setFormRefNumber("");
    setFormServiceSummary("");
    setFormNotes("");
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "Transaction ID",
      "Booking ID",
      "Client Name",
      "Phone",
      "Date",
      "Time",
      "Service",
      "Amount",
      "Payment Method",
      "Type",
      "Status",
      "UPI Reference",
    ];

    const rows = filteredTransactions.map((t) => [
      t.id,
      t.bookingId || "—",
      `"${t.clientName.replace(/"/g, '""')}"`,
      t.phone,
      t.date,
      t.time,
      `"${t.serviceSummary.replace(/"/g, '""')}"`,
      t.amount,
      `"${t.paymentMethod}"`,
      `"${t.paymentType}"`,
      t.status,
      t.referenceNumber || "—",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `vaishnavi_beauty_transactions_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Columns definition for DataTable
  const columns: ColumnDef<TransactionRecord>[] = [
    {
      key: "id",
      header: "Txn ID",
      sortable: true,
      sortValue: (t) => t.id,
      render: (t) => (
        <div>
          <button
            type="button"
            onClick={() => setSelectedTxnForReceipt(t)}
            className="font-medium text-[#581c3c] hover:underline font-mono text-xs sm:text-sm cursor-pointer"
          >
            {t.id}
          </button>
          {t.bookingId && (
            <span className="block text-[11px] text-stone-400 font-mono">
              Ref: {t.bookingId}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "clientName",
      header: "Client & Contact",
      sortable: true,
      sortValue: (t) => t.clientName,
      render: (t) => (
        <div>
          <span className="font-medium text-stone-900 block text-xs sm:text-sm">
            {t.clientName}
          </span>
          <a
            href={`tel:${t.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="text-stone-500 hover:text-[#581c3c] text-[11px] font-normal flex items-center gap-1 mt-0.5"
          >
            <Phone className="w-3 h-3 text-stone-400" />
            <span>{t.phone}</span>
          </a>
        </div>
      ),
    },
    {
      key: "date",
      header: "Date & Time",
      sortable: true,
      sortValue: (t) => t.date,
      render: (t) => (
        <div className="space-y-0.5 text-xs">
          <div className="font-medium text-stone-800 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#581c3c]" />
            <span>{t.date}</span>
          </div>
          <div className="text-stone-400 text-[11px] flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            <span>{t.time}</span>
          </div>
        </div>
      ),
    },
    {
      key: "serviceSummary",
      header: "Service Details",
      render: (t) => (
        <div className="max-w-xs text-xs">
          <span className="text-stone-800 font-normal line-clamp-1">
            {t.serviceSummary}
          </span>
          <span className="text-stone-400 text-[11px] block mt-0.5">
            {t.paymentType}
          </span>
        </div>
      ),
    },
    {
      key: "paymentMethod",
      header: "Payment Method",
      sortable: true,
      sortValue: (t) => t.paymentMethod,
      render: (t) => {
        const isUpi = t.paymentMethod.includes("UPI");
        const isCash = t.paymentMethod.includes("Cash");
        return (
          <div className="text-xs">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${isUpi
                ? "bg-purple-50 text-purple-800 border-purple-200"
                : isCash
                  ? "bg-amber-50 text-amber-800 border-amber-200"
                  : "bg-blue-50 text-blue-800 border-blue-200"
                }`}
            >
              {isUpi && <Smartphone className="w-3 h-3" />}
              {isCash && <Banknote className="w-3 h-3" />}
              {!isUpi && !isCash && <CreditCard className="w-3 h-3" />}
              <span>{t.paymentMethod}</span>
            </span>
            {t.referenceNumber && (
              <span className="block text-[10px] text-stone-400 font-mono mt-0.5 truncate max-w-[140px]">
                {t.referenceNumber}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "amount",
      header: "Amount",
      sortable: true,
      sortValue: (t) => t.amount,
      render: (t) => (
        <span className="text-xs sm:text-sm font-medium font-serif text-stone-900">
          ₹{t.amount.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      sortValue: (t) => t.status,
      render: (t) => {
        const isCompleted = t.status === "Completed";
        const isPending = t.status === "Pending";
        return (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${isCompleted
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : isPending
                ? "bg-amber-50 text-amber-800 border-amber-200"
                : "bg-rose-50 text-rose-800 border-rose-200"
              }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${isCompleted
                ? "bg-emerald-500"
                : isPending
                  ? "bg-amber-500"
                  : "bg-rose-500"
                }`}
            />
            <span>{t.status}</span>
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (t) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedTxnForReceipt(t)}
            className="px-2 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer inline-flex items-center gap-1 text-xs font-medium"
            title="View Receipt"
          >
            <Receipt className="w-3.5 h-3.5 text-[#581c3c]" />
            <span>Receipt</span>
          </button>

          {t.status === "Pending" && (
            <button
              type="button"
              onClick={() => handleMarkAsCompleted(t.id)}
              className="px-2 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors cursor-pointer inline-flex items-center gap-1 text-xs font-medium"
              title="Mark as Paid"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Paid</span>
            </button>
          )}

          {/* <button
            type="button"
            onClick={() => setTxnToDelete(t)}
            className="p-1 rounded-md hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
            title="Delete Record"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button> */}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title & Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium font-serif text-stone-900">
            Transactions & Settlements
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-normal mt-1">
            Track UPI digital transfers, doorstep cash settlements, and customer receipts in Bahadurpally.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-md border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs sm:text-sm font-medium flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
          >
            <Download className="w-4 h-4 text-stone-500" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setIsRecordModalOpen(true)}
            className="px-3.5 py-2 rounded-md bg-[#581c3c] hover:bg-[#481430] text-white text-xs sm:text-sm font-medium flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Toast message */}
      {toastMessage && (
        <div className="p-3.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Collected */}
        <div className="bg-white p-5 rounded-md border border-stone-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-500 font-normal">
              Total Collected
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-medium font-serif text-stone-900">
            ₹{stats.totalCollected.toLocaleString("en-IN")}
          </div>
          <p className="text-[11px] text-stone-500 font-normal">
            {stats.completedCount} successful settlements
          </p>
        </div>

        {/* UPI Payments */}
        <div className="bg-white p-5 rounded-md border border-stone-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-500 font-normal">
              UPI (GPay / PhonePe)
            </span>
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-medium font-serif text-stone-900">
            ₹{stats.upiTotal.toLocaleString("en-IN")}
          </div>
          <p className="text-[11px] text-stone-500 font-normal">
            {stats.upiCount} digital transactions
          </p>
        </div>

        {/* Cash Collections */}
        <div className="bg-white p-5 rounded-md border border-stone-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-500 font-normal">
              Cash on Delivery
            </span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-medium font-serif text-stone-900">
            ₹{stats.cashTotal.toLocaleString("en-IN")}
          </div>
          <p className="text-[11px] text-stone-500 font-normal">
            {stats.cashCount} doorstep collections
          </p>
        </div>

        {/* Pending Settlements */}
        <div className="bg-white p-5 rounded-md border border-stone-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-500 font-normal">
              Pending Settlements
            </span>
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-medium font-serif text-stone-900">
            ₹{stats.pendingTotal.toLocaleString("en-IN")}
          </div>
          <p className="text-[11px] text-stone-500 font-normal">
            {stats.pendingCount} pending balance collections
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-md border border-stone-200/80 shadow-2xs">
        {/* Search */}
        <div className="relative flex-1">
          <label htmlFor={searchInputId} className="sr-only">
            Search transactions
          </label>
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id={searchInputId}
            type="text"
            placeholder="Search by client name, mobile, TXN ID, or UPI reference..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal text-stone-700"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed (Paid)</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
          </select>

          <select
            value={methodFilter}
            onChange={(e) => {
              setMethodFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal text-stone-700"
          >
            <option value="all">All Payment Methods</option>
            <option value="upi">UPI (GPay / PhonePe)</option>
            <option value="cash">Cash on Delivery</option>
            <option value="bank">Bank Transfer</option>
          </select>
        </div>
      </div>

      {/* Main Transactions Table */}
      <DataTable
        columns={columns}
        data={filteredTransactions}
        keyExtractor={(t) => t.id}
        emptyTitle="No transactions found"
        emptyDescription="No transactions match your search or filter criteria."
        pagination={{
          currentPage,
          pageSize,
          totalItems: filteredTransactions.length,
          onPageChange: setCurrentPage,
          onPageSizeChange: setPageSize,
          pageSizeOptions: [5, 10, 20, 50],
        }}
      />

      {/* RECEIPT MODAL */}
      {selectedTxnForReceipt && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-md border border-stone-200/80 shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#581c3c]" />
                <div>
                  <h2 className="text-base sm:text-lg font-medium font-serif text-stone-900">
                    Payment Receipt
                  </h2>
                  <p className="text-xs text-stone-400 font-mono">
                    {selectedTxnForReceipt.id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTxnForReceipt(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Receipt Body */}
            <div
              id="printable-receipt"
              className="flex-1 overflow-y-auto min-h-0 p-5 sm:p-6 space-y-4 text-xs sm:text-sm bg-white"
            >
              {/* Salon Header */}
              <div className="text-center pb-4 border-b border-stone-100 space-y-1">
                <div className="text-base sm:text-lg font-medium font-serif text-stone-900">
                  {BUSINESS_INFO.name}
                </div>
                <div className="text-stone-500 font-normal text-xs">
                  Lead Artist: {BUSINESS_INFO.leadArtist}
                </div>
                <div className="text-stone-400 font-normal text-[11px]">
                  {BUSINESS_INFO.address}
                </div>
                <div className="text-stone-400 font-normal text-[11px]">
                  Phone: {BUSINESS_INFO.phone1} / {BUSINESS_INFO.phone2}
                </div>
              </div>

              {/* Client & Date Info */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-md bg-stone-50 border border-stone-200/80">
                <div>
                  <span className="text-[11px] text-stone-400 block font-normal">
                    Billed To:
                  </span>
                  <span className="font-medium text-stone-900 block">
                    {selectedTxnForReceipt.clientName}
                  </span>
                  <span className="text-stone-500 text-[11px] font-normal">
                    {selectedTxnForReceipt.phone}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-stone-400 block font-normal">
                    Receipt Details:
                  </span>
                  <span className="font-medium text-stone-800 block">
                    {selectedTxnForReceipt.date}
                  </span>
                  <span className="text-stone-500 text-[11px] font-normal">
                    {selectedTxnForReceipt.time}
                  </span>
                </div>
              </div>

              {/* Service & Payment breakdown */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-medium text-stone-700">
                  Service Description
                </div>
                <div className="p-3 rounded-md border border-stone-200 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-normal text-stone-800">
                      {selectedTxnForReceipt.serviceSummary}
                    </span>
                    <span className="font-medium text-stone-900 font-serif shrink-0">
                      ₹{selectedTxnForReceipt.amount}
                    </span>
                  </div>
                  {selectedTxnForReceipt.bookingId && (
                    <div className="text-[11px] text-stone-400 font-normal">
                      Booking Reference: {selectedTxnForReceipt.bookingId}
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Details */}
              <div className="space-y-1.5 pt-2 border-t border-stone-100 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 font-normal">Payment Method</span>
                  <span className="font-medium text-stone-800">
                    {selectedTxnForReceipt.paymentMethod}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 font-normal">Payment Type</span>
                  <span className="font-medium text-stone-800">
                    {selectedTxnForReceipt.paymentType}
                  </span>
                </div>
                {selectedTxnForReceipt.referenceNumber && (
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 font-normal">UPI Reference</span>
                    <span className="font-mono text-stone-700 text-[11px]">
                      {selectedTxnForReceipt.referenceNumber}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 font-normal">Payment Status</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-medium border ${selectedTxnForReceipt.status === "Completed"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}
                  >
                    {selectedTxnForReceipt.status}
                  </span>
                </div>
              </div>

              {/* Total Row */}
              <div className="p-3 rounded-md bg-[#581c3c]/5 border border-[#581c3c]/20 flex items-center justify-between">
                <span className="font-medium text-[#581c3c]">Total Amount Paid</span>
                <span className="text-lg font-medium font-serif text-[#581c3c]">
                  ₹{selectedTxnForReceipt.amount.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Footer Note */}
              <p className="text-center text-[11px] text-stone-400 font-normal pt-2">
                Thank you for trusting Vaishnavi Beauty Services! For queries or next appointments, WhatsApp Anusha directly.
              </p>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-3 sm:px-6 sm:py-3.5 border-t border-stone-100 bg-stone-50/60 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded-md border border-stone-200 text-stone-700 text-xs font-medium hover:bg-stone-100 cursor-pointer inline-flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/91${selectedTxnForReceipt.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                    `*🌸 VAISHNAVI BEAUTY SERVICES - PAYMENT RECEIPT 🌸*\n\nReceipt ID: ${selectedTxnForReceipt.id}\nClient: ${selectedTxnForReceipt.clientName}\nService: ${selectedTxnForReceipt.serviceSummary}\nAmount: ₹${selectedTxnForReceipt.amount}\nMode: ${selectedTxnForReceipt.paymentMethod}\nStatus: ${selectedTxnForReceipt.status}\n\nThank you for choosing us!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium cursor-pointer inline-flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Receipt</span>
                </a>

                <button
                  type="button"
                  onClick={() => setSelectedTxnForReceipt(null)}
                  className="px-4 py-1.5 rounded-md border border-stone-200 text-stone-700 text-xs font-medium hover:bg-stone-100 cursor-pointer transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RECORD PAYMENT MODAL */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-md border border-stone-200/80 shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#581c3c]" />
                <h2 className="text-base sm:text-lg font-medium font-serif text-stone-900">
                  Record New Payment
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsRecordModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <div className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form
                id="record-payment-form"
                onSubmit={handleSaveNewTransaction}
                className="space-y-3.5"
              >
                {/* Client Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Client Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pooja Reddy"
                      value={formClientName}
                      onChange={(e) => setFormClientName(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 98765 43210"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal"
                    />
                  </div>
                </div>

                {/* Amount & Link to Booking */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Amount (₹) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 2799"
                      value={formAmount}
                      onChange={(e) => setFormAmount(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal font-serif"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Booking Reference (Optional)
                    </label>
                    <select
                      value={formBookingId}
                      onChange={(e) => {
                        const bId = e.target.value;
                        setFormBookingId(bId);
                        const match = bookings.find((b) => b.id === bId);
                        if (match) {
                          setFormClientName(match.clientName);
                          setFormPhone(match.phone);
                          setFormAmount(String(match.totalAmount));
                          setFormServiceSummary(
                            match.services.map((s) => s.title).join(", ")
                          );
                        }
                      }}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal"
                    >
                      <option value="">Select existing booking...</option>
                      {bookings.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.id} — {b.clientName} (₹{b.totalAmount})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Payment Method & Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Payment Method
                    </label>
                    <select
                      value={formMethod}
                      onChange={(e) =>
                        setFormMethod(
                          e.target.value as TransactionRecord["paymentMethod"]
                        )
                      }
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal"
                    >
                      <option value="UPI (GPay / PhonePe)">
                        UPI (GPay / PhonePe)
                      </option>
                      <option value="Cash">Cash on Delivery</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Payment Type
                    </label>
                    <select
                      value={formType}
                      onChange={(e) =>
                        setFormType(
                          e.target.value as TransactionRecord["paymentType"]
                        )
                      }
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal"
                    >
                      <option value="Full Payment">Full Payment</option>
                      <option value="Advance Token (50%)">
                        Advance Token (50%)
                      </option>
                      <option value="Balance Settlement">
                        Balance Settlement
                      </option>
                    </select>
                  </div>
                </div>

                {/* UPI Ref Number & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      UPI Ref / Cheque No. (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. UPI-438920194821"
                      value={formRefNumber}
                      onChange={(e) => setFormRefNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formStatus}
                      onChange={(e) =>
                        setFormStatus(
                          e.target.value as TransactionRecord["status"]
                        )
                      }
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal"
                    >
                      <option value="Completed">Completed (Paid)</option>
                      <option value="Pending">Pending</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </div>
                </div>

                {/* Service Summary */}
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Service Summary
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Party Ready Trio (Makeup + Hair + Saree)"
                    value={formServiceSummary}
                    onChange={(e) => setFormServiceSummary(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Paid via PhonePe scanner at studio"
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#581c3c] font-normal"
                  />
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:px-6 sm:py-3.5 border-t border-stone-100 bg-stone-50/60 flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsRecordModalOpen(false)}
                className="px-4 py-2 rounded-md border border-stone-200 text-stone-700 text-xs sm:text-sm font-medium hover:bg-stone-100 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="record-payment-form"
                className="px-4 py-2 rounded-md bg-[#581c3c] hover:bg-[#481430] text-white text-xs sm:text-sm font-medium cursor-pointer shadow-2xs transition-colors"
              >
                Save Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {txnToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-md border border-stone-200/80 shadow-xl max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h3 className="text-base font-medium text-stone-900">
                Delete Transaction Record?
              </h3>
            </div>
            <p className="text-xs text-stone-600 font-normal">
              Are you sure you want to delete{" "}
              <span className="font-medium text-stone-800">
                {txnToDelete.id}
              </span>{" "}
              (₹{txnToDelete.amount} for {txnToDelete.clientName})? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setTxnToDelete(null)}
                className="px-3.5 py-1.5 rounded-md border border-stone-200 text-stone-700 text-xs font-medium hover:bg-stone-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-3.5 py-1.5 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium cursor-pointer shadow-2xs"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
