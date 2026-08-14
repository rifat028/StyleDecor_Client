import React, { useState } from "react";
import {
  MapPin,
  Users,
  CheckCircle2,
  Building2,
  Search,
  Clock,
  Sparkles,
  Send,
  Compass,
  Star,
  Zap,
  Globe
} from "lucide-react";

// Key coverage cities data for DecorCraft across Bangladesh
const CITIES = [
  {
    id: "dhaka",
    name: "Dhaka",
    tagline: "Capital Region & Main Hub",
    decorators: "180+ Agencies",
    eventsCompleted: "4,500+ Setup",
    specialty: "Luxury Weddings & Rooftop Haldi",
    responseTime: "< 2 Hours",
    coordinates: { x: 48, y: 46 },
    popularAreas: ["Gulshan", "Banani", "Dhanmondi", "Uttara", "Mirpur"],
    badge: "Primary Hub",
    rating: "4.9"
  },
  {
    id: "chittagong",
    name: "Chittagong",
    tagline: "Port City & Seaside Venues",
    decorators: "110+ Agencies",
    eventsCompleted: "2,800+ Setup",
    specialty: "Destination Mehendi & Grand Receptions",
    responseTime: "< 2.5 Hours",
    coordinates: { x: 74, y: 68 },
    popularAreas: ["GEC Circle", "Agrabad", "Halishahar", "Panchlaish"],
    badge: "Major Hub",
    rating: "4.8"
  },
  {
    id: "sylhet",
    name: "Sylhet",
    tagline: "Tea Garden & Luxury Estates",
    decorators: "75+ Agencies",
    eventsCompleted: "1,900+ Setup",
    specialty: "Outdoor Garden & Royal Walima",
    responseTime: "< 3 Hours",
    coordinates: { x: 78, y: 30 },
    popularAreas: ["Zindabazar", "Uposhohor", "Kumarpara", "Ambarkhana"],
    badge: "High Demand",
    rating: "4.9"
  },
  {
    id: "rajshahi",
    name: "Rajshahi",
    tagline: "Silk City & Cultural Festivities",
    decorators: "60+ Agencies",
    eventsCompleted: "1,250+ Setup",
    specialty: "Traditional Cultural & Birthday Themes",
    responseTime: "< 3 Hours",
    coordinates: { x: 26, y: 36 },
    popularAreas: ["Shaheb Bazar", "Kazla", "Uposhahor", "Boalia"],
    badge: "Growing Hub",
    rating: "4.7"
  },
  {
    id: "khulna",
    name: "Khulna",
    tagline: "Industrial & Gateway Region",
    decorators: "50+ Agencies",
    eventsCompleted: "1,100+ Setup",
    specialty: "Corporate Conferences & Floral Arches",
    responseTime: "< 3 Hours",
    coordinates: { x: 32, y: 64 },
    popularAreas: ["KDA Avenue", "Sonadanga", "Boyra", "Khalishpur"],
    badge: "Active Zone",
    rating: "4.7"
  },
  {
    id: "coxsbazar",
    name: "Cox's Bazar",
    tagline: "Beachfront & Resort Galas",
    decorators: "45+ Agencies",
    eventsCompleted: "950+ Setup",
    specialty: "Beachfront Weddings & Sundown Parties",
    responseTime: "< 2 Hours",
    coordinates: { x: 82, y: 84 },
    popularAreas: ["Laboni Point", "Inani Beach", "Kolatoli", "Marine Drive"],
    badge: "Resort Special",
    rating: "4.9"
  }
];

const CoverageMap = ({ coverage }) => {
  const [activeCityId, setActiveCityId] = useState("dhaka");
  const [hoveredCityId, setHoveredCityId] = useState(null);
  const [requestLocation, setRequestLocation] = useState("");
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const activeCity = CITIES.find((c) => c.id === activeCityId) || CITIES[0];

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    if (!requestLocation.trim()) return;

    // Check if entered location matches an existing city
    const matched = CITIES.find((c) =>
      c.name.toLowerCase().includes(requestLocation.trim().toLowerCase())
    );

    if (matched) {
      setActiveCityId(matched.id);
    }

    setRequestSubmitted(true);
    setTimeout(() => {
      setRequestSubmitted(false);
      setRequestLocation("");
    }, 4000);
  };

  return (
    <section className="py-16 px-4 md:px-8 lg:px-12 bg-gradient-to-b from-gray-50 via-purple-50/20 to-gray-50 dark:from-gray-950 dark:via-purple-950/10 dark:to-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* 1. Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-sm font-semibold tracking-wide border border-purple-200 dark:border-purple-800/50 shadow-xs">
            <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400 animate-bounce" />
            <span>📍 Service Locations</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
            We Are{" "}
            <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 bg-clip-text text-transparent">
              Decorating Events Across Bangladesh
            </span>
          </h2>

          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 font-normal">
            From intimate home gatherings to grand venue setups, our verified decoration agencies are active in all major hubs.
          </p>
        </div>

        {/* 2. Two-Column Interactive Layout (Grid System) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Interactive City Hub Selector (50% Desktop) */}
          <div className="flex flex-col space-y-6 justify-between">
            {/* City Selection Header & Pills */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Select Coverage Hub
                </h3>
                <span className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2.5 py-1 rounded-full border border-purple-200 dark:border-purple-800">
                  {CITIES.length} Active Regions
                </span>
              </div>

              {/* City Cards / Pills Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CITIES.map((city) => {
                  const isActive = activeCityId === city.id;
                  return (
                    <button
                      key={city.id}
                      onClick={() => setActiveCityId(city.id)}
                      onMouseEnter={() => setHoveredCityId(city.id)}
                      onMouseLeave={() => setHoveredCityId(null)}
                      className={`relative flex items-center justify-between p-3.5 rounded-xl text-left transition-all duration-300 cursor-pointer border ${
                        isActive
                          ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25 border-purple-500 scale-[1.02] ring-2 ring-purple-400/50"
                          : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            isActive
                              ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"
                              : "bg-gray-300 dark:bg-gray-700"
                          }`}
                        />
                        <span className="font-semibold text-sm sm:text-base">
                          {city.name}
                        </span>
                      </div>
                      {isActive && (
                        <CheckCircle2 className="w-4 h-4 text-purple-200 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active City Stats Box */}
            <div className="bg-white dark:bg-gray-900/90 rounded-2xl p-6 sm:p-7 border border-purple-100 dark:border-purple-900/40 shadow-xl shadow-purple-900/5 backdrop-blur-xs relative overflow-hidden transition-all duration-300">
              {/* Decorative accent top bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-600 via-indigo-500 to-pink-500" />

              {/* Selected City Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {activeCity.name} Hub
                    </h4>
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                      {activeCity.badge}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {activeCity.tagline}
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-lg text-xs font-bold border border-amber-200 dark:border-amber-800">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{activeCity.rating} Rating</span>
                </div>
              </div>

              {/* 4 Stats Grid */}
              <div className="grid grid-cols-2 gap-4 my-5">
                {/* Active Decorators */}
                <div className="p-4 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-purple-600 dark:text-purple-400 mb-2">
                    <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Active Decorators
                    </span>
                    <Building2 className="w-4 h-4" />
                  </div>
                  <p className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
                    {activeCity.decorators}
                  </p>
                </div>

                {/* Events Completed */}
                <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-2">
                    <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Events Completed
                    </span>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <p className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
                    {activeCity.eventsCompleted}
                  </p>
                </div>

                {/* Popular Specialty */}
                <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex flex-col justify-between col-span-2 sm:col-span-1">
                  <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 mb-2">
                    <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Popular Specialty
                    </span>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2">
                    {activeCity.specialty}
                  </p>
                </div>

                {/* Response Time */}
                <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 flex flex-col justify-between col-span-2 sm:col-span-1">
                  <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-2">
                    <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Response Time
                    </span>
                    <Clock className="w-4 h-4" />
                  </div>
                  <p className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
                    {activeCity.responseTime}
                  </p>
                </div>
              </div>

              {/* Popular Covered Zones Tag Cloud */}
              <div className="pt-2">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Top Neighborhoods Covered:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {activeCity.popularAreas.map((area, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Interactive Map / City Grid Showcase (50% Desktop) */}
          <div className="relative min-h-[420px] sm:min-h-[480px] lg:min-h-[520px] rounded-3xl bg-slate-900 p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-2xl border border-slate-800 text-white">
            {/* Bangladesh Stylized Vector Map Grid Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

            {/* Glowing Map Ambient Radial Overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

            {/* Bangladesh Outline Stylized Overlay */}
            <svg
              className="absolute inset-0 w-full h-full text-purple-500/10 pointer-events-none"
              viewBox="0 0 500 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Stylized Bangladesh Geographic Silhouette */}
              <path
                d="M 120,150 Q 180,110 250,120 T 360,110 Q 420,130 400,200 T 380,290 Q 410,360 380,440 T 260,450 Q 180,430 150,370 T 110,260 Z"
                fill="currentColor"
                stroke="rgba(168, 85, 247, 0.25)"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Connecting Lines from Dhaka (Hub Center) to other active cities */}
              {CITIES.filter((c) => c.id !== "dhaka").map((city) => {
                const dhaka = CITIES.find((c) => c.id === "dhaka");
                const isConnectedActive =
                  activeCityId === city.id || activeCityId === "dhaka";
                return (
                  <line
                    key={`line-${city.id}`}
                    x1={`${dhaka.coordinates.x}%`}
                    y1={`${dhaka.coordinates.y}%`}
                    x2={`${city.coordinates.x}%`}
                    y2={`${city.coordinates.y}%`}
                    stroke={
                      isConnectedActive
                        ? "rgba(168, 85, 247, 0.6)"
                        : "rgba(148, 163, 184, 0.15)"
                    }
                    strokeWidth={isConnectedActive ? "2" : "1"}
                    strokeDasharray={isConnectedActive ? "6 3" : "2 2"}
                    className={isConnectedActive ? "animate-pulse" : ""}
                  />
                );
              })}
            </svg>

            {/* Map Top Header Badge */}
            <div className="relative z-10 flex items-center justify-between bg-slate-800/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-700/60 max-w-max">
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-300">
                <Globe className="w-4 h-4 text-purple-400 animate-spin-slow" />
                <span>Interactive Hub Radar</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-1" />
              </div>
            </div>

            {/* Interactive City Pins Layer */}
            <div className="relative z-20 w-full h-full my-4">
              {CITIES.map((city) => {
                const isActive = activeCityId === city.id;
                const isHovered = hoveredCityId === city.id;

                return (
                  <div
                    key={city.id}
                    style={{
                      left: `${city.coordinates.x}%`,
                      top: `${city.coordinates.y}%`
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    onClick={() => setActiveCityId(city.id)}
                    onMouseEnter={() => setHoveredCityId(city.id)}
                    onMouseLeave={() => setHoveredCityId(null)}
                  >
                    {/* Animated Pulsing Aura Ring */}
                    <span
                      className={`absolute inset-0 -m-3 rounded-full opacity-75 ${
                        isActive
                          ? "bg-purple-500 animate-ping"
                          : isHovered
                          ? "bg-indigo-400 animate-ping"
                          : "bg-purple-400/30 animate-pulse"
                      }`}
                    />

                    {/* Glowing Pin Circle */}
                    <div
                      className={`relative z-10 p-2.5 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-tr from-purple-600 to-pink-500 text-white scale-125 shadow-[0_0_25px_rgba(168,85,247,0.9)] ring-4 ring-purple-300/30"
                          : "bg-slate-800 text-purple-400 border border-purple-500/40 hover:scale-110 hover:bg-purple-600 hover:text-white"
                      }`}
                    >
                      <MapPin className="w-5 h-5 fill-current" />
                    </div>

                    {/* City Label Tooltip / Card */}
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2.5 whitespace-nowrap transition-all duration-300 pointer-events-none z-30 ${
                        isActive || isHovered
                          ? "opacity-100 translate-y-0 scale-100"
                          : "opacity-80 translate-y-1 scale-95"
                      }`}
                    >
                      <div className="bg-slate-900/95 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg border border-purple-500/40 shadow-xl flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="font-bold">{city.name}</span>
                        <span className="text-purple-300 text-[10px] bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-800">
                          {city.decorators}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Map Bottom Legend Footer */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]" />
                  Active Hub Pin
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  Live Operational
                </span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Click pins to switch city view
              </p>
            </div>
          </div>
        </div>

        {/* 3. Coverage Search & Request Bar (Bottom Widget) */}
        <div className="relative rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-2xl overflow-hidden border border-purple-800/40">
          {/* Decorative background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Left Info Text */}
            <div className="space-y-2 text-center lg:text-left max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-300 bg-purple-950/60 px-3 py-1 rounded-full border border-purple-800/60">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Rapid Network Expansion</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-white">
                Don't see your city listed yet?
              </h4>
              <p className="text-sm text-purple-200/80">
                We are rapidly onboarding verified decor agencies nationwide. Tell us where you need DecorCraft next!
              </p>
            </div>

            {/* Right Action Form */}
            <div className="w-full lg:w-auto min-w-[320px] sm:min-w-[420px]">
              {requestSubmitted ? (
                <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-xl p-4 text-center text-emerald-200 text-sm font-medium animate-fadeIn flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Request received! We'll notify you when DecorCraft arrives in your area.</span>
                </div>
              ) : (
                <form
                  onSubmit={handleRequestSubmit}
                  className="flex flex-col sm:flex-row items-center gap-2.5 bg-slate-950/70 p-2 rounded-xl border border-purple-500/30 backdrop-blur-md shadow-inner"
                >
                  <div className="relative w-full flex-1">
                    <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={requestLocation}
                      onChange={(e) => setRequestLocation(e.target.value)}
                      placeholder="Enter your city or area name..."
                      className="w-full bg-transparent text-white placeholder-slate-400 text-sm pl-10 pr-4 py-2.5 rounded-lg outline-none focus:ring-1 focus:ring-purple-400"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-md hover:shadow-purple-500/25 transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                  >
                    <span>Request Service in My Area</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoverageMap;
