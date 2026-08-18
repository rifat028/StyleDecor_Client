import React from "react";
import {
  Layers,
  CheckCircle2,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Tag,
} from "lucide-react";
import TableSkeleton from "../../../ui/TableSkeleton";
import EmptyState from "../../../ui/EmptyState";
import Pagination from "../../../ui/Pagination";

// Fallback image helper
const getPlaceholderImage = () => {
  return "https://images.unsplash.com/photo-1519741497674-611481863552?w=300&auto=format&fit=crop&q=60";
};

// Decorator services table component with responsive min-widths and pagination
const ManageServiceTable = ({
  services,
  loading,
  onView,
  onEdit,
  onToggleStatus,
  onDelete,
  onResetFilters,
  onOpenAddModal,
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
                <th className="py-3.5 px-2 min-w-55">Package</th>
                <th className="py-3.5 px-2 min-w-35">Category</th>
                <th className="py-3.5 px-2 text-center min-w-32.5">Starting Price</th>
                <th className="py-3.5 px-2 text-center min-w-25">Deposit</th>
                <th className="py-3.5 px-2 text-center min-w-25">Tiers</th>
                <th className="py-3.5 px-2 text-center min-w-25">Rating</th>
                <th className="py-3.5 px-2 text-center min-w-40">Status</th>
                <th className="py-3.5 px-2 text-center min-w-32.5">Actions</th>
              </tr>
            </thead>
            <TableSkeleton rows={5} columns={8} />
          </table>
        </div>
      ) : services.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No Service Packages Found"
          message="You haven't listed any packages matching this filter. Click 'Publish New Package' to create one."
          action={{
            label: "Publish New Package",
            onClick: onOpenAddModal || onResetFilters,
          }}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
                <th className="py-3.5 px-2 min-w-55">Package</th>
                <th className="py-3.5 px-2 min-w-35">Category</th>
                <th className="py-3.5 px-2 text-center min-w-32.5">Starting Price</th>
                <th className="py-3.5 px-2 text-center min-w-25">Deposit</th>
                <th className="py-3.5 px-2 text-center min-w-25">Tiers</th>
                <th className="py-3.5 px-2 text-center min-w-25">Rating</th>
                <th className="py-3.5 px-2 text-center min-w-40">Status</th>
                <th className="py-3.5 px-2 text-center min-w-32.5">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {services.map((srv) => {
                const title = srv.title || srv.serviceName || "Package";
                const cover =
                  srv.coverImage ||
                  srv.images?.[0] ||
                  getPlaceholderImage();
                const cat =
                  typeof srv.category === "string"
                    ? srv.category
                    : srv.category?.name || "Decoration";
                const subCat = srv.subCategory?.name || "";
                const price =
                  srv.pricing?.discountedPrice ||
                  srv.pricing?.basePrice ||
                  srv.cost ||
                  20000;
                const deposit = srv.pricing?.depositRequiredPercent || 25;
                const rating = srv.metrics?.rating || srv.rating || 5.0;
                const isActive = srv.status === "active";
                const variationsCount = srv.packages?.length || 1;

                return (
                  <tr
                    key={srv._id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Package Title & Cover */}
                    <td className="py-3.5 px-2 min-w-55">
                      <div className="flex items-center gap-3">
                        <img
                          src={cover}
                          alt={title}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = getPlaceholderImage();
                          }}
                          className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0 shadow-xs"
                        />
                        <div className="space-y-0.5 max-w-xs min-w-0">
                          <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
                            {title}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">
                            {srv.shortDescription || "Event decoration package"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category & Subcategory */}
                    <td className="py-3.5 px-2 min-w-35">
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900/50 whitespace-nowrap">
                          <Tag className="w-2.5 h-2.5" />
                          <span>{cat}</span>
                        </span>
                        {subCat && (
                          <p className="text-[10px] text-slate-400 truncate font-medium">
                            {subCat}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Starting Price */}
                    <td className="py-3.5 px-2 text-center min-w-32.5 font-black text-purple-600 dark:text-purple-400 text-sm whitespace-nowrap">
                      <div className="inline-flex flex-col items-center">
                        <span>৳{Number(price).toLocaleString()}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {srv.pricing?.unit === "per_day"
                            ? "per day"
                            : srv.pricing?.unit === "per_package"
                            ? "per package"
                            : "per event"}
                        </span>
                      </div>
                    </td>

                    {/* Deposit */}
                    <td className="py-3.5 px-2 text-center min-w-25 font-semibold text-slate-700 dark:text-slate-300">
                      {deposit}%
                    </td>

                    {/* Tiers / Variations */}
                    <td className="py-3.5 px-2 text-center min-w-25 font-semibold text-slate-600 dark:text-slate-400">
                      {variationsCount} Tier{variationsCount > 1 ? "s" : ""}
                    </td>

                    {/* Rating */}
                    <td className="py-3.5 px-2 text-center min-w-25 font-bold text-amber-500 whitespace-nowrap">
                      ★ {Number(rating).toFixed(1)}
                    </td>

                    {/* Status Column with 1-Click Toggle */}
                    <td className="py-3.5 px-2 text-center min-w-40">
                      <button
                        type="button"
                        onClick={() => onToggleStatus(srv)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase transition-all cursor-pointer ${
                          isActive
                            ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-200"
                            : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 hover:bg-slate-300"
                        }`}
                        title={`Click to ${isActive ? "pause" : "activate"}`}
                      >
                        {isActive ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <XCircle className="w-3 h-3 text-slate-500" />
                        )}
                        <span>{srv.status || "active"}</span>
                      </button>
                    </td>

                    {/* Actions Column (Centered with bordered buttons) */}
                    <td className="py-3.5 px-2 text-center min-w-32.5">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Preview Dossier */}
                        <button
                          type="button"
                          onClick={() => onView(srv)}
                          className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-purple-600 transition-colors cursor-pointer"
                          title="Preview Package Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit Package */}
                        <button
                          type="button"
                          onClick={() => onEdit(srv)}
                          className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-colors cursor-pointer"
                          title="Edit Package"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Package */}
                        <button
                          type="button"
                          onClick={() => onDelete(srv)}
                          className="p-1.5 rounded-md border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                          title="Delete Package"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

export default ManageServiceTable;
