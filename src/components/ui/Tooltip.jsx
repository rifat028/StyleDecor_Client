import React, { useState, useRef, useEffect, useCallback } from "react";
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
  const [coords, setCoords] = useState(null);

  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);

  // Compute position and viewport collision clamping
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    if (triggerRect.width === 0 && triggerRect.height === 0) return;

    // Measured or estimated tooltip dimensions
    const tooltipWidth = tooltipRef.current
      ? tooltipRef.current.offsetWidth
      : 120;
    const tooltipHeight = tooltipRef.current
      ? tooltipRef.current.offsetHeight
      : 26;

    const triggerCenterX = triggerRect.left + triggerRect.width / 2;
    const triggerCenterY = triggerRect.top + triggerRect.height / 2;

    const margin = 9;
    const viewportPadding = 10;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let targetPlacement = position.startsWith("bottom") ? "bottom" : "top";
    if (position === "left" || position === "right") {
      targetPlacement = position;
    }

    let top = 0;
    let left = 0;
    let arrowLeft = null;
    let arrowTop = null;

    if (targetPlacement === "top" || targetPlacement === "bottom") {
      // Vertical position with auto-flip if clipping viewport boundaries
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

      top =
        targetPlacement === "top"
          ? triggerRect.top - tooltipHeight - margin
          : triggerRect.bottom + margin;

      // Horizontal target position (centered by default)
      let idealLeft = triggerCenterX - tooltipWidth / 2;

      if (position === "top-left" || position === "bottom-left") {
        idealLeft = triggerRect.left;
      } else if (position === "top-right" || position === "bottom-right") {
        idealLeft = triggerRect.right - tooltipWidth;
      }

      // Clamp within viewport width
      const minLeft = viewportPadding;
      const maxLeft = windowWidth - tooltipWidth - viewportPadding;
      left = Math.max(minLeft, Math.min(idealLeft, maxLeft));

      // Arrow position relative to the tooltip box pointing at trigger center
      const rawArrowLeft = triggerCenterX - left;
      arrowLeft = Math.max(12, Math.min(rawArrowLeft, tooltipWidth - 12));
    } else if (targetPlacement === "left") {
      left = triggerRect.left - tooltipWidth - margin;
      top = triggerCenterY - tooltipHeight / 2;
      arrowTop = tooltipHeight / 2;
    } else if (targetPlacement === "right") {
      left = triggerRect.right + margin;
      top = triggerCenterY - tooltipHeight / 2;
      arrowTop = tooltipHeight / 2;
    }

    setCoords({
      top: Math.round(top),
      left: Math.round(left),
      placement: targetPlacement,
      arrowLeft: arrowLeft !== null ? Math.round(arrowLeft) : null,
      arrowTop: arrowTop !== null ? Math.round(arrowTop) : null,
    });
  }, [position]);

  // Handle opening and initial positioning calculation
  const handleOpen = useCallback(() => {
    if (disabled || !tooltipText) return;
    updatePosition();
    setIsVisible(true);
  }, [disabled, tooltipText, updatePosition]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  // Synchronize positioning on scroll and window resize while active
  useEffect(() => {
    if (!isVisible) return;

    const handleScrollOrResize = () => {
      updatePosition();
    };

    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isVisible, updatePosition]);

  // If no tooltip text or disabled, render trigger directly
  if (!tooltipText || disabled) {
    return children;
  }

  return (
    <div
      ref={triggerRef}
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
      onFocus={handleOpen}
      onBlur={handleClose}
      className={`relative inline-flex items-center justify-center ${className}`}
    >
      {children}

      {isVisible &&
        createPortal(
          <div
            ref={(node) => {
              tooltipRef.current = node;
            }}
            role="tooltip"
            style={{
              position: "fixed",
              top: coords ? `${coords.top}px` : "-9999px",
              left: coords ? `${coords.left}px` : "-9999px",
              zIndex: 99999,
              opacity: coords ? 1 : 0,
            }}
            className={`pointer-events-none px-3 py-1.5 text-xs font-semibold tracking-tight text-indigo-600 dark:text-blue-300 backdrop-blur-md border-2 border-blue-400/80 dark:border-blue-400/70 ring-1 ring-blue-300/40 dark:ring-blue-300/30 shadow-md shadow-blue-400/25 dark:shadow-blue-500/25 bg-white/95 dark:bg-slate-900/95 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.95)_25%,rgba(96,165,250,0.25)_100%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,0.95)_25%,rgba(96,165,250,0.25)_100%)] rounded-lg whitespace-nowrap transition-opacity duration-150 ease-out select-none ${tooltipClassName}`}
          >
            {tooltipText}

            {/* Seamless Attached Pointing Edge Arrow */}
            {coords && coords.placement === "top" && (
              <span
                aria-hidden="true"
                style={{
                  left: `${coords.arrowLeft}px`,
                }}
                className="absolute -bottom-1.5 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-inherit border-r-2 border-b-2 border-inherit"
              />
            )}

            {coords && coords.placement === "bottom" && (
              <span
                aria-hidden="true"
                style={{
                  left: `${coords.arrowLeft}px`,
                }}
                className="absolute -top-1.5 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-inherit border-l-2 border-t-2 border-inherit"
              />
            )}

            {coords && coords.placement === "left" && (
              <span
                aria-hidden="true"
                className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45 bg-inherit border-t-2 border-r-2 border-inherit"
              />
            )}

            {coords && coords.placement === "right" && (
              <span
                aria-hidden="true"
                className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45 bg-inherit border-b-2 border-l-2 border-inherit"
              />
            )}
          </div>,
          document.body
        )}
    </div>
  );
};

export default Tooltip;
