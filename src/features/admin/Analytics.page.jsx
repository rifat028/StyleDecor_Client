import React, { useEffect, useState, useCallback } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { BarChart3 } from "lucide-react";
import DashboardPageHeader from "../../components/ui/DashboardPageHeader";
import TimeFilter from "../../components/ui/TimeFilter";
import AnalyticsKpiCards from "../../components/pages/Admin/Analytics/AnalyticsKpiCards";
import FinancialDeepDiveSection from "../../components/pages/Admin/Analytics/FinancialDeepDiveSection";
import MarketCategoryInsightsSection from "../../components/pages/Admin/Analytics/MarketCategoryInsightsSection";
import VendorPerformanceSection from "../../components/pages/Admin/Analytics/VendorPerformanceSection";

// Admin Platform Intelligence & Financial Analytics Page
const Analytics = () => {
  const axiosSecure = useAxiosSecure();

  // Time Filtering State (Default: "max")
  const [timeFilter, setTimeFilter] = useState("max");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 1. KPI Stats (Time-dependent)
  const [kpiStats, setKpiStats] = useState(null);

  // 2. Financial & Revenue Deep Dive (Last 12 months, time-independent)
  const [gmvData, setGmvData] = useState([]);
  const [commissionData, setCommissionData] = useState([]);

  // 3. Market & Category Insights (Static overall + time-filtered)
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

  // 4. Vendor & Operational Performance (Time-dependent)
  const [topDecorators, setTopDecorators] = useState([]);
  const [topAgents, setTopAgents] = useState([]);

  // Loading States
  const [staticLoading, setStaticLoading] = useState(true);
  const [filteredLoading, setFilteredLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingCategoryBookings, setLoadingCategoryBookings] = useState(false);

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

  // 1. Load Time-INDEPENDENT Analytics (GMV 12m, Net Commission 12m, Division Density, Category Services)
  // Only called on initial mount and explicit manual Refresh
  const loadStaticAnalytics = useCallback(async () => {
    setStaticLoading(true);
    try {
      const [gmvRes, commRes, divUsersRes, catServicesRes] = await Promise.allSettled([
        axiosSecure.get("/analytics/financial-gmv"),
        axiosSecure.get("/analytics/financial-commission"),
        axiosSecure.get("/analytics/market-division-users"),
        axiosSecure.get("/analytics/category-services"),
      ]);

      if (gmvRes.status === "fulfilled") {
        const gmv = gmvRes.value.data?.data || gmvRes.value.data;
        if (Array.isArray(gmv)) setGmvData(gmv);
      }
      if (commRes.status === "fulfilled") {
        const comm = commRes.value.data?.data || commRes.value.data;
        if (Array.isArray(comm)) setCommissionData(comm);
      }
      if (divUsersRes.status === "fulfilled") {
        const divU = divUsersRes.value.data?.data || divUsersRes.value.data;
        if (Array.isArray(divU)) setDivisionUsers(divU);
      }
      if (catServicesRes.status === "fulfilled") {
        const catS = catServicesRes.value.data?.data || catServicesRes.value.data;
        if (Array.isArray(catS)) setCategoryServices(catS);
      }
    } catch {
      toast.error("Failed to load macro financial trends");
    } finally {
      setStaticLoading(false);
    }
  }, [axiosSecure]);

  // 2. Load Time-DEPENDENT Analytics (KPIs, Bookings by Cat/Div, Top Revenue Cats, Booking Curve, Vendors)
  // Re-runs whenever timeFilter, custom dates, or selectedDivision changes
  const loadFilteredAnalytics = useCallback(async () => {
    setFilteredLoading(true);
    try {
      const timeQuery = getTimeQuery();

      const [
        kpiRes,
        catBookingsRes,
        topCatRevRes,
        curveRes,
        divBookingsRes,
        decoratorsRes,
        agentsRes,
      ] = await Promise.allSettled([
        axiosSecure.get(`/analytics/kpi-stats?${timeQuery}`),
        axiosSecure.get(
          `/analytics/category-bookings?division=${selectedDivision}&${timeQuery}`
        ),
        axiosSecure.get(`/analytics/top-categories-revenue?${timeQuery}`),
        axiosSecure.get(`/analytics/booking-curve-365?${timeQuery}`),
        axiosSecure.get(`/analytics/division-bookings?${timeQuery}`),
        axiosSecure.get(`/analytics/top-decorators?${timeQuery}`),
        axiosSecure.get(`/analytics/top-agents?${timeQuery}`),
      ]);

      if (kpiRes.status === "fulfilled") {
        const kpi = kpiRes.value.data?.data || kpiRes.value.data;
        if (kpi) setKpiStats(kpi);
      }
      if (catBookingsRes.status === "fulfilled") {
        const catB = catBookingsRes.value.data?.data || catBookingsRes.value.data;
        if (Array.isArray(catB)) setCategoryBookings(catB);
        if (catBookingsRes.value.data?.divisions) {
          setAvailableDivisions(catBookingsRes.value.data.divisions);
        }
      }
      if (topCatRevRes.status === "fulfilled") {
        const topRev = topCatRevRes.value.data?.data || topCatRevRes.value.data;
        if (Array.isArray(topRev)) setTopCategoriesRevenue(topRev);
      }
      if (curveRes.status === "fulfilled") {
        const curve = curveRes.value.data?.data || curveRes.value.data;
        if (Array.isArray(curve)) setBookingCurve(curve);
      }
      if (divBookingsRes.status === "fulfilled") {
        const divB = divBookingsRes.value.data?.data || divBookingsRes.value.data;
        if (Array.isArray(divB)) setDivisionBookings(divB);
      }
      if (decoratorsRes.status === "fulfilled") {
        const decs = decoratorsRes.value.data?.data || decoratorsRes.value.data;
        if (Array.isArray(decs)) setTopDecorators(decs);
      }
      if (agentsRes.status === "fulfilled") {
        const ags = agentsRes.value.data?.data || agentsRes.value.data;
        if (Array.isArray(ags)) setTopAgents(ags);
      }
    } catch {
      toast.error("Failed to load time-filtered analytics");
    } finally {
      setFilteredLoading(false);
    }
  }, [axiosSecure, selectedDivision, getTimeQuery]);

  // Initial load of static analytics (only once on mount)
  useEffect(() => {
    loadStaticAnalytics();
  }, [loadStaticAnalytics]);

  // Reactive load on time filter or division change (ONLY calls the time-dependent APIs)
  useEffect(() => {
    loadFilteredAnalytics();
  }, [loadFilteredAnalytics]);

  // Handle Division Filter change specifically for Category Bookings chart
  const handleDivisionChange = async (newDivision) => {
    setSelectedDivision(newDivision);
    try {
      setLoadingCategoryBookings(true);
      const timeQuery = getTimeQuery();
      const res = await axiosSecure.get(
        `/analytics/category-bookings?division=${newDivision}&${timeQuery}`
      );
      if (res.data?.success) {
        setCategoryBookings(res.data.data);
      }
    } catch {
      toast.error("Failed to update division filter");
    } finally {
      setLoadingCategoryBookings(false);
    }
  };

  // Handlers for Time Filter
  const handleTimeFilterChange = (newFilter) => {
    setTimeFilter(newFilter);
  };

  const handleCustomDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  // Manual Refresh Data button reloads both static and filtered datasets
  const handleRefresh = () => {
    setRefreshing(true);
    toast.promise(Promise.all([loadStaticAnalytics(), loadFilteredAnalytics()]), {
      loading: "Refreshing analytics data...",
      success: "Analytics updated!",
      error: "Could not refresh data",
    }).finally(() => {
      setRefreshing(false);
    });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* 1. Dashboard Header with Refresh and Time Filter */}
      <DashboardPageHeader
        icon={BarChart3}
        title="Platform & Financial Intelligence"
        subtitle="Real-time revenue monitoring, 10% marketplace commission yields, division penetration, and vendor leaderboards."
        onRefresh={handleRefresh}
        refreshing={refreshing}
        refreshDisabled={staticLoading || filteredLoading || refreshing}
        actions={
          <TimeFilter
            timeFilter={timeFilter}
            onTimeFilterChange={handleTimeFilterChange}
            startDate={startDate}
            endDate={endDate}
            onCustomDateChange={handleCustomDateChange}
            loading={filteredLoading || refreshing}
            showRefresh={false}
          />
        }
      />

      {/* 2. Top 4 Stat Cards: Total Volume, Platform Commission, Collected Commission, Pending Commission */}
      <AnalyticsKpiCards stats={kpiStats} loading={filteredLoading} />

      {/* 3. Financial & Revenue Deep Dive (GMV Last 12 Months + Net Commission Last 12 Months) */}
      <FinancialDeepDiveSection
        gmvData={gmvData}
        commissionData={commissionData}
        loading={staticLoading}
      />

      {/* 4. Market & Category Insights (Division Density, Category Services, Booking Curve, etc.) */}
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
        loading={filteredLoading || staticLoading || loadingCategoryBookings}
      />

      {/* 5. Vendor & Operational Performance (Top 10 Decorators & Top 10 Agents) */}
      <VendorPerformanceSection
        topDecorators={topDecorators}
        topAgents={topAgents}
        loading={filteredLoading}
      />
    </div>
  );
};

export default Analytics;
