import React from "react";
import {
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  Tag,
  Plus,
  Star,
  GripVertical,
  ArrowUpDown,
  Check,
  X,
} from "lucide-react";
import { Reorder, useDragControls } from "framer-motion";
import EmptyState from "../../../ui/EmptyState";
import TableActionButton from "../../../ui/TableActionButton";
import Tooltip from "../../../ui/Tooltip";

// Helper to generate URL-friendly slugs
const generateSlug = (text) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
};

// Switch toggle helper (Accessible, tooltip-driven)
const SwitchToggle = ({ checked, onChange, disabled = false, ariaLabel = "Toggle status" }) => (
  <button
    type="button"
    role="switch"
    aria-label={ariaLabel}
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
);

// Individual Subcategory Item with Draggable Control
const SubCategoryRow = ({
  sub,
  subIdx,
  category,
  isReorderingThisSub,
  isSubSelected,
  onToggleSelectSubCategory,
  onToggleSubStatus,
  onOpenEditSub,
  onDeleteSub,
}) => {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={sub}
      id={String(sub.id ?? subIdx)}
      dragListener={false}
      dragControls={dragControls}
      className="grid grid-cols-[40px_60px_1fr_160px_100px_90px] items-center py-2.5 px-3 bg-white dark:bg-slate-900 border-b last:border-b-0 border-slate-100 dark:border-slate-800 text-xs hover:bg-slate-50/50 dark:hover:bg-slate-800/30 select-none"
      whileDrag={{
        zIndex: 40,
        backgroundColor: "rgba(243, 232, 255, 0.85)",
      }}
    >
      {/* Checkbox / Grip */}
      <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
        {isReorderingThisSub ? (
          <div
            onPointerDown={(e) => {
              e.stopPropagation();
              dragControls.start(e);
            }}
            className="p-1 rounded-md text-slate-400 hover:text-purple-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-grab active:cursor-grabbing touch-none select-none"
            title="Drag to reorder subcategory"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </div>
        ) : (
          <input
            type="checkbox"
            checked={isSubSelected}
            onChange={() => onToggleSelectSubCategory(category._id, sub.id)}
            className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 text-purple-600 focus:ring-purple-500/30 cursor-pointer"
          />
        )}
      </div>

      {/* 1st Column: SL */}
      <div className="text-center font-bold text-slate-700 dark:text-slate-300 tabular-nums">
        #{sub.order ?? subIdx + 1}
      </div>

      {/* Subcategory Name */}
      <div className="font-semibold text-slate-800 dark:text-slate-200 truncate pr-2">
        {sub.name}
      </div>

      {/* URL Slug */}
      <div className="font-mono text-slate-500 dark:text-slate-400 truncate pr-2">
        {sub.slug || generateSlug(sub.name)}
      </div>

      {/* Status Switch */}
      <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
        <Tooltip
          content={sub.status === "active" ? "Active" : "Inactive"}
          position="top"
        >
          <div className="inline-flex">
            <SwitchToggle
              checked={sub.status === "active"}
              onChange={() => onToggleSubStatus(category._id, sub)}
              ariaLabel={`Subcategory status is ${sub.status}`}
            />
          </div>
        </Tooltip>
      </div>

      {/* Actions */}
      <div
        className="flex items-center justify-center gap-1.5"
        onClick={(e) => e.stopPropagation()}
      >
        <TableActionButton
          icon={Edit2}
          onClick={() => onOpenEditSub(category, sub)}
          tooltip="Edit Subcategory"
          tone="amber"
          size="xs"
        />
        <TableActionButton
          icon={Trash2}
          onClick={() => onDeleteSub(category._id, sub)}
          tooltip="Delete Subcategory"
          tone="rose"
          size="xs"
        />
      </div>
    </Reorder.Item>
  );
};

// Individual Category Card Item with Framer Motion Reorder Control
const CategoryCardItem = ({
  category,
  index,
  isExpanded,
  onToggleExpand,
  onToggleStatus,
  onOpenEdit,
  onDeleteCategory,
  onToggleFeature,
  onOpenAddSub,
  onOpenEditSub,
  onToggleSubStatus,
  onDeleteSub,
  isReorderingCategories,
  selectedCategoryIds,
  onToggleSelectCategory,
  reorderingSubCategoryId,
  onToggleReorderSub,
  onReorderSubCategories,
  hasSubOrderChangedMap = {},
  onConfirmReorderSub,
  onCancelReorderSub,
  selectedSubCategoryIds,
  onToggleSelectSubCategory,
  onSelectAllSubCategories,
  onBulkDeleteSubCategories,
}) => {
  const dragControls = useDragControls();
  const subCategories = category.subCategories || [];
  const subCount = subCategories.length;
  const isReorderingThisSub = reorderingSubCategoryId === category._id;
  const selectedSubIds = selectedSubCategoryIds[category._id] || [];

  return (
    <Reorder.Item
      value={category}
      id={category._id}
      dragListener={false}
      dragControls={dragControls}
      className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-2xs select-none"
      whileDrag={{
        zIndex: 50,
      }}
    >
      {/* Category Header Row */}
      <div
        onClick={() => onToggleExpand(category._id)}
        className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 cursor-pointer hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
          isExpanded ? "bg-slate-50/50 dark:bg-slate-800/30" : ""
        }`}
      >
        {/* Left Info: Checkbox/Grip, SL, Name, Badges, Slug & Description */}
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          {/* Checkbox / Grip Handle (Left to SL) */}
          <div
            className="flex items-center shrink-0 pt-0.5 sm:pt-0"
            onClick={(e) => e.stopPropagation()}
          >
            {isReorderingCategories ? (
              <div
                onPointerDown={(e) => {
                  e.stopPropagation();
                  dragControls.start(e);
                }}
                className="p-1.5 rounded-md text-slate-400 hover:text-purple-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-grab active:cursor-grabbing touch-none select-none"
                title="Drag to reorder category"
              >
                <GripVertical className="w-4 h-4" />
              </div>
            ) : (
              <input
                type="checkbox"
                checked={selectedCategoryIds.includes(category._id)}
                onChange={() => onToggleSelectCategory(category._id)}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-purple-600 focus:ring-purple-500/30 cursor-pointer"
              />
            )}
          </div>

          {/* SL Pill at Leftmost Corner of Category Box */}
          <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0 tabular-nums shadow-2xs">
            #{category.order ?? index + 1}
          </div>

          {/* Name, Badges, Slug & Description */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base truncate">
                {category.name}
              </h3>
              {category.feature && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-500" />
                  Featured
                </span>
              )}
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {subCount}{" "}
                {subCount === 1 ? "Subcategory" : "Subcategories"}
              </span>
              <span className="text-xs font-mono text-slate-400">
                /{category.slug || generateSlug(category.name)}
              </span>
            </div>
            {category.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                {category.description}
              </p>
            )}
          </div>
        </div>

        {/* Right Controls: Active Toggle (Tooltip only) & Action Buttons */}
        <div
          className="flex items-center justify-around sm:justify-end gap-2.5 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Status Switch (Tooltip, No Text Label) */}
          <Tooltip
            content={category.status === "active" ? "Active" : "Inactive"}
            position="top"
          >
            <div className="inline-flex items-center">
              <SwitchToggle
                checked={category.status === "active"}
                onChange={() => onToggleStatus(category)}
                ariaLabel={`Category status is ${category.status}`}
              />
            </div>
          </Tooltip>

          {/* Action Buttons (No vertical line to right of toggle) */}
          <div className="flex items-center gap-1.5">
            {/* Featured Toggle Button */}
            <TableActionButton
              icon={Star}
              onClick={() => onToggleFeature(category)}
              tooltip={
                category.feature
                  ? "Unmark as Featured"
                  : "Mark as Featured"
              }
              tone={category.feature ? "featured" : "amber"}
              iconClassName={
                category.feature
                  ? "fill-amber-400 text-amber-500 shrink-0"
                  : "shrink-0"
              }
            />

            {/* Edit Category */}
            <TableActionButton
              icon={Edit2}
              onClick={() => onOpenEdit(category)}
              tooltip="Edit Category Details"
              tone="amber"
            />

            {/* Delete Category */}
            <TableActionButton
              icon={Trash2}
              onClick={() => onDeleteCategory(category)}
              tooltip="Delete Category"
              tone="rose"
            />

            {/* Expand / Collapse Indicator */}
            <TableActionButton
              icon={isExpanded ? ChevronUp : ChevronDown}
              onClick={() => onToggleExpand(category._id)}
              tooltip={
                isExpanded
                  ? "Collapse Subcategories"
                  : "Expand Subcategories"
              }
              tone="slate"
            />
          </div>
        </div>
      </div>

      {/* Smooth 300ms Accordion Transition Container */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          {/* Subcategories Section (Distinct Contrast Background) */}
          <div className="bg-slate-50/90 dark:bg-slate-950/70 p-4 sm:p-5 border-t border-slate-200/80 dark:border-slate-800">
            {/* Subcategory Header */}
            <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
              <div className="flex items-center gap-2">
                {/* Subcategory Reorder Action Button (Left to subcategories heading) */}
                {subCount > 1 && (
                  <div className="flex items-center gap-1.5">
                    {isReorderingThisSub ? (
                      <>
                        {hasSubOrderChangedMap[category._id] && (
                          <button
                            type="button"
                            onClick={() => onConfirmReorderSub(category._id)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-emerald-600 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs ring-2 ring-emerald-500/20 animate-in fade-in"
                            title="Confirm and save subcategory order"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Confirm</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onCancelReorderSub(category._id)}
                          className="p-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                          title="Exit subcategory reordering"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onToggleReorderSub(category._id)}
                        className="p-1.5 rounded-lg border border-purple-200 dark:border-purple-800/80 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                        title="Reorder Subcategories (Drag & Drop)"
                      >
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}

                <Tag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Subcategories for {category.name} ({subCount})
                </h4>
              </div>

              <div className="flex items-center gap-2">
                {/* Add Subcategory Button */}
                <button
                  type="button"
                  onClick={() => onOpenAddSub(category)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Subcategory</span>
                </button>
              </div>
            </div>

            {/* Subcategory Bulk Action Bar */}
            {!isReorderingThisSub && selectedSubIds.length > 0 && (
              <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 p-2.5 rounded-xl flex items-center justify-between gap-3 mb-3 animate-in fade-in duration-200">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={
                      selectedSubIds.length > 0 &&
                      selectedSubIds.length === subCategories.length
                    }
                    onChange={() =>
                      onSelectAllSubCategories(category._id, subCategories)
                    }
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-purple-600 focus:ring-purple-500/30 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-purple-900 dark:text-purple-200">
                    Select All
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => onBulkDeleteSubCategories(category._id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Selected ({selectedSubIds.length})</span>
                </button>
              </div>
            )}

            {/* Subcategories Table / List */}
            {subCount === 0 ? (
              <div className="text-center py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900">
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                  No subcategories added yet under this category.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-2xs">
                {/* Header */}
                <div className="grid grid-cols-[40px_60px_1fr_160px_100px_90px] items-center py-2.5 px-3 bg-slate-100/80 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider text-xs border-b border-slate-200 dark:border-slate-800">
                  <div className="flex justify-center">
                    {isReorderingThisSub ? (
                      <span className="sr-only">Drag</span>
                    ) : (
                      <input
                        type="checkbox"
                        checked={
                          selectedSubIds.length > 0 &&
                          selectedSubIds.length === subCategories.length
                        }
                        onChange={() =>
                          onSelectAllSubCategories(category._id, subCategories)
                        }
                        className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 text-purple-600 focus:ring-purple-500/30 cursor-pointer"
                      />
                    )}
                  </div>
                  <div className="text-center">SL</div>
                  <div>Subcategory Name</div>
                  <div>URL Slug</div>
                  <div className="text-center">Status</div>
                  <div className="text-center">Actions</div>
                </div>

                {/* Subcategories Reorder Group */}
                <Reorder.Group
                  axis="y"
                  values={subCategories}
                  onReorder={(newSubs) =>
                    onReorderSubCategories(category._id, newSubs)
                  }
                  className="divide-y divide-slate-100 dark:divide-slate-800"
                >
                  {subCategories.map((sub, subIdx) => (
                    <SubCategoryRow
                      key={sub.id ?? subIdx}
                      sub={sub}
                      subIdx={subIdx}
                      category={category}
                      isReorderingThisSub={isReorderingThisSub}
                      isSubSelected={selectedSubIds.includes(sub.id)}
                      onToggleSelectSubCategory={onToggleSelectSubCategory}
                      onToggleSubStatus={onToggleSubStatus}
                      onOpenEditSub={onOpenEditSub}
                      onDeleteSub={onDeleteSub}
                    />
                  ))}
                </Reorder.Group>
              </div>
            )}
          </div>
        </div>
      </div>
    </Reorder.Item>
  );
};

// Comprehensive Category Accordion List Component
const CategoryAccordionList = ({
  categories = [],
  loading = false,
  expandedCategories = {},
  onToggleExpand,
  onToggleStatus,
  onOpenEdit,
  onDeleteCategory,
  onToggleFeature,
  onOpenAddSub,
  onOpenEditSub,
  onToggleSubStatus,
  onDeleteSub,
  onResetFilters,
  // Reorder & Bulk for Categories
  isReorderingCategories = false,
  onReorderCategories,
  selectedCategoryIds = [],
  onToggleSelectCategory,
  onSelectAllCategories,
  onBulkDeleteCategories,
  // Reorder & Bulk for Subcategories
  reorderingSubCategoryId = null,
  onToggleReorderSub,
  onReorderSubCategories,
  hasSubOrderChangedMap = {},
  onConfirmReorderSub,
  onCancelReorderSub,
  selectedSubCategoryIds = {},
  onToggleSelectSubCategory,
  onSelectAllSubCategories,
  onBulkDeleteSubCategories,
}) => {
  if (loading) {
    return (
      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 space-y-4 animate-pulse rounded-xl">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl"
          />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
        <EmptyState
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
      {/* Category Bulk Action Bar when categories are selected */}
      {!isReorderingCategories && selectedCategoryIds.length > 0 && (
        <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 p-3 rounded-xl flex items-center justify-between gap-3 animate-in fade-in duration-200">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={
                selectedCategoryIds.length > 0 &&
                selectedCategoryIds.length === categories.length
              }
              onChange={onSelectAllCategories}
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-purple-600 focus:ring-purple-500/30 cursor-pointer"
            />
            <span className="text-xs font-bold text-purple-900 dark:text-purple-200">
              Select All
            </span>
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBulkDeleteCategories}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected ({selectedCategoryIds.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Categories Reorder Group */}
      <Reorder.Group
        axis="y"
        values={categories}
        onReorder={onReorderCategories}
        className="space-y-3"
      >
        {categories.map((category, index) => (
          <CategoryCardItem
            key={category._id}
            category={category}
            index={index}
            isExpanded={!!expandedCategories[category._id]}
            onToggleExpand={onToggleExpand}
            onToggleStatus={onToggleStatus}
            onOpenEdit={onOpenEdit}
            onDeleteCategory={onDeleteCategory}
            onToggleFeature={onToggleFeature}
            onOpenAddSub={onOpenAddSub}
            onOpenEditSub={onOpenEditSub}
            onToggleSubStatus={onToggleSubStatus}
            onDeleteSub={onDeleteSub}
            isReorderingCategories={isReorderingCategories}
            selectedCategoryIds={selectedCategoryIds}
            onToggleSelectCategory={onToggleSelectCategory}
            reorderingSubCategoryId={reorderingSubCategoryId}
            onToggleReorderSub={onToggleReorderSub}
            onReorderSubCategories={onReorderSubCategories}
            hasSubOrderChangedMap={hasSubOrderChangedMap}
            onConfirmReorderSub={onConfirmReorderSub}
            onCancelReorderSub={onCancelReorderSub}
            selectedSubCategoryIds={selectedSubCategoryIds}
            onToggleSelectSubCategory={onToggleSelectSubCategory}
            onSelectAllSubCategories={onSelectAllSubCategories}
            onBulkDeleteSubCategories={onBulkDeleteSubCategories}
          />
        ))}
      </Reorder.Group>
    </div>
  );
};

export default CategoryAccordionList;
