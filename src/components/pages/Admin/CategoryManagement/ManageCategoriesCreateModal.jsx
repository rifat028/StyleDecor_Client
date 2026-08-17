import React from "react";
import { Plus, X, Tag, Layers } from "lucide-react";
import Modal from "../../../ui/Modal";

// Modal providing full category creation form with subcategory builder
const ManageCategoriesCreateModal = ({
  isOpen,
  onClose,
  createFormData,
  setCreateFormData,
  tempSubName,
  setTempSubName,
  onAddSubTag,
  onRemoveSubTag,
  onSubmit,
  submitting,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Category"
      maxWidth="max-w-xl"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Category Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            Category Name *
          </label>
          <input
            type="text"
            required
            value={createFormData.name}
            onChange={(e) =>
              setCreateFormData({ ...createFormData, name: e.target.value })
            }
            placeholder="e.g. Wedding & Reception Decor"
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Description
          </label>
          <textarea
            rows={2}
            value={createFormData.description}
            onChange={(e) =>
              setCreateFormData({
                ...createFormData,
                description: e.target.value,
              })
            }
            placeholder="Brief explanation of decoration styles under this category..."
            className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Display Order */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Display Sort Order
            </label>
            <input
              type="number"
              min={1}
              value={createFormData.order}
              onChange={(e) =>
                setCreateFormData({
                  ...createFormData,
                  order: Number(e.target.value),
                })
              }
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            />
          </div>

          {/* Initial Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Initial Status
            </label>
            <select
              value={createFormData.status}
              onChange={(e) =>
                setCreateFormData({
                  ...createFormData,
                  status: e.target.value,
                })
              }
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer transition-all"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Subcategories Builder */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            Add Initial Subcategories (Optional)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tempSubName}
              onChange={(e) => setTempSubName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onAddSubTag();
                }
              }}
              placeholder="e.g. Stage Decor, Floral Backdrop..."
              className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            />
            <button
              type="button"
              onClick={onAddSubTag}
              className="px-4 py-2 bg-purple-100 dark:bg-purple-950/60 hover:bg-purple-200 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold text-xs rounded-xl border border-purple-200 dark:border-purple-800 cursor-pointer transition-colors"
            >
              Add
            </button>
          </div>

          {/* Render Added Tags */}
          {createFormData.subCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {createFormData.subCategories.map((sub, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 rounded-full"
                >
                  {sub.name}
                  <button
                    type="button"
                    onClick={() => onRemoveSubTag(idx)}
                    className="text-slate-400 hover:text-rose-500 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
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
            {submitting ? "Creating..." : "Create Category"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ManageCategoriesCreateModal;
