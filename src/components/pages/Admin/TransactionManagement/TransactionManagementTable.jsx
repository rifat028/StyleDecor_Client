import React from "react";
import {
  DollarSign,
  CreditCard,
  Building,
  Calendar,
  Eye,
  CheckCircle2,
  RotateCcw,
  Clock,
  User,
} from "lucide-react";
import TableSkeleton from "../../../ui/TableSkeleton";
import EmptyState from "../../../ui/EmptyState";
import Pagination from "../../../ui/Pagination";

// Helper to render categorical status badge
const renderStatusBadge = (status) => {
  const s = String(status || "").toLowerCase();
  if (s === "completed") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 uppercase">
        <CheckCircle2 className="w-3 h-3" /> Completed
      </span>
    );
  }
  if (s === "refunded") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 uppercase">
        <RotateCcw className="w-3 h-3" /> Refunded
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 uppercase">
      <Clock className="w-3 h-3" /> Pending
    </span>
  );
};

// Transaction management table component with responsive min-widths and pagination (210-250 lines)
const TransactionManagementTable = ({
  payments,
  loading,
  onView,
  onOpenRefund,
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
                <th className="py-3.5 px-2 min-w-55">Transaction & Gateway</th>
                <th className="py-3.5 px-2 min-w-45">Customer & Vendor</th>
                <th className="py-3.5 px-2 text-center min-w-35">Gross & Escrow</th>
                <th className="py-3.5 px-2 text-center min-w-40">Status</th>
                <th className="py-3.5 px-2 text-center min-w-30">Actions</th>
              </tr>
            </thead>
            <TableSkeleton rows={5} columns={5} />
          </table>
        </div>
      ) : payments.length === 0 ? (
        <EmptyState
          icon={DollarSign}
          title="No Transactions Found"
          message="Try adjusting your status, gateway, or vendor filters."
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
                <th className="py-3.5 px-2 min-w-55">Transaction & Gateway</th>
                <th className="py-3.5 px-2 min-w-45">Customer & Vendor</th>
                <th className="py-3.5 px-2 text-center min-w-35">Gross & Escrow</th>
                <th className="py-3.5 px-2 text-center min-w-40">Status</th>
                <th className="py-3.5 px-2 text-center min-w-30">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {payments.map((payment) => {
                const isCompleted = payment.status === "completed";
                const isRefunded = payment.status === "refunded";
                const grossAmount = payment.amount || 0;
                const platformFee = payment.platformFee || grossAmount * 0.1;
                const netVendor = grossAmount - platformFee;

                return (
                  <tr
                    key={payment._id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Transaction & Gateway Profile Cell */}
                    <td className="py-3.5 px-2 min-w-55">
                      <div className="space-y-1">
                        <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 truncate">
                          <span>
                            #{payment.paymentCode || payment._id?.slice(-8)}
                          </span>
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="px-2 py-0.5 rounded-md font-semibold text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase">
                            {payment.paymentMethod || "Online"}
                          </span>
                          <span>•</span>
                          <span className="font-mono text-[11px] text-slate-400 truncate">
                            {payment.transactionId || "TRX-STANDARD"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Customer & Vendor Cell */}
                    <td className="py-3.5 px-2 min-w-45">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 truncate">
                          <User className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>
                            {payment.customerEmail ||
                              payment.userEmail ||
                              "Customer"}
                          </span>
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
                          <Building className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>
                            {payment.decoratorName ||
                              payment.decorator?.businessName ||
                              "StyleDecor Partner"}
                          </span>
                        </p>
                      </div>
                    </td>

                    {/* Gross Amount & Escrow Net Cell */}
                    <td className="py-3.5 px-2 text-center min-w-35">
                      <div className="inline-flex flex-col items-center">
                        <span className="font-black text-slate-900 dark:text-slate-100 text-sm">
                          ৳{Number(grossAmount).toLocaleString()}
                        </span>
                        <span className="text-[11px] text-slate-400 mt-0.5">
                          Net: ৳{Number(netVendor).toLocaleString()}
                        </span>
                      </div>
                    </td>

                    {/* Status Badge Cell (min-w-40) */}
                    <td className="py-3.5 px-2 text-center min-w-40">
                      {renderStatusBadge(payment.status)}
                    </td>

                    {/* Centered Actions Cell with Bordered Buttons */}
                    <td className="py-3.5 px-2 text-center min-w-30">
                      <div className="flex items-center justify-center gap-2">
                        {/* View Invoice Dossier Button */}
                        <button
                          type="button"
                          onClick={() => onView(payment._id)}
                          title="View Invoice Dossier"
                          className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/50 dark:hover:text-purple-400 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Process Refund Button (Disabled if not completed or already refunded) */}
                        <button
                          type="button"
                          disabled={!isCompleted || isRefunded}
                          onClick={() => onOpenRefund(payment)}
                          title={
                            isRefunded
                              ? "Already Refunded"
                              : !isCompleted
                              ? "Refund Not Applicable"
                              : "Process Dispute Refund"
                          }
                          className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 dark:text-rose-400 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                        >
                          <RotateCcw className="w-4 h-4" />
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
      {!loading && payments.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          limit={limit}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
          itemLabel="transactions"
        />
      )}
    </div>
  );
};

export default TransactionManagementTable;
