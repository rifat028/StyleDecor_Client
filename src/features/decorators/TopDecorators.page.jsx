import React, { useState, useEffect, useCallback } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Link, useNavigate, useSearchParams } from "react-router";
import Spinner from "../home/components/Spinner";
import {
  Palette,
  Search,
  MapPin,
  Star,
  Award,
  ShieldCheck,
  Phone,
  Mail,
  Globe,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  ArrowRight,
  Filter,
  CheckCircle2,
  Building,
  Check,
} from "lucide-react";

const TOP_CITIES = [
  "all",
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Rangpur",
  "Mymensingh",
  "Cumilla",
  "Gazipur",
];

const getPlaceholderLogo = (name = "Decorator") => {
  const initials = encodeURIComponent(name || "Decorator");
  return `https://ui-avatars.com/api/?name=${initials}&background=7C3AED&color=ffffff&bold=true&size=200`;
};

const TopDecorators = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Data States
  const [decorators, setDecorators] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || "all");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "rating");
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const limit = 9;

  // Modal State (View Single Decorator via GET /decorators/id/:id)
  const [selectedDecorator, setSelectedDecorator] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Fetch Decorators List (GET /decorators?status=active&...)
  const fetchDecorators = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        status: "active",
        page: String(page),
        limit: String(limit),
        sort: sortBy,
      });

      if (selectedCity !== "all") params.append("city", selectedCity);
      if (searchTerm.trim()) params.append("search", searchTerm.trim());

      const res = await axiosSecure.get(`/decorators?${params.toString()}`);
      if (res.data?.success) {
        setDecorators(res.data.data || []);
        setTotalCount(res.data.totalCount || 0);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (error) {
      console.error("Failed to load decorators:", error);
      setDecorators([]);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure, page, limit, selectedCity, sortBy, searchTerm]);

  useEffect(() => {
    fetchDecorators();
  }, [fetchDecorators]);

  // Open Details Modal using GET /decorators/id/:id
  const handleOpenDetails = async (decorator) => {
    try {
      setLoadingDetails(true);
      setSelectedDecorator(decorator);
      const res = await axiosSecure.get(`/decorators/id/${decorator._id}`);
      if (res.data?.success && res.data?.data) {
        setSelectedDecorator(res.data.data);
      }
    } catch (err) {
      console.warn("Could not refresh decorator details, using cache:", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSelectedCity("all");
    setSearchTerm("");
    setSearchInput("");
    setSortBy("rating");
    setPage(1);
  };

  const isFiltered = selectedCity !== "all" || searchTerm.trim() !== "" || sortBy !== "rating";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* ================= Hero Header ================= */}
        <div className="relative rounded-3xl overflow-hidden bg-linear-to-r from-slate-950 via-purple-950 to-indigo-950 text-white p-8 sm:p-14 shadow-2xl border border-purple-800/40 text-center space-y-5">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Verified Vendor Marketplace
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Discover Bangladesh's Top Event & Wedding Decorators
            </h1>
            <p className="text-sm sm:text-base text-purple-200/80 leading-relaxed">
              Explore rated stage architects, royal wedding specialists, and birthday artists. Filter by location and book trusted partners with guaranteed escrow safety.
            </p>

            {/* Instant Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative max-w-xl mx-auto pt-2 flex items-center"
            >
              <Search className="w-5 h-5 text-purple-300 absolute left-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by agency name, theme, or city..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-12 pr-28 py-3.5 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md text-white placeholder-purple-200/60 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-xl"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    setSearchTerm("");
                    setPage(1);
                  }}
                  className="absolute right-20 text-purple-300 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-2 px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {/* ================= Filter Controls & City Tabs ================= */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
          {/* City Filter Pills */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-purple-600" /> Filter by Location
              </span>
              {isFiltered && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Reset Filters
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {TOP_CITIES.map((city) => {
                const isSelected = selectedCity === city;
                return (
                  <button
                    key={city}
                    onClick={() => {
                      setSelectedCity(city);
                      setPage(1);
                    }}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/60"
                    }`}
                  >
                    {city === "all" ? "All Bangladesh" : city}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Bar: Sort & Result Count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Showing{" "}
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {totalCount}
              </span>{" "}
              verified decorator agencies
            </p>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs font-semibold text-slate-500">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
              >
                <option value="rating">Highest Rated ★</option>
                <option value="completedEvents">Most Events Completed</option>
                <option value="newest">Newest First</option>
                <option value="name">Agency Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* ================= Decorators Grid ================= */}
        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <Spinner />
          </div>
        ) : decorators.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-16 text-center border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <Palette className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              No Decorators Found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              We couldn't find any decorator agency matching your current search or location filter.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-5 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-all cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {decorators.map((dec) => {
              const isVerified = Boolean(dec.verification?.isVerified);
              const rating = dec.metrics?.rating ? Number(dec.metrics.rating).toFixed(1) : "5.0";
              const completedEvents = dec.metrics?.completedEvents || 0;

              return (
                <div
                  key={dec._id}
                  className="group bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5"
                >
                  {/* Card Top: Logo, Name, Verification */}
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="relative">
                        <img
                          src={dec.logo || getPlaceholderLogo(dec.businessName)}
                          alt={dec.businessName}
                          onError={(e) => {
                            e.currentTarget.src = getPlaceholderLogo(dec.businessName);
                          }}
                          className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800 shadow-md group-hover:scale-105 transition-transform duration-300"
                        />
                        {isVerified && (
                          <div className="absolute -bottom-1 -right-1 bg-purple-600 text-white rounded-full p-1 shadow-md ring-2 ring-white dark:ring-slate-900">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {rating}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400">
                          {completedEvents}+ Events Done
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
                        {dec.businessName}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {dec.tagline || dec.about || "Professional Event & Wedding Decorator"}
                      </p>
                    </div>

                    {/* City & Coverage Pills */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                        <span>Based in {dec.contactInfo?.city || "Dhaka"}</span>
                      </div>

                      {dec.serviceAreas?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {dec.serviceAreas.slice(0, 3).map((area, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-medium"
                            >
                              {area}
                            </span>
                          ))}
                          {dec.serviceAreas.length > 3 && (
                            <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400 text-[10px] font-semibold">
                              +{dec.serviceAreas.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <Link
                      to={`/decorators/${dec._id}`}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-600 text-purple-700 dark:text-purple-300 hover:text-white border border-purple-200 dark:border-purple-900/60 hover:border-transparent text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      View Agency Profile <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
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
              decorators
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

      {/* ================= Detailed Decorator Modal ================= */}
      {selectedDecorator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="relative p-6 sm:p-8 bg-linear-to-r from-purple-950 via-slate-900 to-indigo-950 text-white flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={
                    selectedDecorator.logo ||
                    getPlaceholderLogo(selectedDecorator.businessName)
                  }
                  alt={selectedDecorator.businessName}
                  className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white/20 shadow-xl"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white">
                      {selectedDecorator.businessName}
                    </h3>
                    {selectedDecorator.verification?.isVerified && (
                      <ShieldCheck className="w-5 h-5 text-purple-400" />
                    )}
                  </div>
                  <p className="text-xs text-purple-200/80">
                    {selectedDecorator.tagline || "Verified Event Decorator"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedDecorator(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-600 dark:text-slate-300">
              {/* Performance Counters */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Rating
                  </span>
                  <p className="font-extrabold text-sm text-amber-500">
                    ★ {selectedDecorator.metrics?.rating || "5.0"}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Events Completed
                  </span>
                  <p className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                    {selectedDecorator.metrics?.completedEvents || 0}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Base City
                  </span>
                  <p className="font-extrabold text-sm text-purple-600 dark:text-purple-400">
                    {selectedDecorator.contactInfo?.city || "Dhaka"}
                  </p>
                </div>
              </div>

              {/* About Agency */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] mb-1.5">
                  About the Agency
                </h4>
                <p className="leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
                  {selectedDecorator.about || "This agency is a premier event decoration service provider registered on StyleDecor."}
                </p>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] mb-2">
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Phone
                    </span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {selectedDecorator.contactInfo?.phone || "Available upon booking"}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Email
                    </span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {selectedDecorator.contactInfo?.email || "contact@styledecor.com"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Service Areas */}
              {selectedDecorator.serviceAreas?.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] mb-2">
                    Service Areas Covered
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDecorator.serviceAreas.map((area, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 font-semibold border border-purple-100 dark:border-purple-900"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <Link
                to="/services"
                onClick={() => setSelectedDecorator(null)}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-purple-600/20"
              >
                Browse Catalog Services <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={() => setSelectedDecorator(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopDecorators;
