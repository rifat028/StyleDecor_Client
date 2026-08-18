import React from "react";
import {
  Building,
  Edit3,
  Phone,
  Mail,
  Globe,
  FileText,
  MapPin,
} from "lucide-react";

// Decorator Agency profile summary card displaying agency data in read-only form format
const MyProfileDecoratorAgencySection = ({
  decoratorData,
  onOpenEditModal,
}) => {
  if (!decoratorData) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-purple-200/80 dark:border-purple-900/40 shadow-xs space-y-6 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/15 dark:hover:shadow-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700">
      {/* Agency Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-2xl border border-purple-100 dark:border-purple-900/50 shrink-0">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {decoratorData.businessName}
            </h3>
            <p className="text-xs text-slate-400">
              {decoratorData.tagline || "Registered Decoration Agency"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            ★ {decoratorData.metrics?.rating || "5.0"} Rating
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            {decoratorData.metrics?.completedEvents || 0} Events
          </span>

          {/* Edit Agency Profile Action Button (Opens Modal) */}
          <button
            type="button"
            onClick={onOpenEditModal}
            className="p-2 rounded-xl text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-colors cursor-pointer"
            title="Edit Agency Profile"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Agency Details in Form Format */}
      <div className="space-y-4">
        {/* Business Name & Tagline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Agency Business Name
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                disabled
                readOnly
                value={decoratorData.businessName || "Not specified"}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-medium cursor-default outline-hidden"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Tagline / Motto
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                disabled
                readOnly
                value={decoratorData.tagline || "Registered Decoration Agency"}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-medium cursor-default outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* About Agency */}
        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            About Your Agency
          </label>
          <textarea
            rows={3}
            disabled
            readOnly
            value={decoratorData.about || "No description provided."}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-medium cursor-default outline-hidden resize-none leading-relaxed"
          />
        </div>

        {/* Contact Info (Phone, Email, Website) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Contact Phone
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                disabled
                readOnly
                value={decoratorData.contactInfo?.phone || "N/A"}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-medium cursor-default outline-hidden"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Agency Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                disabled
                readOnly
                value={decoratorData.contactInfo?.email || "N/A"}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-medium cursor-default outline-hidden truncate"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Website
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                disabled
                readOnly
                value={decoratorData.contactInfo?.website || "N/A"}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-medium cursor-default outline-hidden truncate"
              />
            </div>
          </div>
        </div>

        {/* Operational Service Areas */}
        <div className="space-y-1 pt-1">
          <label className="block text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Operational Coverage Areas
          </label>
          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-100 dark:bg-slate-800">
            {decoratorData.serviceAreas?.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {decoratorData.serviceAreas.map((area, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900/60 text-xs font-medium shadow-2xs"
                  >
                    <MapPin className="w-3 h-3 text-purple-500" />
                    <span>{area}</span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No operational areas selected.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfileDecoratorAgencySection;
