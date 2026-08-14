import React, { useEffect, useState, useCallback } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import ServiceCard from "./components/ServiceCard";
import TopSection from "./components/TopSection";
import Spinner from "../home/components/Spinner";
import {
  Search,
  Filter,
  Layers,
  Sparkles,
  X,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";

const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "Wedding & Pre-Wedding", label: "Wedding & Pre-Wedding" },
  { value: "Birthday & Milestone", label: "Birthday & Milestone" },
  { value: "Corporate & Commercial", label: "Corporate & Commercial" },
  { value: "Home & Rooftop Gatherings", label: "Home & Rooftop Gatherings" },
  { value: "Cultural & Religious Festivals", label: "Cultural & Religious" },
  { value: "Lighting & Special FX", label: "Lighting & Special FX" },
];

const Services = () => {
  const axiosSecure = useAxiosSecure();

  // Services Data States
  const [services, setServices] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchText, setSearchText] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("all");
  const [minCost, setMinCost] = useState("");
  const [maxCost, setMaxCost] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const limit = 12;

  // Load Services from Backend API
  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        sort: sortBy,
        status: "active",
      });

      if (category !== "all") params.append("category", category);
      if (searchText.trim()) params.append("search", searchText.trim());
      if (minCost) params.append("minPrice", minCost);
      if (maxCost) params.append("maxPrice", maxCost);

      const res = await axiosSecure.get(`/services?${params.toString()}`);
      if (res.data?.success) {
        setServices(res.data.data || []);
        setTotalCount(res.data.totalCount || 0);
        setTotalPages(res.data.totalPages || 1);
      } else if (Array.isArray(res.data)) {
        setServices(res.data);
        setTotalCount(res.data.length);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Failed to load services:", err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure, page, limit, category, searchText, minCost, maxCost, sortBy]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchText(searchInput);
    setPage(1);
  };

  const handleResetFilters = () => {
    setCategory("all");
    setSearchText("");
    setSearchInput("");
    setMinCost("");
    setMaxCost("");
    setSortBy("newest");
    setPage(1);
  };

  const isFiltered =
    category !== "all" ||
    searchText.trim() !== "" ||
    minCost !== "" ||
    maxCost !== "" ||
    sortBy !== "newest";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20 animate-fade-in">
      {/* Top Banner Section */}
      <TopSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* ============= Search & Multi-Filter Control Console ============= */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Search Input Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative w-full lg:max-w-md flex items-center"
            >
              <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Search packages, stage themes, props..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-11 pr-24 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="absolute right-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Search
              </button>
            </form>

            {/* Reset Filters */}
            {isFiltered && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer self-end lg:self-auto"
              >
                <X className="w-3.5 h-3.5" /> Reset Filters
              </button>
            )}
          </div>

          {/* Filter Pills / Inputs Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            {/* Category Select */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                Event Category
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Price */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                Min Budget (৳)
              </label>
              <input
                type="number"
                placeholder="e.g. 10000"
                value={minCost}
                onChange={(e) => {
                  setMinCost(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Max Price */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                Max Budget (৳)
              </label>
              <input
                type="number"
                placeholder="e.g. 80000"
                value={maxCost}
                onChange={(e) => {
                  setMaxCost(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Sort Order */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                Sort Results
              </label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="rating">Highest Rated ★</option>
                <option value="popular">Most Booked / Popular</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name">Package Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* ================= Services Grid Section ================= */}
        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <Spinner />
          </div>
        ) : services.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-16 text-center border border-slate-200/80 dark:border-slate-800 space-y-4">
            <Layers className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
              No Decoration Packages Found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              We couldn't find any packages matching your search filters. Try adjusting your budget or category selection.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-all cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}

        {/* ================= Pagination Controls ================= */}
        {totalCount > limit && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 text-xs">
            <p className="text-slate-500 dark:text-slate-400">
              Showing{" "}
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {(page - 1) * limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {Math.min(page * limit, totalCount)}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {totalCount}
              </span>{" "}
              packages
            </p>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setPage(1);
                  window.scrollTo({ top: 300, behavior: "smooth" });
                }}
                disabled={page === 1}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                title="First Page"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setPage((p) => Math.max(1, p - 1));
                  window.scrollTo({ top: 300, behavior: "smooth" });
                }}
                disabled={page === 1}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => {
                  setPage((p) => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 300, behavior: "smooth" });
                }}
                disabled={page >= totalPages}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setPage(totalPages);
                  window.scrollTo({ top: 300, behavior: "smooth" });
                }}
                disabled={page >= totalPages}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                title="Last Page"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
