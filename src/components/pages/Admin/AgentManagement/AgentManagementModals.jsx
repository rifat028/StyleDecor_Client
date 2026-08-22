import React from "react";
import {
  Users,
  CheckCircle2,
  Activity,
  UserX,
  MapPin,
  Phone,
  Mail,
  Building,
  Star,
  Trash2,
  Award,
  Shield,
} from "lucide-react";
import Modal from "../../../ui/Modal";

// Helper for placeholder avatar
const getAgentAvatar = (name = "Agent") => {
  const initials = encodeURIComponent(name || "Agent");
  return `https://ui-avatars.com/api/?name=${initials}&background=D97706&color=ffffff&bold=true&size=150`;
};

// Consolidated Agent Dossier Modal (200-240 lines)
const AgentManagementModals = ({
  selectedAgent,
  onClose,
  onUpdateStatus,
  onDelete,
  loading = false,
}) => {
  if (!selectedAgent) return null;

  const status = String(selectedAgent.status || "").toLowerCase();

  return (
    <Modal
      isOpen={!!selectedAgent}
      onClose={onClose}
      title="Field Specialist Dossier"
      maxWidth="max-w-xl"
    >
      <div className="space-y-6">
        {/* Header Profile Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
          <img
            src={selectedAgent.photoUrl || selectedAgent.user?.photoUrl || selectedAgent.avatar || getAgentAvatar(selectedAgent.name)}
            alt={selectedAgent.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = getAgentAvatar(selectedAgent.name);
            }}
            className="w-16 h-16 rounded-full object-cover ring-4 ring-purple-500/20 shrink-0 bg-white dark:bg-slate-900"
          />
          <div className="text-center sm:text-left space-y-1 min-w-0 flex-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {selectedAgent.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{selectedAgent.email || selectedAgent.user?.email}</span>
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-3 pt-1 text-xs">
              <span className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{Number(selectedAgent.metrics?.rating || selectedAgent.rating || 4.9).toFixed(1)}</span>
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                {selectedAgent.metrics?.completedEvents ?? selectedAgent.completedEventsCount ?? selectedAgent.completedMissions ?? 0}{" "}
                Events Completed
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Grid Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Phone Contact */}
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Phone Contact
            </p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {selectedAgent.phone || selectedAgent.user?.phone || "Not provided"}
            </p>
          </div>

          {/* Territory / Zone */}
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Service Territory
            </p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {selectedAgent.assignedArea?.district
                ? `${selectedAgent.assignedArea.district}, ${selectedAgent.assignedArea.division || "Dhaka"}`
                : (selectedAgent.serviceArea || selectedAgent.city || "Dhaka Zone")}
            </p>
          </div>

          {/* Affiliated Agency */}
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 sm:col-span-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Affiliated Agency
            </p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {selectedAgent.decorator?.businessName || selectedAgent.agencyName || "Independent Registered Specialist"}
            </p>
          </div>

          {/* Specialization / Skills */}
          {(selectedAgent.specialization || selectedAgent.skills) && (
            <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 sm:col-span-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Technical Competencies
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                {selectedAgent.specialization || (Array.isArray(selectedAgent.skills) ? selectedAgent.skills.join(", ") : selectedAgent.skills)}
              </p>
            </div>
          )}
        </div>

        {/* Modal Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => onDelete(selectedAgent)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 font-semibold text-xs transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Remove Specialist</span>
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors cursor-pointer"
            >
              Close
            </button>

            {status !== "available" && status !== "active" && (
              <button
                type="button"
                onClick={() => onUpdateStatus(selectedAgent, "available")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Available</span>
              </button>
            )}

            {status !== "suspended" && (
              <button
                type="button"
                onClick={() => onUpdateStatus(selectedAgent, "suspended")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer"
              >
                <UserX className="w-4 h-4" />
                <span>Suspend Agent</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AgentManagementModals;
