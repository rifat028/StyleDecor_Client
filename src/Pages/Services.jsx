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

  const [query, setQuery] = useState("");

  const queryFilter = `?category=${category}${
    minCost && `&min_cost=${minCost}`
  }${maxCost && `&max_cost=${maxCost}`}${
    searchText && `&search_text=${searchText}`
  }`;

  // const querySearch = `${searchText && `?search_text=${searchText}`}`;

  // const query = querySearch || queryFilter;

  // console.log(queryFilter, querySearch);

  // load all services
  useEffect(() => {
    axiosSecure
      .get(`/services${query}`)
      .then((res) => {
        setServices(res.data);
        // console.log(res.data);
        // console.log(query);
      })
      .catch((err) => {
        console.error("Failed to load services", err);
        setServices([]);
      })
      .finally(() => setLoading(false));
  }, [axiosSecure, query]);

  return (
    <div className="min-h-screen bg-base-100 dark:bg-gray-900">
      {/* ================= TOP SECTION ================= */}
      <TopSection></TopSection>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ================= SEARCH SECTION ================= */}
        <div className="bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-2xl p-5 shadow-sm  mb-3 md:mb-6 md:mx-30">
          {/* Search */}
          <div className="md:col-span-3">
            <label className="label">
              <span className="label-text dark:text-slate-200">Search</span>
            </label>
            <div className="flex">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search service..."
                className="input input-bordered w-full dark:bg-slate-900 dark:border-slate-700 dark:text-white rounded-r-none"
              />
              <button
                className="btn btn-primary rounded-l-none w-[30%]"
                onClick={() => setQuery(queryFilter)}
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* ================= FILTER SECTION ================= */}
        <div className="bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-9 gap-4">
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
            <div className="md:col-span-2 flex items-center flex-col">
              <label className="label">
                <span className="label-text dark:text-slate-200">
                  Apply Filters
                </span>
              </label>
              <button
                className="btn btn-primary"
                onClick={() => setQuery(queryFilter)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* ================= SERVICES CARDS ================= */}
        {services.length == 0 && (
          <div className="text-center text-red-400 font-semibold text-3xl py-6 md:py-20">
            No service found
          </div>
        )}
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
