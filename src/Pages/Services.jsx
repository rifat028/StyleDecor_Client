import React, { useEffect, useMemo, useState } from "react";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import ServiceCard from "../Components/ServiceComponents/ServiceCard";

const Services = () => {
  const axiosSecure = useAxiosSecure();

  // main data
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI state (search + filters)
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("all");
  const [minCost, setMinCost] = useState("");
  const [maxCost, setMaxCost] = useState("");
  const [sortBy, setSortBy] = useState("latest"); // latest | costLow | costHigh | ratingHigh

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        // ✅ backend route: GET /services (all)
        const res = await axiosSecure.get("/services");
        setServices(res.data || []);
      } catch (error) {
        console.error("Failed to load services:", error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, [axiosSecure]);

  // build category list from data
  const categories = useMemo(() => {
    const unique = new Set(
      services.map((s) => s.serviceCategory).filter(Boolean)
    );
    return ["all", ...Array.from(unique)];
  }, [services]);

  // filter + search + budget range
  const filteredServices = useMemo(() => {
    const text = searchText.trim().toLowerCase();
    const min = minCost === "" ? null : Number(minCost);
    const max = maxCost === "" ? null : Number(maxCost);

    return services
      .filter((s) => {
        // search by serviceName
        if (text) {
          const name = (s.serviceName || "").toLowerCase();
          if (!name.includes(text)) return false;
        }

        // filter by category
        if (category !== "all" && s.serviceCategory !== category) return false;

        // budget range filter
        const cost = Number(s.cost || 0);
        if (min !== null && cost < min) return false;
        if (max !== null && cost > max) return false;

        return true;
      })
      .sort((a, b) => {
        // sorting
        if (sortBy === "costLow")
          return Number(a.cost || 0) - Number(b.cost || 0);
        if (sortBy === "costHigh")
          return Number(b.cost || 0) - Number(a.cost || 0);
        if (sortBy === "ratingHigh")
          return Number(b.rating || 0) - Number(a.rating || 0);

        // latest: if your backend sends createdDate like "2025-01-01"
        // fallback to _id for order
        const ad = a.createdDate || "";
        const bd = b.createdDate || "";
        if (ad && bd) return bd.localeCompare(ad);

        // fallback: string compare for _id
        const aid = a._id?.toString?.() || "";
        const bid = b._id?.toString?.() || "";
        return bid.localeCompare(aid);
      });
  }, [services, searchText, category, minCost, maxCost, sortBy]);

  const handleReset = () => {
    setSearchText("");
    setCategory("all");
    setMinCost("");
    setMaxCost("");
    setSortBy("latest");
  };

  return (
    <div className="min-h-screen bg-base-100 dark:bg-slate-950">
      {/* Page Header */}
      <div className="bg-base-200 dark:bg-slate-900">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:py-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-base-content dark:text-slate-100">
            Services
          </h1>
          <p className="mt-2 max-w-2xl text-sm sm:text-base text-base-content/70 dark:text-slate-300">
            Browse our decoration services. You can search by service name,
            filter by category, set a budget range, and sort easily.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mx-auto w-full max-w-7xl px-4 py-8">
        <div className="rounded-2xl border border-base-300 dark:border-slate-800 bg-base-100 dark:bg-slate-950 p-5 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search */}
            <div className="md:col-span-4">
              <label className="label">
                <span className="label-text dark:text-slate-200">Search</span>
              </label>
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search by service name..."
                className="input input-bordered w-full bg-base-100 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
              />
            </div>

            {/* Category */}
            <div className="md:col-span-3">
              <label className="label">
                <span className="label-text dark:text-slate-200">Category</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="select select-bordered w-full bg-base-100 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === "all" ? "All" : c}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget Min */}
            <div className="md:col-span-2">
              <label className="label">
                <span className="label-text dark:text-slate-200">
                  Min (BDT)
                </span>
              </label>
              <input
                type="number"
                value={minCost}
                onChange={(e) => setMinCost(e.target.value)}
                placeholder="0"
                className="input input-bordered w-full bg-base-100 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
              />
            </div>

            {/* Budget Max */}
            <div className="md:col-span-2">
              <label className="label">
                <span className="label-text dark:text-slate-200">
                  Max (BDT)
                </span>
              </label>
              <input
                type="number"
                value={maxCost}
                onChange={(e) => setMaxCost(e.target.value)}
                placeholder="50000"
                className="input input-bordered w-full bg-base-100 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
              />
            </div>

            {/* Sort */}
            <div className="md:col-span-1">
              <label className="label">
                <span className="label-text dark:text-slate-200">Sort</span>
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="select select-bordered w-full bg-base-100 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
              >
                <option value="latest">Latest</option>
                <option value="costLow">Cost: Low</option>
                <option value="costHigh">Cost: High</option>
                <option value="ratingHigh">Rating</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <p className="text-sm text-base-content/70 dark:text-slate-300">
              Showing{" "}
              <span className="font-semibold">{filteredServices.length}</span>{" "}
              service(s)
            </p>

            <button
              onClick={handleReset}
              className="btn btn-outline w-full sm:w-auto dark:border-slate-700 dark:text-slate-100"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mt-8">
          {loading ? (
            <div className="min-h-[40vh] flex items-center justify-center">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="rounded-2xl border border-base-300 dark:border-slate-800 bg-base-100 dark:bg-slate-950 p-8 text-center">
              <h2 className="text-xl font-semibold text-base-content dark:text-slate-100">
                No services found
              </h2>
              <p className="mt-2 text-sm text-base-content/70 dark:text-slate-300">
                Try changing your search text, category, or budget range.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredServices.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Services;
