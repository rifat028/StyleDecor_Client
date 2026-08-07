import React from "react";
import { useNavigate } from "react-router";

const TopSection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-base-200 dark:bg-slate-900">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:py-14">
        <p className="inline-flex items-center gap-2 rounded-full border border-base-300 dark:border-slate-800 bg-base-100/70 dark:bg-slate-950/60 px-4 py-2 text-xs sm:text-sm text-base-content dark:text-slate-100">
          <span className="text-lg">🏠</span> About StyleDecor
        </p>

        <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-base-content dark:text-slate-100">
          Smart <span className="text-blue-500">decoration booking </span> for
          homes & ceremonies
        </h1>

        <p className="mt-4 max-w-3xl text-sm sm:text-base md:text-lg text-base-content/70 dark:text-slate-300">
          StyleDecor helps people book decoration services online—choose
          packages, select a time slot, pay securely, and track the work status.
          We serve both in-studio consultations and on-site decoration services
          across Bangladesh.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            className="btn btn-primary w-full sm:w-auto transition duration-300 transform hover:scale-105 hover:bg-indigo-600"
            onClick={() => navigate("/services")}
          >
            Explore Services
          </button>
          <button
            className="btn btn-outline w-full sm:w-auto dark:border-slate-700 dark:text-slate-100 transition duration-300 transform hover:scale-105"
            onClick={() => navigate("/contact")}
          >
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
};

export default TopSection;
