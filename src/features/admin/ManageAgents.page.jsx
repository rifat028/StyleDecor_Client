import React, { useEffect, useState, useCallback } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Users, RefreshCw } from "lucide-react";
import AgentManagementToolbar from "../../components/pages/Admin/AgentManagement/AgentManagementToolbar";
import AgentManagementTable from "../../components/pages/Admin/AgentManagement/AgentManagementTable";
import AgentManagementModals from "../../components/pages/Admin/AgentManagement/AgentManagementModals";

const CITIES_LIST = [
  "all",
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Rangpur",
  "Mymensingh",
  "Cumilla",
  "Gazipur",
];

// Admin field specialist supervision page
const ManageAgents = () => {
  const axiosSecure = useAxiosSecure();

  // Data & Loading States
  const [agents, setAgents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Dossier Modal State
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [dossierLoading, setDossierLoading] = useState(false);

  // Debounce search query (350ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [search]);

  // Load platform statistics
  const loadStats = useCallback(async () => {
    try {
      const res = await axiosSecure.get("/agents/stats");
      if (res.data?.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.warn("Failed to load agent stats:", err);
    }
  }, [axiosSecure]);

  // Load paginated agents list
  const loadAgents = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (statusFilter !== "all") params.append("status", statusFilter);
      if (cityFilter !== "all") params.append("city", cityFilter);
      if (debouncedSearch.trim()) params.append("search", debouncedSearch.trim());

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
      setRefreshing(false);
    }
  }, [axiosSecure, page, limit, statusFilter, cityFilter, debouncedSearch]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatusFilter("all");
    setCityFilter("all");
    setPage(1);
  };

  // View full agent dossier modal
  const handleOpenDossier = async (agent) => {
    try {
      setDossierLoading(true);
      setSelectedAgent(agent);
      const res = await axiosSecure.get(`/agents/id/${agent._id}`);
      if (res.data?.success) {
        setSelectedAgent(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load agent dossier:", err);
    } finally {
      setDossierLoading(false);
    }
  };

  // Update agent status (Available, Suspended)
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
      await axiosSecure.patch(`/agents/${agent._id}/status`, {
        status: newStatus,
      });
      toast.success(`Agent status is now ${newStatus}`);
      if (selectedAgent?._id === agent._id) {
        setSelectedAgent((prev) => ({ ...prev, status: newStatus }));
      }
      loadAgents();
      loadStats();
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Failed to update agent status");
    }
  };

  // Delete agent
  const handleDeleteAgent = async (agent) => {
    const confirm = await Swal.fire({
      title: "Permanently Remove Agent?",
      text: `Are you sure you want to delete ${agent.name} from the platform database?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.delete(`/agents/${agent._id}`);
      toast.success("Agent has been removed");
      if (selectedAgent?._id === agent._id) {
        setSelectedAgent(null);
      }
      loadAgents();
      loadStats();
    } catch (err) {
      console.error("Failed to delete agent:", err);
      toast.error("Failed to delete agent");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* 1. Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-purple-100 dark:bg-purple-950/60 rounded-xl text-purple-600 dark:text-purple-400 shrink-0 shadow-xs">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Manage Field Specialists & Agents
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Supervise registered on-site craft specialists, verify credentials, and govern dispatch availability.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setRefreshing(true);
            loadAgents();
            loadStats();
          }}
          disabled={loading || refreshing}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw
            className={`w-4 h-4 text-purple-600 dark:text-purple-400 ${
              refreshing ? "animate-spin" : ""
            }`}
          />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* 2. Consolidated Toolbar (~130 lines) */}
      <AgentManagementToolbar
        stats={stats}
        statusFilter={statusFilter}
        onSelectStatusFilter={(s) => {
          setStatusFilter(s);
          setPage(1);
        }}
        loadingStats={loading && !stats}
        search={search}
        onSearchChange={setSearch}
        onClearSearch={() => {
          setSearch("");
          setDebouncedSearch("");
          setPage(1);
        }}
        cityFilter={cityFilter}
        onCityFilterChange={(c) => {
          setCityFilter(c);
          setPage(1);
        }}
        citiesList={CITIES_LIST}
      />

      {/* 3. Consolidated Table Component (~220 lines) */}
      <AgentManagementTable
        agents={agents}
        loading={loading}
        onView={handleOpenDossier}
        onDelete={handleDeleteAgent}
        onResetFilters={handleResetFilters}
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
      />

      {/* 4. Consolidated Modals Component (~210 lines) */}
      <AgentManagementModals
        selectedAgent={selectedAgent}
        onClose={() => setSelectedAgent(null)}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDeleteAgent}
        loading={dossierLoading}
      />
    </div>
  );
};

export default ManageAgents;
