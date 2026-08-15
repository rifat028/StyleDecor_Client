import React, { useContext, useEffect, useMemo, useState, useCallback } from "react";
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
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  Layers,
  X,
  CreditCard,
  ShieldCheck,
  Edit,
  UserCheck,
  DollarSign,
  FileText,
  Users,
  UserPlus,
} from "lucide-react";

const STATUS_STEPS = [
  "in_draft",
  "pending",
  "accepted",
  "advance_paid",
  "preparing",
  "on_the_way",
  "in_progress",
  "completed",
  "fully_paid",
  "rejected",
];

const MyProjects = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const [decoratorId, setDecoratorId] = useState(null);
  const [decoratorProfile, setDecoratorProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Agency Field Specialists
  const [agencyAgents, setAgencyAgents] = useState([]);

  // Filters
  const [statusTab, setStatusTab] = useState("all");
  const [searchText, setSearchText] = useState("");

  // Modals
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [bookingPayments, setBookingPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [nextStatus, setNextStatus] = useState("");

  // 1. Load Decorator Profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.email) return;
      try {
        let dec = null;
        try {
          const res = await axiosSecure.get("/decorators/me");
          dec = res.data?.data || res.data;
        } catch (meErr) {
          const res = await axiosSecure.get(`/decorators/${encodeURIComponent(user.email)}`);
          dec = res.data?.data || res.data;
        }

        if (dec?._id) {
          setDecoratorId(dec._id);
          setDecoratorProfile(dec);
        }
      } catch (err) {
        console.error("Failed to load decorator agency profile:", err);
      }
    };
    loadProfile();
  }, [axiosSecure, user?.email]);

  // 2. Load Bookings for this Decorator
  const loadProjects = useCallback(async () => {
    if (!decoratorId) return;
    try {
      setLoading(true);
      const res = await axiosSecure.get(`/bookings/decorator/${decoratorId}`);
      const list = res.data?.data || res.data || [];
      setBookings(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to load projects:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure, decoratorId]);

  // 3. Load Agency Field Specialists (GET /agents/decorator/:decoratorId)
  const loadAgencyAgents = useCallback(async () => {
    if (!decoratorId) return;
    try {
      const res = await axiosSecure.get(`/agents/decorator/${decoratorId}`);
      const list = res.data?.data || [];
      setAgencyAgents(Array.isArray(list) ? list : []);
    } catch (err) {
      console.warn("Failed to load agency agents for assignment:", err);
    }
  }, [axiosSecure, decoratorId]);

  useEffect(() => {
    loadProjects();
    loadAgencyAgents();
  }, [loadProjects, loadAgencyAgents]);

  // Open Assign Specialist Modal
  const handleOpenAssignModal = (b) => {
    setSelectedBooking(b);
    setSelectedAgentId(b.assignedAgentId || b.assignedAgent?._id || "");
    setIsAssignModalOpen(true);
  };

  // Submit Assign Specialist (PATCH /bookings/:id/assign)
  const handleAssignAgent = async (e) => {
    e.preventDefault();
    if (!selectedBooking?._id || !selectedAgentId) return;

    try {
      const res = await axiosSecure.patch(`/bookings/${selectedBooking._id}/assign`, {
        assignedAgentId: selectedAgentId,
      });

      if (res.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Specialist Assigned 🎉",
          text: "The field specialist has been assigned to this event project.",
          timer: 1500,
          showConfirmButton: false,
        });

        setIsAssignModalOpen(false);
        loadProjects();
      }
    } catch (err) {
      console.error("Failed to assign agent:", err);
      Swal.fire("Error", err.response?.data?.message || "Failed to assign field specialist.", "error");
    }
  };

  // Summary Metrics
  const stats = useMemo(() => {
    return {
      total: bookings.length,
      active: bookings.filter((b) =>
        ["accepted", "advance_paid", "advance paid", "preparing", "on_the_way", "on the way", "in_progress", "inprogress"].includes(b.status)
      ).length,
      completed: bookings.filter((b) =>
        ["completed", "fully_paid", "fully paid"].includes(b.status)
      ).length,
      pending: bookings.filter((b) =>
        ["pending", "in_draft", "draft"].includes(b.status)
      ).length,
    };
  }, [bookings]);

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (statusTab !== "all" && b.status !== statusTab) return false;
      if (searchText.trim()) {
        const q = searchText.toLowerCase();
        const code = (b.bookingCode || "").toLowerCase();
        const title = (b.serviceSnapshot?.title || b.serviceName || "").toLowerCase();
        const client = (b.customer?.name || b.clientName || "").toLowerCase();
        const venue = (b.eventDetails?.venueName || b.location || "").toLowerCase();
        if (!code.includes(q) && !title.includes(q) && !client.includes(q) && !venue.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [bookings, statusTab, searchText]);

  // Open Project & Payment Audit Dossier Modal (Integration: GET /payments/booking/:bookingId)
  const handleOpenView = async (b) => {
    setSelectedBooking(b);
    setIsViewModalOpen(true);
    setBookingPayments([]);
    setPaymentsLoading(true);

    try {
      const res = await axiosSecure.get(`/payments/booking/${b._id}`);
      const list = res.data?.data || [];
      setBookingPayments(Array.isArray(list) ? list : []);
    } catch (err) {
      console.warn("Failed to load payments for booking:", err);
      setBookingPayments([]);
    } finally {
      setPaymentsLoading(false);
    }
  };

  // Status Change Handler
  const openStatusModal = (b) => {
    setSelectedBooking(b);
    setNextStatus(b.status || STATUS_STEPS[0]);
    setIsStatusModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedBooking?._id || !nextStatus) return;

    try {
      await axiosSecure.patch(`/bookings/${selectedBooking._id}/status`, {
        status: nextStatus,
      });

      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: `Project is now marked as "${nextStatus}".`,
        timer: 1500,
        showConfirmButton: false,
      });

      setIsStatusModalOpen(false);
      loadProjects();
    } catch (err) {
      console.error("Failed to update status:", err);
      Swal.fire("Error", "Failed to update project status.", "error");
    }
  };

  // Status Badge Helper
  const renderStatusBadge = (status) => {
    const s = String(status || "").toLowerCase();
    switch (s) {
      case "in_draft":
      case "draft":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 uppercase">
            Draft
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
      case "advance_paid":
      case "advance paid":
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
      case "on_the_way":
      case "on the way":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800 uppercase">
            <Clock className="w-3 h-3" /> On The Way
          </span>
        );
      case "in_progress":
      case "inprogress":
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
      case "fully_paid":
      case "fully paid":
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 animate-fade-in space-y-8">
      {/* ================= Header Banner ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Building className="w-3.5 h-3.5" /> Agency Operations
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            My Event Projects
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage live orders, audit customer payment receipts, and advance execution stages from preparation to completion.
          </p>
        </div>
      </div>

      {/* ================= KPI Counters ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Total Projects
          </span>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {stats.total}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Active / In Progress
          </span>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
            {stats.active}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Completed / Paid
          </span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {stats.completed}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
            Awaiting Review
          </span>
          <p className="text-2xl font-black text-amber-500">
            {stats.pending}
          </p>
        </div>
      </div>

      {/* ================= Filters & Search ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          {[
            { id: "all", label: "All Projects" },
            { id: "in_draft", label: "In Draft" },
            { id: "pending", label: "Pending" },
            { id: "accepted", label: "Accepted" },
            { id: "advance_paid", label: "Advance Paid" },
            { id: "preparing", label: "Preparing" },
            { id: "on_the_way", label: "On The Way" },
            { id: "in_progress", label: "In Progress" },
            { id: "completed", label: "Completed" },
            { id: "fully_paid", label: "Fully Paid" },
          ].map((tab) => {
            const isSelected = statusTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search code, service, or customer name..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* ================= Projects Table ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-20 flex items-center justify-center">
            <Spinner />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Layers className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No Projects Found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No event projects matching your filter criteria were found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
                  <th className="py-4 px-5">Project Code</th>
                  <th className="py-4 px-4">Service & Package</th>
                  <th className="py-4 px-4">Client Contact</th>
                  <th className="py-4 px-4">Lead Specialist</th>
                  <th className="py-4 px-4">Event Schedule & Venue</th>
                  <th className="py-4 px-4">Price (৳)</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredBookings.map((b) => {
                  const code = b.bookingCode || `BK-${b._id.slice(-6).toUpperCase()}`;
                  const title = b.serviceSnapshot?.title || b.serviceName || "Decoration Setup";
                  const pkgTier = b.serviceSnapshot?.selectedPackage || "Standard";
                  const clientName = b.customer?.name || b.clientName || "Valued Client";
                  const clientPhone = b.contact || b.customer?.phone || "N/A";
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

                      {/* Service */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 max-w-xs">
                          <p className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                            {title}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            Tier: <span className="font-semibold text-purple-600">{pkgTier}</span>
                          </span>
                        </div>
                      </td>

                      {/* Client */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-800 dark:text-slate-200">
                            {clientName}
                          </p>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-purple-500" /> {clientPhone}
                          </p>
                        </div>
                      </td>

                      {/* Lead Specialist */}
                      <td className="py-3.5 px-4">
                        {b.assignedAgent ? (
                          <div className="flex items-center gap-2">
                            <img
                              src={b.assignedAgent.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                              alt={b.assignedAgent.name}
                              className="w-7 h-7 rounded-full object-cover ring-1 ring-purple-400"
                            />
                            <p className="font-semibold text-slate-800 dark:text-slate-200">
                              {b.assignedAgent.name}
                            </p>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">
                            Unassigned
                          </span>
                        )}
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

                      {/* Total */}
                      <td className="py-3.5 px-4 font-black text-slate-900 dark:text-slate-100 text-sm whitespace-nowrap">
                        ৳{Number(total).toLocaleString()}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {renderStatusBadge(b.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenAssignModal(b)}
                            className="p-2 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-300 cursor-pointer"
                            title="Assign Field Specialist"
                          >
                            <Users className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenView(b)}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-purple-600 cursor-pointer"
                            title="View Project Dossier & Payments"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openStatusModal(b)}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-indigo-600 cursor-pointer"
                            title="Update Progress Stage"
                          >
                            <Edit className="w-3.5 h-3.5" />
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

      {/* ================= View Project & Payments Modal (Integration: GET /payments/booking/:bookingId) ================= */}
      {isViewModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">
                  Project Dossier: {selectedBooking.bookingCode}
                </h3>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-600 dark:text-slate-300">
              {/* Project Snapshot */}
              <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 space-y-1">
                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase">Service Package</span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {selectedBooking.serviceSnapshot?.title || selectedBooking.serviceName}
                </h4>
                <p className="text-[11px] text-slate-500">
                  Tier: <span className="font-semibold text-purple-600">{selectedBooking.serviceSnapshot?.selectedPackage || "Standard"}</span>
                </p>
              </div>

              {/* Client & Venue Logistics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Client Contact</span>
                  <p className="font-bold text-slate-900 dark:text-slate-100">{selectedBooking.customer?.name || selectedBooking.clientName}</p>
                  <p className="text-[11px] text-slate-500">{selectedBooking.customer?.email || selectedBooking.clientEmail}</p>
                  <p className="text-[11px] text-slate-500">Phone: {selectedBooking.contact || selectedBooking.customer?.phone || "N/A"}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Venue Logistics</span>
                  <p className="font-bold text-slate-900 dark:text-slate-100">{selectedBooking.eventDetails?.venueName || selectedBooking.location}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{selectedBooking.eventDetails?.venueAddress || selectedBooking.location}</p>
                  <p className="text-[11px] text-slate-500">
                    Schedule: {selectedBooking.eventDetails?.startTime || "16:00"} - {selectedBooking.eventDetails?.endTime || "22:00"}
                  </p>
                </div>
              </div>

              {/* Payment Financial Audit Trail (Integration: GET /payments/booking/:id) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-purple-600" /> Payment & Deposit Audit Trail
                  </h5>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 uppercase">
                    Status: {selectedBooking.paymentStatus || "unpaid"}
                  </span>
                </div>

                {paymentsLoading ? (
                  <div className="p-6 flex justify-center">
                    <Spinner />
                  </div>
                ) : bookingPayments.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-center text-slate-400">
                    No payment deposits recorded for this booking yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {bookingPayments.map((pay) => (
                      <div
                        key={pay._id}
                        className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-purple-600 dark:text-purple-400 text-xs">
                              {pay.paymentCode}
                            </span>
                            <span className="uppercase text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                              {pay.paymentMethod}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400">
                            TRX: {pay.gatewayDetails?.transactionId || "TRX-AUTO"} • {new Date(pay.paidAt || pay.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-black text-slate-900 dark:text-slate-100 text-xs">
                            ৳{Number(pay.amount).toLocaleString()}
                          </p>
                          <span className="text-[10px] font-bold text-emerald-600 capitalize">
                            Receivable: ৳{(pay.breakdown?.vendorReceivable || Math.round(pay.amount * 0.885)).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Balance Summary */}
                <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600 dark:text-slate-400">Grand Total: ৳{Number(selectedBooking.pricingBreakdown?.grandTotal || selectedBooking.totalCost || 0).toLocaleString()}</span>
                  <span className="text-purple-600 dark:text-purple-400">
                    Paid: ৳{Number(selectedBooking.pricingBreakdown?.paidAmount || 0).toLocaleString()} | Due: ৳{Number(selectedBooking.pricingBreakdown?.dueAmount || (selectedBooking.totalCost - (selectedBooking.pricingBreakdown?.paidAmount || 0)) || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= Update Status Modal ================= */}
      {isStatusModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                Advance Project Lifecycle
              </h3>
              <button
                onClick={() => setIsStatusModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  {selectedBooking.serviceSnapshot?.title || selectedBooking.serviceName}
                </p>
                <p className="text-slate-400">
                  Client: {selectedBooking.customer?.name || selectedBooking.clientName}
                </p>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Select Execution Stage:
                </label>
                <select
                  value={nextStatus}
                  onChange={(e) => setNextStatus(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold capitalize cursor-pointer"
                >
                  {STATUS_STEPS.map((st) => (
                    <option key={st} value={st}>
                      {st.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
              <button
                onClick={() => setIsStatusModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer"
              >
                Save Progress
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= Assign Specialist Modal (PATCH /bookings/:id/assign) ================= */}
      {isAssignModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">
                  Assign Field Specialist
                </h3>
              </div>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAssignAgent} className="p-6 space-y-4 text-xs text-slate-700 dark:text-slate-200">
              <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 space-y-1">
                <span className="text-[10px] font-bold text-purple-600 uppercase">Project Order</span>
                <p className="font-bold text-purple-900 dark:text-purple-200">
                  {selectedBooking.serviceSnapshot?.title || selectedBooking.serviceName}
                </p>
                <p className="text-[11px] text-slate-500">
                  Code: {selectedBooking.bookingCode} • Venue: {selectedBooking.eventDetails?.venueName || "Venue"}
                </p>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-800 dark:text-slate-100">
                  Select Specialist from Agency Roster:
                </label>

                {agencyAgents.length === 0 ? (
                  <p className="text-slate-400 italic p-3 text-center">
                    No specialists registered yet. Visit "My Agents" to hire specialists.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {agencyAgents.map((ag) => {
                      const isChosen = selectedAgentId === ag._id;
                      return (
                        <div
                          key={ag._id}
                          onClick={() => setSelectedAgentId(ag._id)}
                          className={`p-3 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                            isChosen
                              ? "border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 shadow-xs"
                              : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <img
                              src={ag.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                              alt={ag.name}
                              className="w-9 h-9 rounded-xl object-cover ring-1 ring-purple-500/20"
                            />
                            <div>
                              <p className="font-bold text-xs">{ag.name}</p>
                              <p className="text-[10px] text-slate-400">{ag.designation}</p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-amber-500 font-bold text-[11px]">★ {ag.metrics?.rating || 4.8}</span>
                            <p className="text-[10px] text-slate-400">{ag.metrics?.activeAssignedBookings || 0} active</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedAgentId}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer disabled:opacity-50"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProjects;
