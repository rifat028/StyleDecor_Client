import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { CheckCircle } from "lucide-react";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const PaymentSuccess = () => {
  const [paymentInfo, setPaymentInfo] = useState({});
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [searchParam] = useSearchParams();
  const sessionId = searchParam.get("session_id");

  useEffect(() => {
    if (sessionId) {
      axiosSecure
        .patch(`/payment-success?session_id=${sessionId}`)
        .then((res) => {
          console.log(res.data);
        });
    }
  }, [sessionId, axiosSecure]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center bg-base-200 dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-base-content dark:text-white">
          Payment Successful 🎉
        </h1>

        {/* Message */}
        <p className="mt-3 text-sm md:text-base text-base-content/70 dark:text-gray-300">
          Thank you for your payment. Your booking has been successfully
          processed.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate("/services")}
            className="btn btn-primary"
          >
            Browse Services
          </button>

          <button
            onClick={() => navigate("/dashboard/my-bookings")}
            className="btn btn-outline"
          >
            My Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
