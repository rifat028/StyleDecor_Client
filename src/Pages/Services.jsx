import React, { useEffect, useState } from "react";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import ServiceCard from "../Components/ServiceComponents/ServiceCard";
import TopSection from "../Components/ServiceComponents/TopSection";
import Spinner from "../Components/Spinner";

const Services = () => {
  const axiosSecure = useAxiosSecure();

  // services data
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // filter values (ONLY capturing – no logic)
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("all");
  const [minCost, setMinCost] = useState("");
  const [maxCost, setMaxCost] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  // load all services
  useEffect(() => {
    axiosSecure
      .get("/services")
      .then((res) => setServices(res.data))
      .catch((err) => {
        console.error("Failed to load services", err);
        setServices([]);
      })
      .finally(() => setLoading(false));
  }, [axiosSecure]);

  return (
    <div className="min-h-screen bg-base-100 dark:bg-slate-950">
      {/* ================= TOP SECTION ================= */}
      <TopSection></TopSection>

      {/* ================= FILTER SECTION ================= */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
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
                placeholder="Search service..."
                className="input input-bordered w-full dark:bg-slate-900 dark:border-slate-700 dark:text-white"
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
                className="select select-bordered w-full dark:bg-slate-900 dark:border-slate-700 dark:text-white"
              >
                <option value="all">All</option>
                <option value="home">Home</option>
                <option value="wedding">Wedding</option>
                <option value="office">Office</option>
                <option value="seminar">Seminar</option>
                <option value="meeting">Meeting</option>
              </select>
            </div>

            {/* Min */}
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
                className="input input-bordered w-full dark:bg-slate-900 dark:border-slate-700 dark:text-white"
              />
            </div>

            {/* Max */}
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
                className="input input-bordered w-full dark:bg-slate-900 dark:border-slate-700 dark:text-white"
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
                className="select select-bordered w-full dark:bg-slate-900 dark:border-slate-700 dark:text-white"
              >
                <option value="latest">Latest</option>
                <option value="low">Low Price</option>
                <option value="high">High Price</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* ================= SERVICES CARDS ================= */}
        <div className="mt-10">
          {loading ? (
            <Spinner></Spinner>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service) => (
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
