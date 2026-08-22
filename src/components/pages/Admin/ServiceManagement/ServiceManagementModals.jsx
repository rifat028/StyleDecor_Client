import React from "react";
import {
  Layers,
  Sparkles,
  CheckCircle2,
  XCircle,
  Building,
  Clock,
  Tag,
  Check,
  Trash2,
  Star,
} from "lucide-react";
import Modal from "../../../ui/Modal";

// Helper for default placeholder image
const getPlaceholderImage = (title = "Service") => {
  return `https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&auto=format&fit=crop&q=80`;
};

// Consolidated Service Dossier Modal (200-240 lines)
const ServiceManagementModals = ({
  viewingService,
  onClose,
  onToggleStatus,
  onToggleFeatured,
  onDelete,
}) => {
  if (!viewingService) return null;

  const title = viewingService.title || viewingService.serviceName || "Decoration Package";
  const isFeatured = !!viewingService.featured;
  const isActive = viewingService.status === "active";
  const price = viewingService.price || viewingService.pricing?.basePrice || 0;

  return (
    <Modal
      isOpen={!!viewingService}
      onClose={onClose}
      title="Service Package Dossier"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Service Hero Image & Badges */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 h-48 sm:h-56">
          <img
            src={
              viewingService.images?.[0] ||
              viewingService.image ||
              getPlaceholderImage(title)
            }
            alt={title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = getPlaceholderImage(title);
            }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-600 text-white shadow-xs">
                {viewingService.category || "General Decor"}
                {viewingService.subCategory?.name ? ` • ${viewingService.subCategory.name}` : ""}
              </span>
              {isFeatured && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs">
                  <Sparkles className="w-3 h-3 fill-white" /> Featured Package
                </span>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
              {title}
            </h3>
          </div>
        </div>

        {/* Detailed Grid Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Base Price */}
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-center sm:text-left">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Package Base Price
            </p>
            <p className="text-lg font-black text-purple-600 dark:text-purple-400">
              ৳{Number(price).toLocaleString()}
            </p>
          </div>

          {/* Setup Duration */}
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-center sm:text-left">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-center sm:justify-start gap-1">
              <Clock className="w-3.5 h-3.5" /> Setup Duration
            </p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {viewingService.duration || "Full Day (8-10 Hours)"}
            </p>
          </div>

          {/* Vendor Agency */}
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-center sm:text-left">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-center sm:justify-start gap-1">
              <Building className="w-3.5 h-3.5" /> Decorator Vendor
            </p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
              {viewingService.decorator?.businessName ||
                viewingService.decoratorName ||
                "StyleDecor Partner"}
            </p>
          </div>
        </div>

        {/* Description */}
        {viewingService.description && (
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Package Description & Scope
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {viewingService.description}
            </p>
          </div>
        )}

        {/* Inclusions / Package Features Checklist */}
        {Array.isArray(viewingService.inclusions || viewingService.features) &&
          (viewingService.inclusions || viewingService.features).length > 0 && (
            <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Inclusions & Deliverables
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(viewingService.inclusions || viewingService.features).map(
                  (item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

        {/* Modal Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => onDelete(viewingService)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 font-semibold text-xs transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Package</span>
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap sm:flex-nowrap">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors cursor-pointer"
            >
              Close
            </button>

            {/* Toggle Featured Button */}
            <button
              type="button"
              onClick={() => onToggleFeatured(viewingService)}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer ${
                isFeatured
                  ? "border border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:border-amber-800 dark:text-amber-300"
                  : "border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{isFeatured ? "Unfeature" : "Feature Package"}</span>
            </button>

            {/* Toggle Status Button */}
            <button
              type="button"
              onClick={() => onToggleStatus(viewingService)}
              className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-xs transition-colors cursor-pointer text-white ${
                isActive
                  ? "bg-rose-600 hover:bg-rose-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {isActive ? (
                <>
                  <XCircle className="w-4 h-4" />
                  <span>Deactivate</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Activate</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ServiceManagementModals;
