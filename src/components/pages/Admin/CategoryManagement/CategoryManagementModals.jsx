import React from "react";
import { Plus, X, Tag, Layers, Edit2, FolderPlus } from "lucide-react";
import Modal from "../../../ui/Modal";

// Consolidated Modals Suite for Category Management (300-340 lines)
const CategoryManagementModals = ({
  // 1. Create Category Modal
  isCreateOpen,
  onCloseCreate,
  createFormData,
  setCreateFormData,
  tempSubName,
  setTempSubName,
  onAddSubTag,
  onRemoveSubTag,
  onCreateSubmit,
  submittingCreate,

  // 2. Edit Category Modal
  editingCategory,
  onCloseEditCategory,
  editFormData,
  setEditFormData,
  onEditCategorySubmit,
  submittingEditCategory,

  // 3. Add Subcategory Modal
  subCategoryModalTarget,
  onCloseAddSub,
  newSubData,
  setNewSubData,
  onAddSubSubmit,
  submittingAddSub,

  // 4. Edit Subcategory Modal
  editingSubCategory,
  onCloseEditSub,
  editSubData,
  setEditSubData,
  onEditSubSubmit,
  submittingEditSub,

  generateSlug,
}) => {
  return (
    <>
      {/* 1. Create Category Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={onCloseCreate}
        title="Create New Category"
        maxWidth="max-w-xl"
      >
        <form onSubmit={onCreateSubmit} className="space-y-4">
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
                setCreateFormData({
                  ...createFormData,
                  name: e.target.value,
                })
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
              onClick={onCloseCreate}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingCreate}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {submittingCreate ? "Creating..." : "Create Category"}
            </button>
          </div>
        </form>
      </Modal>

      {/* 2. Edit Category Modal */}
      <Modal
        isOpen={!!editingCategory}
        onClose={onCloseEditCategory}
        title={`Edit Category: ${editingCategory?.name || ""}`}
        maxWidth="max-w-lg"
      >
        {editingCategory && (
          <form onSubmit={onEditCategorySubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                Category Name *
              </label>
              <input
                type="text"
                required
                value={editFormData.name}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, name: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Description
              </label>
              <textarea
                rows={3}
                value={editFormData.description}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    description: e.target.value,
                  })
                }
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Display Sort Order
              </label>
              <input
                type="number"
                min={1}
                value={editFormData.order}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    order: Number(e.target.value),
                  })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onCloseEditCategory}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingEditCategory}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {submittingEditCategory ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* 3. Add Subcategory Modal */}
      <Modal
        isOpen={!!subCategoryModalTarget}
        onClose={onCloseAddSub}
        title={`Add Subcategory to "${subCategoryModalTarget?.name || ""}"`}
        maxWidth="max-w-md"
      >
        {subCategoryModalTarget && (
          <form onSubmit={onAddSubSubmit} className="space-y-4">
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

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onCloseAddSub}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingAddSub}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {submittingAddSub ? "Adding..." : "Add Subcategory"}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* 4. Edit Subcategory Modal */}
      <Modal
        isOpen={!!editingSubCategory}
        onClose={onCloseEditSub}
        title={`Edit Subcategory: ${editingSubCategory?.subCategory?.name || ""}`}
        maxWidth="max-w-md"
      >
        {editingSubCategory && (
          <form onSubmit={onEditSubSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                Subcategory Name *
              </label>
              <input
                type="text"
                required
                value={editSubData.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setEditSubData({
                    ...editSubData,
                    name,
                    slug: generateSlug(name),
                  });
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                URL Slug
              </label>
              <input
                type="text"
                required
                value={editSubData.slug}
                onChange={(e) =>
                  setEditSubData({ ...editSubData, slug: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Sort Order
              </label>
              <input
                type="number"
                min={1}
                value={editSubData.order}
                onChange={(e) =>
                  setEditSubData({
                    ...editSubData,
                    order: Number(e.target.value),
                  })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onCloseEditSub}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingEditSub}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {submittingEditSub ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
};

export default CategoryManagementModals;
