import React, { useContext, useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../auth/AuthContext";
import Swal from "sweetalert2";
import Spinner from "../home/components/Spinner";
import {
  Calendar,
  Clock,
  MapPin,
  Building,
  User,
  Phone,
  Eye,
  Edit3,
  Trash2,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  Layers,
  ArrowRight,
  X,
  CreditCard,
  Tag,
  ShieldCheck,
  Users,
} from "lucide-react";

const MyBookings = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [statusTab, setStatusTab] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Modals
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Edit Form State
  const [editFormData, setEditFormData] = useState({
    eventDate: "",
    startTime: "16:00",
    endTime: "22:00",
    venueName: "",
    venueAddress: "",
    guestCountEstimate: "100",
    contact: "",
    specialInstructions: "",
  });

  // Load Bookings
  const loadBookings = useCallback(async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const res = await axiosSecure.get(`/bookings/user/${user.email}`);
      const list = res.data?.data || res.data || [];
      setBookings(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to load customer bookings:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure, user?.email]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: bookings.length,
      confirmed: bookings.filter((b) => ["confirmed", "in_progress", "Assigned", "Planning", "Equipping", "On Way", "Setting up"].includes(b.status)).length,
      completed: bookings.filter((b) => ["completed", "Completed"].includes(b.status)).length,
      pending: bookings.filter((b) => ["pending", "unpaid"].includes(b.status) || b.paymentStatus === "unpaid").length,
    };
  }, [bookings]);

  // Filtered & Sorted Bookings
  const filteredBookings = useMemo(() => {
    return bookings
      .filter((b) => {
        // Status Filter
        if (statusTab !== "all") {
          const currentStatus = String(b.status || "").toLowerCase();
          if (statusTab === "confirmed") {
            if (!["confirmed", "assigned", "planning", "equipping", "on way", "setting up"].includes(currentStatus)) return false;
          } else if (statusTab === "in_progress") {
            if (!["in_progress", "planning", "equipping", "on way", "setting up"].includes(currentStatus)) return false;
          } else if (statusTab === "completed") {
            if (currentStatus !== "completed") return false;
          } else if (statusTab === "pending") {
            if (currentStatus !== "pending") return false;
          } else if (statusTab === "cancelled") {
            if (currentStatus !== "cancelled") return false;
          }
        }

        // Search Filter
        if (searchText.trim()) {
          const q = searchText.toLowerCase();
          const code = (b.bookingCode || "").toLowerCase();
          const title = (b.serviceSnapshot?.title || b.serviceName || "").toLowerCase();
          const venue = (b.eventDetails?.venueName || b.location || "").toLowerCase();
          const address = (b.eventDetails?.venueAddress || "").toLowerCase();
          const decName = (b.decorator?.businessName || "").toLowerCase();

          if (!code.includes(q) && !title.includes(q) && !venue.includes(q) && !address.includes(q) && !decName.includes(q)) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "eventDate_asc") {
          const dateA = new Date(a.eventDetails?.eventDate || a.bookingDate || 0);
          const dateB = new Date(b.eventDetails?.eventDate || b.bookingDate || 0);
          return dateA - dateB;
        }
        if (sortBy === "eventDate_desc") {
          const dateA = new Date(a.eventDetails?.eventDate || a.bookingDate || 0);
          const dateB = new Date(b.eventDetails?.eventDate || b.bookingDate || 0);
          return dateB - dateA;
        }
        if (sortBy === "amount_desc") {
          const amtA = a.pricingBreakdown?.grandTotal || a.totalCost || 0;
          const amtB = b.pricingBreakdown?.grandTotal || b.totalCost || 0;
          return amtB - amtA;
        }
        if (sortBy === "amount_asc") {
          const amtA = a.pricingBreakdown?.grandTotal || a.totalCost || 0;
          const amtB = b.pricingBreakdown?.grandTotal || b.totalCost || 0;
          return amtA - amtB;
        }
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [bookings, statusTab, searchText, sortBy]);

  // Open View Modal
  const handleOpenView = (b) => {
    setSelectedBooking(b);
    setIsViewModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (b) => {
    setSelectedBooking(b);
    const dateVal = b.eventDetails?.eventDate
      ? new Date(b.eventDetails.eventDate).toISOString().split("T")[0]
      : b.bookingDate || "";

    setEditFormData({
      eventDate: dateVal,
      startTime: b.eventDetails?.startTime || "16:00",
      endTime: b.eventDetails?.endTime || "22:00",
      venueName: b.eventDetails?.venueName || b.location || "",
      venueAddress: b.eventDetails?.venueAddress || b.location || "",
      guestCountEstimate: String(b.eventDetails?.guestCountEstimate || "100"),
      contact: b.contact || user?.phone || "",
      specialInstructions: b.eventDetails?.specialInstructions || "",
    });
    setIsEditModalOpen(true);
  };

  // Submit Edit Form
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!selectedBooking?._id) return;

    try {
      const payload = {
        eventDate: editFormData.eventDate,
        startTime: editFormData.startTime,
        endTime: editFormData.endTime,
        venueName: editFormData.venueName.trim(),
        venueAddress: editFormData.venueAddress.trim(),
        guestCountEstimate: Number(editFormData.guestCountEstimate),
        contact: editFormData.contact.trim(),
        specialInstructions: editFormData.specialInstructions.trim(),
      };

      await axiosSecure.patch(`/bookings/${selectedBooking._id}`, payload);
      Swal.fire({
        icon: "success",
        title: "Booking Updated",
        text: "Your event logistics and contact details have been saved.",
        timer: 1500,
        showConfirmButton: false,
      });

      setIsEditModalOpen(false);
      loadBookings();
    } catch (err) {
      console.error("Failed to update booking:", err);
      Swal.fire("Error", err.response?.data?.message || "Failed to update booking.", "error");
    }
  };

  // Delete / Cancel Booking
  const handleDeleteBooking = async (b) => {
    const isCompleted = ["completed", "Completed"].includes(b.status);
    const confirm = await Swal.fire({
      title: isCompleted ? "Remove Booking Record?" : "Cancel Event Booking?",
      text: `Are you sure you want to ${isCompleted ? "remove this booking record" : "cancel this booking"} (${b.bookingCode || b.serviceName})?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: isCompleted ? "Yes, Delete" : "Yes, Cancel Booking",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.delete(`/bookings/${b._id}`);
      Swal.fire({
        icon: "success",
        title: "Cancelled",
        text: "The booking has been successfully removed.",
        timer: 1500,
        showConfirmButton: false,
      });
      loadBookings();
    } catch (err) {
      console.error("Failed to delete booking:", err);
      Swal.fire("Error", "Failed to cancel booking. Please try again.", "error");
    }
  };

  // Status Badge Helper supporting full lifecycle
  const renderStatusBadge = (status) => {
    const s = String(status || "").toLowerCase();
    switch (s) {
      case "in_draft":
      case "draft":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 uppercase">
            In Draft
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 uppercase">
            <AlertCircle className="w-3 h-3" /> Pending
          </span>
        );
      case "accepted":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 uppercase">
            <CheckCircle2 className="w-3 h-3" /> Accepted
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 uppercase">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      case "advance paid":
      case "advance_paid":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-cyan-100 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 uppercase">
            <CreditCard className="w-3 h-3" /> Advance Paid
          </span>
        );
      case "preparing":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 uppercase">
            <Sparkles className="w-3 h-3" /> Preparing
          </span>
        );
      case "on the way":
      case "on_the_way":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800 uppercase">
            <Clock className="w-3 h-3" /> On The Way
          </span>
        );
      case "inprogress":
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 uppercase">
            <Clock className="w-3 h-3" /> In Progress
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 uppercase">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </span>
        );
      case "fully paid":
      case "fully_paid":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 uppercase">
            <ShieldCheck className="w-3 h-3" /> Fully Paid
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase">
            {status}
          </span>
        );
    }
  };

  // Payment Badge Helper
  const renderPaymentBadge = (b) => {
    const pStatus = b.paymentStatus || (b.paid ? "paid" : "unpaid");
    if (pStatus === "paid") {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 uppercase">
          Paid
        </span>
      );
    }
    if (pStatus === "partially_paid") {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 uppercase">
          Partial
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900 uppercase">
        Unpaid
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 animate-fade-in space-y-8">
      {/* ================= Header Banner ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Calendar className="w-3.5 h-3.5" /> Event Reservations
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            My Bookings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Track all your scheduled event setups, monitor assigned decorator agencies, and manage venue logistics.
          </p>
        </div>

        <Link
          to="/services"
          className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/25 transition-all cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4" /> Book New Service
        </Link>
      </div>

      {/* ================= KPI Summary Metric Cards ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Total Bookings
          </span>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {stats.total}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Confirmed / Active
          </span>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
            {stats.confirmed}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Completed Events
          </span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {stats.completed}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
            Pending / Awaiting
          </span>
          <p className="text-2xl font-black text-amber-500">
            {stats.pending}
          </p>
        </div>
      </div>

      {/* ================= Filter Controls & Search ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          {[
            { id: "all", label: "All Bookings", count: stats.total },
            { id: "confirmed", label: "Confirmed", count: stats.confirmed },
            { id: "completed", label: "Completed", count: stats.completed },
            { id: "pending", label: "Pending", count: stats.pending },
          ].map((tab) => {
            const isSelected = statusTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusTab(tab.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isSelected ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by code, service name, or venue..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-400 shrink-0">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="eventDate_asc">Event Date: Earliest First</option>
              <option value="eventDate_desc">Event Date: Latest First</option>
              <option value="amount_desc">Amount: High to Low</option>
              <option value="amount_asc">Amount: Low to High</option>
            </select>
          </div>
        </div>
      </div>

      {/* ================= Bookings Data Table ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-20 flex items-center justify-center">
            <Spinner />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No Bookings Found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You don't have any bookings matching this criteria. Browse our decoration packages and book your next celebration!
            </p>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 cursor-pointer shadow-md shadow-purple-600/25"
            >
              <Sparkles className="w-3.5 h-3.5" /> Explore Services
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
                  <th className="py-4 px-5">Booking Code</th>
                  <th className="py-4 px-4">Service & Package</th>
                  <th className="py-4 px-4">Decorator Agency</th>
                  <th className="py-4 px-4">Event Date & Venue</th>
                  <th className="py-4 px-4">Total (৳)</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Payment</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredBookings.map((b) => {
                  const code = b.bookingCode || `BK-${b._id.slice(-6).toUpperCase()}`;
                  const title = b.serviceSnapshot?.title || b.serviceName || "Decoration Setup";
                  const pkgTier = b.serviceSnapshot?.selectedPackage || "Standard Package";
                  const agencyName = b.decorator?.businessName || "StyleDecor Agency";
                  const agencyCity = b.decorator?.contactInfo?.city || "Dhaka";
                  const rawDate = b.eventDetails?.eventDate || b.bookingDate;
                  const dateStr = rawDate
                    ? new Date(rawDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "TBD";
                  const venue = b.eventDetails?.venueName || b.location || "Venue TBD";
                  const total = b.pricingBreakdown?.grandTotal || b.totalCost || 0;

                  return (
                    <tr
                      key={b._id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Code */}
                      <td className="py-3.5 px-5">
                        <span className="font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 rounded-lg border border-purple-200 dark:border-purple-900/50">
                          {code}
                        </span>
                      </td>

                      {/* Service & Package */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 max-w-xs">
                          <p className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                            {title}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            Tier: <span className="font-semibold text-purple-600 dark:text-purple-400">{pkgTier}</span>
                          </span>
                        </div>
                      </td>

                      {/* Decorator Agency */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1 max-w-[140px]">
                            {agencyName}
                          </p>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-purple-500" /> {agencyCity}
                          </span>
                        </div>
                      </td>

                      {/* Event Date & Venue */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-800 dark:text-slate-200">
                            {dateStr}
                          </p>
                          <span className="text-[10px] text-slate-400 line-clamp-1 max-w-[150px]">
                            {venue}
                          </span>
                        </div>
                      </td>

                      {/* Total Cost */}
                      <td className="py-3.5 px-4 font-black text-slate-900 dark:text-slate-100 text-sm whitespace-nowrap">
                        ৳{Number(total).toLocaleString()}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {renderStatusBadge(b.status)}
                      </td>

                      {/* Payment */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {renderPaymentBadge(b)}
                      </td>

                      {/* Action Buttons: View, Edit, Delete */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Button */}
                          <button
                            onClick={() => handleOpenView(b)}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-200 hover:text-purple-600 cursor-pointer"
                            title="View Full Booking Dossier"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => handleOpenEdit(b)}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
                            title="Edit Event Details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete / Cancel Button */}
                          <button
                            onClick={() => handleDeleteBooking(b)}
                            className="p-2 rounded-xl border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 cursor-pointer"
                            title="Cancel / Remove Booking"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= Full View Dossier Modal ================= */}
      {isViewModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-purple-400" />
                <div>
                  <h3 className="text-base font-bold text-white">
                    Booking Dossier: {selectedBooking.bookingCode || `BK-${selectedBooking._id.slice(-6).toUpperCase()}`}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Status: <span className="capitalize font-semibold text-purple-300">{selectedBooking.status}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-600 dark:text-slate-300">
              {/* Service & Agency Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                    {selectedBooking.serviceSnapshot?.category || selectedBooking.serviceCategory || "Event Decor"}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {selectedBooking.serviceSnapshot?.title || selectedBooking.serviceName}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Package Tier: <span className="font-semibold text-purple-600">{selectedBooking.serviceSnapshot?.selectedPackage || "Standard"}</span>
                  </p>
                </div>

                <div className="text-left sm:text-right space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Providing Agency</span>
                  <p className="font-bold text-slate-900 dark:text-slate-100">
                    {selectedBooking.decorator?.businessName || "StyleDecor Verified Agency"}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {selectedBooking.decorator?.contactInfo?.phone || "Support Available"}
                  </p>
                </div>
              </div>

              {/* Assigned Agent Card (if assigned) */}
              {selectedBooking.assignedAgent && (
                <div className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40 flex items-center gap-3">
                  <img
                    src={selectedBooking.assignedAgent.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                    alt={selectedBooking.assignedAgent.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase">
                      Dedicated Event Specialist Assigned
                    </span>
                    <p className="font-bold text-slate-900 dark:text-slate-100">
                      {selectedBooking.assignedAgent.name} ({selectedBooking.assignedAgent.designation || "Lead Decorator"})
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Direct Contact: {selectedBooking.assignedAgent.phone}
                    </p>
                  </div>
                </div>
              )}

              {/* Event Logistics Matrix */}
              <div className="space-y-2">
                <h5 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">
                  Event Logistics & Schedule
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-1">
                    <span className="text-[10px] text-slate-400">Event Date & Timing</span>
                    <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-purple-500" />
                      {selectedBooking.eventDetails?.eventDate
                        ? new Date(selectedBooking.eventDetails.eventDate).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : selectedBooking.bookingDate || "TBD"}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Hours: {selectedBooking.eventDetails?.startTime || "16:00"} - {selectedBooking.eventDetails?.endTime || "22:00"}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-1">
                    <span className="text-[10px] text-slate-400">Venue & Location</span>
                    <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-purple-500" />
                      {selectedBooking.eventDetails?.venueName || selectedBooking.location || "Venue TBD"}
                    </p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {selectedBooking.eventDetails?.venueAddress || selectedBooking.location || "Dhaka"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Special Instructions */}
              {selectedBooking.eventDetails?.specialInstructions && (
                <div className="space-y-1">
                  <h5 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">
                    Special Instructions
                  </h5>
                  <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 italic">
                    "{selectedBooking.eventDetails.specialInstructions}"
                  </p>
                </div>
              )}

              {/* Pricing Breakdown Summary */}
              <div className="p-4 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-2">
                <h5 className="font-bold text-purple-950 dark:text-purple-200 uppercase tracking-wider text-[11px]">
                  Financial Breakdown
                </h5>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Package Subtotal</span>
                  <span className="font-semibold">
                    ৳{Number(selectedBooking.pricingBreakdown?.subtotal || selectedBooking.totalCost || 0).toLocaleString()}
                  </span>
                </div>
                {selectedBooking.pricingBreakdown?.serviceTax > 0 && (
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Platform Service Tax</span>
                    <span>৳{Number(selectedBooking.pricingBreakdown.serviceTax).toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-purple-200/60 dark:border-purple-900/60 flex justify-between font-black text-sm text-slate-900 dark:text-slate-100">
                  <span>Grand Total</span>
                  <span className="text-purple-600 dark:text-purple-400">
                    ৳{Number(selectedBooking.pricingBreakdown?.grandTotal || selectedBooking.totalCost || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= Edit Booking Modal ================= */}
      {isEditModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">
                  Edit Event Logistics
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedBooking.bookingCode || selectedBooking.serviceName}
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Date & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={editFormData.eventDate}
                    onChange={(e) => setEditFormData({ ...editFormData, eventDate: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Contact Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+880 17XXXXXXXX"
                    value={editFormData.contact}
                    onChange={(e) => setEditFormData({ ...editFormData, contact: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Start Time & End Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Event Start Time
                  </label>
                  <input
                    type="time"
                    value={editFormData.startTime}
                    onChange={(e) => setEditFormData({ ...editFormData, startTime: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Event End Time
                  </label>
                  <input
                    type="time"
                    value={editFormData.endTime}
                    onChange={(e) => setEditFormData({ ...editFormData, endTime: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Venue Name & Address */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Venue / Banquet Hall Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sena Kunja Grand Ballroom"
                  value={editFormData.venueName}
                  onChange={(e) => setEditFormData({ ...editFormData, venueName: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Venue Full Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dhaka Cantonment, Dhaka"
                  value={editFormData.venueAddress}
                  onChange={(e) => setEditFormData({ ...editFormData, venueAddress: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>

              {/* Guest Count */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Estimated Guest Count
                </label>
                <input
                  type="number"
                  min="10"
                  placeholder="100"
                  value={editFormData.guestCountEstimate}
                  onChange={(e) => setEditFormData({ ...editFormData, guestCountEstimate: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>

              {/* Special Instructions */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Special Instructions / Requests
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Stage lighting setup needs to be done before 3 PM..."
                  value={editFormData.specialInstructions}
                  onChange={(e) => setEditFormData({ ...editFormData, specialInstructions: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer shadow-md shadow-purple-600/30"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
