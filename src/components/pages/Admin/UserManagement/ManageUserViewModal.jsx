import React from "react";
import { Mail, Phone, MapPin, Calendar, Clock, ShieldCheck, User } from "lucide-react";
import Modal from "../../../ui/Modal";

// Modal displaying detailed user record and address dossier
const ManageUserViewModal = ({
  user,
  isOpen,
  onClose,
  getPlaceholderAvatar,
  getRoleBadge,
}) => {
  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User Account Details"
      maxWidth="max-w-xl"
    >
      <div className="space-y-6">
        {/* Header Avatar and Basic Details */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
          <img
            src={user.photoUrl || getPlaceholderAvatar(user.name, user.role)}
            alt={user.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = getPlaceholderAvatar(user.name, user.role);
            }}
            className="w-16 h-16 rounded-full object-cover ring-4 ring-purple-500/20 shrink-0"
          />
          <div className="text-center sm:text-left space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {user.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{user.email}</span>
            </p>
            <div className="pt-1">{getRoleBadge(user.role)}</div>
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
              {user.phone || "Not provided"}
            </p>
          </div>

          {/* City / Division */}
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Primary City
            </p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {user.address?.city || "Dhaka"}
            </p>
          </div>

          {/* Street Address */}
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 sm:col-span-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Full Physical Address
            </p>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {[
                user.address?.street,
                user.address?.area,
                user.address?.city,
                user.address?.postalCode && `Postal Code: ${user.address.postalCode}`,
              ]
                .filter(Boolean)
                .join(", ") || "No address recorded on file"}
            </p>
          </div>

          {/* Account Creation Date */}
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Member Since
            </p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Standard"}
            </p>
          </div>

          {/* User ID */}
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Database Identifier
            </p>
            <p className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300 truncate">
              {user._id}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ManageUserViewModal;
