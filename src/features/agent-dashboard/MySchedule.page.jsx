import React, { useContext, useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../auth/AuthContext";
import Spinner from "../home/components/Spinner";
import Swal from "sweetalert2";
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
  AlertCircle,
  Sparkles,
  Layers,
  X,
  Play,
  ArrowRight,
  ShieldCheck,
  Edit,
  Activity,
  Award,
} from "lucide-react";

const MySchedule = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timelineTab, setTimelineTab] = useState("all");
  const [searchText, setSearchText] = useState("");

  // Stage Update Modal
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [nextStage, setNextStage] = useState("preparing");
  const [milestoneNote, setMilestoneNote] = useState("");
  const [submittingStage, setSubmittingStage] = useState(false);

  // View Dossier Modal
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // 1. Integration: GET /agents/my-schedule?timeline=...
  const loadSchedule = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get(`/agents/my-schedule?timeline=${timelineTab}`);
      const list = res.data?.data || [];
      setSchedule(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to load agent schedule:", err);
      setSchedule([]);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure, timelineTab]);

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  // Filtered Schedule
  const filteredSchedule = useMemo(() => {
    return schedule.filter((b) => {
      if (searchText.trim()) {
        const q = searchText.toLowerCase();
        const code = (b.bookingCode || "").toLowerCase();
        const title = (b.serviceSnapshot?.title || b.serviceName || "").toLowerCase();
        const client = (b.customer?.name || b.clientName || "").toLowerCase();
        const venue = (b.eventDetails?.venueName || b.location || "").toLowerCase();
        const address = (b.eventDetails?.venueAddress || "").toLowerCase();
        if (!code.includes(q) && !title.includes(q) && !client.includes(q) && !venue.includes(q) && !address.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [schedule, searchText]);

  // Open Stage Update Modal
  const handleOpenStageModal = (b) => {
    setSelectedBooking(b);
    setNextStage(b.status || "preparing");
    setMilestoneNote("");
    setIsStageModalOpen(true);
  };

  // Integration: PATCH /agents/bookings/:bookingId/stage
  const handleUpdateStage = async (e) => {
    e.preventDefault();
    if (!selectedBooking?._id) return;

    try {
      setSubmittingStage(true);
      const res = await axiosSecure.patch(`/agents/bookings/${selectedBooking._id}/stage`, {
        status: nextStage,
        milestoneNote,
      });

      if (res.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Milestone Updated",
          text: `Event status advanced to "${nextStage.replace(/_/g, " ")}".`,
          timer: 1500,
          showConfirmButton: false,
        });
        setIsStageModalOpen(false);
        loadSchedule();
      }
    } catch (err) {
      console.error("Failed to update milestone:", err);
      Swal.fire("Error", err.response?.data?.message || "Failed to update milestone.", "error");
    } finally {
      setSubmittingStage(false);
    }
  };

  // Open View Modal
  const handleOpenView = (b) => {
    setSelectedBooking(b);
    setIsViewModalOpen(true);
  };

  // Status Badge Helper
  const renderStatusBadge = (status) => {
    const s = String(status || "").toLowerCase();
    switch (s) {
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
            <Activity className="w-3 h-3" /> In Progress
          </span>
        );
      case "completed":
      case "fully_paid":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 uppercase">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </span>
        );
      case "accepted":
      case "advance_paid":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 uppercase">
            <CheckCircle2 className="w-3 h-3" /> Scheduled
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
            <Calendar className="w-3.5 h-3.5" /> Field Operations Roster
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            My Schedule & Assigned Events
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Audit your upcoming event assignments, check venue logistics, and execute stage milestones.
          </p>
        </div>

        <Link
          to="/dashboard/active-execution"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/30 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" /> Live Execution Console
        </Link>
      </div>

      {/* ================= Timeline Tabs & Search ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        {/* Timeline Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          {[
            { id: "all", label: "All Assignments" },
            { id: "active", label: "Active Execution" },
            { id: "upcoming", label: "Upcoming Events" },
            { id: "today", label: "Today's Events" },
            { id: "past", label: "Past Executed" },
          ].map((tab) => {
            const isSelected = timelineTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setTimelineTab(tab.id)}
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
            placeholder="Search by code, venue, service, or customer..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* ================= Events Table ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-20 flex items-center justify-center">
            <Spinner />
          </div>
        ) : filteredSchedule.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No Assigned Events in this Timeline
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You do not have any event assignments under the selected filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
                  <th className="py-4 px-5">Booking Code</th>
                  <th className="py-4 px-4">Service & Tier</th>
                  <th className="py-4 px-4">Customer Contact</th>
                  <th className="py-4 px-4">Event Date & Time</th>
                  <th className="py-4 px-4">Venue & Address</th>
                  <th className="py-4 px-4">Decorator Agency</th>
                  <th className="py-4 px-4">Stage Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredSchedule.map((b) => {
                  const code = b.bookingCode || `BK-${b._id.slice(-6).toUpperCase()}`;
                  const title = b.serviceSnapshot?.title || b.serviceName || "Decoration Setup";
                  const tier = b.serviceSnapshot?.selectedPackage || "Standard";
                  const clientName = b.customer?.name || b.clientName || "Valued Client";
                  const clientPhone = b.contact || b.customer?.phone || "N/A";
                  const rawDate = b.eventDetails?.eventDate || b.bookingDate;
                  const dateStr = rawDate
                    ? new Date(rawDate).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "TBD";
                  const timeStr = `${b.eventDetails?.startTime || "16:00"} - ${b.eventDetails?.endTime || "22:00"}`;
                  const venueName = b.eventDetails?.venueName || b.location || "Venue TBD";
                  const address = b.eventDetails?.venueAddress || b.location || "Dhaka";
                  const agency = b.decorator?.businessName || "StyleDecor Agency";

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
                            Tier: <span className="font-semibold text-purple-600">{tier}</span>
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

                      {/* Schedule */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-800 dark:text-slate-200">
                            {dateStr}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            {timeStr}
                          </span>
                        </div>
                      </td>

                      {/* Venue */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 max-w-[150px]">
                          <p className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                            {venueName}
                          </p>
                          <span className="text-[10px] text-slate-400 line-clamp-1">
                            {address}
                          </span>
                        </div>
                      </td>

                      {/* Agency */}
                      <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[130px]">
                        {agency}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {renderStatusBadge(b.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenView(b)}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-purple-600 cursor-pointer"
                            title="View Full Event Dossier"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenStageModal(b)}
                            className="p-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white cursor-pointer shadow-sm"
                            title="Update Execution Milestone"
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

      {/* ================= Milestone Update Modal (PATCH /agents/bookings/:id/stage) ================= */}
      {isStageModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">
                  Update Execution Milestone
                </h3>
              </div>
              <button
                onClick={() => setIsStageModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateStage} className="p-6 space-y-4 text-xs text-slate-700 dark:text-slate-200">
              <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 space-y-1">
                <p className="font-bold text-purple-900 dark:text-purple-200">
                  {selectedBooking.serviceSnapshot?.title || selectedBooking.serviceName}
                </p>
                <p className="text-slate-500">
                  Code: {selectedBooking.bookingCode} • Venue: {selectedBooking.eventDetails?.venueName || "Venue"}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 dark:text-slate-100">
                  Select On-Site Milestone:
                </label>
                <select
                  value={nextStage}
                  onChange={(e) => setNextStage(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold capitalize cursor-pointer"
                >
                  <option value="preparing">Preparing Equipment & Stage</option>
                  <option value="on_the_way">On The Way to Venue</option>
                  <option value="in_progress">In Progress: Decorating On-Site</option>
                  <option value="completed">Completed & Handed Over</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 dark:text-slate-100">
                  Execution Note / Field Memo:
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Stage lighting rig assembled, floral arch placed at stage front..."
                  value={milestoneNote}
                  onChange={(e) => setMilestoneNote(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsStageModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingStage}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer disabled:opacity-50"
                >
                  {submittingStage ? "Saving..." : "Save Milestone"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= View Dossier Modal ================= */}
      {isViewModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">
                  Event Details: {selectedBooking.bookingCode}
                </h3>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 space-y-1">
                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase">Service Package</span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {selectedBooking.serviceSnapshot?.title || selectedBooking.serviceName}
                </h4>
                <p className="text-[11px] text-slate-500">
                  Selected Tier: <span className="font-semibold text-purple-600">{selectedBooking.serviceSnapshot?.selectedPackage || "Standard"}</span>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    Timing: {selectedBooking.eventDetails?.startTime || "16:00"} - {selectedBooking.eventDetails?.endTime || "22:00"}
                  </p>
                </div>
              </div>

              {selectedBooking.eventDetails?.specialInstructions && (
                <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 space-y-1">
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Special Setup Instructions
                  </span>
                  <p className="text-slate-800 dark:text-slate-200 text-xs">
                    {selectedBooking.eventDetails.specialInstructions}
                  </p>
                </div>
              )}
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
    </div>
  );
};

export default MySchedule;
