import React from "react";

// Reusable table skeleton rows component
const TableSkeleton = ({ rows = 5, columns = 5 }) => {
  return (
    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 animate-pulse">
      {Array.from({ length: rows }).map((_, rIdx) => (
        <tr key={rIdx} className="hover:bg-transparent">
          {Array.from({ length: columns }).map((_, cIdx) => (
            <td key={cIdx} className="py-4 px-2">
              <div
                className={`h-4 bg-slate-200 dark:bg-slate-800 rounded-sm ${
                  cIdx === 0
                    ? "w-3/4"
                    : cIdx === columns - 1
                    ? "w-16 mx-auto"
                    : "w-1/2"
                }`}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default TableSkeleton;
