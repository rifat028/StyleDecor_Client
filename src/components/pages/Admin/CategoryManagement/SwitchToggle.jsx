import React from "react";

// Sleek switch toggle with active/inactive state and accessibility attributes
const SwitchToggle = ({ checked, onChange, label = true, disabled = false }) => {
  return (
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
};

export default SwitchToggle;
