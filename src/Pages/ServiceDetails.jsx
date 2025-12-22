import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import Spinner from "../Components/Spinner";

const ServiceDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // get service id from route
  const axiosSecure = useAxiosSecure();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadService = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(`/services/${id}`);
        setService(res.data);
      } catch (error) {
        console.error("Failed to load service details", error);
        setService(null);
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [axiosSecure, id]);

  if (loading) {
    return <Spinner></Spinner>;
  }

  if (!service) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-base-content dark:text-slate-200">
          Service not found.
        </p>
      </div>
    );
  }

  const {
    serviceName,
    serviceCategory,
    description,
    cost,
    unit,
    rating,
    totalReviews,
  } = service;

  return (
    <div className="min-h-screen bg-base-100 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-base-200 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-base-content dark:text-white">
            Service <span className="text-purple-500">Details</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-sm md:text-base text-base-content/70 dark:text-slate-300">
            Learn more about this decoration service before booking.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Details */}
          <div className="lg:col-span-8">
            <div className="bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-base-content dark:text-white">
                {serviceName}
              </h2>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium border border-base-300 dark:border-slate-700 bg-base-200 dark:bg-slate-900 text-base-content dark:text-slate-100">
                  {serviceCategory.toUpperCase()}
                </span>
                <span className="text-xs text-base-content/60 dark:text-slate-400">
                  {unit}
                </span>
              </div>

              <p className="mt-5 text-sm md:text-base text-base-content/80 dark:text-slate-300 leading-relaxed">
                {description}
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-base-200 dark:bg-slate-900">
                  <p className="text-xs text-base-content/60 dark:text-slate-400">
                    Price
                  </p>
                  <p className="text-lg font-bold text-base-content dark:text-white">
                    ৳{cost}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-base-200 dark:bg-slate-900">
                  <p className="text-xs text-base-content/60 dark:text-slate-400">
                    Rating
                  </p>
                  <p className="text-lg font-bold text-base-content dark:text-white">
                    {rating} ⭐
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-base-200 dark:bg-slate-900">
                  <p className="text-xs text-base-content/60 dark:text-slate-400">
                    Reviews
                  </p>
                  <p className="text-lg font-bold text-base-content dark:text-white">
                    {totalReviews}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Booking Box */}
          <div className="lg:col-span-4">
            <div className="bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-2xl p-6 shadow-sm sticky top-6">
              <h3 className="text-xl font-semibold text-base-content dark:text-white">
                Ready to book?
              </h3>

              <p className="mt-2 text-sm text-base-content/70 dark:text-slate-300">
                Choose this service and proceed to booking.
              </p>

              <div className="mt-5">
                <p className="text-sm text-base-content/60 dark:text-slate-400">
                  Starting from
                </p>
                <p className="text-2xl font-bold text-base-content dark:text-white">
                  ৳{cost}
                </p>
              </div>

              <button
                className="btn btn-primary w-full mt-6 transition duration-300 hover:scale-103 hover:bg-purple-600"
                onClick={() => navigate(`/service-booking/${id}`)}
              >
                Book This Service
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h1 className="text-3xl md:text-5xl font-bold text-base-content dark:text-white text-center">
          Would you like to{" "}
          <span className="text-purple-500">Explore More</span> Services like
          this?
        </h1>
        <div className="flex justify-center">
          <button
            className="btn btn-primary mt-6 transition duration-300 hover:scale-103 hover:bg-purple-600"
            onClick={() => navigate("/services")}
          >
            Explore more
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
