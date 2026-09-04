import React, { useState, useEffect, useCallback } from "react";
import { LayoutDashboard } from "lucide-react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

import DashboardPageHeader from "../../components/ui/DashboardPageHeader";
import TimeFilter from "../../components/ui/TimeFilter";
import DashboardKpiCards from "../../components/pages/Admin/Dashboard/DashboardKpiCards";
import DecoratorServiceCharts from "../../components/pages/Admin/Dashboard/DecoratorServiceCharts";
import BookingStatusChart from "../../components/pages/Admin/Dashboard/BookingStatusChart";
import UnsettledPaymentsTable from "../../components/pages/Admin/Dashboard/UnsettledPaymentsTable";

// Admin Executive Dashboard Page
const AdminDashboard = () => {
  const axiosSecure = useAxiosSecure();

  // Time Filtering State (Default: "max")
  const [timeFilter, setTimeFilter] = useState("max");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Data States
  const [kpiStats, setKpiStats] = useState({});
  const [decoratorStatus, setDecoratorStatus] = useState([]);
  const [serviceStatus, setServiceStatus] = useState([]);
  const [bookingStatus, setBookingStatus] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);

  // Unsettled Payments State
  const [unsettledData, setUnsettledData] = useState([]);
  const [unsettledMeta, setUnsettledMeta] = useState({
    totalUnsettled: 0,
    totalUnsettledAmount: 0,
    totalOrderValue: 0,
  });

  // Loading States
  const [loading, setLoading] = useState(true);
  const [unsettledLoading, setUnsettledLoading] = useState(false);

  // Build query string for time filter
  const getTimeQuery = useCallback(() => {
    let q = `timeFilter=${encodeURIComponent(timeFilter)}`;
    if (timeFilter === "custom" && startDate) {
      q += `&startDate=${encodeURIComponent(startDate)}`;
      if (endDate) {
        q += `&endDate=${encodeURIComponent(endDate)}`;
      }
    }
    return q;
  }, [timeFilter, startDate, endDate]);

  // Load KPI cards, Decorator chart, Service chart, and Booking status chart
  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const timeQuery = getTimeQuery();

      const [kpiRes, decRes, srvRes, bkingRes] = await Promise.allSettled([
        axiosSecure.get(`/dashboard/kpi-cards?${timeQuery}`),
        axiosSecure.get(`/dashboard/decorator-status`),
        axiosSecure.get(`/dashboard/service-status`),
        axiosSecure.get(`/dashboard/booking-status?${timeQuery}`),
      ]);

      if (kpiRes.status === "fulfilled" && kpiRes.value.data?.success) {
        setKpiStats(kpiRes.value.data.data || {});
      }
      if (decRes.status === "fulfilled" && decRes.value.data?.success) {
        setDecoratorStatus(decRes.value.data.data || []);
      }
      if (srvRes.status === "fulfilled" && srvRes.value.data?.success) {
        setServiceStatus(srvRes.value.data.data || []);
      }
      if (bkingRes.status === "fulfilled" && bkingRes.value.data?.success) {
        setBookingStatus(bkingRes.value.data.data || []);
        setTotalBookings(bkingRes.value.data.total || 0);
      }
    } catch {
      toast.error("Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  }, [axiosSecure, getTimeQuery]);

  // Load Unsettled Payments for current time filter
  const loadUnsettledPayments = useCallback(async () => {
    setUnsettledLoading(true);
    try {
      const timeQuery = getTimeQuery();
      const res = await axiosSecure.get(
        `/dashboard/unsettled-payments?${timeQuery}&limit=all`
      );

      if (res.data?.success) {
        setUnsettledData(res.data.data || []);
        setUnsettledMeta({
          totalUnsettled: res.data.totalUnsettled || 0,
          totalUnsettledAmount: res.data.totalUnsettledAmount || 0,
          totalOrderValue: res.data.totalOrderValue || 0,
        });
      }
    } catch {
      toast.error("Failed to load unsettled payments");
    } finally {
      setUnsettledLoading(false);
    }
  }, [axiosSecure, getTimeQuery]);

  // Initial and reactive load on time filter change
  useEffect(() => {
    loadDashboardData();
    loadUnsettledPayments();
  }, [loadDashboardData, loadUnsettledPayments]);

  // Handlers for filter
  const handleTimeFilterChange = (newFilter) => {
    setTimeFilter(newFilter);
  };

  const handleCustomDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleRefresh = () => {
    toast.promise(Promise.all([loadDashboardData(), loadUnsettledPayments()]), {
      loading: "Refreshing dashboard data...",
      success: "Dashboard updated!",
      error: "Could not refresh data",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 1. Header with Refresh Data Button and Time Filter */}
      <DashboardPageHeader
        icon={LayoutDashboard}
        title="Admin Executive Dashboard"
        subtitle="Platform vitals, workforce density, live service catalog, and unsettled platform fees."
        onRefresh={handleRefresh}
        refreshing={loading || unsettledLoading}
        refreshDisabled={loading || unsettledLoading}
        actions={
          <TimeFilter
            timeFilter={timeFilter}
            onTimeFilterChange={handleTimeFilterChange}
            startDate={startDate}
            endDate={endDate}
            onCustomDateChange={handleCustomDateChange}
            loading={loading || unsettledLoading}
            showRefresh={false}
          />
        }
      />

      {/* 2. Section: 6 Data Cards */}
      <section className="space-y-3">
        <DashboardKpiCards stats={kpiStats} loading={loading} />
      </section>

      {/* 3. Section: Status-Wise Decorator & Service Pie Charts */}
      <section className="space-y-3">
        <DecoratorServiceCharts
          decoratorData={decoratorStatus}
          serviceData={serviceStatus}
          loading={loading}
        />
      </section>

      {/* 4. Section: Booking Status Distribution */}
      <section className="space-y-3">
        <BookingStatusChart
          bookingData={bookingStatus}
          totalBookings={totalBookings}
          timeFilter={timeFilter}
          loading={loading}
        />
      </section>

      {/* 5. Section: Unsettled Payment Table with Reusable Pagination */}
      <section className="space-y-3">
        <UnsettledPaymentsTable
          unsettledData={unsettledData}
          totalUnsettled={unsettledMeta.totalUnsettled}
          totalUnsettledAmount={unsettledMeta.totalUnsettledAmount}
          totalOrderValue={unsettledMeta.totalOrderValue}
          loading={unsettledLoading}
        />
      </section>
    </div>
  );
};

export default AdminDashboard;
