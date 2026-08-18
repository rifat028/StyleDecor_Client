import React from "react";
import {
  Building,
  Edit3,
  Check,
  Save,
  X,
} from "lucide-react";
import { TOP_CITIES_BD } from "../../../lib/constants";

// Decorator agency profile view card and inline editor for decorator role
const MyProfileDecoratorAgencySection = ({
  decoratorData,
  isEditingDecorator,
  onToggleEditingDecorator,
  decoratorForm,
  onDecoratorInputChange,
  onToggleServiceArea,
  onSubmitDecoratorProfile,
  savingDecorator = false,
}) => {
  if (!decoratorData) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-purple-200/80 dark:border-purple-900/40 shadow-xs space-y-6">
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
          <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            ★ {decoratorData.metrics?.rating || "5.0"} Rating
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            {decoratorData.metrics?.completedEvents || 0} Events
          </span>

          {/* Toggle Agency Edit Button */}
          <button
            type="button"
            onClick={onToggleEditingDecorator}
            className="p-2 rounded-xl text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-colors cursor-pointer"
            title="Edit Agency Profile"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isEditingDecorator ? (
        /* Agency Edit Form (PATCH /decorators/:id) */
        <form
          onSubmit={onSubmitDecoratorProfile}
          className="space-y-4 pt-2 animate-fade-in text-xs"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                Agency Business Name *
              </label>
              <input
                type="text"
                name="businessName"
                required
                value={decoratorForm.businessName}
                onChange={onDecoratorInputChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                Tagline / Motto
              </label>
              <input
                type="text"
                name="tagline"
                value={decoratorForm.tagline}
                onChange={onDecoratorInputChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
              About Your Agency
            </label>
            <textarea
              name="about"
              rows={3}
              value={decoratorForm.about}
              onChange={onDecoratorInputChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                name="phone"
                value={decoratorForm.phone}
                onChange={onDecoratorInputChange}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Agency Email
              </label>
              <input
                type="email"
                name="email"
                value={decoratorForm.email}
                onChange={onDecoratorInputChange}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Website
              </label>
              <input
                type="text"
                name="website"
                value={decoratorForm.website}
                onChange={onDecoratorInputChange}
                placeholder="https://..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
              Operational Service Areas
            </label>
            <div className="flex flex-wrap gap-1.5">
              {TOP_CITIES_BD.map((c) => {
                const isSelected = decoratorForm.serviceAreas.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => onToggleServiceArea(c)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                      isSelected
                        ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{c}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onToggleEditingDecorator}
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingDecorator}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold shadow-md shadow-purple-600/25 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{savingDecorator ? "Saving..." : "Save Agency Profile"}</span>
            </button>
          </div>
        </form>
      ) : (
        /* Agency View Mode */
        <div className="space-y-4 text-sm">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              About Agency
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {decoratorData.about || "No description provided."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
              <p className="text-[11px] font-bold text-slate-400 uppercase">
                Phone
              </p>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                {decoratorData.contactInfo?.phone || "N/A"}
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
              <p className="text-[11px] font-bold text-slate-400 uppercase">
                Email
              </p>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                {decoratorData.contactInfo?.email || "N/A"}
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
              <p className="text-[11px] font-bold text-slate-400 uppercase">
                Website
              </p>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5 truncate">
                {decoratorData.contactInfo?.website || "N/A"}
              </p>
            </div>
          </div>

          {decoratorData.serviceAreas?.length > 0 && (
            <div className="pt-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Operational Coverage Areas
              </p>
              <div className="flex flex-wrap gap-1.5">
                {decoratorData.serviceAreas.map((area, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyProfileDecoratorAgencySection;
