import React from "react";
import { Link } from "react-router";
import Tooltip from "./Tooltip";

// Visual tone preset styling mappings for table action buttons
const TONE_CLASSES = {
  purple:
    "border-slate-200 dark:border-slate-700 text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/50 dark:hover:text-purple-400",
  view:
    "border-slate-200 dark:border-slate-700 text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/50 dark:hover:text-purple-400",
  amber:
    "border-slate-200 dark:border-slate-700 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 dark:hover:text-amber-400",
  edit:
    "border-slate-200 dark:border-slate-700 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 dark:hover:text-amber-400",
  rose:
    "border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 dark:hover:text-rose-400",
  delete:
    "border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 dark:hover:text-rose-400",
  danger:
    "border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 dark:hover:text-rose-400",
  emerald:
    "border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50",
  success:
    "border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50",
  approve:
    "border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50",
  warning:
    "border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50",
  suspend:
    "border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50",
  blue:
    "border-slate-200 dark:border-slate-700 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 dark:hover:text-blue-400",
  info:
    "border-slate-200 dark:border-slate-700 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 dark:hover:text-blue-400",
  primary:
    "bg-purple-600 hover:bg-purple-700 text-white border-purple-600 shadow-xs",
  featured:
    "border-amber-300 bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-400",
  slate:
    "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-purple-600",
  default:
    "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-purple-600",
};

// Button sizing presets
const SIZE_CLASSES = {
  xs: "p-1 rounded-sm",
  sm: "p-1.5 rounded-md",
  md: "p-2 rounded-lg",
};

// Icon dimension presets
const ICON_SIZES = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-4.5 h-4.5",
};

/**
 * Standardized Table Action Button with integrated hover/focus tooltip.
 *
 * @param {Object} props
 * @param {React.ComponentType} [props.icon] - Lucide icon component
 * @param {string} [props.tooltip] - Text displayed in the tooltip on hover
 * @param {string} [props.title] - Alias for tooltip
 * @param {string} [props.label] - Alias for tooltip
 * @param {string} [props.disabledTooltip] - Custom tooltip to display when disabled
 * @param {"purple"|"view"|"amber"|"edit"|"rose"|"delete"|"danger"|"emerald"|"success"|"approve"|"warning"|"suspend"|"blue"|"info"|"primary"|"featured"|"slate"|"default"} [props.tone="purple"]
 * @param {"purple"|"view"|"amber"|"edit"|"rose"|"delete"|"danger"|"emerald"|"success"|"approve"|"warning"|"suspend"|"blue"|"info"|"primary"|"featured"|"slate"|"default"} [props.variant] - Alias for tone
 * @param {"xs"|"sm"|"md"} [props.size="sm"]
 * @param {"top"|"bottom"|"left"|"right"|"top-left"|"top-right"|"bottom-left"|"bottom-right"} [props.tooltipPosition="top"]
 * @param {boolean} [props.disabled=false]
 * @param {Function} [props.onClick]
 * @param {string} [props.to] - If provided, renders as React Router Link
 * @param {string} [props.href] - If provided, renders as HTML anchor
 * @param {string} [props.type="button"]
 * @param {string} [props.className=""]
 * @param {string} [props.iconClassName=""]
 * @param {React.ReactNode} [props.children]
 */
const TableActionButton = ({
  icon: Icon,
  tooltip,
  title,
  label,
  disabledTooltip,
  tone = "purple",
  variant,
  size = "sm",
  tooltipPosition = "top",
  disabled = false,
  onClick,
  to,
  href,
  type = "button",
  className = "",
  iconClassName = "",
  children,
  ...rest
}) => {
  const selectedTone = variant || tone;
  const activeToneClass = TONE_CLASSES[selectedTone] || TONE_CLASSES.purple;
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.sm;
  const iconSizeClass = ICON_SIZES[size] || ICON_SIZES.sm;

  // Resolve tooltip text (prioritize disabledTooltip when disabled)
  const activeTooltip =
    disabled && disabledTooltip
      ? disabledTooltip
      : tooltip || title || label;

  const baseClasses = `inline-flex items-center justify-center border transition-colors cursor-pointer ${sizeClass} ${
    disabled
      ? "opacity-30 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-700 hover:bg-transparent hover:text-slate-300 dark:hover:text-slate-700 pointer-events-none"
      : activeToneClass
  } ${className}`;

  // Content with Icon or Children
  const content = (
    <>
      {Icon && <Icon className={`${iconSizeClass} ${iconClassName}`} />}
      {children}
    </>
  );

  let buttonElement;

  if (to && !disabled) {
    buttonElement = (
      <Link
        to={to}
        className={baseClasses}
        aria-label={activeTooltip}
        {...rest}
      >
        {content}
      </Link>
    );
  } else if (href && !disabled) {
    buttonElement = (
      <a
        href={href}
        className={baseClasses}
        aria-label={activeTooltip}
        {...rest}
      >
        {content}
      </a>
    );
  } else {
    buttonElement = (
      <button
        type={type}
        disabled={disabled}
        onClick={disabled ? undefined : onClick}
        className={baseClasses}
        aria-label={activeTooltip}
        {...rest}
      >
        {content}
      </button>
    );
  }

  // Wrap in Tooltip component for hover/focus state
  return (
    <Tooltip
      content={activeTooltip}
      position={tooltipPosition}
      disabled={!activeTooltip}
      className={disabled ? "cursor-not-allowed" : ""}
    >
      {buttonElement}
    </Tooltip>
  );
};

export default TableActionButton;
