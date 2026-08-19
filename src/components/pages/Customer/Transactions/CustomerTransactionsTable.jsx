import React from "react";
import { CreditCard, CheckCircle2, Clock, RotateCcw, Eye } from "lucide-react";
import TableSkeleton from "../../../ui/TableSkeleton";
import EmptyState from "../../../ui/EmptyState";
import Pagination from "../../../ui/Pagination";
import TableActionButton from "../../../ui/TableActionButton";

// Canonical Status Badge Component for Customer Payments
export const CustomerPaymentStatusBadge = ({ status }) => {
  const s = String(status || "").toLowerCase();
  if (s === "completed" || s === "paid") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 uppercase">
        <CheckCircle2 className="w-3 h-3" /> Paid
      </span>
    );
  }
  if (s === "refunded") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 uppercase">
        <RotateCcw className="w-3 h-3" /> Refunded
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 uppercase">
      <Clock className="w-3 h-3" /> Pending
    </span>
  );
};

// Customer payment history table component with responsive min-widths and pagination
const CustomerTransactionsTable = ({
  transactions,
  loading,
  onOpenReceipt,
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
                <th className="py-3.5 px-2 min-w-40">Receipt Code</th>
                <th className="py-3.5 px-2 min-w-45">Service & Package</th>
                <th className="py-3.5 px-2 min-w-35">Decorator Agency</th>
                <th className="py-3.5 px-2 min-w-35">Gateway & TRX ID</th>
                <th className="py-3.5 px-2 text-center min-w-27.5">
                  Amount Paid
                </th>
                <th className="py-3.5 px-2 text-center min-w-27.5">Date</th>
                <th className="py-3.5 px-2 text-center min-w-40">Status</th>
                <th className="py-3.5 px-2 text-center min-w-25">Invoice</th>
              </tr>
            </thead>
            <TableSkeleton rows={5} columns={8} />
          </table>
        </div>
      ) : transactions.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No Payment Transactions Found"
          message="You do not have any transaction records matching your search filters."
          action={{
            label: "Reset Filters",
            onClick: onResetFilters,
          }}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
                <th className="py-3.5 px-2 min-w-40">Receipt Code</th>
                <th className="py-3.5 px-2 min-w-45">Service & Package</th>
                <th className="py-3.5 px-2 min-w-35">Decorator Agency</th>
                <th className="py-3.5 px-2 min-w-35">Gateway & TRX ID</th>
                <th className="py-3.5 px-2 text-center min-w-27.5">
                  Amount Paid
                </th>
                <th className="py-3.5 px-2 text-center min-w-27.5">Date</th>
                <th className="py-3.5 px-2 text-center min-w-40">Status</th>
                <th className="py-3.5 px-2 text-center min-w-25">Invoice</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {transactions.map((t) => {
                const payCode =
                  t.paymentCode ||
                  `PAY-${(t._id || t.transactionId || "").slice(-6).toUpperCase()}`;
                const srvTitle =
                  t.booking?.serviceSnapshot?.title ||
                  t.serviceName ||
                  "Decoration Setup";
                const agency =
                  t.decorator?.businessName || "StyleDecor Verified Agency";
                const trxId =
                  t.gatewayDetails?.transactionId ||
                  t.transactionId ||
                  "TRX-AUTO";
                const method = t.paymentMethod || "sslcommerz";
                const amt = Number(t.amount || 0);
                const dateStr = t.paidAt || t.paidAT || t.createdAt;

                return (
                  <tr
                    key={t._id || trxId}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Receipt Code */}
                    <td className="py-3.5 px-2 min-w-32.5">
                      <span className="font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-900/50">
                        {payCode}
                      </span>
                    </td>

                    {/* Service & Package */}
                    <td className="py-3.5 px-2 min-w-45 font-bold text-slate-900 dark:text-slate-100">
                      <p className="truncate max-w-xs">{srvTitle}</p>
                    </td>

                    {/* Decorator Agency */}
                    <td className="py-3.5 px-2 min-w-35 font-semibold text-slate-800 dark:text-slate-200">
                      <p className="truncate max-w-35">{agency}</p>
                    </td>

                    {/* Gateway & TRX ID */}
                    <td className="py-3.5 px-2 min-w-35">
                      <div className="space-y-0.5">
                        <span className="font-bold uppercase text-[9px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {method}
                        </span>
                        <p className="text-[10px] font-mono text-slate-400 truncate max-w-30">
                          {trxId}
                        </p>
                      </div>
                    </td>

                    {/* Amount Paid */}
                    <td className="py-3.5 px-2 text-center min-w-27.5 font-black text-slate-900 dark:text-slate-100 text-sm whitespace-nowrap">
                      ৳{amt.toLocaleString()}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-2 text-center min-w-27.5 text-slate-500 whitespace-nowrap">
                      {dateStr
                        ? new Date(dateStr).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-2 text-center min-w-40 whitespace-nowrap">
                      <CustomerPaymentStatusBadge status={t.status} />
                    </td>

                    {/* Action: Open Official Receipt */}
                    <td className="py-3.5 px-2 text-center min-w-25">
                      <TableActionButton
                        icon={Eye}
                        onClick={() => onOpenReceipt(t._id)}
                        tooltip="View Official Receipt Dossier"
                        tone="purple"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 3-Part Streamlined Pagination Footer */}
      {!loading && transactions.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          limit={limit}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
          itemLabel="payments"
        />
      )}
    </div>
  );
};

export default CustomerTransactionsTable;
