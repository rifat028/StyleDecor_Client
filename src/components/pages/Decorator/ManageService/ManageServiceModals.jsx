import React from "react";
import {
  Plus,
  X,
  Clock,
  Calendar,
  Check,
  Building,
  Tag,
  Edit,
  Trash2,
} from "lucide-react";
import Modal from "../../../ui/Modal";

// Sub-component for managing package variation tiers within the form
const PackageTiersEditor = ({
  packageTiers = [],
  onAddTier,
  onRemoveTier,
  onTierChange,
}) => {
  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <label className="font-bold text-slate-700 dark:text-slate-300 text-xs">
          Package Variations & Tiers (Optional)
        </label>
        <button
          type="button"
          onClick={onAddTier}
          className="text-purple-600 dark:text-purple-400 hover:text-purple-700 font-bold flex items-center gap-1 cursor-pointer text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Tier</span>
        </button>
      </div>

      <div className="space-y-2">
        {packageTiers.map((tier, idx) => (
          <div
            key={idx}
            className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
          >
            <div className="sm:col-span-4">
              <input
                type="text"
                placeholder="Tier Name (e.g. Premium Grand)"
                value={tier.tier}
                onChange={(e) => onTierChange(idx, "tier", e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100"
              />
            </div>
            <div className="sm:col-span-3">
              <input
                type="number"
                placeholder="Price (৳)"
                value={tier.price}
                onChange={(e) => onTierChange(idx, "price", e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100"
              />
            </div>
            <div className="sm:col-span-4">
              <input
                type="text"
                placeholder="Features (comma separated)"
                value={tier.featuresText}
                onChange={(e) => onTierChange(idx, "featuresText", e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-[11px] text-slate-800 dark:text-slate-100"
              />
            </div>
            <div className="sm:col-span-1 text-right">
              <button
                type="button"
                onClick={() => onRemoveTier(idx)}
                className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                title="Remove Tier"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Preview View Modal for examining full service package details
export const ManageServiceViewModal = ({
  viewingService,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!viewingService) return null;

  const title = viewingService.title || viewingService.serviceName || "Package Preview";
  const cat =
    typeof viewingService.category === "string"
      ? viewingService.category
      : viewingService.category?.name || "Decoration";
  const price =
    viewingService.pricing?.discountedPrice ||
    viewingService.pricing?.basePrice ||
    viewingService.cost ||
    0;

  return (
    <Modal
      isOpen={!!viewingService}
      onClose={onClose}
      title={`Preview: ${title}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6 text-xs text-slate-600 dark:text-slate-300">
        {/* Hero Image & Headline */}
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <img
            src={
              viewingService.coverImage ||
              viewingService.images?.[0] ||
              "https://images.unsplash.com/photo-1519741497674-611481863552?w=300"
            }
            alt={title}
            className="w-full sm:w-32 h-28 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0 shadow-md"
          />
          <div className="space-y-1.5 min-w-0 flex-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              <Tag className="w-3 h-3" />
              <span>{cat}</span>
            </span>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
              {title}
            </h4>
            <p className="text-sm text-purple-600 dark:text-purple-400 font-bold">
              Starting at ৳{Number(price).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Short Summary Description */}
        <div className="space-y-1.5">
          <h5 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">
            Summary & Scope
          </h5>
          <p className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 leading-relaxed">
            {viewingService.shortDescription ||
              viewingService.description ||
              "No description provided."}
          </p>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Deposit</span>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
              {viewingService.pricing?.depositRequiredPercent || 25}%
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Setup Time</span>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
              {viewingService.specifications?.setupDurationHours || 6} Hours
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Min. Notice</span>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
              {viewingService.specifications?.minimumNoticeDays || 3} Days
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Outdoor</span>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
              {viewingService.specifications?.isOutdoorSuitable !== false ? "Yes" : "No"}
            </p>
          </div>
        </div>

        {/* Package Tiers Breakdown */}
        {viewingService.packages?.length > 0 && (
          <div className="space-y-2">
            <h5 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">
              Package Variations & Tiers
            </h5>
            <div className="space-y-2">
              {viewingService.packages.map((pkg, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">
                      {pkg.tier}
                    </span>
                    {Array.isArray(pkg.features) && pkg.features.length > 0 && (
                      <span className="text-[11px] text-slate-400">
                        {pkg.features.join(" • ")}
                      </span>
                    )}
                  </div>
                  <span className="font-black text-purple-600 dark:text-purple-400 text-sm">
                    ৳{Number(pkg.price).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inclusions & Exclusions */}
        {Array.isArray(viewingService.inclusions) && viewingService.inclusions.length > 0 && (
          <div className="space-y-1.5">
            <h5 className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-[11px]">
              Inclusions & Deliverables
            </h5>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-1">
              {viewingService.inclusions.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              onDelete(viewingService);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold cursor-pointer text-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer text-xs"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(viewingService);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer text-xs"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Package</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// Create / Edit Form Modal with structured sections and package tiers management
export const ManageServiceFormModal = ({
  isOpen,
  onClose,
  editingService,
  formData,
  setFormData,
  categoriesList,
  onSubmit,
  onAddTier,
  onRemoveTier,
  onTierChange,
}) => {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingService ? "Edit Service Package" : "Publish New Decoration Package"}
      maxWidth="max-w-3xl"
    >
      <form onSubmit={onSubmit} className="space-y-6 text-xs">
        {/* 1. General Information Section */}
        <div className="space-y-4">
          <h4 className="font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider text-[11px]">
            1. General Information
          </h4>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              Package Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Royal Wedding Reception Stage Setup"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 cursor-pointer text-xs"
              >
                {categoriesList.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                SubCategory Name
              </label>
              <input
                type="text"
                placeholder="e.g. Wedding Stage"
                value={formData.subCategoryName}
                onChange={(e) =>
                  setFormData({ ...formData, subCategoryName: e.target.value })
                }
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Listing Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 cursor-pointer text-xs"
              >
                <option value="active">Active (Visible)</option>
                <option value="inactive">Paused (Draft)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Pricing & Deposit Terms Section */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h4 className="font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider text-[11px]">
            2. Pricing & Deposit Terms
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Base Price (৳) *
              </label>
              <input
                type="number"
                required
                min="1000"
                placeholder="45000"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Discounted Price (৳)
              </label>
              <input
                type="number"
                min="1000"
                placeholder="40000"
                value={formData.discountedPrice}
                onChange={(e) =>
                  setFormData({ ...formData, discountedPrice: e.target.value })
                }
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Pricing Unit
              </label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 cursor-pointer text-xs"
              >
                <option value="per_event">Per Event</option>
                <option value="per_day">Per Day</option>
                <option value="per_package">Per Package</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Deposit (%)
              </label>
              <input
                type="number"
                min="10"
                max="100"
                value={formData.depositRequiredPercent}
                onChange={(e) =>
                  setFormData({ ...formData, depositRequiredPercent: e.target.value })
                }
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs"
              />
            </div>
          </div>

          {/* Package Variations Tiers Editor */}
          <PackageTiersEditor
            packageTiers={formData.packageTiers}
            onAddTier={onAddTier}
            onRemoveTier={onRemoveTier}
            onTierChange={onTierChange}
          />
        </div>

        {/* 3. Media & Specifications Section */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h4 className="font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider text-[11px]">
            3. Media & Specifications
          </h4>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              Cover Photo Image URL
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formData.coverImage}
              onChange={(e) =>
                setFormData({ ...formData, coverImage: e.target.value })
              }
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              Short Summary *
            </label>
            <textarea
              required
              rows={2}
              placeholder="Brief 1-2 sentence overview of the setup..."
              value={formData.shortDescription}
              onChange={(e) =>
                setFormData({ ...formData, shortDescription: e.target.value })
              }
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              Full Description & Design Aesthetics
            </label>
            <textarea
              rows={3}
              placeholder="Comprehensive description of floral grade, lighting fixtures, fabrics..."
              value={formData.fullDescription}
              onChange={(e) =>
                setFormData({ ...formData, fullDescription: e.target.value })
              }
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs"
            />
          </div>
        </div>

        {/* 4. Inclusions & Exclusions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <label className="font-bold text-emerald-600 dark:text-emerald-400">
              Inclusions (one per line)
            </label>
            <textarea
              rows={3}
              value={formData.inclusionsText}
              onChange={(e) =>
                setFormData({ ...formData, inclusionsText: e.target.value })
              }
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-[11px]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-rose-600 dark:text-rose-400">
              Exclusions (one per line)
            </label>
            <textarea
              rows={3}
              value={formData.exclusionsText}
              onChange={(e) =>
                setFormData({ ...formData, exclusionsText: e.target.value })
              }
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-[11px]"
            />
          </div>
        </div>

        {/* Modal Submit & Cancel Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer shadow-md shadow-purple-600/30 text-xs transition-colors"
          >
            {editingService ? "Save Changes" : "Publish Package"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
