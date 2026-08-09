import React from "react";
import { useNavigate } from "react-router";

const CallToAction = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-base-200 dark:bg-slate-900">
      <div className="mx-auto w-full max-w-7xl px-4 py-10">
        <div className="rounded-2xl border border-base-300 dark:border-slate-800 bg-base-100 dark:bg-slate-950 p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-base-content dark:text-slate-100">
              Ready to decorate your next event?
            </h3>
            <p className="mt-2 text-sm text-base-content/70 dark:text-slate-300">
              Choose a package, pick a slot, and track the status—everything in
              one place.
            </p>
          </div>
          <button
            onClick={() => navigate("/services")}
            className="btn btn-primary w-full md:w-auto transition duration-300 transform hover:scale-105"
          >
            Book Decoration Service
          </button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
