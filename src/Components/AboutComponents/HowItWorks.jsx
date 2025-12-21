import React, { use } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../Authentication/AuthContext";

const HowItWorks = ({ steps }) => {
  const navigate = useNavigate();
  const { user } = use(AuthContext);
  console.log();
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 rounded-2xl border border-base-300 dark:border-slate-800 bg-base-100 dark:bg-slate-950 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-base-content dark:text-slate-100">
            How StyleDecor works
          </h2>
          <p className="mt-3 text-sm text-base-content/70 dark:text-slate-300">
            Our system is designed to reduce walk-in crowd, simplify scheduling,
            and make service updates transparent.
          </p>

          <div className="mt-5 rounded-xl bg-base-200 dark:bg-slate-900 p-4">
            <p className="text-sm text-base-content/70 dark:text-slate-300">
              <span className="font-semibold text-base-content dark:text-slate-100">
                On-site service status:
              </span>{" "}
              Assigned → Planning → Materials Prepared → On the Way → Setup in
              Progress → Completed
            </p>
          </div>

          <button
            onClick={() => navigate("/contact")}
            className="btn btn-primary w-full md:w-auto transition duration-300 transform hover:scale-105"
          >
            Talk To Our team
          </button>
        </div>

        <div className="lg:col-span-7 rounded-2xl border border-base-300 dark:border-slate-800 bg-base-100 dark:bg-slate-950 p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-base-content dark:text-slate-100">
            Simple steps
          </h3>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {steps.map((s, idx) => (
              <div
                key={s.title}
                className="rounded-2xl bg-base-200 dark:bg-slate-900 p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-base-content dark:text-slate-100">
                    {s.title}
                  </p>
                  <span className="badge badge-outline dark:border-slate-700 dark:text-slate-100">
                    Step {idx + 1}
                  </span>
                </div>
                <p className="mt-2 text-sm text-base-content/70 dark:text-slate-300">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/services")}
              className="btn btn-primary w-full md:w-auto transition duration-300 transform hover:scale-105"
            >
              Book Decoration Service
            </button>
            {!user && (
              <button
                onClick={() => navigate("/login")}
                className="btn btn-primary w-full sm:w-auto transition duration-300 transform hover:scale-105"
              >
                Login to Book
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
