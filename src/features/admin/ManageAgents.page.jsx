import React, { useEffect, useMemo, useState, useCallback } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Spinner from "../home/components/Spinner";
import Swal from "sweetalert2";
import {
  Users,
  ShieldCheck,
  Star,
  Sparkles,
  Building,
  MapPin,
  Mail,
  Phone,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  Trash2,
  Award,
  ChevronLeft,
  ChevronRight,
  X,
  UserCheck,
  UserX,
  Activity,
} from "lucide-react";

const ManageAgents = () => {
  const axiosSecure = useAxiosSecure();

  const [agents, setAgents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Agent Dossier Modal
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isDossierModalOpen, setIsDossierModalOpen] = useState(false);
  const [dossierLoading, setDossierLoading] = useState(false);

  // 1. Load Platform Stats (GET /agents/stats)
  const loadStats = async () => {
    try {
      const res = await axiosSecure.get("/agents/stats");
      if (res.data?.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.warn("Failed to load agent stats:", err);
    }
  };

  // 2. Load Paginated Agents (GET /agents)
  const loadAgents = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
      });
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (cityFilter !== "all") params.append("city", cityFilter);
      if (searchText.trim()) params.append("search", searchText.trim());

      const res = await axiosSecure.get(`/agents?${params.toString()}`);
      if (res.data?.success) {
        setAgents(res.data.data || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalCount(res.data.totalCount || 0);
      }
    } catch (err) {
      console.error("Failed to load agents list:", err);
      setAgents([]);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure, page, statusFilter, cityFilter, searchText]);

  useEffect(() => {
    loadStats();
  }, [axiosSecure]);

  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  // 3. View Agent Dossier (GET /agents/id/:id)
  const handleOpenDossier = async (agentId) => {
    try {
      setDossierLoading(true);
      setIsDossierModalOpen(true);
      const res = await axiosSecure.get(`/agents/id/${agentId}`);
      if (res.data?.success) {
        setSelectedAgent(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load agent dossier:", err);
      Swal.fire("Error", "Failed to retrieve agent dossier.", "error");
      setIsDossierModalOpen(false);
    } finally {
      setDossierLoading(false);
    }
  };

  // 4. Update Agent Status (PATCH /agents/:id/status)
  const handleUpdateStatus = async (agent, newStatus) => {
    const confirm = await Swal.fire({
      title: `Update Agent Status to "${newStatus}"?`,
      text: `Are you sure you want to change the status for ${agent.name}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Update",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.patch(`/agents/${agent._id}/status`, { status: newStatus });
      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: `Agent status is now ${newStatus}.`,
        timer: 1500,
        showConfirmButton: false,
      });
      loadAgents();
      loadStats();
    } catch (err) {
      console.error("Failed to update status:", err);
      Swal.fire("Error", "Failed to update agent status.", "error");
    }
  };

  // 5. Delete Agent (DELETE /agents/:id)
  const handleDeleteAgent = async (agent) => {
    const confirm = await Swal.fire({
      title: "Permanently Remove Agent?",
      text: `Are you sure you want to delete ${agent.name} from the platform database?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.delete(`/agents/${agent._id}`);
      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Agent has been removed from StyleDecor.",
        timer: 1500,
        showConfirmButton: false,
      });
      loadAgents();
      loadStats();
    } catch (err) {
      console.error("Failed to delete agent:", err);
      Swal.fire("Error", "Failed to delete agent.", "error");
    }
  };

  // Status Badge Helper
  const renderStatusBadge = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "available" || s === "active") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 uppercase">
          <CheckCircle2 className="w-3 h-3" /> Available
        </span>
      );
    }
    if (s === "on_assignment" || s === "assigned") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 uppercase">
          <Activity className="w-3 h-3" /> On Assignment
        </span>
      );
    }
    if (s === "suspended") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 uppercase">
          <UserX className="w-3 h-3" /> Suspended
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase">
        {status}
      </span>
    );
  };

  const statData = stats || {
    totalAgents: 0,
    availableCount: 0,
    onAssignmentCount: 0,
    totalCompletedEvents: 0,
    avgRating: 4.8,
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 animate-fade-in space-y-8">
      {/* ================= Header Banner ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5" /> Specialist Workforce Supervision
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Manage Field Specialists & Agents
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Audit registered on-site craft specialists across decorator agencies in Bangladesh, verify credentials, and govern statuses.
          </p>
        </div>
      </div>

      {/* ================= Statistics Cards (GET /agents/stats) ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-lg shadow-purple-600/20 space-y-1">
          <span className="text-[11px] font-bold text-purple-200 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> Total Field Crew
          </span>
          <p className="text-2xl sm:text-3xl font-black">
            {statData.totalAgents}
          </p>
          <p className="text-[11px] text-purple-200 pt-1">
            Registered specialists in database
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Available for Dispatch
          </span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {statData.availableCount}
          </p>
          <p className="text-[11px] text-slate-400 pt-1">
            Ready for instant event assignment
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-blue-500" /> Active On-Site
          </span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {statData.onAssignmentCount}
          </p>
          <p className="text-[11px] text-slate-400 pt-1">
            Executing live project milestones
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-500" /> Platform Avg Rating
          </span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {statData.avgRating} <span className="text-sm font-normal text-slate-400">/ 5.0</span>
          </p>
          <p className="text-[11px] text-slate-400 pt-1">
            Across {statData.totalCompletedEvents} delivered setups
          </p>
        </div>
      </div>

      {/* ================= Filters & Search ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or specialty..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 shrink-0">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available</option>
              <option value="on_assignment">On Assignment</option>
              <option value="off_duty">Off Duty</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 shrink-0">City:</span>
            <select
              value={cityFilter}
              onChange={(e) => {
                setCityFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 cursor-pointer"
            >
              <option value="all">All Cities</option>
              <option value="Dhaka">Dhaka</option>
              <option value="Chittagong">Chittagong</option>
              <option value="Sylhet">Sylhet</option>
              <option value="Rajshahi">Rajshahi</option>
            </select>
          </div>
        </div>
      </div>

      {/* ================= Agents Table ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-20 flex items-center justify-center">
            <Spinner />
          </div>
        ) : agents.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Users className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No Field Specialists Found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No agent records matched your criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
                  <th className="py-4 px-5">Specialist Profile</th>
                  <th className="py-4 px-4">Affiliated Agency</th>
                  <th className="py-4 px-4">Contact Info</th>
                  <th className="py-4 px-4">Specialization</th>
                  <th className="py-4 px-4">Quality Rating</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {agents.map((a) => (
                  <tr
                    key={a._id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Specialist */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={a.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"}
                          alt={a.name}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-purple-500/20"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100">
                            {a.name}
                          </p>
                          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">
                            {a.designation}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Agency */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-800 dark:text-slate-200">
                          {a.decorator?.businessName || "Independent"}
                        </p>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-purple-500" /> {a.assignedArea?.city || "Dhaka"}
                        </span>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <p className="text-slate-700 dark:text-slate-300 font-medium">
                          {a.email}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {a.phone}
                        </p>
                      </div>
                    </td>

                    {/* Specialization */}
                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200 max-w-xs truncate">
                      {a.specialization}
                    </td>

                    {/* Rating */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{a.metrics?.rating || 4.8}</span>
                        <span className="text-[10px] text-slate-400">({a.metrics?.completedEvents || 0} jobs)</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {renderStatusBadge(a.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenDossier(a._id)}
                          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-purple-600 cursor-pointer"
                          title="View Agent Dossier"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {a.status === "suspended" ? (
                          <button
                            onClick={() => handleUpdateStatus(a, "available")}
                            className="p-2 rounded-xl border border-emerald-200 dark:border-emerald-900/60 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer"
                            title="Reactivate Agent"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateStatus(a, "suspended")}
                            className="p-2 rounded-xl border border-amber-200 dark:border-amber-900/60 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 cursor-pointer"
                            title="Suspend Agent"
                          >
                            <UserX className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteAgent(a)}
                          className="p-2 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                          title="Delete Agent Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Showing Page <span className="font-bold">{page}</span> of <span className="font-bold">{totalPages}</span> ({totalCount} total agents)
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= Agent Dossier Modal (GET /agents/id/:id) ================= */}
      {isDossierModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Users className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">
                  Field Specialist Dossier
                </h3>
              </div>
              <button
                onClick={() => setIsDossierModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-600 dark:text-slate-300">
              {dossierLoading || !selectedAgent ? (
                <div className="p-16 flex items-center justify-center">
                  <Spinner />
                </div>
              ) : (
                <>
                  {/* Header identity */}
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50">
                    <img
                      src={selectedAgent.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"}
                      alt={selectedAgent.name}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-500/20"
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                          {selectedAgent.name}
                        </h4>
                        {renderStatusBadge(selectedAgent.status)}
                      </div>
                      <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                        {selectedAgent.designation} • {selectedAgent.experienceYears || 2} Years Experience
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Email: {selectedAgent.email} • Phone: {selectedAgent.phone}
                      </p>
                    </div>
                  </div>

                  {/* Affiliated Agency */}
                  {selectedAgent.decorator && (
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Affiliated Decorator Agency</span>
                      <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {selectedAgent.decorator.businessName}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        City: {selectedAgent.decorator.city} • Hotline: {selectedAgent.decorator.phone || "N/A"}
                      </p>
                    </div>
                  )}

                  {/* Operational Zones & Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Operational Zones</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        {Array.isArray(selectedAgent.assignedArea?.zones) ? selectedAgent.assignedArea.zones.join(", ") : "Dhanmondi, Gulshan"}
                      </p>
                      <p className="text-[10px] text-slate-400">City: {selectedAgent.assignedArea?.city || "Dhaka"}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Performance Metrics</span>
                      <p className="font-bold text-amber-500">
                        ★ {selectedAgent.metrics?.rating || 4.8} / 5.0 Rating
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {selectedAgent.metrics?.completedEvents || 0} setups completed • {selectedAgent.metrics?.activeAssignedBookings || 0} active jobs
                      </p>
                    </div>
                  </div>

                  {/* Appraisals History */}
                  <div className="space-y-3">
                    <h5 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-purple-600" /> Agency Appraisals Log ({selectedAgent.reviews?.length || 0})
                    </h5>

                    {!selectedAgent.reviews || selectedAgent.reviews.length === 0 ? (
                      <p className="text-slate-400 italic text-[11px]">No evaluation logs submitted yet.</p>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {selectedAgent.reviews.map((rev) => (
                          <div key={rev._id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-800 dark:text-slate-200">
                                {rev.decoratorBusinessName || rev.reviewedBy?.name || "Agency Supervisor"}
                              </span>
                              <span className="text-amber-500 font-bold">★ {rev.rating}.0</span>
                            </div>
                            <p className="text-[11px] text-slate-600 dark:text-slate-300 italic">"{rev.comment}"</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => setIsDossierModalOpen(false)}
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

export default ManageAgents;
