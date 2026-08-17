import React from "react";
import { Star } from "lucide-react";

// Displays an amber star rating and optional review count.
const RatingBadge = ({
  value = 0,
  count,
  className = "",
  starClassName = "w-3.5 h-3.5",
  showCount = true,
}) => {
  const formattedRating = Number(value || 0).toFixed(1);

  return (
    <div className={`inline-flex items-center gap-1 text-xs font-semibold ${className}`}>
      <Star className={`fill-amber-400 text-amber-400 shrink-0 ${starClassName}`} />
      <span className="font-bold text-slate-800 dark:text-slate-200">
        {formattedRating}
      </span>
      {showCount && count !== undefined && count !== null && (
        <span className="text-slate-500 dark:text-slate-400 text-[11px]">({count})</span>
      )}
    </div>
  );
};

export default RatingBadge;
