import React from "react";
import { Sparkles, Mail, Phone, Star, Award, Edit, Trash2 } from "lucide-react";
import TableActionButton from "../../../ui/TableActionButton";

// Status badge covering every value the filter/edit dropdowns can produce (available, on_assignment,
// off_duty, on_leave) so no agent status falls through to the generic gray default.
const renderStatusBadge = (status) => {
  const s = String(status || "").toLowerCase();
  if (s === "available") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 uppercase">
        Available
      </span>
    );
  }
  if (s === "on_assignment" || s === "assigned") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 uppercase">
        On Assignment
      </span>
    );
  }
  if (s === "off_duty") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 uppercase">
        Off Duty
      </span>
    );
  }
  if (s === "on_leave") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 uppercase">
        On Leave
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase">
      {status}
    </span>
  );
};

const AgentCard = ({ agent: a, onEdit, onDelete, onAppraise }) => {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 hover:shadow-md transition-all flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={a.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"}
              alt={a.name}
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-purple-500/20"
            />
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">{a.name}</h4>
              <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">{a.designation}</p>
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

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700 flex items-center justify-around text-center text-xs">
          <div>
            <span className="font-black text-purple-600 flex items-center justify-center gap-0.5">
              <Star className="w-3 h-3 fill-current" /> {a.metrics?.rating || 4.8}
            </span>
            <p className="text-[10px] text-slate-400">Rating</p>
          </div>
          <div className="h-5 w-px bg-slate-200 dark:bg-slate-700" />
          <div>
            <span className="font-black text-slate-900 dark:text-slate-100">{a.metrics?.completedEvents || 0}</span>
            <p className="text-[10px] text-slate-400">Completed</p>
          </div>
          <div className="h-5 w-px bg-slate-200 dark:bg-slate-700" />
          <div>
            <span className="font-black text-slate-900 dark:text-slate-100">{a.metrics?.activeAssignedBookings || 0}</span>
            <p className="text-[10px] text-slate-400">Active Jobs</p>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <button
          onClick={() => onAppraise(a)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 font-bold text-xs hover:bg-purple-100 cursor-pointer"
        >
          <Award className="w-3.5 h-3.5" /> Appraise
        </button>

        <div className="flex items-center gap-1">
          <TableActionButton icon={Edit} onClick={() => onEdit(a)} tooltip="Edit Specialist Details" tone="slate" size="md" />
          <TableActionButton icon={Trash2} onClick={() => onDelete(a)} tooltip="Remove from Roster" tone="rose" size="md" />
        </div>
      </div>
    </div>
  );
};

export default AgentCard;
