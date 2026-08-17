import React from "react";
import {
  Layers,
  Sparkles,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  Star,
  Building,
  Clock,
  Tag,
} from "lucide-react";
import TableSkeleton from "../../../ui/TableSkeleton";
import EmptyState from "../../../ui/EmptyState";
import Pagination from "../../../ui/Pagination";

// Helper for default placeholder image
const getPlaceholderImage = (title = "Service") => {
  return `https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=300&auto=format&fit=crop&q=60`;
};

// Service management table component with responsive min-widths and pagination (210-250 lines)
const ServiceManagementTable = ({
  services,
  loading,
  onView,
  onToggleStatus,
  onToggleFeatured,
  onDelete,
  onResetFilters,
  page,
  totalPages,
  totalCount,
  limit,
  onPageChange,
  onLimitChange,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden rounded-none">
      {loading ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
                <th className="py-3.5 px-2 min-w-55">Service Package</th>
                <th className="py-3.5 px-2 min-w-40">Decorator Agency</th>
                <th className="py-3.5 px-2 text-center min-w-32.5">Pricing</th>
                <th className="py-3.5 px-2 text-center min-w-35">Status & Feature</th>
                <th className="py-3.5 px-2 text-center min-w-30">Actions</th>
              </tr>
            </thead>
            <TableSkeleton rows={5} columns={5} />
          </table>
        </div>
      ) : services.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No Service Packages Found"
          message="Try adjusting your category, vendor, or search criteria."
          action={{
            label: "Clear All Filters",
            onClick: onResetFilters,
          }}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
                <th className="py-3.5 px-2 min-w-55">Service Package</th>
                <th className="py-3.5 px-2 min-w-40">Decorator Agency</th>
                <th className="py-3.5 px-2 text-center min-w-32.5">Pricing</th>
                <th className="py-3.5 px-2 text-center min-w-35">Status & Feature</th>
                <th className="py-3.5 px-2 text-center min-w-30">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {services.map((service) => {
                const isFeatured = !!service.featured;
                const isActive = service.status === "active";
                const price = service.price || service.pricing?.basePrice || 0;
                const title = service.title || service.serviceName || "Decoration Package";

                return (
                  <tr
                    key={service._id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Service Package Profile Cell */}
                    <td className="py-3.5 px-2 min-w-55">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            service.images?.[0] ||
                            service.image ||
                            getPlaceholderImage(title)
                          }
                          alt={title}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = getPlaceholderImage(title);
                          }}
                          className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0 bg-slate-100 dark:bg-slate-800"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 truncate">
                            <span className="truncate">{title}</span>
                            {isFeatured && (
                              <Sparkles
                                className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0"
                                title="Featured Package"
                              />
                            )}
                          </p>
                          <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold truncate flex items-center gap-1">
                            <Tag className="w-3 h-3 shrink-0" />
                            <span>{service.category || "General Decor"}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Decorator Agency Cell */}
                    <td className="py-3.5 px-2 min-w-40">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 truncate">
                          <Building className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>
                            {service.decorator?.businessName ||
                              service.decoratorName ||
                              "StyleDecor Partner"}
                          </span>
                        </p>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-400 shrink-0" />
                          <span>
                            {Number(
                              service.rating?.average ||
                                service.decorator?.rating?.average ||
                                4.9
                            ).toFixed(1)}
                          </span>
                        </p>
                      </div>
                    </td>

                    {/* Pricing & Duration Cell */}
                    <td className="py-3.5 px-2 text-center min-w-32.5">
                      <div className="inline-flex flex-col items-center">
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                          ৳{Number(price).toLocaleString()}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 shrink-0" />
                          <span>{service.duration || "Full Day"}</span>
                        </span>
                      </div>
                    </td>

                    {/* Status & Featured Cell */}
                    <td className="py-3.5 px-2 text-center min-w-35">
                      <div className="inline-flex flex-col items-center gap-1">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                            <XCircle className="w-3 h-3" /> Inactive
                          </span>
                        )}
                        {isFeatured && (
                          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Centered Actions Cell with Bordered Buttons */}
                    <td className="py-3.5 px-2 text-center min-w-30">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* View Dossier Button */}
                        <button
                          type="button"
                          onClick={() => onView(service)}
                          title="View Service Dossier"
                          className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/50 dark:hover:text-purple-400 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Toggle Featured Star Button */}
                        <button
                          type="button"
                          onClick={() => onToggleFeatured(service)}
                          title={
                            isFeatured
                              ? "Remove from Highlights"
                              : "Feature on Homepage"
                          }
                          className={`p-1.5 rounded-md border transition-colors cursor-pointer ${
                            isFeatured
                              ? "border-amber-300 bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-400"
                              : "border-slate-200 dark:border-slate-700 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                          }`}
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>

                        {/* Toggle Status Button */}
                        <button
                          type="button"
                          onClick={() => onToggleStatus(service)}
                          title={isActive ? "Deactivate Package" : "Activate Package"}
                          className={`p-1.5 rounded-md border transition-colors cursor-pointer ${
                            isActive
                              ? "border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-950/40"
                              : "border-slate-200 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:border-slate-700"
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>

                        {/* Delete Service Button */}
                        <button
                          type="button"
                          onClick={() => onDelete(service)}
                          title="Delete Service Package"
                          className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 dark:hover:text-rose-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 3-Part Streamlined Pagination Footer */}
      {!loading && services.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          limit={limit}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
          itemLabel="services"
        />
      )}
    </div>
  );
};

export default ServiceManagementTable;
