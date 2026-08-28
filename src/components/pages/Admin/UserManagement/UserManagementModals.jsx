import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Shield,
  Image,
  Search,
  X,
  ChevronDown,
  Check,
} from "lucide-react";
import Modal from "../../../ui/Modal";
import { DIVISION_DISTRICTS_MAP, ALL_BANGLADESH_DISTRICTS } from "../../../../lib/constants";

// Searchable Select Component for Modal Dropdowns
const SearchableSelect = ({
  value,
  onChange,
  options = [],
  placeholder = "Select...",
  searchPlaceholder = "Search...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
    if (!isOpen) {
      setSearchTerm("");
    }
  }, [isOpen]);

  // Normalize string and object options
  const normalizedOptions = useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === "object" && opt !== null) {
        return { value: opt.value, label: opt.label || opt.value };
      }
      return { value: opt, label: String(opt) };
    });
  }, [options]);

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return normalizedOptions;
    const lower = searchTerm.toLowerCase().trim();
    return normalizedOptions.filter((opt) =>
      opt.label.toLowerCase().includes(lower)
    );
  }, [normalizedOptions, searchTerm]);

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 hover:border-purple-400 dark:hover:border-purple-600 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all cursor-pointer text-left"
      >
        <span className="truncate">
          <span
            className={
              selectedOption
                ? "font-medium text-slate-800 dark:text-slate-100"
                : "text-slate-400 dark:text-slate-500"
            }
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-purple-600 dark:text-purple-400" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-full max-h-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 flex flex-col animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden">
          <div className="p-2 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-8 pr-7 py-1.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-1.5 focus:ring-purple-500/30 focus:border-purple-500 transition-all"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setIsOpen(false);
                    setSearchTerm("");
                  }
                }}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchTerm("");
                    searchInputRef.current?.focus();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          <div className="overflow-y-auto py-1 max-h-48 scrollbar-thin">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-3 text-center text-xs text-slate-400 dark:text-slate-500">
                No matching results
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer text-left ${
                      isSelected
                        ? "bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 font-bold"
                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80"
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

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
                <SearchableSelect
                  value={editFormData.division}
                  onChange={(newDivision) => {
                    const districtsInNewDivision = DIVISION_DISTRICTS_MAP[newDivision] || [];
                    const isDistrictStillValid = districtsInNewDivision.includes(editFormData.district);
                    setEditFormData({
                      ...editFormData,
                      division: newDivision,
                      district: isDistrictStillValid ? editFormData.district : (districtsInNewDivision[0] || ""),
                    });
                  }}
                  options={divisionsList.filter((d) => d !== "all")}
                  placeholder="Select Division"
                  searchPlaceholder="Search division..."
                />
              </div>

              {/* District */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  District
                </label>
                <SearchableSelect
                  value={editFormData.district}
                  onChange={(newDistrict) =>
                    setEditFormData({
                      ...editFormData,
                      district: newDistrict,
                    })
                  }
                  options={
                    editFormData.district &&
                    !(DIVISION_DISTRICTS_MAP[editFormData.division] || ALL_BANGLADESH_DISTRICTS).includes(editFormData.district)
                      ? [
                          editFormData.district,
                          ...(DIVISION_DISTRICTS_MAP[editFormData.division] || ALL_BANGLADESH_DISTRICTS),
                        ]
                      : (DIVISION_DISTRICTS_MAP[editFormData.division] || ALL_BANGLADESH_DISTRICTS)
                  }
                  placeholder="Select District"
                  searchPlaceholder="Search district..."
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
