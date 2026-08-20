import React from "react";

// Self-contained toggle-grid for specialization categories
const CategorySpecializationPicker = ({ categoriesList, selectedCategories, onToggleCategory }) => {
  return (
    <div className="space-y-2">
      <label className="font-bold text-slate-700 dark:text-slate-300">Specialization Categories:</label>
      <div className="flex flex-wrap gap-2">
        {categoriesList.map((cat, idx) => {
          const isSelected = selectedCategories.includes(cat);
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onToggleCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                isSelected
                  ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
              }`}
            >
              {isSelected ? "✓ " : "+ "}
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySpecializationPicker;
