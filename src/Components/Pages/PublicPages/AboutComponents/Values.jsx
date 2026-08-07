import React from "react";

const Values = ({ values }) => {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-10">
      <div className="rounded-2xl border border-base-300 dark:border-slate-800 bg-base-100 dark:bg-slate-950 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-base-content dark:text-slate-100">
              Our core values
            </h2>
            <p className="mt-2 text-sm text-base-content/70 dark:text-slate-300">
              We focus on quality, timing, communication, and fair pricing.
            </p>
          </div>
          <a
            href="/services"
            className="btn btn-sm btn-outline w-full sm:w-auto dark:border-slate-700 dark:text-slate-100 transition duration-300 transform hover:scale-105"
          >
            View Packages
          </a>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl bg-base-200 dark:bg-slate-900 p-5 hover:scale-105 transition duration-500"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-base-100 dark:bg-slate-950 flex items-center justify-center border border-base-300 dark:border-slate-800">
                  <span className="text-lg">{v.icon}</span>
                </div>
                <p className="font-semibold text-base-content dark:text-slate-100">
                  {v.title}
                </p>
              </div>
              <p className="mt-3 text-sm text-base-content/70 dark:text-slate-300">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Values;
