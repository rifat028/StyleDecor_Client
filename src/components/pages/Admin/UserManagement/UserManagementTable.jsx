import React from "react";
import { Users, Mail, Phone, MapPin, Eye, Edit2, Trash2 } from "lucide-react";
import TableSkeleton from "../../../ui/TableSkeleton";
import EmptyState from "../../../ui/EmptyState";
import Pagination from "../../../ui/Pagination";
import TableActionButton from "../../../ui/TableActionButton";

// User management table with responsive min-widths, skeleton state, and integrated pagination (180-220 lines)
const UserManagementTable = ({
  users,
  loading,
  superAdminEmail,
  onView,
  onEdit,
  onDelete,
  onQuickRoleChange,
  getPlaceholderAvatar,
  getRoleBadge,
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
                <th className="py-3.5 px-2 min-w-55">User Profile</th>
                <th className="py-3.5 px-2 min-w-45">Contact & Location</th>
                <th className="py-3.5 px-2 text-center min-w-32.5">System Role</th>
                <th className="py-3.5 px-2 text-center min-w-40">Quick Role Switch</th>
                <th className="py-3.5 px-2 text-center min-w-30">Actions</th>
              </tr>
            </thead>
            <TableSkeleton rows={5} columns={5} />
          </table>
        </div>
      ) : users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Users Found"
          message="Try adjusting your search criteria or role filters."
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
                <th className="py-3.5 px-2 min-w-55">User Profile</th>
                <th className="py-3.5 px-2 min-w-45">Contact & Location</th>
                <th className="py-3.5 px-2 text-center min-w-32.5">System Role</th>
                <th className="py-3.5 px-2 text-center min-w-40">Quick Role Switch</th>
                <th className="py-3.5 px-2 text-center min-w-30">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {users.map((user) => {
                const isSuperAdmin = user.email === superAdminEmail;
                const locDistrict = user.address?.district || user.address?.area;
                const locDivision = user.address?.division || user.address?.city || "Dhaka";
                const locationText = locDistrict ? `${locDistrict}, ${locDivision}` : locDivision;

                return (
                  <tr
                    key={user._id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* User Profile Cell */}
                    <td className="py-3.5 px-2 min-w-55">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            user.photoUrl ||
                            getPlaceholderAvatar(user.name, user.role)
                          }
                          alt={user.name}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = getPlaceholderAvatar(
                              user.name,
                              user.role
                            );
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

                    {/* Contact & Location Cell */}
                    <td className="py-3.5 px-2 min-w-45">
                      <div className="space-y-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 min-w-0">
                          <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{user.phone || "No phone"}</span>
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 min-w-0">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span
                            className="line-clamp-1"
                            title={locationText}
                          >
                            {locationText}
                          </span>
                        </p>
                      </div>
                    </td>

                    {/* System Role Badge Cell */}
                    <td className="py-3.5 px-2 text-center min-w-32.5">
                      <div className="flex justify-center">
                        {getRoleBadge(user.role)}
                      </div>
                    </td>

                    {/* Quick Role Switch Select Cell */}
                    <td className="py-3.5 px-2 text-center min-w-40">
                      <select
                        value={user.role}
                        disabled={isSuperAdmin}
                        onChange={(e) =>
                          onQuickRoleChange(user, e.target.value)
                        }
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
                        <TableActionButton
                          icon={Eye}
                          onClick={() => onView(user)}
                          tooltip="View Full Profile"
                          tone="purple"
                        />

                        {/* Edit User */}
                        <TableActionButton
                          icon={Edit2}
                          onClick={() => onEdit(user)}
                          tooltip="Edit User Details"
                          tone="amber"
                        />

                        {/* Delete User (Disabled for Super Admin) */}
                        <TableActionButton
                          icon={Trash2}
                          disabled={isSuperAdmin}
                          onClick={() => onDelete(user)}
                          tooltip="Delete User"
                          disabledTooltip="Super Admin Account Cannot Be Deleted"
                          tone="rose"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 3-Part Streamlined Pagination Footer */}
      {!loading && users.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          limit={limit}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
          itemLabel="users"
        />
      )}
    </div>
  );
};

export default UserManagementTable;
