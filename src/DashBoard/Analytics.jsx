import React, { useEffect, useMemo, useState } from "react";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

/**
 * Analytics.jsx (Admin) - CLIENT SIDE PROCESSING (NO NEW APIS)
 *
 * ✅ Uses ONLY your existing API:
 *    GET /bookings   (verifyFbToken protected)
 *
 * ✅ Your requirements:
 * 1) total completed booking count -> derived from bookings where status === "Completed"
 * 2) total earning -> SUM(totalCost) of completed bookings (NOT 20%)
 * 3) demand chart -> count vs category using bookings of ALL status
 *
 * Notes:
 * - Your /bookings API returns { data, totalCount } and is paginated.
 * - For analytics, we need ALL bookings. So we fetch all pages in a loop.
 * - Set LIMIT high if you want fewer requests (but keep safe).
 */

const Analytics = () => {
  const axiosSecure = useAxiosSecure();

  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // --------- helper: fetch all pages from /bookings ----------
  const fetchAllBookings = async () => {
    const limit = 100; // fetch 100 per request (you can increase if needed)
    let page = 1;

    let collected = [];
    let totalCount = 0;

    while (true) {
      const res = await axiosSecure.get(
        `/bookings?page=${page}&limit=${limit}&sortDate=desc`
      );

      const data = res.data?.data || [];
      totalCount = res.data?.totalCount || 0;

      collected = [...collected, ...data];

      // stop when we got all
      if (collected.length >= totalCount || data.length === 0) break;

      page += 1;
    }

    return collected;
  };

  // --------- load ALL bookings once ----------
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const bookings = await fetchAllBookings();
        setAllBookings(bookings);
      } catch (err) {
        console.error("Failed to load analytics:", err);
        setAllBookings([]);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [axiosSecure]);

  // 1) completed count (client side)
  const completedBookings = useMemo(() => {
    return allBookings.filter(
      (b) => String(b.status || "").toLowerCase() === "completed"
    );
  }, [allBookings]);

  const completedCount = completedBookings.length;

  // 2) total earning = SUM(totalCost) of completed bookings
  const totalRevenue = useMemo(() => {
    return completedBookings.reduce(
      (sum, b) => sum + (Number(b.totalCost) || 0),
      0
    );
  }, [completedBookings]);

  // 3) demand chart = count vs category for ALL status
  const demandChartData = useMemo(() => {
    const map = {};
    allBookings.forEach((b) => {
      const cat = (b.serviceCategory || "unknown").toLowerCase();
      map[cat] = (map[cat] || 0) + 1;
    });

    return Object.entries(map).map(([category, count]) => ({
      category,
      count,
    }));
  }, [allBookings]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 dark:bg-gray-900">
      {/* 1) Top section with bg-base-100 */}
      <div className="bg-base-100 dark:bg-gray-900 border-b border-base-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-base-content dark:text-white">
            Admin <span className="text-purple-500">Analytics</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-sm md:text-base text-base-content/70 dark:text-gray-300">
            Completed booking stats and service demand across all bookings.
          </p>

          <p className="mt-2 text-xs text-base-content/60 dark:text-gray-400">
            (Fetched total bookings: {allBookings.length})
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* 2) Revenue Monitoring */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-base-content dark:text-white mb-4">
            Revenue Monitoring
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Total completed bookings */}
            <div className="rounded-2xl border border-base-300 dark:border-gray-700 bg-base-200 dark:bg-gray-800 p-6">
              <p className="text-sm text-base-content/70 dark:text-gray-300">
                Total Completed Bookings
              </p>
              <p className="mt-2 text-3xl font-bold text-base-content dark:text-white">
                {completedCount}
              </p>
              <p className="mt-1 text-xs text-base-content/60 dark:text-gray-400">
                Calculated from bookings where status = Completed
              </p>
            </div>

            {/* Total revenue = sum(totalCost) */}
            <div className="rounded-2xl border border-base-300 dark:border-gray-700 bg-base-200 dark:bg-gray-800 p-6">
              <p className="text-sm text-base-content/70 dark:text-gray-300">
                Total Revenue (SUM of totalCost)
              </p>
              <p className="mt-2 text-3xl font-bold text-green-600">
                ৳{Math.round(totalRevenue)}
              </p>
              <p className="mt-1 text-xs text-base-content/60 dark:text-gray-400">
                Sum of totalCost for completed bookings
              </p>
            </div>
          </div>
        </section>

        {/* 3) Demand Chart */}
        <section className="rounded-2xl border border-base-300 dark:border-gray-700 bg-base-100 dark:bg-gray-800 p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-bold text-base-content dark:text-white mb-2">
            Service Demand Chart
          </h2>
          <p className="text-sm text-base-content/70 dark:text-gray-300 mb-4">
            Booking count by category (includes ALL booking statuses).
          </p>

          {demandChartData.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-base-content dark:text-white">
                No booking data found for chart.
              </p>
            </div>
          ) : (
            <div className="h-80 md:h-95 md:px-30 md:pt-10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demandChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Analytics;
