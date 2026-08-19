import React from "react";

// Position offset and translation presets
const POSITION_CLASSES = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  "top-left": "bottom-full left-0 mb-2",
  "top-right": "bottom-full right-0 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  "bottom-left": "top-full left-0 mt-2",
  "bottom-right": "top-full right-0 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

// Pointer arrow indicator border styling presets
const ARROW_CLASSES = {
  top: "top-full left-1/2 -translate-x-1/2 -mt-1 border-t-slate-900 dark:border-t-slate-800 border-x-transparent border-b-transparent",
  "top-left": "top-full left-3 -mt-1 border-t-slate-900 dark:border-t-slate-800 border-x-transparent border-b-transparent",
  "top-right": "top-full right-3 -mt-1 border-t-slate-900 dark:border-t-slate-800 border-x-transparent border-b-transparent",
  bottom: "bottom-full left-1/2 -translate-x-1/2 -mb-1 border-b-slate-900 dark:border-b-slate-800 border-x-transparent border-t-transparent",
  "bottom-left": "bottom-full left-3 -mb-1 border-b-slate-900 dark:border-b-slate-800 border-x-transparent border-t-transparent",
  "bottom-right": "bottom-full right-3 -mb-1 border-b-slate-900 dark:border-b-slate-800 border-x-transparent border-t-transparent",
  left: "left-full top-1/2 -translate-y-1/2 -ml-1 border-l-slate-900 dark:border-l-slate-800 border-y-transparent border-r-transparent",
  right: "right-full top-1/2 -translate-y-1/2 -mr-1 border-r-slate-900 dark:border-r-slate-800 border-y-transparent border-l-transparent",
};

/**
 * Lightweight, accessible, CSS-driven tooltip wrapper.
 * Displays on hover and keyboard focus without clipping.
 *
 * @param {Object} props
 * @param {string|React.ReactNode} [props.content] - Tooltip text or node
 * @param {string|React.ReactNode} [props.text] - Alias for content
 * @param {string|React.ReactNode} [props.title] - Alias for content
 * @param {"top"|"bottom"|"left"|"right"|"top-left"|"top-right"|"bottom-left"|"bottom-right"} [props.position="top"]
 * @param {boolean} [props.disabled=false] - Whether to suppress tooltip
 * @param {string} [props.className=""] - Wrapper classes
 * @param {string} [props.tooltipClassName=""] - Popup classes
 * @param {React.ReactNode} props.children - Target trigger element
 */
const Tooltip = ({
  content,
  text,
  title,
  position = "top",
  disabled = false,
  className = "",
  tooltipClassName = "",
  children,
}) => {
  const tooltipText = content || text || title;

  // If no tooltip text is provided or tooltip is explicitly disabled, render children directly
  if (!tooltipText || disabled) {
    return children;
  }

  const posClass = POSITION_CLASSES[position] || POSITION_CLASSES.top;
  const arrowClass = ARROW_CLASSES[position] || ARROW_CLASSES.top;

  return (
    <div className={`relative inline-flex items-center justify-center group/tooltip ${className}`}>
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute z-50 px-2.5 py-1 text-[11px] font-semibold tracking-tight text-white dark:text-slate-100 bg-slate-900/95 dark:bg-slate-800 rounded-md shadow-md shadow-slate-950/20 border border-slate-700/50 dark:border-slate-600/50 whitespace-nowrap opacity-0 scale-95 transition-all duration-150 ease-out group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 group-focus-within/tooltip:opacity-100 group-focus-within/tooltip:scale-100 ${posClass} ${tooltipClassName}`}
      >
        {tooltipText}
        <span
          aria-hidden="true"
          className={`absolute w-0 h-0 border-4 ${arrowClass}`}
        />
      </span>
    </div>
  );
};

export default Tooltip;
