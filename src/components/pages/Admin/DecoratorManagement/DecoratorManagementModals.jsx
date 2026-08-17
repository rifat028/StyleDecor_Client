import React from "react";
import {
  Building,
  ShieldCheck,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Award,
  CheckCircle2,
  Ban,
  Trash2,
  Calendar,
  Layers,
} from "lucide-react";
import Modal from "../../../ui/Modal";

// Consolidated Decorator Dossier Modal (230-270 lines)
const DecoratorManagementModals = ({
  viewDecorator,
  onCloseView,
  onStatusTransition,
  onDelete,
  getPlaceholderLogo,
}) => {
  if (!viewDecorator) return null;

  const isVerified = viewDecorator.verification?.isVerified;
  const status = viewDecorator.status;

  return (
    <Modal
      isOpen={!!viewDecorator}
      onClose={onCloseView}
      title="Decorator Agency Dossier"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Header Profile Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
          <img
            src={
              viewDecorator.logo ||
              getPlaceholderLogo(viewDecorator.businessName)
            }
            alt={viewDecorator.businessName}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = getPlaceholderLogo(
                viewDecorator.businessName
              );
            }}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-purple-500/20 shrink-0 bg-white dark:bg-slate-900"
          />
          <div className="text-center sm:text-left space-y-1 min-w-0 flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {viewDecorator.businessName}
              </h3>
              {isVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck className="w-3 h-3" /> Verified Partner
                </span>
              )}
            </div>
            {viewDecorator.tagline && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {viewDecorator.tagline}
              </p>
            )}
            <div className="flex items-center justify-center sm:justify-start gap-3 pt-1 text-xs">
              <span className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>
                  {Number(viewDecorator.rating?.average || 5.0).toFixed(1)} (
                  {viewDecorator.rating?.count || 0} reviews)
                </span>
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                {viewDecorator.projectsCompleted || 0} Projects Completed
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Phone Contact */}
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Phone Contact
            </p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {viewDecorator.contact?.phone || "Not provided"}
            </p>
          </div>

          {/* Email Contact */}
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Official Email
            </p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
              {viewDecorator.contact?.email || "Not provided"}
            </p>
          </div>

          {/* Location / Address */}
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Operational Base
            </p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {[
                viewDecorator.location?.address,
                viewDecorator.location?.area,
                viewDecorator.location?.city || "Dhaka",
              ]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>

          {/* Experience & Team */}
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Experience & Scale
            </p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {viewDecorator.experienceYears || 1}+ Years in Industry •{" "}
              {viewDecorator.teamSize || 5} Crew Members
            </p>
          </div>

          {/* About & Description */}
          {viewDecorator.about && (
            <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 sm:col-span-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Agency Background
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {viewDecorator.about}
              </p>
            </div>
          )}

          {/* Specialties / Service Categories */}
          {Array.isArray(viewDecorator.specialties) &&
            viewDecorator.specialties.length > 0 && (
              <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 sm:col-span-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Specialization Categories
                </p>
                <div className="flex flex-wrap gap-2">
                  {viewDecorator.specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* Modal Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => onDelete(viewDecorator)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 font-semibold text-xs transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Agency</span>
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onCloseView}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors cursor-pointer"
            >
              Close
            </button>

            {status === "pending" && (
              <button
                type="button"
                onClick={() => onStatusTransition(viewDecorator, "active")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Verify Agency</span>
              </button>
            )}

            {status === "active" && (
              <button
                type="button"
                onClick={() => onStatusTransition(viewDecorator, "suspended")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer"
              >
                <Ban className="w-4 h-4" />
                <span>Suspend Agency</span>
              </button>
            )}

            {status === "suspended" && (
              <button
                type="button"
                onClick={() => onStatusTransition(viewDecorator, "active")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Reactivate Agency</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DecoratorManagementModals;
