import React, { useContext, useEffect, useMemo, useState, useCallback } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../auth/AuthContext";
import Spinner from "../home/components/Spinner";
import Swal from "sweetalert2";
import {
  Users,
  UserPlus,
  Star,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Clock,
  Edit,
  Trash2,
  Search,
  Award,
  X,
  MessageSquare,
  Building,
  ShieldCheck,
} from "lucide-react";

const MyAgents = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const [decoratorId, setDecoratorId] = useState(null);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAppraiseModalOpen, setIsAppraiseModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);

  // Form State
  const [agentForm, setAgentForm] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "Field Specialist",
    specialization: "Stage Architecture & Floral Setup",
    experienceYears: 2,
    city: "Dhaka",
    zones: "Dhanmondi, Gulshan",
    photoUrl: "",
    status: "available",
  });

  // Appraisal Form State
  const [appraisalForm, setAppraisalForm] = useState({
    rating: 5,
    comment: "",
    eventOutcome: "outstanding",
    recommendedForBigEvents: true,
  });

  // 1. Resolve Decorator ID
  useEffect(() => {
    const resolveDecorator = async () => {
      if (!user?.email) return;
      try {
        const res = await axiosSecure.get(`/decorators/${encodeURIComponent(user.email)}`);
        const dec = res.data?.data || res.data;
        if (dec?._id) {
          setDecoratorId(dec._id);
        }
      } catch (err) {
        console.error("Failed to resolve decorator profile:", err);
      }
    };
    resolveDecorator();
  }, [axiosSecure, user?.email]);

  // 2. Integration: GET /agents/decorator/:decoratorId
  const loadAgents = useCallback(async () => {
    if (!decoratorId) return;
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
    }
  }, [decoratorId, loadAgents]);

  // Filtered Agents
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

  // 3. Integration: POST /agents (Add/Hire Agent)
  const handleAddAgent = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: agentForm.name.trim(),
        email: agentForm.email.trim(),
        phone: agentForm.phone.trim(),
        decoratorId: decoratorId,
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

  // Open Edit Modal
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

  // 4. Integration: PATCH /agents/:id (Update Agent)
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

  // 5. Integration: DELETE /agents/:id (Remove Agent)
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

  // Open Appraisal Modal
  const handleOpenAppraise = (a) => {
    setSelectedAgent(a);
    setAppraisalForm({
      rating: 5,
      comment: "",
      eventOutcome: "outstanding",
      recommendedForBigEvents: true,
    });
    setIsAppraiseModalOpen(true);
  };

  // 6. Integration: POST /agents/:id/reviews (Submit Appraisal)
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

  // Status Badge Helper
  const renderStatusBadge = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "available") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 uppercase">
          <CheckCircle2 className="w-3 h-3" /> Available
        </span>
      );
    }
    if (s === "on_assignment" || s === "assigned") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 uppercase">
          <Clock className="w-3 h-3" /> On Assignment
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase">
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 animate-fade-in space-y-8">
      {/* ================= Header Banner ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5" /> Agency Specialist Workforce
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            My Field Agents & Specialists
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your agency's on-site setup crew, assign operational zones, and conduct performance appraisals.
          </p>
        </div>

        <button
          onClick={() => {
            setAgentForm({
              name: "",
              email: "",
              phone: "",
              designation: "Field Specialist",
              specialization: "Stage Architecture & Floral Setup",
              experienceYears: 2,
              city: "Dhaka",
              zones: "Dhanmondi, Gulshan",
              photoUrl: "",
              status: "available",
            });
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/30 cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5" /> Hire New Agent
        </button>
      </div>

      {/* ================= Search & Filters ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
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
          </select>
        </div>
      </div>

      {/* ================= Agents Grid ================= */}
      {loading ? (
        <div className="p-20 flex items-center justify-center">
          <Spinner />
        </div>
      ) : filteredAgents.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-16 border border-slate-200/80 dark:border-slate-800 text-center space-y-3 shadow-xs">
          <Users className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No Specialists Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You don't have any field agents registered under this criteria. Click "Hire New Agent" to expand your crew.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((a) => (
            <div
              key={a._id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={a.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"}
                      alt={a.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-purple-500/20"
                    />
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                        {a.name}
                      </h4>
                      <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                        {a.designation}
                      </p>
                    </div>
                  </div>
                  <div>{renderStatusBadge(a.status)}</div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <p className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                    <span className="truncate">{a.specialization}</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-400">
                    <Mail className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                    <span className="truncate">{a.email}</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                    <span>{a.phone}</span>
                  </p>
                </div>

                {/* Metrics Pill */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700 flex items-center justify-around text-center text-xs">
                  <div>
                    <span className="font-black text-purple-600 flex items-center justify-center gap-0.5">
                      <Star className="w-3 h-3 fill-current" /> {a.metrics?.rating || 4.8}
                    </span>
                    <p className="text-[10px] text-slate-400">Rating</p>
                  </div>
                  <div className="h-5 w-px bg-slate-200 dark:bg-slate-700" />
                  <div>
                    <span className="font-black text-slate-900 dark:text-slate-100">
                      {a.metrics?.completedEvents || 0}
                    </span>
                    <p className="text-[10px] text-slate-400">Completed</p>
                  </div>
                  <div className="h-5 w-px bg-slate-200 dark:bg-slate-700" />
                  <div>
                    <span className="font-black text-slate-900 dark:text-slate-100">
                      {a.metrics?.activeAssignedBookings || 0}
                    </span>
                    <p className="text-[10px] text-slate-400">Active Jobs</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleOpenAppraise(a)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 font-bold text-xs hover:bg-purple-100 cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5" /> Appraise
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(a)}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    title="Edit Specialist Details"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteAgent(a)}
                    className="p-2 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                    title="Remove from Roster"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= Add / Hire Agent Modal ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">
                  Hire / Register Field Specialist
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAgent} className="p-6 space-y-4 text-xs text-slate-700 dark:text-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 dark:text-slate-100">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariqul Islam"
                    value={agentForm.name}
                    onChange={(e) => setAgentForm({ ...agentForm, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 dark:text-slate-100">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="agent@styledecor.com"
                    value={agentForm.email}
                    onChange={(e) => setAgentForm({ ...agentForm, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 dark:text-slate-100">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+8801700000000"
                    value={agentForm.phone}
                    onChange={(e) => setAgentForm({ ...agentForm, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 dark:text-slate-100">Designation</label>
                  <input
                    type="text"
                    placeholder="Lead Stage Architect"
                    value={agentForm.designation}
                    onChange={(e) => setAgentForm({ ...agentForm, designation: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 dark:text-slate-100">Specialization</label>
                <input
                  type="text"
                  placeholder="e.g. Stage Architecture & Floral Setup"
                  value={agentForm.specialization}
                  onChange={(e) => setAgentForm({ ...agentForm, specialization: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 dark:text-slate-100">Operating City</label>
                  <input
                    type="text"
                    placeholder="Dhaka"
                    value={agentForm.city}
                    onChange={(e) => setAgentForm({ ...agentForm, city: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 dark:text-slate-100">Coverage Zones</label>
                  <input
                    type="text"
                    placeholder="Dhanmondi, Gulshan"
                    value={agentForm.zones}
                    onChange={(e) => setAgentForm({ ...agentForm, zones: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer"
                >
                  Register Specialist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= Edit Agent Modal ================= */}
      {isEditModalOpen && selectedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">
                  Edit Specialist: {selectedAgent.name}
                </h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-xs text-slate-700 dark:text-slate-200">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 dark:text-slate-100">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={agentForm.name}
                    onChange={(e) => setAgentForm({ ...agentForm, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 dark:text-slate-100">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={agentForm.phone}
                    onChange={(e) => setAgentForm({ ...agentForm, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 dark:text-slate-100">Designation</label>
                  <input
                    type="text"
                    value={agentForm.designation}
                    onChange={(e) => setAgentForm({ ...agentForm, designation: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 dark:text-slate-100">Status</label>
                  <select
                    value={agentForm.status}
                    onChange={(e) => setAgentForm({ ...agentForm, status: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 cursor-pointer"
                  >
                    <option value="available">Available</option>
                    <option value="on_assignment">On Assignment</option>
                    <option value="off_duty">Off Duty</option>
                    <option value="on_leave">On Leave</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 dark:text-slate-100">Specialization</label>
                <input
                  type="text"
                  value={agentForm.specialization}
                  onChange={(e) => setAgentForm({ ...agentForm, specialization: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= Appraisal Modal (POST /agents/:id/reviews) ================= */}
      {isAppraiseModalOpen && selectedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">
                  Appraise Specialist: {selectedAgent.name}
                </h3>
              </div>
              <button
                onClick={() => setIsAppraiseModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitAppraisal} className="p-6 space-y-4 text-xs text-slate-700 dark:text-slate-200">
              <div className="space-y-1">
                <label className="font-bold text-slate-800 dark:text-slate-100">Quality Rating Score (1 to 5 Stars)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setAppraisalForm({ ...appraisalForm, rating: star })}
                      className={`p-2 rounded-xl border text-base font-black cursor-pointer transition-all ${
                        appraisalForm.rating >= star
                          ? "border-amber-500 bg-amber-500 text-white shadow-xs"
                          : "border-slate-200 dark:border-slate-700 text-slate-400"
                      }`}
                    >
                      ★ {star}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 dark:text-slate-100">Event Execution Outcome</label>
                <select
                  value={appraisalForm.eventOutcome}
                  onChange={(e) => setAppraisalForm({ ...appraisalForm, eventOutcome: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 cursor-pointer capitalize"
                >
                  <option value="outstanding">Outstanding Execution</option>
                  <option value="excellent">Excellent - On Time</option>
                  <option value="good">Good - Minor Adjustments</option>
                  <option value="needs_improvement">Needs Improvement</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 dark:text-slate-100">Appraisal Review Comment</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Maintained flawless stage symmetry and completed floral setup ahead of schedule..."
                  value={appraisalForm.comment}
                  onChange={(e) => setAppraisalForm({ ...appraisalForm, comment: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={appraisalForm.recommendedForBigEvents}
                  onChange={(e) => setAppraisalForm({ ...appraisalForm, recommendedForBigEvents: e.target.checked })}
                  className="checkbox checkbox-primary checkbox-xs"
                />
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Recommend for VIP & Grand Gala Events
                </span>
              </label>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAppraiseModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer"
                >
                  Submit Appraisal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAgents;
