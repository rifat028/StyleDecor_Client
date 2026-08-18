import React from "react";
import { MapPin, Building, Navigation, Calendar } from "lucide-react";

// Primary Event & Residential Address summary card displaying 4 fields in 4 vertical rows
const MyProfileAddressSection = ({ address }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs h-full flex flex-col justify-between space-y-6 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 dark:hover:shadow-purple-900/20 hover:border-purple-300/60 dark:hover:border-purple-800/60">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Primary Event & Residential Address</span>
          </h3>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold border border-slate-200 dark:border-slate-700">
            {address?.city || "Dhaka"} Division
          </span>
        </div>

        {/* 4 Fields in 4 Vertical Rows */}
        <div className="space-y-4">
          {/* Row 1: Street & Holding */}
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Street / Holding
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                disabled
                readOnly
                value={address?.street || "No street address configured"}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-medium cursor-default outline-hidden"
              />
            </div>
          </div>

          {/* Row 2: Area & Neighborhood */}
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Area / Neighborhood
            </label>
            <div className="relative">
              <Navigation className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                disabled
                readOnly
                value={address?.area || "Not specified"}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-medium cursor-default outline-hidden"
              />
            </div>
          </div>

          {/* Row 3: City */}
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              City / Division
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                disabled
                readOnly
                value={`${address?.city || "Dhaka"}, Bangladesh`}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-medium cursor-default outline-hidden"
              />
            </div>
          </div>

          {/* Row 4: Postal Code */}
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Postal Code
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                disabled
                readOnly
                value={address?.postalCode || "N/A"}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-medium cursor-default outline-hidden"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfileAddressSection;
