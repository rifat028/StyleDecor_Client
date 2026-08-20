import React from "react";
import { Building, Save } from "lucide-react";
import Modal from "../../../ui/Modal";
import CoverageZonesEditor from "./CoverageZonesEditor";
import CategorySpecializationPicker from "./CategorySpecializationPicker";

const POPULAR_ZONES = [
  "Dhaka", "Gulshan", "Banani", "Dhanmondi", "Uttara", "Mirpur",
  "Bashundhara", "Mohakhali", "Chattogram", "Sylhet", "Rajshahi", "Khulna",
  "Cumilla", "Gazipur",
];

const POPULAR_CATEGORIES = [
  "Wedding & Pre-Wedding", "Corporate Galas & Expos", "Birthday & Milestones",
  "Gaye Holud & Sangeet", "Floral & Botanical Styling", "Rooftop & Boutique Gatherings",
  "Lighting & Stage Setup",
];

// Create/Edit form modal for the agency profile — branding, contact, coverage zones, category specializations
const AgencyProfileEditModal = ({
  isOpen,
  onClose,
  isNew,
  formData,
  setFormData,
  isSaving,
  onSubmit,
  newZoneInput,
  onZoneInputChange,
  onAddZone,
  onRemoveZone,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isNew ? "Register Agency Profile" : "Edit Agency Profile"}
      icon={Building}
      dark
      maxWidth="max-w-2xl"
    >
      <form onSubmit={onSubmit} className="space-y-5 text-xs text-slate-700 dark:text-slate-300">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Business Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. DreamCraft Events & Decors"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Tagline / Sub-Headline</label>
            <input
              type="text"
              placeholder="e.g. Royal Weddings & Floral Wonders"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Logo Image URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Cover Banner Image URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-slate-300">About Brand & Craft Story</label>
          <textarea
            rows={3}
            placeholder="Describe your design aesthetics, experience, team expertise, and decor specialties..."
            value={formData.about}
            onChange={(e) => setFormData({ ...formData, about: e.target.value })}
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Phone</label>
            <input
              type="text"
              placeholder="+880 1711-223344"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">City</label>
            <select
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
            >
              {POPULAR_ZONES.map((z, idx) => (
                <option key={idx} value={z}>{z}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Trade License No</label>
            <input
              type="text"
              placeholder="TL-2026-DH-XXXX"
              value={formData.tradeLicenseNo}
              onChange={(e) => setFormData({ ...formData, tradeLicenseNo: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Headquarters Address</label>
            <input
              type="text"
              placeholder="Road 11, Block D, Banani"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Website URL</label>
            <input
              type="url"
              placeholder="https://dreamcraftevents.com"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Facebook URL</label>
            <input
              type="url"
              placeholder="https://facebook.com/dreamcraftevents"
              value={formData.facebook}
              onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Instagram URL</label>
            <input
              type="url"
              placeholder="https://instagram.com/dreamcraftevents"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
            />
          </div>
        </div>

        <CoverageZonesEditor
          serviceAreas={formData.serviceAreas}
          newZoneInput={newZoneInput}
          onZoneInputChange={onZoneInputChange}
          onAddZone={onAddZone}
          onRemoveZone={onRemoveZone}
        />

        <CategorySpecializationPicker
          categoriesList={POPULAR_CATEGORIES}
          selectedCategories={formData.categories}
          onToggleCategory={(cat) => {
            const exists = formData.categories.includes(cat);
            setFormData({
              ...formData,
              categories: exists
                ? formData.categories.filter((c) => c !== cat)
                : [...formData.categories, cat],
            });
          }}
        />

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer shadow-md shadow-purple-600/30 disabled:opacity-50 flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Agency Profile"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AgencyProfileEditModal;
