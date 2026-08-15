import React, { useContext, useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../auth/AuthContext";
import Spinner from "../home/components/Spinner";
import {
  Award,
  Star,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  Building,
  Calendar,
  Layers,
  TrendingUp,
} from "lucide-react";

const PerformanceAppraisals = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Integration: GET /agents/my-performance
  useEffect(() => {
    const loadPerformance = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get("/agents/my-performance");
        if (res.data?.success) {
          setDossier(res.data);
        }
      } catch (err) {
        console.error("Failed to load agent performance:", err);
      } finally {
        setLoading(false);
      }
    };
    loadPerformance();
  }, [axiosSecure]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const metrics = dossier?.metrics || {
    rating: 4.8,
    totalReviews: 0,
    completedEvents: 0,
    outstandingOutcomes: 0,
    recommendationRate: 100,
  };

  const badges = dossier?.badges || [];
  const reviews = dossier?.reviews || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 animate-fade-in space-y-8">
      {/* ================= Header Banner ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" /> Recognition & Appraisal Dossier
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            My Performance & Appraisals
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Audit your field execution ratings, earned specialist badges, and agency evaluation reviews.
          </p>
        </div>
      </div>

      {/* ================= KPI Cards ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Rating Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-lg shadow-purple-600/20 space-y-1">
          <span className="text-[11px] font-bold text-purple-200 uppercase tracking-wider flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-current" /> Quality Score
          </span>
          <p className="text-2xl sm:text-3xl font-black">
            {metrics.rating} <span className="text-base text-purple-200">/ 5.0</span>
          </p>
          <p className="text-[11px] text-purple-200 pt-1">
            Across {metrics.totalReviews} agency appraisals
          </p>
        </div>

        {/* Executed Events */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Delivered Events
          </span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {metrics.completedEvents}
          </p>
          <p className="text-[11px] text-slate-400 pt-1">
            Completed on-site setups
          </p>
        </div>

        {/* Outstanding Outcomes */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-500" /> Outstanding Rated
          </span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {metrics.outstandingOutcomes}
          </p>
          <p className="text-[11px] text-slate-400 pt-1">
            Zero defect execution runs
          </p>
        </div>

        {/* Recommendation Rate */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <ThumbsUp className="w-3.5 h-3.5 text-blue-500" /> Recommendation
          </span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {metrics.recommendationRate}%
          </p>
          <p className="text-[11px] text-slate-400 pt-1">
            Recommended for VIP galas
          </p>
        </div>
      </div>

      {/* ================= Earned Recognition Badges ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Specialist Recognition & Certifications
          </h3>
          <p className="text-xs text-slate-400">Badges awarded based on verified field performance</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {badges.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-600/25">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">
                  {b.name}
                </h4>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified Active
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= Agency & Client Appraisals List ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Agency & Client Appraisals
            </h3>
            <p className="text-xs text-slate-400">Written evaluations from decorator agencies and venue managers</p>
          </div>
          <MessageSquare className="w-5 h-5 text-purple-500" />
        </div>

        {reviews.length === 0 ? (
          <div className="p-12 text-center space-y-2 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
              No Appraisals Logged Yet
            </p>
            <p className="text-[11px] text-slate-400">
              After executing events, your affiliated agency will log performance feedback here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div
                key={r._id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-purple-500 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {r.decoratorBusinessName || r.reviewedBy?.name || "Decorator Agency Lead"}
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        Evaluator: {r.reviewedBy?.email || "Supervisor"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 uppercase">
                      Outcome: {r.eventOutcome || "Outstanding"}
                    </span>
                    <div className="flex items-center gap-0.5 text-amber-500 text-xs font-black">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{r.rating}.0</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800 italic">
                  "{r.comment}"
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>{new Date(r.createdAt || Date.now()).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                  {r.recommendedForBigEvents && (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Recommended for VIP Events
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceAppraisals;
