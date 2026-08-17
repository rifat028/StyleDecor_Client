import React from "react";
import { User, Phone, MapPin, Shield, Image, X } from "lucide-react";
import Modal from "../../../ui/Modal";

// Modal providing full user detail editing form
const ManageUserEditModal = ({
  user,
  isOpen,
  onClose,
  editFormData,
  setEditFormData,
  onSubmit,
  submitting,
  citiesList,
  superAdminEmail,
}) => {
  if (!user) return null;

  const isSuperAdmin = user.email === superAdminEmail;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit User: ${user.name}`}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={onSubmit} className="space-y-4">
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
                setEditFormData({ ...editFormData, name: e.target.value })
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
                setEditFormData({ ...editFormData, phone: e.target.value })
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
                setEditFormData({ ...editFormData, photoUrl: e.target.value })
              }
              placeholder="https://example.com/avatar.jpg"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            />
          </div>

          {/* System Role */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              System Role
            </label>
            <select
              value={editFormData.role}
              disabled={isSuperAdmin}
              onChange={(e) =>
                setEditFormData({ ...editFormData, role: e.target.value })
              }
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <option value="customer">Customer</option>
              <option value="decorator">Decorator</option>
              <option value="agent">Agent</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* City */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              City
            </label>
            <select
              value={editFormData.city}
              onChange={(e) =>
                setEditFormData({ ...editFormData, city: e.target.value })
              }
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer transition-all"
            >
              {citiesList
                .filter((c) => c !== "all")
                .map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
            </select>
          </div>

          {/* Area */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Area / Thana
            </label>
            <input
              type="text"
              value={editFormData.area}
              onChange={(e) =>
                setEditFormData({ ...editFormData, area: e.target.value })
              }
              placeholder="e.g. Gulshan, Dhanmondi"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            />
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
                setEditFormData({ ...editFormData, postalCode: e.target.value })
              }
              placeholder="e.g. 1212"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            />
          </div>

          {/* Street Address */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Street Address
            </label>
            <input
              type="text"
              value={editFormData.street}
              onChange={(e) =>
                setEditFormData({ ...editFormData, street: e.target.value })
              }
              placeholder="House, Road, Block details"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            />
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {submitting ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ManageUserEditModal;
