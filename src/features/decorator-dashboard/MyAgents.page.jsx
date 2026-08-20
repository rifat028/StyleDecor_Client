import React, { useContext, useEffect, useMemo, useState, useCallback } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../auth/AuthContext";
import useDecoratorId from "../../hooks/useDecoratorId";
import Swal from "sweetalert2";
import Spinner from "../home/components/Spinner";
import DashboardPageHeader from "../../components/ui/DashboardPageHeader";
import EmptyState from "../../components/ui/EmptyState";
import { Users, UserPlus, Search } from "lucide-react";
import AgentCard from "../../components/pages/Decorator/MyAgents/AgentCard";
import { AddAgentModal, EditAgentModal, AppraiseAgentModal } from "../../components/pages/Decorator/MyAgents/MyAgentsModals";

const DEFAULT_AGENT_FORM = {
  name: "", email: "", phone: "", designation: "Field Specialist",
  specialization: "Stage Architecture & Floral Setup", experienceYears: 2,
  city: "Dhaka", zones: "Dhanmondi, Gulshan", photoUrl: "", status: "available",
};

const MyAgents = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const { decoratorId, loading: profileLoading } = useDecoratorId(user?.email);

  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAppraiseModalOpen, setIsAppraiseModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);

  const [agentForm, setAgentForm] = useState(DEFAULT_AGENT_FORM);
  const [appraisalForm, setAppraisalForm] = useState({
    rating: 5, comment: "", eventOutcome: "outstanding", recommendedForBigEvents: true,
  });

  // GET /agents/decorator/:decoratorId
  const loadAgents = useCallback(async () => {
    if (!decoratorId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await axiosSecure.get(`/agents/decorator/${decoratorId}`);
      const list = res.data?.data || [];
      setAgents(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to load agency agents:", err);
      setAgents([]);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure, decoratorId]);

  useEffect(() => {
    if (decoratorId) {
      loadAgents();
    } else if (!profileLoading) {
      setLoading(false);
    }
  }, [loadAgents, decoratorId, profileLoading]);

  const isInitialLoading = profileLoading || loading;

  const filteredAgents = useMemo(() => {
    return agents.filter((a) => {
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (searchText.trim()) {
        const q = searchText.toLowerCase();
        const name = (a.name || "").toLowerCase();
        const email = (a.email || "").toLowerCase();
        const des = (a.designation || "").toLowerCase();
        const spec = (a.specialization || "").toLowerCase();
        if (!name.includes(q) && !email.includes(q) && !des.includes(q) && !spec.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [agents, statusFilter, searchText]);

  // POST /agents
  const handleAddAgent = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: agentForm.name.trim(),
        email: agentForm.email.trim(),
        phone: agentForm.phone.trim(),
        decoratorId,
        designation: agentForm.designation.trim(),
        specialization: agentForm.specialization.trim(),
        experienceYears: Number(agentForm.experienceYears),
        assignedArea: {
          city: agentForm.city.trim(),
          zones: agentForm.zones.split(",").map((z) => z.trim()).filter(Boolean),
        },
        photoUrl: agentForm.photoUrl.trim() || undefined,
        status: agentForm.status,
      };

      const res = await axiosSecure.post("/agents", payload);
      if (res.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Specialist Added 🎉",
          text: "New field agent has been registered to your agency team.",
          timer: 1500,
          showConfirmButton: false,
        });
        setIsAddModalOpen(false);
        loadAgents();
      }
    } catch (err) {
      console.error("Failed to add agent:", err);
      Swal.fire("Error", err.response?.data?.message || "Failed to add agent.", "error");
    }
  };

  const handleOpenEdit = (a) => {
    setSelectedAgent(a);
    setAgentForm({
      name: a.name || "",
      email: a.email || "",
      phone: a.phone || "",
      designation: a.designation || "Field Specialist",
      specialization: a.specialization || "Stage Architecture",
      experienceYears: a.experienceYears || 2,
      city: a.assignedArea?.city || "Dhaka",
      zones: Array.isArray(a.assignedArea?.zones) ? a.assignedArea.zones.join(", ") : "Dhanmondi",
      photoUrl: a.photoUrl || "",
      status: a.status || "available",
    });
    setIsEditModalOpen(true);
  };

  // PATCH /agents/:id
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!selectedAgent?._id) return;

    try {
      const payload = {
        name: agentForm.name.trim(),
        phone: agentForm.phone.trim(),
        designation: agentForm.designation.trim(),
        specialization: agentForm.specialization.trim(),
        experienceYears: Number(agentForm.experienceYears),
        assignedArea: {
          city: agentForm.city.trim(),
          zones: agentForm.zones.split(",").map((z) => z.trim()).filter(Boolean),
        },
        photoUrl: agentForm.photoUrl.trim() || undefined,
        status: agentForm.status,
      };

      const res = await axiosSecure.patch(`/agents/${selectedAgent._id}`, payload);
      if (res.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Updated",
          text: "Agent details updated successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
        setIsEditModalOpen(false);
        loadAgents();
      }
    } catch (err) {
      console.error("Failed to update agent:", err);
      Swal.fire("Error", err.response?.data?.message || "Failed to update agent.", "error");
    }
  };

  // DELETE /agents/:id
  const handleDeleteAgent = async (a) => {
    const confirm = await Swal.fire({
      title: "Remove Field Specialist?",
      text: `Are you sure you want to remove ${a.name} from your agency roster?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Remove",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.delete(`/agents/${a._id}`);
      Swal.fire({
        icon: "success",
        title: "Removed",
        text: "Agent has been removed from your roster.",
        timer: 1500,
        showConfirmButton: false,
      });
      loadAgents();
    } catch (err) {
      console.error("Failed to remove agent:", err);
      Swal.fire("Error", err.response?.data?.message || "Failed to remove agent.", "error");
    }
  };

  const handleOpenAppraise = (a) => {
    setSelectedAgent(a);
    setAppraisalForm({ rating: 5, comment: "", eventOutcome: "outstanding", recommendedForBigEvents: true });
    setIsAppraiseModalOpen(true);
  };

  // POST /agents/:id/reviews
  const handleSubmitAppraisal = async (e) => {
    e.preventDefault();
    if (!selectedAgent?._id) return;

    try {
      const res = await axiosSecure.post(`/agents/${selectedAgent._id}/reviews`, appraisalForm);
      if (res.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Appraisal Recorded 🎉",
          text: "Performance evaluation logged and new rating calculated.",
          timer: 1500,
          showConfirmButton: false,
        });
        setIsAppraiseModalOpen(false);
        loadAgents();
      }
    } catch (err) {
      console.error("Failed to submit appraisal:", err);
      Swal.fire("Error", err.response?.data?.message || "Failed to submit appraisal.", "error");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <DashboardPageHeader
        icon={Users}
        title="My Field Agents & Specialists"
        subtitle="Manage your agency's on-site setup crew, assign operational zones, and conduct performance appraisals."
        onRefresh={loadAgents}
        refreshing={isInitialLoading}
        refreshDisabled={isInitialLoading}
        actions={
          <button
            type="button"
            onClick={() => {
              setAgentForm(DEFAULT_AGENT_FORM);
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold shadow-md shadow-purple-600/25 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Hire New Agent</span>
          </button>
        }
      />

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by agent name, email, or specialization..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 cursor-pointer"
          >
            <option value="all">All Agents</option>
            <option value="available">Available</option>
            <option value="on_assignment">On Assignment</option>
            <option value="off_duty">Off Duty</option>
            <option value="on_leave">On Leave</option>
          </select>
        </div>
      </div>

      {isInitialLoading ? (
        <div className="p-20 flex items-center justify-center">
          <Spinner />
        </div>
      ) : filteredAgents.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Specialists Found"
          message='You don&apos;t have any field agents registered under this criteria. Click "Hire New Agent" to expand your crew.'
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((a) => (
            <AgentCard key={a._id} agent={a} onEdit={handleOpenEdit} onDelete={handleDeleteAgent} onAppraise={handleOpenAppraise} />
          ))}
        </div>
      )}

      <AddAgentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        agentForm={agentForm}
        setAgentForm={setAgentForm}
        onSubmit={handleAddAgent}
      />

      <EditAgentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        selectedAgent={selectedAgent}
        agentForm={agentForm}
        setAgentForm={setAgentForm}
        onSubmit={handleSaveEdit}
      />

      <AppraiseAgentModal
        isOpen={isAppraiseModalOpen}
        onClose={() => setIsAppraiseModalOpen(false)}
        selectedAgent={selectedAgent}
        appraisalForm={appraisalForm}
        setAppraisalForm={setAppraisalForm}
        onSubmit={handleSubmitAppraisal}
      />
    </div>
  );
};

export default MyAgents;
