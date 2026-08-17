import React from "react";
import {
  Users,
  CheckCircle2,
  Activity,
  UserX,
  MapPin,
  Phone,
  Mail,
  Eye,
  Trash2,
  Star,
  Building,
} from "lucide-react";
import TableSkeleton from "../../../ui/TableSkeleton";
import EmptyState from "../../../ui/EmptyState";
import Pagination from "../../../ui/Pagination";

// Helper to render categorical status badge for field agents
const renderStatusBadge = (status) => {
  const s = String(status || "").toLowerCase();
  if (s === "available" || s === "active") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 uppercase">
        <CheckCircle2 className="w-3 h-3" /> Available
      </span>
    );
  }
  if (s === "on_assignment" || s === "assigned") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 uppercase">
        <Activity className="w-3 h-3" /> On Assignment
      </span>
    );
  }
  if (s === "suspended") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 uppercase">
        <UserX className="w-3 h-3" /> Suspended
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase">
      {status}
    </span>
  );
};

// Helper for placeholder avatar
const getAgentAvatar = (name = "Agent") => {
  const initials = encodeURIComponent(name || "Agent");
  return `https://ui-avatars.com/api/?name=${initials}&background=D97706&color=ffffff&bold=true&size=150`;
};

// Agent management table component with responsive min-widths and pagination (200-240 lines)
const AgentManagementTable = ({
  agents,
  loading,
  onView,
  onDelete,
  onResetFilters,
  page,
  totalPages,
  totalCount,
  limit,
  onPageChange,
  onLimitChange,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden rounded-none">
      {loading ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
                <th className="py-3.5 px-2 min-w-55">Specialist Profile</th>
                <th className="py-3.5 px-2 min-w-45">Territory & Agency</th>
                <th className="py-3.5 px-2 text-center min-w-32.5">Performance</th>
                <th className="py-3.5 px-2 text-center min-w-35">Availability</th>
                <th className="py-3.5 px-2 text-center min-w-30">Actions</th>
              </tr>
            </thead>
            <TableSkeleton rows={5} columns={5} />
          </table>
        </div>
      ) : agents.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Field Agents Found"
          message="Try adjusting your search criteria or filter selections."
          action={{
            label: "Clear All Filters",
            onClick: onResetFilters,
          }}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
                <th className="py-3.5 px-2 min-w-55">Specialist Profile</th>
                <th className="py-3.5 px-2 min-w-45">Territory & Agency</th>
                <th className="py-3.5 px-2 text-center min-w-32.5">Performance</th>
                <th className="py-3.5 px-2 text-center min-w-35">Availability</th>
                <th className="py-3.5 px-2 text-center min-w-30">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {agents.map((agent) => (
                <tr
                  key={agent._id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* Specialist Profile Cell */}
                  <td className="py-3.5 px-2 min-w-55">
                    <div className="flex items-center gap-3">
                      <img
                        src={agent.avatar || getAgentAvatar(agent.name)}
                        alt={agent.name}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = getAgentAvatar(agent.name);
                        }}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/20 shrink-0 bg-slate-100 dark:bg-slate-800"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
                          {agent.name}
                        </p>
                        <p className="text-xs text-slate-400 flex items-center gap-1 truncate">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{agent.email}</span>
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Territory & Affiliated Agency Cell */}
                  <td className="py-3.5 px-2 min-w-45">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 truncate">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>
                          {agent.serviceArea || agent.city || "Dhaka Zone"}
                        </span>
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
                        <Building className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{agent.agencyName || "Independent"}</span>
                      </p>
                    </div>
                  </td>

                  {/* Performance & Missions Completed Cell */}
                  <td className="py-3.5 px-2 text-center min-w-32.5">
                    <div className="inline-flex flex-col items-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{Number(agent.rating || 4.9).toFixed(1)}</span>
                      </span>
                      <span className="text-[11px] text-slate-400 mt-1">
                        {agent.completedEventsCount ||
                          agent.completedMissions ||
                          0}{" "}
                        events
                      </span>
                    </div>
                  </td>

                  {/* Availability Badge Cell */}
                  <td className="py-3.5 px-2 text-center min-w-35">
                    {renderStatusBadge(agent.status)}
                  </td>

                  {/* Centered Actions Cell with Bordered Buttons */}
                  <td className="py-3.5 px-2 text-center min-w-30">
                    <div className="flex items-center justify-center gap-2">
                      {/* View Dossier Button */}
                      <button
                        type="button"
                        onClick={() => onView(agent)}
                        title="View Specialist Dossier"
                        className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/50 dark:hover:text-purple-400 transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Delete Agent Button */}
                      <button
                        type="button"
                        onClick={() => onDelete(agent)}
                        title="Delete Agent"
                        className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 dark:hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3-Part Streamlined Pagination Footer */}
      {!loading && agents.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          limit={limit}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
          itemLabel="agents"
        />
      )}
    </div>
  );
};

export default AgentManagementTable;
