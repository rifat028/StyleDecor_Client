import React from "react";
import { FolderPlus, Tag } from "lucide-react";
import Modal from "../../../ui/Modal";

// Modal for adding a single subcategory to an existing parent category
const AddSubCategoryModal = ({
  category,
  isOpen,
  onClose,
  newSubData,
  setNewSubData,
  onSubmit,
  submitting,
  generateSlug,
}) => {
  if (!category) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add Subcategory to "${category.name}"`}
      maxWidth="max-w-md"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            Subcategory Name *
          </label>
          <input
            type="text"
            required
            value={newSubData.name}
            onChange={(e) => {
              const name = e.target.value;
              setNewSubData({
                ...newSubData,
                name,
                slug: generateSlug(name),
              });
            }}
            placeholder="e.g. Engagement Stage"
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
          />
        </div>

        {/* Slug */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            URL Slug
          </label>
          <input
            type="text"
            required
            value={newSubData.slug}
            onChange={(e) =>
              setNewSubData({ ...newSubData, slug: e.target.value })
            }
            placeholder="engagement-stage"
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Display Order */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Sort Order
            </label>
            <input
              type="number"
              min={1}
              value={newSubData.order}
              onChange={(e) =>
                setNewSubData({
                  ...newSubData,
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
              value={newSubData.status}
              onChange={(e) =>
                setNewSubData({ ...newSubData, status: e.target.value })
              }
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer transition-all"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
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
            {submitting ? "Adding..." : "Add Subcategory"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddSubCategoryModal;
