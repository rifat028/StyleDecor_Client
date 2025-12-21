import React from "react";

const Stats = ({ stats }) => {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-base-300 dark:border-slate-800 bg-base-100 dark:bg-slate-950 p-5 shadow-sm"
          >
            <p className="text-2xl sm:text-3xl font-bold text-base-content dark:text-slate-100">
              {item.value}
            </p>
            <p className="mt-1 text-sm text-base-content/70 dark:text-slate-300">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
