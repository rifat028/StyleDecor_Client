import React, { useContext, useEffect, useState } from "react";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { AuthContext } from "../Authentication/AuthContext";

const Transactions = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const loadTransactions = async () => {
      try {
        setLoading(true);

        // ✅ Server: GET /transactions?email=user@email.com
        const res = await axiosSecure.get(
          `/transactions?email=${encodeURIComponent(user.email)}`
        );

        setTransactions(res.data || []);
      } catch (err) {
        console.error("Failed to load transactions:", err);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [axiosSecure, user?.email]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-base-200 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-base-content dark:text-white">
            My <span className="text-purple-500">Transactions</span>
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-sm md:text-base text-base-content/70 dark:text-slate-300">
            Here you can see your payment history and transaction details.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Empty */}
        {transactions.length === 0 ? (
          <div className="rounded-2xl border border-base-300 dark:border-gray-700 bg-base-200 dark:bg-gray-800 p-8 text-center">
            <p className="text-base-content dark:text-white font-medium">
              No transactions found.
            </p>
            <p className="mt-2 text-sm text-base-content/70 dark:text-gray-300">
              Once you pay for a booking, your transactions will show here.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-base-300 dark:border-gray-700 bg-base-100 dark:bg-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead className="bg-base-200 dark:bg-gray-700">
                  <tr className="text-base-content dark:text-white">
                    <th>#</th>
                    <th>Transaction ID</th>
                    <th>Booking ID</th>
                    <th>Service</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>Paid At</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((t, index) => (
                    <tr
                      key={t._id || t.transactionId || index}
                      className="text-base-content dark:text-gray-100"
                    >
                      <td>{index + 1}</td>

                      <td className="min-w-56 font-mono text-xs md:text-sm">
                        {t.transactionId}
                      </td>

                      <td className="min-w-56 font-mono text-xs md:text-sm">
                        {t.bookingID}
                      </td>

                      <td className="min-w-52 font-semibold">
                        {t.serviceName}
                      </td>

                      <td className="min-w-24">
                        <span
                          className={`badge ${
                            t.status === "paid"
                              ? "badge-success"
                              : "badge-error"
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>

                      <td className="min-w-24">৳{t.amount}</td>
                      <td className="min-w-24">{t.paidAT}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-base-200 dark:bg-gray-700 flex items-center justify-between">
              <p className="text-sm text-base-content/70 dark:text-gray-200">
                Total transactions:{" "}
                <span className="font-semibold">{transactions.length}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
