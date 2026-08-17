import React from "react";
import { Tag, Edit2, Trash2, Plus } from "lucide-react";
import SwitchToggle from "./SwitchToggle";

// Subcategory table nested inside category accordion row
const SubCategoryTable = ({
  category,
  onToggleSubStatus,
  onOpenAddSub,
  onOpenEditSub,
  onDeleteSub,
}) => {
  const subCategories = category.subCategories || [];

  return (
    <div className="bg-slate-50/70 dark:bg-slate-900/60 p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            Subcategories for {category.name} ({subCategories.length})
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

      {subCategories.length === 0 ? (
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
                <th className="py-2.5 px-2 min-w-45">Subcategory Name</th>
                <th className="py-2.5 px-2 min-w-40">URL Slug</th>
                <th className="py-2.5 px-2 text-center min-w-25">Sort Order</th>
                <th className="py-2.5 px-2 text-center min-w-25">Status</th>
                <th className="py-2.5 px-2 text-center min-w-25">Actions</th>
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
                  <td className="py-2.5 px-2 text-center min-w-25">
                    <SwitchToggle
                      checked={sub.status === "active"}
                      onChange={() => onToggleSubStatus(category._id, sub)}
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
  );
};

export default SubCategoryTable;
