import React from "react";
import { useNavigate } from "react-router";

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();
  const { serviceName, serviceCategory, cost, unit, rating, totalReviews } =
    service;

  // Simple star display (beginner friendly)
  const renderStars = (value) => {
    const fullStars = Math.floor(value);
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(i <= fullStars ? "★" : "☆");
    }
    return stars.join(" ");
  };

  return (
    <div
      className="
        w-full
        rounded-2xl
        border border-base-300 dark:border-slate-800
        bg-base-100 dark:bg-slate-950
        p-5
        shadow-sm
        hover:shadow-md
        transition
        duration-300
        hover:-translate-y-2
      "
    >
      {/* Service Name */}
      <h3 className="text-base sm:text-lg font-semibold text-base-content dark:text-slate-100">
        {serviceName}
      </h3>

      {/* Category & Unit */}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span
          className="
            rounded-full
            border border-base-300 dark:border-slate-700
            bg-base-200 dark:bg-slate-900
            px-3 py-1
            text-xs font-medium
            text-base-content dark:text-slate-100
          "
        >
          {serviceCategory.toUpperCase()}
        </span>
        <span className="text-xs text-base-content/60 dark:text-slate-400">
          {unit}
        </span>
      </div>

      {/* Price */}
      <div className="mt-4">
        <p className="text-sm text-base-content/60 dark:text-slate-400">
          Starting from
        </p>
        <p className="text-xl font-bold text-base-content dark:text-slate-100">
          ৳{cost}
        </p>
      </div>

      {/* Rating */}
      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-base-content dark:text-slate-100">
            Rating: {rating}
          </p>
          <p className="text-sm text-base-content/70 dark:text-slate-300">
            {renderStars(rating)}
          </p>
        </div>
        <p className="text-sm text-base-content/70 dark:text-slate-300 ">
          {totalReviews} reviews
        </p>
      </div>

      {/* View Details Button */}
      <div className="mt-5">
        <button
          className="btn btn-primary w-full transition duration-300 transform hover:scale-103 hover:bg-indigo-600 mt-auto"
          onClick={() => navigate(`/services/${service._id}`)}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
