import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router";
import { CheckCircle2, ArrowRight, Calendar, Sparkles, CreditCard } from "lucide-react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Spinner from "../home/components/Spinner";

const PaymentSuccess = () => {
  const [transactionId, setTransactionId] = useState("");
  const [paymentCode, setPaymentCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [searchParam] = useSearchParams();
  const sessionId = searchParam.get("session_id");

  const calledRef = useRef(false);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }
    if (calledRef.current) return;
    calledRef.current = true;

    const verifyStripePayment = async () => {
      try {
        setLoading(true);
        let res;
        try {
          res = await axiosSecure.patch(`/payments/payment-success?session_id=${sessionId}`);
        } catch (e) {
          res = await axiosSecure.patch(`/payment-success?session_id=${sessionId}`);
        }

        if (res.data?.success) {
          setSuccess(true);
          setTransactionId(res.data?.transactionId || "TRX-STRIPE-CONFIRMED");
          setPaymentCode(res.data?.paymentCode || "PAY-CONFIRMED");
        } else {
          setSuccess(false);
        }
      } catch (err) {
        console.error("Payment verification failed:", err);
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    verifyStripePayment();
  }, [sessionId, axiosSecure]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Spinner />
      </div>
    );
  }

  if (!success && sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <div className="max-w-md w-full text-center bg-white dark:bg-slate-900 rounded-3xl p-8 border border-rose-200 dark:border-rose-900/60 shadow-xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
            <CreditCard className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            Payment Verification Failed
          </h2>
          <p className="text-xs text-slate-500">
            We could not verify the Stripe transaction callback. If your card was charged, please check your bookings dashboard.
          </p>
          <div className="pt-4">
            <button
              onClick={() => navigate("/dashboard/my-bookings")}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer"
            >
              Go to My Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 animate-fade-in">
      <div className="max-w-lg w-full text-center bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-2xl space-y-6">
        {/* Animated Success Badge */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-50 dark:ring-emerald-950/30">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Order Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Payment Successful 🎉
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Your payment has been cleared and protected by StyleDecor Escrow. The decorator agency has received your confirmation.
          </p>
        </div>

        {/* Receipt Box */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700 space-y-2 text-xs text-left">
          <div className="flex justify-between items-center text-slate-500">
            <span>Payment Reference</span>
            <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{paymentCode || "PAY-ONLINE"}</span>
          </div>
          <div className="flex justify-between items-center text-slate-500">
            <span>Stripe Transaction ID</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{transactionId || "TRX-CLEARED"}</span>
          </div>
          <div className="flex justify-between items-center text-slate-500">
            <span>Status</span>
            <span className="font-bold text-emerald-600 uppercase">Paid & Protected</span>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            to="/dashboard/my-bookings"
            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-purple-600/30"
          >
            <Calendar className="w-4 h-4" /> View My Bookings
          </Link>
          <Link
            to="/services"
            className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            Explore More Services <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
