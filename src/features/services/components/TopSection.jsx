import React from "react";

const TopSection = () => {
  return (
    <div className="bg-base-200 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-14 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-base-content dark:text-white">
          Our <span className="text-purple-500">Services</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-sm md:text-base text-base-content/70 dark:text-slate-300">
          Explore our professional home, wedding, and corporate decoration
          services. Choose a service and view details to book easily.
        </p>
      </div>
    </div>
  );
};

export default TopSection;
