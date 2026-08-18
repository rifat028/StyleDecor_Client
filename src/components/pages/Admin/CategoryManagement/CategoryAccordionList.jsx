import React from "react";
import {
  Layers,
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  FolderPlus,
  Tag,
  Plus,
} from "lucide-react";
import EmptyState from "../../../ui/EmptyState";

// Switch toggle helper
const SwitchToggle = ({ checked, onChange, label = true, disabled = false }) => (
  <div className="flex flex-col items-center select-none">
    {label && (
      <span
        className={`text-[10px] font-bold uppercase tracking-wider mb-1 transition-colors ${
          checked
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-slate-400 dark:text-slate-500"
        }`}
      >
        {checked ? "Active" : "Inactive"}
      </span>
    )}
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed ${
        checked
          ? "bg-emerald-500 dark:bg-emerald-600"
          : "bg-slate-300 dark:bg-slate-700"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  </div>
);

// Comprehensive Category Accordion List Component (260-310 lines)
const CategoryAccordionList = ({
  categories,
  loading,
  expandedCategories,
  onToggleExpand,
  onToggleStatus,
  onOpenEdit,
  onDeleteCategory,
  onOpenAddSub,
  onOpenEditSub,
  onToggleSubStatus,
  onDeleteSub,
  onResetFilters,
}) => {
  if (loading) {
    return (
      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-none p-8 space-y-4 animate-pulse">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="h-16 bg-slate-100 dark:bg-slate-800 rounded-none"
          />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none">
        <EmptyState
          icon={Layers}
          title="No Categories Found"
          message="Try adjusting your search criteria or status filter."
          action={{
            label: "Clear Filters",
            onClick: onResetFilters,
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {categories.map((category) => {
        const isExpanded = !!expandedCategories[category._id];
        const subCategories = category.subCategories || [];
        const subCount = subCategories.length;

        return (
          <div
            key={category._id}
            className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-none overflow-hidden transition-all"
          >
            {/* Category Header Row */}
            <div
              onClick={() => onToggleExpand(category._id)}
              className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                isExpanded ? "bg-slate-50/50 dark:bg-slate-800/30" : ""
              }`}
            >
              {/* Left Info: Icon, Name, Slug, Description */}
              <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                <div className="p-2.5 bg-purple-50 dark:bg-purple-950/60 rounded-xl text-purple-600 dark:text-purple-400 shrink-0 border border-purple-100 dark:border-purple-900/60">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base truncate">
                      {category.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {subCount}{" "}
                      {subCount === 1 ? "Subcategory" : "Subcategories"}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      /{category.slug}
                    </span>
                  </div>
                  {category.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Info: Status Toggle, Action Buttons, Accordion Chevron */}
              <div
                className="flex items-center gap-3 self-end sm:self-auto shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Status Switch */}
                <SwitchToggle
                  checked={category.status === "active"}
                  onChange={() => onToggleStatus(category)}
                />

                {/* Action Buttons */}
                <div className="flex items-center gap-1.5 border-l border-slate-200 dark:border-slate-800 pl-3">
                  {/* Add Subcategory */}
                  <button
                    type="button"
                    onClick={() => onOpenAddSub(category)}
                    title="Add Subcategory"
                    className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/50 dark:hover:text-purple-400 transition-colors cursor-pointer"
                  >
                    <FolderPlus className="w-4 h-4" />
                  </button>

                  {/* Edit Category */}
                  <button
                    type="button"
                    onClick={() => onOpenEdit(category)}
                    title="Edit Category Details"
                    className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 dark:hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {/* Delete Category */}
                  <button
                    type="button"
                    onClick={() => onDeleteCategory(category)}
                    title="Delete Category"
                    className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 dark:hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Expand / Collapse Indicator */}
                  <button
                    type="button"
                    onClick={() => onToggleExpand(category._id)}
                    className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer ml-1"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Subcategories Drawer */}
            {isExpanded && (
              <div className="bg-slate-50/70 dark:bg-slate-900/60 p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                      Subcategories for {category.name} ({subCount})
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenAddSub(category)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Subcategory</span>
                  </button>
                </div>

                {subCount === 0 ? (
                  <div className="text-center py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                      No subcategories added yet under this category.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 shadow-2xs">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider">
                          <th className="py-2.5 px-2 min-w-45">
                            Subcategory Name
                          </th>
                          <th className="py-2.5 px-2 min-w-40">URL Slug</th>
                          <th className="py-2.5 px-2 text-center min-w-25">
                            Sort Order
                          </th>
                          <th className="py-2.5 px-2 text-center min-w-40">
                            Status
                          </th>
                          <th className="py-2.5 px-2 text-center min-w-25">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {subCategories.map((sub) => (
                          <tr
                            key={sub.id || sub._id}
                            className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                          >
                            <td className="py-2.5 px-2 min-w-45 font-semibold text-slate-800 dark:text-slate-200">
                              {sub.name}
                            </td>
                            <td className="py-2.5 px-2 min-w-40 font-mono text-slate-500 dark:text-slate-400">
                              {sub.slug}
                            </td>
                            <td className="py-2.5 px-2 text-center min-w-25 font-bold text-slate-600 dark:text-slate-300">
                              #{sub.order ?? 1}
                            </td>
                            <td className="py-2.5 px-2 text-center min-w-40">
                              <SwitchToggle
                                checked={sub.status === "active"}
                                onChange={() =>
                                  onToggleSubStatus(category._id, sub)
                                }
                                label={false}
                              />
                            </td>
                            <td className="py-2.5 px-2 text-center min-w-25">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => onOpenEditSub(category, sub)}
                                  title="Edit Subcategory"
                                  className="p-1 rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 dark:hover:text-amber-400 transition-colors cursor-pointer"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onDeleteSub(category._id, sub)}
                                  title="Delete Subcategory"
                                  className="p-1 rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CategoryAccordionList;
