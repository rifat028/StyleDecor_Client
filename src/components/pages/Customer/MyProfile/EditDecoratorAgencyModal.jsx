import React from "react";
import { Check, Save } from "lucide-react";
import Modal from "../../../ui/Modal";
import { TOP_CITIES_BD } from "../../../../lib/constants";

// Modal dialog for editing decorator agency profile details
const EditDecoratorAgencyModal = ({
  isOpen,
  onClose,
  decoratorForm,
  onDecoratorInputChange,
  onToggleServiceArea,
  onSubmitDecoratorProfile,
  savingDecorator = false,
}) => {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Agency Profile"
      maxWidth="max-w-2xl"
    >
      <form
        onSubmit={onSubmitDecoratorProfile}
        className="space-y-4 text-xs"
      >
        {/* Business Name & Tagline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Agency Business Name *
            </label>
            <input
              type="text"
              name="businessName"
              required
              value={decoratorForm.businessName}
              onChange={onDecoratorInputChange}
              placeholder="e.g. Elegance Event Decor"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Tagline / Motto
            </label>
            <input
              type="text"
              name="tagline"
              value={decoratorForm.tagline}
              onChange={onDecoratorInputChange}
              placeholder="e.g. Crafting Dream Weddings"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            />
          </div>
        </div>

        {/* About Agency */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            About Your Agency
          </label>
          <textarea
            name="about"
            rows={3}
            value={decoratorForm.about}
            onChange={onDecoratorInputChange}
            placeholder="Describe your design aesthetics, experience, and services..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
          />
        </div>

        {/* Contact Info (Phone, Email, Website) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Contact Phone
            </label>
            <input
              type="text"
              name="phone"
              value={decoratorForm.phone}
              onChange={onDecoratorInputChange}
              placeholder="+880 17XXXXXXXX"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Agency Email
            </label>
            <input
              type="email"
              name="email"
              value={decoratorForm.email}
              onChange={onDecoratorInputChange}
              placeholder="agency@styledecor.com"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Website
            </label>
            <input
              type="text"
              name="website"
              value={decoratorForm.website}
              onChange={onDecoratorInputChange}
              placeholder="https://..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            />
          </div>
        </div>

        {/* Operational Service Areas */}
        <div className="pt-2">
          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Operational Coverage Areas
          </label>
          <div className="flex flex-wrap gap-1.5">
            {TOP_CITIES_BD.map((c) => {
              const isSelected = decoratorForm.serviceAreas.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => onToggleServiceArea(c)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border cursor-pointer ${
                    isSelected
                      ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                  <span>{c}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Controls */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={savingDecorator}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium shadow-md shadow-purple-600/25 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{savingDecorator ? "Saving..." : "Save Agency Profile"}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditDecoratorAgencyModal;
