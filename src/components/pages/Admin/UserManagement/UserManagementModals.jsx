import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Shield,
  Image,
} from "lucide-react";
import Modal from "../../../ui/Modal";
import { DIVISION_DISTRICTS_MAP, ALL_BANGLADESH_DISTRICTS } from "../../../../lib/constants";

// Consolidated View and Edit Modals for User Management (250-300 lines)
const UserManagementModals = ({
  viewingUser,
  onCloseView,
  editingUser,
  onCloseEdit,
  editFormData,
  setEditFormData,
  onSaveEdit,
  submittingEdit,
  divisionsList,
  superAdminEmail,
  getPlaceholderAvatar,
  getRoleBadge,
}) => {
  const isSuperAdmin = editingUser?.email === superAdminEmail;

  return (
    <>
      {/* 1. View User Account Dossier Modal */}
      <Modal
        isOpen={!!viewingUser}
        onClose={onCloseView}
        title="User Account Details"
        maxWidth="max-w-xl"
      >
        {viewingUser && (
          <div className="space-y-6">
            {/* Header Avatar and Basic Details */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
              <img
                src={
                  viewingUser.photoUrl ||
                  getPlaceholderAvatar(viewingUser.name, viewingUser.role)
                }
                alt={viewingUser.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getPlaceholderAvatar(
                    viewingUser.name,
                    viewingUser.role
                  );
                }}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-purple-500/20 shrink-0"
              />
              <div className="text-center sm:text-left space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {viewingUser.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{viewingUser.email}</span>
                </p>
                <div className="pt-1">{getRoleBadge(viewingUser.role)}</div>
              </div>
            </div>

            {/* Detailed Grid Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone */}
              <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> Phone Contact
                </p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {viewingUser.phone || "Not provided"}
                </p>
              </div>

              {/* Division */}
              <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Division
                </p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {viewingUser.address?.division || viewingUser.address?.city || "Dhaka"}
                </p>
              </div>

              {/* Physical Address */}
              <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 sm:col-span-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Full Physical Address
                </p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {[
                    viewingUser.address?.home || viewingUser.address?.street,
                    viewingUser.address?.district || viewingUser.address?.area,
                    viewingUser.address?.division || viewingUser.address?.city,
                    viewingUser.address?.postalCode &&
                      `Postal Code: ${viewingUser.address.postalCode}`,
                  ]
                    .filter(Boolean)
                    .join(", ") || "No address recorded on file"}
                </p>
              </div>

              {/* Created At */}
              <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Member Since
                </p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {viewingUser.createdAt
                    ? new Date(viewingUser.createdAt).toLocaleDateString()
                    : "Standard"}
                </p>
              </div>

              {/* Database ID */}
              <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Database Identifier
                </p>
                <p className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300 truncate">
                  {viewingUser._id}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={onCloseView}
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* 2. Edit User Profile Modal */}
      <Modal
        isOpen={!!editingUser}
        onClose={onCloseEdit}
        title={`Edit User: ${editingUser?.name || ""}`}
        maxWidth="max-w-2xl"
      >
        {editingUser && (
          <form onSubmit={onSaveEdit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  Phone Number
                </label>
                <input
                  type="text"
                  value={editFormData.phone}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      phone: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                />
              </div>

              {/* Photo URL */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Image className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  Avatar Image URL
                </label>
                <input
                  type="url"
                  value={editFormData.photoUrl}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      photoUrl: e.target.value,
                    })
                  }
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                />
              </div>

              {/* Role */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  System Role
                </label>
                <select
                  value={editFormData.role}
                  disabled={isSuperAdmin}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      role: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <option value="customer">Customer</option>
                  <option value="decorator">Decorator</option>
                  <option value="agent">Agent</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Division */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  Division
                </label>
                <select
                  value={editFormData.division}
                  onChange={(e) => {
                    const newDivision = e.target.value;
                    const districtsInNewDivision = DIVISION_DISTRICTS_MAP[newDivision] || [];
                    const isDistrictStillValid = districtsInNewDivision.includes(editFormData.district);
                    setEditFormData({
                      ...editFormData,
                      division: newDivision,
                      district: isDistrictStillValid ? editFormData.district : (districtsInNewDivision[0] || ""),
                    });
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer transition-all"
                >
                  {divisionsList
                    .filter((d) => d !== "all")
                    .map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                </select>
              </div>

              {/* District */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  District
                </label>
                <select
                  value={editFormData.district}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      district: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer transition-all"
                >
                  <option value="">Select District</option>
                  {(DIVISION_DISTRICTS_MAP[editFormData.division] || ALL_BANGLADESH_DISTRICTS).map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                  {editFormData.district &&
                    !(DIVISION_DISTRICTS_MAP[editFormData.division] || []).includes(editFormData.district) && (
                      <option value={editFormData.district}>{editFormData.district}</option>
                    )}
                </select>
              </div>

              {/* Postal Code */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={editFormData.postalCode}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      postalCode: e.target.value,
                    })
                  }
                  placeholder="e.g. 1702"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                />
              </div>

              {/* Home / Street Address */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Home / Street Address
                </label>
                <input
                  type="text"
                  value={editFormData.home}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      home: e.target.value,
                    })
                  }
                  placeholder="e.g. H.No 34/5, Nawapara"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                />
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onCloseEdit}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingEdit}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {submittingEdit ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
};

export default UserManagementModals;
