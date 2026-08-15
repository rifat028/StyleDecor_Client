import React, { useContext, useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../auth/AuthContext";
import Spinner from "../home/components/Spinner";
import Swal from "sweetalert2";
import {
  User,
  Phone,
  Mail,
  Building,
  MapPin,
  Sparkles,
  ShieldCheck,
  Award,
  Edit,
  Save,
  CheckCircle2,
  Clock,
  Briefcase,
  Layers,
  Activity,
} from "lucide-react";

const AgentProfile = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    photoUrl: "",
    designation: "",
    specialization: "",
    experienceYears: 2,
    status: "available",
    bio: "",
    emergencyContact: "",
  });

  // 1. Integration: GET /agents/me
  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/agents/me");
      if (res.data?.success && res.data?.data) {
        const ag = res.data.data;
        setAgent(ag);
        setFormData({
          name: ag.name || "",
          phone: ag.phone || "",
          photoUrl: ag.photoUrl || "",
          designation: ag.designation || "Field Specialist",
          specialization: ag.specialization || "Floral & Stage Decoration",
          experienceYears: ag.experienceYears || 2,
          status: ag.status || "available",
          bio: ag.bio || "",
          emergencyContact: ag.emergencyContact || "",
        });
      }
    } catch (err) {
      console.error("Failed to load agent profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [axiosSecure]);

  // 2. Integration: PATCH /agents/me
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await axiosSecure.patch("/agents/me", formData);
      if (res.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Profile Saved 🎉",
          text: "Your specialist profile and operational availability have been updated.",
          timer: 1500,
          showConfirmButton: false,
        });
        setAgent(res.data.data);
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
      Swal.fire("Error", err.response?.data?.message || "Failed to update profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center p-8">
        <div className="space-y-3 max-w-md">
          <User className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Agent Profile Not Found
          </h2>
          <p className="text-xs text-slate-500">
            This user account is not currently linked to an active Field Specialist profile. Please contact your decorator agency.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 animate-fade-in space-y-8">
      {/* ================= Header Banner ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
            <User className="w-3.5 h-3.5" /> Specialist Identity & Credentials
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Agent Profile & Availability
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your credentials, craft specializations, emergency contacts, and live dispatch availability.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Card & Agency Affiliation */}
        <div className="lg:col-span-1 space-y-6">
          {/* Identity Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs text-center space-y-4">
            <div className="relative inline-block">
              <img
                src={agent.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"}
                alt={agent.name}
                className="w-24 h-24 rounded-3xl object-cover ring-4 ring-purple-500/20 mx-auto"
              />
              <span
                className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 ${
                  agent.status === "available"
                    ? "bg-emerald-500"
                    : agent.status === "on_assignment"
                    ? "bg-blue-500"
                    : "bg-slate-400"
                }`}
              />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                {agent.name}
              </h3>
              <p className="text-xs font-bold text-purple-600 dark:text-purple-400">
                {agent.designation}
              </p>
              <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-500" /> {agent.specialization}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700 flex items-center justify-around text-center text-xs">
              <div>
                <p className="text-lg font-black text-purple-600 dark:text-purple-400">
                  {agent.metrics?.rating || 4.8}★
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Rating</p>
              </div>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
              <div>
                <p className="text-lg font-black text-slate-900 dark:text-slate-100">
                  {agent.metrics?.completedEvents || 0}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Delivered</p>
              </div>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
              <div>
                <p className="text-lg font-black text-slate-900 dark:text-slate-100">
                  {agent.experienceYears || 2}y
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Exp</p>
              </div>
            </div>
          </div>

          {/* Affiliated Decorator Agency Card */}
          {agent.decorator && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
              <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5" /> Affiliated Decorator Agency
              </span>
              <h4 className="text-base font-black text-slate-900 dark:text-slate-100">
                {agent.decorator.businessName}
              </h4>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-purple-500" /> Operating Base: {agent.decorator.city}
              </p>
              {agent.decorator.phone && (
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-purple-500" /> Agency Hotline: {agent.decorator.phone}
                </p>
              )}
            </div>
          )}

          {/* Assigned Zones */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-purple-500" /> Assigned Coverage Zones
            </span>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              City: {agent.assignedArea?.city || "Dhaka"}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(agent.assignedArea?.zones || ["Dhanmondi", "Gulshan", "Banani"]).map((zone) => (
                <span
                  key={zone}
                  className="px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 font-bold text-[11px] border border-purple-200 dark:border-purple-900/50"
                >
                  {zone}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Editable Profile & Availability Form */}
        <div className="lg:col-span-2 space-y-6">
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  Edit Profile & Availability
                </h3>
                <p className="text-xs text-slate-400">Update your details and availability status</p>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer shadow-md shadow-purple-600/30 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>

            {/* Availability Status Switcher */}
            <div className="space-y-2">
              <label className="font-bold text-slate-800 dark:text-slate-100 text-xs">
                Current Operational Availability Status:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: "available", label: "Available", desc: "Ready for Dispatch" },
                  { id: "on_assignment", label: "On Assignment", desc: "Executing On-Site" },
                  { id: "off_duty", label: "Off Duty", desc: "Rest Hours" },
                  { id: "on_leave", label: "On Leave", desc: "Vacation / Away" },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, status: st.id })}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                      formData.status === st.id
                        ? "border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold shadow-xs"
                        : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <p className="font-bold text-xs">{st.label}</p>
                    <p className="text-[10px] text-slate-400">{st.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Basic Info Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Specialist Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Direct Phone / Mobile *
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Designation / Role Title
                </label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Primary Specialization
                </label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Avatar Photo URL
                </label>
                <input
                  type="url"
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Emergency Contact (Name & Phone)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Brother: +8801700000000"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Craft Bio & Experience Summary
              </label>
              <textarea
                rows={3}
                placeholder="Highlight your field rigging experience, floral installation expertise, or lighting certifications..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AgentProfile;
