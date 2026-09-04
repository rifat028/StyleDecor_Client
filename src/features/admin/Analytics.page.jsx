import React, { useEffect, useState, useCallback } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { BarChart3 } from "lucide-react";
import DashboardPageHeader from "../../components/ui/DashboardPageHeader";
import AnalyticsKpiCards from "../../components/pages/Admin/Analytics/AnalyticsKpiCards";
import FinancialDeepDiveSection from "../../components/pages/Admin/Analytics/FinancialDeepDiveSection";
import MarketCategoryInsightsSection from "../../components/pages/Admin/Analytics/MarketCategoryInsightsSection";
import VendorPerformanceSection from "../../components/pages/Admin/Analytics/VendorPerformanceSection";

// Admin Platform Intelligence & Financial Analytics Page
const Analytics = () => {
  const axiosSecure = useAxiosSecure();

  // 1. KPI Stats
  const [kpiStats, setKpiStats] = useState(null);

  // 2. Financial & Revenue Deep Dive
  const [gmvData, setGmvData] = useState([]);
  const [commissionData, setCommissionData] = useState([]);

  // 3. Market & Category Insights
  const [divisionUsers, setDivisionUsers] = useState([]);
  const [categoryServices, setCategoryServices] = useState([]);
  const [categoryBookings, setCategoryBookings] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("all");
  const [availableDivisions, setAvailableDivisions] = useState([
    "all",
    "Dhaka",
    "Chattogram",
    "Khulna",
    "Rajshahi",
    "Rangpur",
    "Barishal",
    "Sylhet",
    "Mymensingh",
  ]);
  const [topCategoriesRevenue, setTopCategoriesRevenue] = useState([]);
  const [bookingCurve, setBookingCurve] = useState([]);
  const [divisionBookings, setDivisionBookings] = useState([]);

  // 4. Vendor & Operational Performance
  const [topDecorators, setTopDecorators] = useState([]);
  const [topAgents, setTopAgents] = useState([]);

  // Page States
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingCategoryBookings, setLoadingCategoryBookings] = useState(false);

  // Load all 11 analytics endpoints in parallel
  const loadAllAnalytics = useCallback(async () => {
    try {
      const [
        kpiRes,
        gmvRes,
        commRes,
        divUsersRes,
        catServicesRes,
        catBookingsRes,
        topCatRevRes,
        curveRes,
        divBookingsRes,
        decoratorsRes,
        agentsRes,
      ] = await Promise.allSettled([
        axiosSecure.get("/analytics/kpi-stats"),
        axiosSecure.get("/analytics/financial-gmv"),
        axiosSecure.get("/analytics/financial-commission"),
        axiosSecure.get("/analytics/market-division-users"),
        axiosSecure.get("/analytics/category-services"),
        axiosSecure.get(`/analytics/category-bookings?division=${selectedDivision}`),
        axiosSecure.get("/analytics/top-categories-revenue"),
        axiosSecure.get("/analytics/booking-curve-365"),
        axiosSecure.get("/analytics/division-bookings"),
        axiosSecure.get("/analytics/top-decorators"),
        axiosSecure.get("/analytics/top-agents"),
      ]);

      if (kpiRes.status === "fulfilled" && kpiRes.value.data?.success) {
        setKpiStats(kpiRes.value.data.data);
      }
      if (gmvRes.status === "fulfilled" && gmvRes.value.data?.success) {
        setGmvData(gmvRes.value.data.data);
      }
      if (commRes.status === "fulfilled" && commRes.value.data?.success) {
        setCommissionData(commRes.value.data.data);
      }
      if (divUsersRes.status === "fulfilled" && divUsersRes.value.data?.success) {
        setDivisionUsers(divUsersRes.value.data.data);
      }
      if (catServicesRes.status === "fulfilled" && catServicesRes.value.data?.success) {
        setCategoryServices(catServicesRes.value.data.data);
      }
      if (catBookingsRes.status === "fulfilled" && catBookingsRes.value.data?.success) {
        setCategoryBookings(catBookingsRes.value.data.data);
        if (catBookingsRes.value.data.divisions) {
          setAvailableDivisions(catBookingsRes.value.data.divisions);
        }
      }
      if (topCatRevRes.status === "fulfilled" && topCatRevRes.value.data?.success) {
        setTopCategoriesRevenue(topCatRevRes.value.data.data);
      }
      if (curveRes.status === "fulfilled" && curveRes.value.data?.success) {
        setBookingCurve(curveRes.value.data.data);
      }
      if (divBookingsRes.status === "fulfilled" && divBookingsRes.value.data?.success) {
        setDivisionBookings(divBookingsRes.value.data.data);
      }
      if (decoratorsRes.status === "fulfilled" && decoratorsRes.value.data?.success) {
        setTopDecorators(decoratorsRes.value.data.data);
      }
      if (agentsRes.status === "fulfilled" && agentsRes.value.data?.success) {
        setTopAgents(agentsRes.value.data.data);
      }
    } catch (error) {
      console.error("Error loading analytics:", error);
      toast.error("Failed to load some analytics charts");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [axiosSecure, selectedDivision]);

  useEffect(() => {
    setLoading(true);
    loadAllAnalytics();
  }, [loadAllAnalytics]);

  // Handle Division Filter change specifically for Category Bookings chart
  const handleDivisionChange = async (newDivision) => {
    setSelectedDivision(newDivision);
    try {
      setLoadingCategoryBookings(true);
      const res = await axiosSecure.get(`/analytics/category-bookings?division=${newDivision}`);
      if (res.data?.success) {
        setCategoryBookings(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load category bookings for division:", err);
      toast.error("Failed to update division filter");
    } finally {
      setLoadingCategoryBookings(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* 1. Dashboard Header */}
      <DashboardPageHeader
        icon={BarChart3}
        title="Platform & Financial Intelligence"
        subtitle="Real-time revenue monitoring, 10% marketplace commission yields, division penetration, and vendor leaderboards."
        onRefresh={() => {
          setRefreshing(true);
          loadAllAnalytics();
        }}
        refreshing={refreshing}
        refreshDisabled={loading || refreshing}
      />

      {/* 2. Top 4 Stat Cards: Total Volume, Platform Commission, Collected Commission, Pending Commission */}
      <AnalyticsKpiCards stats={kpiStats} loading={loading} />

      {/* 3. Financial & Revenue Deep Dive (GMV Line Graph + Net Commission Line Graph) */}
      <FinancialDeepDiveSection
        gmvData={gmvData}
        commissionData={commissionData}
        loading={loading}
      />

      {/* 4. Market & Category Insights (6 Charts) */}
      <MarketCategoryInsightsSection
        divisionUsers={divisionUsers}
        categoryServices={categoryServices}
        categoryBookings={categoryBookings}
        selectedDivision={selectedDivision}
        onDivisionChange={handleDivisionChange}
        availableDivisions={availableDivisions}
        topCategoriesRevenue={topCategoriesRevenue}
        bookingCurve={bookingCurve}
        divisionBookings={divisionBookings}
        loading={loading || loadingCategoryBookings}
      />

      {/* 5. Vendor & Operational Performance (Top 10 Decorators & Top 10 Agents) */}
      <VendorPerformanceSection
        topDecorators={topDecorators}
        topAgents={topAgents}
        loading={loading}
      />
    </div>
  );
};

export default Analytics;
