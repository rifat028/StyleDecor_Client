import React, { useContext, useEffect, useMemo, useState } from "react";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { AuthContext } from "../Authentication/AuthContext";

const MyEarnings = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const [decoratorId, setDecoratorId] = useState(null);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedBooking, setSelectedBooking] = useState(null);

  // ---------- 1) Load decorator id by email ----------
  useEffect(() => {
    const loadDecoratorId = async () => {
      // console.log(user?.email);
      if (!user?.email) return;

      try {
        // ✅ Expected: GET /decorators/someone@gmail.com -> [decorator] OR decorator
        const res = await axiosSecure.get(`/decorators/${user.email}`);
        console.log(res);
        const dec = Array.isArray(res.data) ? res.data[0] : res.data;
        setDecoratorId(dec?._id || null);
      } catch (err) {
        console.error("Failed to load decorator id:", err);
        setDecoratorId(null);
      }
    };

    loadDecoratorId();
  }, [axiosSecure, user?.email]);

  // ---------- 2) Load all bookings for this decorator ----------
  useEffect(() => {
    const loadBookings = async () => {
      if (!decoratorId) return;

      try {
        setLoading(true);
        const res = await axiosSecure.get(`/bookings/decorator/${decoratorId}`);
        console.log(res);
        setBookings(res.data || []);
      } catch (err) {
        console.error("Failed to load bookings:", err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [axiosSecure, decoratorId]);

  // ---------- Completed bookings only ----------
  const completedBookings = useMemo(() => {
    return (bookings || []).filter(
      (b) => String(b.status || "").toLowerCase() === "completed"
    );
  }, [bookings]);

  // ---------- Add earning field ----------
  const completedWithEarning = useMemo(() => {
    return completedBookings.map((b) => ({
      ...b,
      earning: Math.round((Number(b.totalCost) || 0) * 0.2),
    }));
  }, [completedBookings]);

  // ---------- Total earning ----------
  const totalEarning = useMemo(() => {
    return completedWithEarning.reduce((sum, b) => sum + (b.earning || 0), 0);
  }, [completedWithEarning]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 dark:bg-gray-900">
      {/* Top section */}
      <div className="bg-base-100 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-base-content dark:text-white">
            My <span className="text-purple-500">Earnings</span>
          </h1>

          <p className="mt-4 text-base-content/70 dark:text-slate-300">
            Earnings are calculated as <strong>20%</strong> of the total project
            cost (only completed projects).
          </p>

          <div className="mt-6 inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-base-100 dark:bg-gray-800 border border-base-300 dark:border-gray-700">
            <span className="text-lg font-semibold text-base-content dark:text-white">
              Total Earnings:
            </span>
            <span className="text-2xl font-bold text-green-600">
              ৳{totalEarning}
            </span>
          </div>
        </div>
      </div>

      {/* Table section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {completedWithEarning.length === 0 ? (
          <div className="p-8 rounded-xl bg-base-200 dark:bg-gray-800 text-center">
            <p className="font-medium text-base-content dark:text-white">
              No completed projects found.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-base-300 dark:border-gray-700 bg-base-100 dark:bg-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead className="bg-base-200 dark:bg-gray-700">
                  <tr className="text-base-content dark:text-white">
                    <th>#</th>
                    <th>Booking ID</th>
                    <th>Client</th>
                    <th>Service</th>
                    <th>Completed At</th>
                    <th>Total Cost</th>
                    <th>Earning (20%)</th>
                  </tr>
                </thead>

                <tbody>
                  {completedWithEarning.map((b, idx) => (
                    <tr
                      key={b._id}
                      className="text-base-content dark:text-gray-100"
                    >
                      <td>{idx + 1}</td>

                      <td>
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="link link-primary text-sm"
                        >
                          {b._id}
                        </button>
                      </td>

                      <td>
                        <p className="font-semibold">{b.clientName}</p>
                        <p className="text-xs text-base-content/60 dark:text-gray-300">
                          {b.contact}
                        </p>
                      </td>

                      <td>
                        <p className="font-semibold">{b.serviceName}</p>
                        <p className="text-xs capitalize text-base-content/60 dark:text-gray-300">
                          {b.serviceCategory}
                        </p>
                      </td>

                      <td>{b.completedAt || "-"}</td>
                      <td>৳{b.totalCost}</td>
                      <td className="font-bold text-green-600">৳{b.earning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSelectedBooking(null)}
          />

          <div className="relative w-full max-w-xl rounded-2xl bg-base-100 dark:bg-gray-800 border border-base-300 dark:border-gray-700 shadow-lg">
            <div className="p-4 border-b dark:border-gray-700 flex justify-between">
              <h3 className="text-lg font-bold dark:text-white">
                Booking Details
              </h3>
              <button
                className="btn btn-sm"
                onClick={() => setSelectedBooking(null)}
              >
                Close
              </button>
            </div>

            <div className="p-4 text-sm dark:text-gray-200 space-y-2">
              <p>
                <strong>Booking ID:</strong> {selectedBooking._id}
              </p>
              <p>
                <strong>Client:</strong> {selectedBooking.clientName}
              </p>
              <p>
                <strong>Email:</strong> {selectedBooking.clientEmail}
              </p>
              <p>
                <strong>Contact:</strong> {selectedBooking.contact}
              </p>
              <p>
                <strong>Service:</strong> {selectedBooking.serviceName}
              </p>
              <p>
                <strong>Category:</strong> {selectedBooking.serviceCategory}
              </p>
              <p>
                <strong>Location:</strong> {selectedBooking.location}
              </p>
              <p>
                <strong>Booking Date:</strong> {selectedBooking.bookingDate}
              </p>
              <p>
                <strong>Completed At:</strong>{" "}
                {selectedBooking.completedAt || "-"}
              </p>
              <p>
                <strong>Total Cost:</strong> ৳{selectedBooking.totalCost}
              </p>
              <p className="font-bold text-green-600">
                Earning: ৳
                {Math.round((Number(selectedBooking.totalCost) || 0) * 0.2)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEarnings;
