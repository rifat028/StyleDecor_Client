import React, { useEffect, useState, useCallback } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Users } from "lucide-react";
import DashboardPageHeader from "../../components/ui/DashboardPageHeader";
import AgentManagementToolbar from "../../components/pages/Admin/AgentManagement/AgentManagementToolbar";
import AgentManagementTable from "../../components/pages/Admin/AgentManagement/AgentManagementTable";
import AgentManagementModals from "../../components/pages/Admin/AgentManagement/AgentManagementModals";

// Official administrative divisions of Bangladesh used for territory governance
const TERRITORIES_LIST = [
  "all",
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
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
  const [territoryFilter, setTerritoryFilter] = useState("all");
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

  // Load paginated agents list filtered by division territory & status
  const loadAgents = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (statusFilter !== "all") params.append("status", statusFilter);
      if (territoryFilter !== "all") params.append("division", territoryFilter);
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
  }, [axiosSecure, page, limit, statusFilter, territoryFilter, debouncedSearch]);

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
    setTerritoryFilter("all");
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
    const isSuspending = newStatus === "suspended";
    const confirm = await Swal.fire({
      title: isSuspending ? `Suspend ${agent.name}?` : `Activate ${agent.name}?`,
      text: isSuspending
        ? `Are you sure you want to suspend this agent? They will not be assigned to new events.`
        : `Are you sure you want to mark ${agent.name} as available?`,
      icon: isSuspending ? "warning" : "question",
      showCancelButton: true,
      confirmButtonText: isSuspending ? "Yes, Suspend" : "Yes, Activate",
      confirmButtonColor: isSuspending ? "#ef4444" : "#10b981",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.patch(`/agents/${agent._id}/status`, {
        status: newStatus,
      });
      toast.success(`Agent status updated to ${newStatus}`);
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

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* 1. Standardized Top Header Bar */}
      <DashboardPageHeader
        icon={Users}
        title="Manage Field Specialists & Agents"
        subtitle="Supervise registered on-site craft specialists, verify credentials, and govern dispatch availability."
        onRefresh={() => {
          setRefreshing(true);
          loadAgents();
          loadStats();
        }}
        refreshing={refreshing}
        refreshDisabled={loading || refreshing}
      />

      {/* 2. Consolidated Toolbar with Dropdown Filters and Stat Cards */}
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
        territoryFilter={territoryFilter}
        onTerritoryFilterChange={(t) => {
          setTerritoryFilter(t);
          setPage(1);
        }}
        territoriesList={TERRITORIES_LIST}
      />

      {/* 3. Consolidated Table Component */}
      <AgentManagementTable
        agents={agents}
        loading={loading}
        onView={handleOpenDossier}
        onUpdateStatus={handleUpdateStatus}
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

      {/* 4. Consolidated Modals Component */}
      <AgentManagementModals
        selectedAgent={selectedAgent}
        onClose={() => setSelectedAgent(null)}
        onUpdateStatus={handleUpdateStatus}
        loading={dossierLoading}
      />
    </div>
  );
};

export default ManageAgents;
