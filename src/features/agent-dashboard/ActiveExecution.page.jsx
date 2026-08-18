import React, { useEffect, useMemo, useState, useCallback } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import Spinner from "../home/components/Spinner";
import DashboardPageHeader from "../../components/ui/DashboardPageHeader";
import {
  Activity,
  Play,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Sparkles,
  Truck,
  ShieldCheck,
  CheckSquare,
  Square,
  Save,
  Building,
  User,
  AlertCircle,
  X,
  Layers,
} from "lucide-react";

const STAGES = [
  { id: "preparing", label: "Preparing Equipment", icon: Sparkles, color: "text-purple-500 bg-purple-50 dark:bg-purple-950/40" },
  { id: "on_the_way", label: "On The Way", icon: Truck, color: "text-orange-500 bg-orange-50 dark:bg-orange-950/40" },
  { id: "in_progress", label: "In Progress (On-Site)", icon: Activity, color: "text-blue-500 bg-blue-50 dark:bg-blue-950/40" },
  { id: "completed", label: "Completed & Delivered", icon: CheckCircle2, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40" },
];

const DEFAULT_CHECKLIST = [
  { id: "c1", label: "Stage structural truss & backdrop framework anchored safely", completed: false },
  { id: "c2", label: "Floral installation & fresh blooms arranged to theme palette", completed: false },
  { id: "c3", label: "Ambient 3200K warm spot lighting & neon signage wired & tested", completed: false },
  { id: "c4", label: "Photo booth backdrop & couple entrance archway illuminated", completed: false },
  { id: "c5", label: "VIP walkway carpet & aisle floral stands aligned with zero wrinkles", completed: false },
  { id: "c6", label: "Venue manager & customer representative walk-through completed", completed: false },
];

const ActiveExecution = () => {
  const axiosSecure = useAxiosSecure();

  const [activeEvents, setActiveEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Execution State
  const [milestoneNote, setMilestoneNote] = useState("");
  const [checklist, setChecklist] = useState(DEFAULT_CHECKLIST);
  const [submitting, setSubmitting] = useState(false);

  // 1. Integration: GET /agents/active-events
  const loadActiveEvents = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/agents/active-events");
      const list = res.data?.data || [];
      setActiveEvents(Array.isArray(list) ? list : []);
      if (list.length > 0 && !selectedEvent) {
        setSelectedEvent(list[0]);
      }
    } catch (err) {
      console.error("Failed to load active events:", err);
      setActiveEvents([]);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure, selectedEvent]);

  useEffect(() => {
    loadActiveEvents();
  }, [loadActiveEvents]);

  // Toggle Checklist Item
  const toggleChecklistItem = (id) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const checklistProgress = useMemo(() => {
    const doneCount = checklist.filter((c) => c.completed).length;
    return Math.round((doneCount / checklist.length) * 100);
  }, [checklist]);

  // 2. Integration: PATCH /agents/bookings/:bookingId/stage
  const handleAdvanceStage = async (stageId) => {
    if (!selectedEvent?._id) return;

    try {
      setSubmitting(true);
      const allChecklistDone = checklist.every((c) => c.completed);

      const res = await axiosSecure.patch(`/agents/bookings/${selectedEvent._id}/stage`, {
        status: stageId,
        milestoneNote: milestoneNote || `Agent advanced milestone to ${stageId.replace(/_/g, " ")}.`,
        checklistCompleted: allChecklistDone,
      });

      if (res.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Milestone Recorded 🎉",
          text: `Event setup milestone is now: "${stageId.replace(/_/g, " ").toUpperCase()}".`,
          timer: 1500,
          showConfirmButton: false,
        });

        // Update selected event locally and reload
        setSelectedEvent((prev) => (prev ? { ...prev, status: stageId } : null));
        loadActiveEvents();
      }
    } catch (err) {
      console.error("Failed to advance stage:", err);
      Swal.fire("Error", err.response?.data?.message || "Failed to advance milestone.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 animate-fade-in space-y-8">
      {/* ================= 1. Standardized Top Header Bar ================= */}
      <DashboardPageHeader
        icon={Activity}
        title="Active Event Execution Console"
        subtitle="Execute real-time on-site decoration workflows, complete quality safety checklists, and submit milestone timestamps."
        onRefresh={loadActiveEvents}
        refreshing={loading}
      />

      {activeEvents.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-16 border border-slate-200/80 dark:border-slate-800 text-center space-y-4 shadow-xs">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            No Active Setup Projects Currently Running
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            All your assigned event decorations have been delivered or are awaiting scheduled event dates. Check your schedule for upcoming bookings.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Active Events Selector List */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">
              Active Assigned Projects ({activeEvents.length})
            </h3>

            <div className="space-y-3">
              {activeEvents.map((evt) => {
                const isSelected = selectedEvent?._id === evt._id;
                const code = evt.bookingCode || `BK-${evt._id.slice(-6).toUpperCase()}`;
                const title = evt.serviceSnapshot?.title || evt.serviceName;

                return (
                  <div
                    key={evt._id}
                    onClick={() => {
                      setSelectedEvent(evt);
                      setMilestoneNote("");
                    }}
                    className={`p-5 rounded-3xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-purple-50/70 dark:bg-purple-950/40 border-purple-500 shadow-md shadow-purple-600/15 ring-2 ring-purple-500/20"
                        : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-purple-300"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono font-bold text-xs text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/60 px-2 py-0.5 rounded-lg">
                        {code}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-500">
                        {evt.status.replace(/_/g, " ")}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1 mb-1">
                      {title}
                    </h4>

                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-purple-500 shrink-0" />
                      <span className="truncate">{evt.eventDetails?.venueName || "Venue"}</span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Execution Operations Console */}
          {selectedEvent && (
            <div className="lg:col-span-2 space-y-6">
              {/* Event Overview Card */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                      Live Project Execution
                    </span>
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100">
                      {selectedEvent.serviceSnapshot?.title || selectedEvent.serviceName}
                    </h2>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
                    {selectedEvent.bookingCode}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Venue Destination</span>
                    <p className="font-bold text-slate-900 dark:text-slate-100">{selectedEvent.eventDetails?.venueName || "Venue"}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{selectedEvent.eventDetails?.venueAddress || "Address"}</p>
                    <p className="text-[11px] text-slate-500">
                      Hours: {selectedEvent.eventDetails?.startTime || "16:00"} - {selectedEvent.eventDetails?.endTime || "22:00"}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Client Contact Hotline</span>
                    <p className="font-bold text-slate-900 dark:text-slate-100">{selectedEvent.customer?.name || selectedEvent.clientName}</p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-purple-500" /> {selectedEvent.contact || selectedEvent.customer?.phone || "N/A"}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Guest Count: ~{selectedEvent.eventDetails?.guestCountEstimate || 100} Guests
                    </p>
                  </div>
                </div>

                {selectedEvent.eventDetails?.specialInstructions && (
                  <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40 text-xs">
                    <span className="font-bold text-amber-700 dark:text-amber-300 uppercase flex items-center gap-1.5 text-[10px] mb-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Special Directives from Client
                    </span>
                    <p className="text-slate-800 dark:text-slate-200 text-xs">
                      {selectedEvent.eventDetails.specialInstructions}
                    </p>
                  </div>
                )}
              </div>

              {/* Milestone Stepper Progression */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" /> Advance Milestone Progress
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {STAGES.map((st) => {
                    const isCurrent = selectedEvent.status === st.id;
                    const Icon = st.icon;

                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => handleAdvanceStage(st.id)}
                        disabled={submitting}
                        className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                          isCurrent
                            ? "border-purple-600 bg-purple-600 text-white shadow-lg shadow-purple-600/30 ring-2 ring-purple-500/20"
                            : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-purple-300"
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isCurrent ? "bg-white/20 text-white" : st.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold">{st.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Memo Input */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Field Progress Memo / Arrival Note:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Arrived on venue, flower arch installed, lights tested..."
                    value={milestoneNote}
                    onChange={(e) => setMilestoneNote(e.target.value)}
                    className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Quality & Safety Execution Checklist */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                      On-Site Quality Checklist ({checklistProgress}% Done)
                    </h3>
                    <p className="text-xs text-slate-400">Ensure all safety and artistic checkpoints are verified</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold text-xs">
                    {checklistProgress}%
                  </div>
                </div>

                {/* Checklist items */}
                <div className="space-y-2.5">
                  {checklist.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleChecklistItem(item.id)}
                      className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                        item.completed
                          ? "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200"
                          : "bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {item.completed ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <span className={`text-xs font-medium ${item.completed ? "line-through opacity-80" : ""}`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActiveExecution;
