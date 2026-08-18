import React from "react";

// Full profile page skeleton placeholder mirroring the 2 equal-width column layout
const MyProfileSkeleton = ({ isDecorator = false }) => {
  return (
    <div className="space-y-8 animate-pulse pb-10">
      {/* 1. Top Banner Header Skeleton */}
      <div className="rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Left: Avatar & Info */}
          <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-200 dark:bg-slate-800 shrink-0" />
            <div className="space-y-2.5 w-full sm:w-auto flex flex-col items-center sm:items-start">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-44 sm:w-52 rounded-lg bg-slate-200 dark:bg-slate-800" />
                <div className="h-5 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="h-4 w-40 rounded-md bg-slate-200 dark:bg-slate-800" />
              <div className="h-3.5 w-32 rounded-md bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>

          {/* Right: Action Button & Account Status Badge */}
          <div className="flex flex-col items-stretch sm:items-end gap-3 w-full sm:w-auto">
            <div className="h-10 w-full sm:w-40 rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-11 w-full sm:w-48 rounded-xl bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </div>

      {/* 2. Main Details Grid Skeleton (2 Equal-Width & Equal-Height Columns with 4 Rows each) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
        {/* Left Column: Account Credentials Skeleton (4 Vertical Rows) */}
        <div className="h-full">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs h-full flex flex-col justify-between space-y-6">
            <div className="h-5 w-40 rounded-md bg-slate-200 dark:bg-slate-800" />
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-9 w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Address Details Skeleton (4 Vertical Rows) */}
        <div className="h-full">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs h-full flex flex-col justify-between space-y-6">
            <div className="flex items-center justify-between">
              <div className="h-5 w-56 rounded-md bg-slate-200 dark:bg-slate-800" />
              <div className="h-5 w-24 rounded-full bg-slate-200 dark:bg-slate-800" />
            </div>

            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="h-3 w-28 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-9 w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Decorator Extra Segment: Agency Info Card Skeleton */}
      {isDecorator && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-purple-200/80 dark:border-purple-900/40 shadow-xs space-y-6">
          {/* Agency Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800 shrink-0" />
              <div className="space-y-1.5">
                <div className="h-5 w-44 rounded-md bg-slate-200 dark:bg-slate-800" />
                <div className="h-3.5 w-56 rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-6 w-24 rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="h-8 w-8 rounded-xl bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>

          {/* Business & Tagline Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="h-3 w-32 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-9 w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3 w-28 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-9 w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800" />
            </div>
          </div>

          {/* Agency About Textarea Skeleton */}
          <div className="space-y-1.5">
            <div className="h-3 w-28 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-20 w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800" />
          </div>

          {/* Contact Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-9 w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800" />
              </div>
            ))}
          </div>

          {/* Coverage Areas Skeleton */}
          <div className="space-y-1.5 pt-1">
            <div className="h-3 w-40 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-12 w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfileSkeleton;
