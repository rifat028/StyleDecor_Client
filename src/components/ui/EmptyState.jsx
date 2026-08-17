import React from "react";

// Displays an icon, bold title, message, and optional action CTA.
const EmptyState = ({
  icon: Icon,
  title = "No Data Found",
  message = "Try adjusting your search criteria or filters.",
  action,
  className = "",
}) => {
  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-3xl p-12 md:p-16 text-center border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs ${className}`}
    >
      {Icon && (
        <div className="flex justify-center">
          <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 w-fit shadow-xs">
            <Icon className="w-10 h-10 mx-auto" />
          </div>
        </div>
      )}
      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
        {title}
      </h3>
      {message && (
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          {message}
        </p>
      )}
      {action && (
        <div className="pt-2">
          {typeof action === "function" ? (
            action()
          ) : action.onClick && action.label ? (
            <button
              onClick={action.onClick}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-all duration-200 shadow-md shadow-purple-600/25 cursor-pointer text-sm inline-flex items-center gap-2"
            >
              {action.label}
            </button>
          ) : (
            action
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
