import React, { useState, useRef, useLayoutEffect, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

/**
 * Teleported, accessible, floating tooltip wrapper.
 * Uses React Portal to mount directly into document.body, completely preventing
 * table width clipping, overflow-x:auto cuts, and z-index stacking issues.
 *
 * Automatically detects viewport edges and clamps horizontal positioning while
 * keeping the pointer arrow locked directly over the trigger element.
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
  const [isVisible, setIsVisible] = useState(false);

  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const arrowRef = useRef(null);

  // Directly calculate and apply position to DOM elements without triggering React render cascades
  const applyPosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    if (triggerRect.width === 0 && triggerRect.height === 0) return;

    const tooltipEl = tooltipRef.current;
    const tooltipRect = tooltipEl.getBoundingClientRect();
    const tooltipWidth = tooltipRect.width || 160;
    const tooltipHeight = tooltipRect.height || 30;

    const margin = 9;
    const viewportPadding = 12;
    const windowWidth =
      document.documentElement.clientWidth || window.innerWidth;
    const windowHeight =
      document.documentElement.clientHeight || window.innerHeight;

    let targetPlacement = position.startsWith("bottom") ? "bottom" : "top";
    if (position === "left" || position === "right") {
      targetPlacement = position;
    }

    if (targetPlacement === "top" || targetPlacement === "bottom") {
      // Auto-flip if out of bounds vertically
      if (
        targetPlacement === "top" &&
        triggerRect.top - tooltipHeight - margin < viewportPadding
      ) {
        targetPlacement = "bottom";
      } else if (
        targetPlacement === "bottom" &&
        triggerRect.bottom + tooltipHeight + margin > windowHeight - viewportPadding
      ) {
        targetPlacement = "top";
      }

      const top =
        targetPlacement === "top"
          ? triggerRect.top - tooltipHeight - margin
          : triggerRect.bottom + margin;

      const triggerCenterX = triggerRect.left + triggerRect.width / 2;
      let idealLeft = triggerCenterX - tooltipWidth / 2;

      if (position === "top-left" || position === "bottom-left") {
        idealLeft = triggerRect.left;
      } else if (position === "top-right" || position === "bottom-right") {
        idealLeft = triggerRect.right - tooltipWidth;
      }

      const minLeft = viewportPadding;
      const maxLeft = Math.max(
        viewportPadding,
        windowWidth - tooltipWidth - viewportPadding
      );
      const clampedLeft = Math.max(minLeft, Math.min(idealLeft, maxLeft));

      // Arrow position relative to the tooltip box pointing at trigger center
      const rawArrowLeft = triggerCenterX - clampedLeft;
      const arrowLeft = Math.max(14, Math.min(rawArrowLeft, tooltipWidth - 14));

      tooltipEl.style.top = `${Math.round(top)}px`;
      tooltipEl.style.left = `${Math.round(clampedLeft)}px`;
      tooltipEl.style.opacity = "1";

      const arrowEl = arrowRef.current;
      if (arrowEl) {
        if (targetPlacement === "top") {
          arrowEl.className =
            "absolute -bottom-1.5 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-inherit border-r-2 border-b-2 border-inherit";
        } else {
          arrowEl.className =
            "absolute -top-1.5 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-inherit border-l-2 border-t-2 border-inherit";
        }
        arrowEl.style.left = `${Math.round(arrowLeft)}px`;
        arrowEl.style.top = "";
      }
    } else if (targetPlacement === "left") {
      const left = triggerRect.left - tooltipWidth - margin;
      const top = triggerRect.top + triggerRect.height / 2 - tooltipHeight / 2;

      tooltipEl.style.top = `${Math.round(top)}px`;
      tooltipEl.style.left = `${Math.round(left)}px`;
      tooltipEl.style.opacity = "1";

      const arrowEl = arrowRef.current;
      if (arrowEl) {
        arrowEl.className =
          "absolute -right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45 bg-inherit border-t-2 border-r-2 border-inherit";
        arrowEl.style.left = "";
        arrowEl.style.top = "";
      }
    } else if (targetPlacement === "right") {
      const left = triggerRect.right + margin;
      const top = triggerRect.top + triggerRect.height / 2 - tooltipHeight / 2;

      tooltipEl.style.top = `${Math.round(top)}px`;
      tooltipEl.style.left = `${Math.round(left)}px`;
      tooltipEl.style.opacity = "1";

      const arrowEl = arrowRef.current;
      if (arrowEl) {
        arrowEl.className =
          "absolute -left-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45 bg-inherit border-b-2 border-l-2 border-inherit";
        arrowEl.style.left = "";
        arrowEl.style.top = "";
      }
    }
  }, [position]);

  // Synchronously measure and place DOM node before paint
  useLayoutEffect(() => {
    if (isVisible) {
      applyPosition();
    }
  }, [isVisible, applyPosition]);

  // Handle scroll and resize without re-rendering
  useEffect(() => {
    if (!isVisible) return;

    const handleScrollOrResize = () => {
      applyPosition();
    };

    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isVisible, applyPosition]);

  if (!tooltipText || disabled) {
    return children;
  }

  return (
    <div
      ref={triggerRef}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      className={`relative inline-flex items-center justify-center ${className}`}
    >
      {children}

      {isVisible &&
        createPortal(
          <div
            ref={tooltipRef}
            role="tooltip"
            style={{
              position: "fixed",
              top: "-9999px",
              left: "-9999px",
              zIndex: 99999,
              opacity: 0,
            }}
            className={`pointer-events-none max-w-[calc(100vw-24px)] px-3 py-1.5 text-xs font-semibold tracking-tight text-indigo-600 dark:text-blue-300 backdrop-blur-md border-2 border-blue-400/80 dark:border-blue-400/70 ring-1 ring-blue-300/40 dark:ring-blue-300/30 shadow-md shadow-blue-400/25 dark:shadow-blue-500/25 bg-white/95 dark:bg-slate-900/95 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.95)_25%,rgba(96,165,250,0.25)_100%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,0.95)_25%,rgba(96,165,250,0.25)_100%)] rounded-lg whitespace-nowrap transition-opacity duration-150 ease-out select-none ${tooltipClassName}`}
          >
            {tooltipText}

            {/* Seamless Attached Pointing Edge Arrow */}
            <span
              ref={arrowRef}
              aria-hidden="true"
              className="absolute -bottom-1.5 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-inherit border-r-2 border-b-2 border-inherit"
            />
          </div>,
          document.body
        )}
    </div>
  );
};

export default Tooltip;
