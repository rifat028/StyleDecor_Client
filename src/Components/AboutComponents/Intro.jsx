import React from "react";

const Intro = () => {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Text */}
        <div className="lg:col-span-7 rounded-2xl border border-base-300 dark:border-slate-800 bg-base-100 dark:bg-slate-950 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-base-content dark:text-slate-100">
            Who we are
          </h2>
          <p className="mt-3 text-sm sm:text-base text-base-content/70 dark:text-slate-300">
            We are a decoration company with a passion for creating beautiful
            spaces—whether it’s a home makeover, wedding stage, engagement
            ceremony, office setup, or seminar decoration. Our goal is simple:
            make booking easy and make the final look impressive.
          </p>
          <p className="mt-3 text-sm sm:text-base text-base-content/70 dark:text-slate-300">
            With StyleDecor’s booking system, customers can avoid long waiting
            times, check availability, and get real-time updates on the progress
            of their service.
          </p>

          <div className="mt-6 rounded-xl bg-base-200 dark:bg-slate-900 p-4">
            <p className="font-medium text-base-content dark:text-slate-100">
              Our mission
            </p>
            <p className="mt-1 text-sm text-base-content/70 dark:text-slate-300">
              To make professional decoration services accessible, reliable, and
              easy to book through a modern online system.
            </p>
          </div>
        </div>

        {/* Image / Visual placeholder */}
        <div className="lg:col-span-5 rounded-2xl border border-base-300 dark:border-slate-800 bg-base-100 dark:bg-slate-950 p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-base-content dark:text-slate-100">
            What we do
          </h3>

          <div className="mt-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-base-200 dark:bg-slate-900 flex items-center justify-center">
                🎉
              </div>
              <div>
                <p className="font-medium text-base-content dark:text-slate-100">
                  Ceremony & Wedding Decor
                </p>
                <p className="text-sm text-base-content/70 dark:text-slate-300">
                  Stage, entry gate, lighting, floral, theme setup.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-base-200 dark:bg-slate-900 flex items-center justify-center">
                🛋️
              </div>
              <div>
                <p className="font-medium text-base-content dark:text-slate-100">
                  Home Decoration
                </p>
                <p className="text-sm text-base-content/70 dark:text-slate-300">
                  Living room, bedroom, balcony, and special occasions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-base-200 dark:bg-slate-900 flex items-center justify-center">
                🏢
              </div>
              <div>
                <p className="font-medium text-base-content dark:text-slate-100">
                  Corporate & Office Setup
                </p>
                <p className="text-sm text-base-content/70 dark:text-slate-300">
                  Seminar, meeting, store opening & branding decor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Intro;
