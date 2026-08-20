import React from "react";
import { X } from "lucide-react";

// Self-contained coverage-zone tag list: add via text input + Enter, remove via chip X button
const CoverageZonesEditor = ({ serviceAreas, newZoneInput, onZoneInputChange, onAddZone, onRemoveZone }) => {
  return (
    <div className="space-y-2">
      <label className="font-bold text-slate-700 dark:text-slate-300">Service Coverage Zones:</label>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {serviceAreas.map((area, idx) => (
          <span
            key={idx}
            className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-[11px] font-bold border border-purple-200 dark:border-purple-800 flex items-center gap-1"
          >
            {area}
            <button
              type="button"
              onClick={() => onRemoveZone(area)}
              className="hover:text-red-500 cursor-pointer ml-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Add custom zone (e.g. Uttara Sector 4)"
          value={newZoneInput}
          onChange={(e) => onZoneInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAddZone();
            }
          }}
          className="flex-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
        />
        <button
          type="button"
          onClick={onAddZone}
          className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold cursor-pointer hover:bg-slate-300"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default CoverageZonesEditor;
