import React from "react";
import {
  CreditCard,
  Building2,
  Calendar,
  Eye,
  CheckCircle2,
  UserCheck,
  RotateCcw,
  Clock,
  User,
  ShieldCheck,
} from "lucide-react";
import TableSkeleton from "../../../ui/TableSkeleton";
import EmptyState from "../../../ui/EmptyState";
import Pagination from "../../../ui/Pagination";
import TableActionButton from "../../../ui/TableActionButton";

// Helper to render uniform width, center-aligned payment type badges
const renderPaymentTypeBadge = (type) => {
  const t = String(type || "").toLowerCase();
  if (t === "advance_payment") {
    return (
      <span className="w-36 inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 shrink-0">
        <CreditCard className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate">Advance Payment</span>
      </span>
    );
  }
  if (t === "full_payment") {
    return (
      <span className="w-36 inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate">Full Payment</span>
      </span>
    );
  }
  if (t === "platform_fee") {
    return (
      <span className="w-36 inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shrink-0">
        <Building2 className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate">Platform Fee</span>
      </span>
    );
  }
  if (t === "agent_fee") {
    return (
      <span className="w-36 inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shrink-0">
        <UserCheck className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate">Agent Fee</span>
      </span>
    );
  }
  return (
    <span className="w-36 inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
      <Clock className="w-3.5 h-3.5 shrink-0" />
      <span className="truncate">{type || "Payment"}</span>
    </span>
  );
};

// Helper to render role badge with appropriate styling
const renderRoleBadge = (role) => {
  const r = String(role || "").toLowerCase();
  if (r === "customer") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
        <User className="w-2.5 h-2.5" /> Customer
      </span>
    );
  }
  if (r === "decorator") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
        <Building2 className="w-2.5 h-2.5" /> Decorator
      </span>
    );
  }
  if (r === "admin") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60">
        <ShieldCheck className="w-2.5 h-2.5" /> Admin
      </span>
    );
  }
  if (r === "agent") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
        <UserCheck className="w-2.5 h-2.5" /> Agent
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
      {role}
    </span>
  );
};

// Transaction management table component with From, To, Amount, Type columns
const TransactionManagementTable = ({
  payments = [],
  loading = false,
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
                <th className="py-3.5 px-3 min-w-44">Transaction & Code</th>
                <th className="py-3.5 px-3 min-w-44">From</th>
                <th className="py-3.5 px-3 min-w-44">To</th>
                <th className="py-3.5 px-3 text-center min-w-32">Amount</th>
                <th className="py-3.5 px-3 text-center min-w-40">Type</th>
                <th className="py-3.5 px-3 text-center min-w-24">Actions</th>
              </tr>
            </thead>
            <TableSkeleton rows={5} columns={6} />
          </table>
        </div>
      ) : payments.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No Transactions Found"
          message="Try adjusting your payment type or decorator filters."
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
                <th className="py-3.5 px-3 min-w-44">Transaction & Code</th>
                <th className="py-3.5 px-3 min-w-44">From</th>
                <th className="py-3.5 px-3 min-w-44">To</th>
                <th className="py-3.5 px-3 text-center min-w-32">Amount</th>
                <th className="py-3.5 px-3 text-center min-w-40">Type</th>
                <th className="py-3.5 px-3 text-center min-w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {payments.map((payment) => {
                const amount = payment.amount || 0;
                const paymentDate = payment.paidAt || payment.createdAt;
                const senderName =
                  payment.sender?.name ||
                  payment.sender?.businessName ||
                  payment.customer?.name ||
                  "Customer";
                const receiverName =
                  payment.receiver?.name ||
                  payment.receiver?.businessName ||
                  payment.decorator?.businessName ||
                  "Decorator Partner";

                return (
                  <tr
                    key={payment._id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* 1. Transaction Code & Date Cell */}
                    <td className="py-3.5 px-3 min-w-44">
                      <div className="space-y-1">
                        <p className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5 truncate">
                          <span>#{payment.paymentCode || payment._id?.slice(-8)}</span>
                        </p>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>
                            {paymentDate
                              ? new Date(paymentDate).toLocaleDateString("en-GB", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "Recent"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 2. From Cell (Sender) */}
                    <td className="py-3.5 px-3 min-w-44">
                      <div className="space-y-1">
                        <div>{renderRoleBadge(payment.sender?.role || "customer")}</div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                          {senderName}
                        </p>
                      </div>
                    </td>

                    {/* 3. To Cell (Receiver) */}
                    <td className="py-3.5 px-3 min-w-44">
                      <div className="space-y-1">
                        <div>{renderRoleBadge(payment.receiver?.role || "decorator")}</div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                          {receiverName}
                        </p>
                      </div>
                    </td>

                    {/* 4. Amount Cell */}
                    <td className="py-3.5 px-3 text-center min-w-32">
                      <div className="inline-flex flex-col items-center">
                        <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                          ৳{Number(amount).toLocaleString()}
                        </span>
                        <span className="mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                          {payment.paymentMethod || "Online"}
                        </span>
                      </div>
                    </td>

                    {/* 5. Type Badge Cell (Uniform w-36, center-aligned) */}
                    <td className="py-3.5 px-3 text-center min-w-40">
                      <div className="flex justify-center">
                        {renderPaymentTypeBadge(payment.paymentType)}
                      </div>
                    </td>

                    {/* 6. Actions Cell */}
                    <td className="py-3.5 px-3 text-center min-w-24">
                      <div className="flex items-center justify-center gap-2">
                        <TableActionButton
                          icon={Eye}
                          onClick={() => onView(payment._id)}
                          tooltip="View Payment Dossier"
                          tone="purple"
                        />
                        {onOpenRefund && (
                          <TableActionButton
                            icon={RotateCcw}
                            disabled={payment.paymentType !== "full_payment"}
                            onClick={() => onOpenRefund(payment)}
                            tooltip="Process Dispute Refund"
                            disabledTooltip="Refund Not Applicable"
                            tone="rose"
                          />
                        )}
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
