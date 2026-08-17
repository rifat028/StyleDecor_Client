import React from "react";
import { ChevronDown, ChevronUp, Edit2, Trash2, FolderPlus, Layers } from "lucide-react";
import SwitchToggle from "./SwitchToggle";
import SubCategoryTable from "./SubCategoryTable";

// Main category accordion row with expandable drawer
const CategoryAccordionRow = ({
  category,
  isExpanded,
  onToggleExpand,
  onToggleStatus,
  onOpenEdit,
  onDeleteCategory,
  onOpenAddSub,
  onOpenEditSub,
  onToggleSubStatus,
  onDeleteSub,
}) => {
  const subCount = category.subCategories?.length || 0;

  return (
    <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-none overflow-hidden transition-all">
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
                {subCount} {subCount === 1 ? "Subcategory" : "Subcategories"}
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

        {/* Right Info: SwitchToggle, Action Buttons, Accordion Chevron */}
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
        <SubCategoryTable
          category={category}
          onToggleSubStatus={onToggleSubStatus}
          onOpenAddSub={onOpenAddSub}
          onOpenEditSub={onOpenEditSub}
          onDeleteSub={onDeleteSub}
        />
      )}
    </div>
  );
};

export default CategoryAccordionRow;
