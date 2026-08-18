import React from "react";
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
} from "lucide-react";
import TableSkeleton from "../../../ui/TableSkeleton";
import EmptyState from "../../../ui/EmptyState";
import Pagination from "../../../ui/Pagination";

// Canonical Status Badge Component for Payment Records
export const PaymentStatusBadge = ({ status }) => {
  const s = String(status || "").toLowerCase();
  if (s === "completed") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 uppercase">
        <CheckCircle2 className="w-3 h-3" /> Completed
      </span>
    );
  }
  if (s === "refunded") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 uppercase">
        <AlertCircle className="w-3 h-3" /> Refunded
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 uppercase">
      <Clock className="w-3 h-3" /> Pending
    </span>
  );
};

// Decorator earnings and payouts table component with responsive min-widths and pagination
const MyEarningsTable = ({
  payments,
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
                <th className="py-3.5 px-2 min-w-40">Payment Code</th>
                <th className="py-3.5 px-2 min-w-40">Customer</th>
                <th className="py-3.5 px-2 min-w-32">Booking Ref</th>
                <th className="py-3.5 px-2 min-w-35">Gateway & TRX ID</th>
                <th className="py-3.5 px-2 text-center min-w-27.5">
                  Gross Amount
                </th>
                <th className="py-3.5 px-2 text-center min-w-27.5">
                  Platform Fee
                </th>
                <th className="py-3.5 px-2 text-center min-w-30">
                  Your Receivable
                </th>
                <th className="py-3.5 px-2 text-center min-w-40">Status</th>
                <th className="py-3.5 px-2 text-center min-w-27.5">Invoice</th>
              </tr>
            </thead>
            <TableSkeleton rows={5} columns={9} />
          </table>
        </div>
      ) : payments.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No Payment Transactions Found"
          message="No financial records match your current filter settings."
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
                <th className="py-3.5 px-2 min-w-40">Payment Code</th>
                <th className="py-3.5 px-2 min-w-40">Customer</th>
                <th className="py-3.5 px-2 min-w-32">Booking Ref</th>
                <th className="py-3.5 px-2 min-w-35">Gateway & TRX ID</th>
                <th className="py-3.5 px-2 text-center min-w-27.5">
                  Gross Amount
                </th>
                <th className="py-3.5 px-2 text-center min-w-27.5">
                  Platform Fee
                </th>
                <th className="py-3.5 px-2 text-center min-w-30">
                  Your Receivable
                </th>
                <th className="py-3.5 px-2 text-center min-w-40">Status</th>
                <th className="py-3.5 px-2 text-center min-w-27.5">Invoice</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {payments.map((p) => {
                const custName =
                  p.customer?.name || p.clientName || "Valued Client";
                const bkgCode =
                  p.booking?.bookingCode ||
                  `BK-${p.bookingId ? p.bookingId.toString().slice(-6).toUpperCase() : "REF"}`;
                const trxId = p.gatewayDetails?.transactionId || "TRX-AUTO";
                const method = p.paymentMethod || "sslcommerz";
                const grossAmt = Number(p.amount || 0);
                const commission =
                  Number(p.breakdown?.platformCommission) ||
                  Math.round(grossAmt * 0.1);
                const receivable =
                  Number(p.breakdown?.vendorReceivable) ||
                  Math.round(grossAmt * 0.885);

                return (
                  <tr
                    key={p._id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Payment Code */}
                    <td className="py-3.5 px-2 min-w-32.5">
                      <span className="font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-900/50">
                        {p.paymentCode}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-2 min-w-40">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
                          {custName}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {p.customer?.phone || p.clientEmail || ""}
                        </p>
                      </div>
                    </td>

                    {/* Booking Reference */}
                    <td className="py-3.5 px-2 min-w-30 font-mono font-semibold text-slate-700 dark:text-slate-300">
                      {bkgCode}
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

                    {/* Gross Amount */}
                    <td className="py-3.5 px-2 text-center min-w-27.5 font-black text-slate-900 dark:text-slate-100 text-sm whitespace-nowrap">
                      ৳{grossAmt.toLocaleString()}
                    </td>

                    {/* Platform Commission (10%) */}
                    <td className="py-3.5 px-2 text-center min-w-27.5 text-slate-500 whitespace-nowrap font-medium">
                      -৳{commission.toLocaleString()}
                    </td>

                    {/* Net Receivable (88.5%) */}
                    <td className="py-3.5 px-2 text-center min-w-30 font-black text-emerald-600 dark:text-emerald-400 text-sm whitespace-nowrap">
                      ৳{receivable.toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-2 text-center min-w-40 whitespace-nowrap">
                      <PaymentStatusBadge status={p.status} />
                    </td>

                    {/* Action: Open Invoice Dossier */}
                    <td className="py-3.5 px-2 text-center min-w-27.5">
                      <button
                        type="button"
                        onClick={() => onOpenReceipt(p._id)}
                        className="inline-flex items-center gap-1 p-1.5 rounded-md border border-purple-200 dark:border-purple-900/60 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-colors cursor-pointer"
                        title="View Official Invoice Dossier"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
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
          itemLabel="payments"
        />
      )}
    </div>
  );
};

export default MyEarningsTable;
