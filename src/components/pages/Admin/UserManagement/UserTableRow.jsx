import React from "react";
import { Mail, Phone, MapPin, Eye, Edit2, Trash2 } from "lucide-react";

// Individual user row for the administration user management table
const UserTableRow = ({
  user,
  superAdminEmail,
  onView,
  onEdit,
  onDelete,
  onQuickRoleChange,
  getPlaceholderAvatar,
  getRoleBadge,
}) => {
  const isSuperAdmin = user.email === superAdminEmail;

  return (
    <tr className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
      {/* User Profile Cell */}
      <td className="py-3.5 px-2 min-w-55">
        <div className="flex items-center gap-3">
          <img
            src={user.photoUrl || getPlaceholderAvatar(user.name, user.role)}
            alt={user.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = getPlaceholderAvatar(user.name, user.role);
            }}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-500/20 shrink-0"
          />
          <div className="min-w-0">
            <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 truncate">
              {user.name}
              {isSuperAdmin && (
                <span className="text-[10px] bg-rose-500 text-white font-black px-1.5 py-0.5 rounded-sm shrink-0">
                  SUPER ADMIN
                </span>
              )}
            </p>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 truncate">
              <Mail className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{user.email}</span>
            </p>
          </div>
        </div>
      </td>

      {/* Contact & City Cell */}
      <td className="py-3.5 px-2 min-w-45">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{user.phone || "No phone"}</span>
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span>
              {user.address?.area
                ? `${user.address.area}, ${user.address.city || "Dhaka"}`
                : `${user.address?.city || "Dhaka"}`}
            </span>
          </p>
        </div>
      </td>

      {/* System Role Badge Cell */}
      <td className="py-3.5 px-2 min-w-32.5">{getRoleBadge(user.role)}</td>

      {/* Quick Role Switch Select Cell */}
      <td className="py-3.5 px-2 text-center min-w-35">
        <select
          value={user.role}
          disabled={isSuperAdmin}
          onChange={(e) => onQuickRoleChange(user, e.target.value)}
          className="px-2 py-1 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-hidden focus:ring-1 focus:ring-purple-500"
        >
          <option value="customer">Customer</option>
          <option value="decorator">Decorator</option>
          <option value="agent">Agent</option>
          <option value="admin">Admin</option>
        </select>
      </td>

      {/* Centered Actions Cell with Bordered Buttons */}
      <td className="py-3.5 px-2 text-center min-w-30">
        <div className="flex items-center justify-center gap-2">
          {/* View Profile */}
          <button
            type="button"
            onClick={() => onView(user)}
            title="View Full Profile"
            className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/50 dark:hover:text-purple-400 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Edit User */}
          <button
            type="button"
            onClick={() => onEdit(user)}
            title="Edit User Details"
            className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 dark:hover:text-amber-400 transition-colors cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          {/* Delete User (Hidden for Super Admin) */}
          {!isSuperAdmin && (
            <button
              type="button"
              onClick={() => onDelete(user)}
              title="Delete User"
              className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 dark:hover:text-rose-400 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default UserTableRow;
