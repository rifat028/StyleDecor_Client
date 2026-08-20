import React from "react";
import { Link } from "react-router";
import {
  Building,
  ShieldCheck,
  Star,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Globe,
  Edit3,
  Layers,
  Award,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Facebook,
  Instagram,
  Clock,
  Camera,
  Activity,
} from "lucide-react";

// Hero banner (cover photo, logo, identity, status selector) + KPI cards + about/contact detail grid
const AgencyProfileHero = ({ agency, user, onOpenEdit, onStatusChange }) => {
  const metrics = agency.metrics || {
    rating: 5.0,
    reviewCount: 12,
    completedEvents: 45,
    responseRate: 100,
    responseTimeHours: 1.0,
  };

  const isVerified = Boolean(agency.verification?.isVerified);

  return (
    <>
      {/* Agency Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="relative h-48 sm:h-64 md:h-72 w-full bg-slate-800">
          <img
            src={agency.coverImage || "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600"}
            alt={agency.businessName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

          <button
            onClick={onOpenEdit}
            className="absolute top-4 right-4 px-3.5 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all border border-white/20"
          >
            <Camera className="w-3.5 h-3.5" /> Edit Cover & Brand
          </button>
        </div>

        <div className="p-6 sm:p-8 -mt-16 sm:-mt-20 relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            <div className="relative">
              <img
                src={agency.logo || "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=300"}
                alt={agency.businessName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-white dark:ring-slate-900 shadow-2xl bg-slate-900"
              />
              {isVerified && (
                <span
                  className="absolute -bottom-1 -right-1 p-1 rounded-full bg-purple-600 text-white ring-2 ring-white dark:ring-slate-900"
                  title="Verified Agency"
                >
                  <ShieldCheck className="w-4 h-4" />
                </span>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                  {agency.businessName}
                </h1>
                {isVerified ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                    <ShieldCheck className="w-3 h-3" /> Verified Partner
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                    <Clock className="w-3 h-3" /> Verification Pending
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                {agency.tagline || "Signature Wedding & Event Decoration Specialists"}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-purple-500" />
                  {agency.contactInfo?.city || "Dhaka"}, Bangladesh
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-bold text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {metrics.rating} Rating ({metrics.completedEvents || 0} Celebrations)
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select
              value={agency.status || "active"}
              onChange={(e) => onStatusChange(e.target.value)}
              className="px-3.5 py-2.5 rounded-2xl text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-pointer focus:ring-2 focus:ring-purple-500/20"
            >
              <option value="active">🟢 Active & Accepting Orders</option>
              <option value="busy">🟡 High Workload / Busy</option>
              <option value="on_leave">🔵 On Temporary Leave</option>
              <option value="suspended">🔴 Closed</option>
            </select>

            <button
              onClick={onOpenEdit}
              className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Agency Profile
            </button>

            <Link
              to={`/decorators/${agency._id}`}
              className="px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Public View
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Performance Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-linear-to-br from-purple-600 to-indigo-700 text-white shadow-lg shadow-purple-600/20 space-y-1">
          <span className="text-[11px] font-bold text-purple-200 uppercase tracking-wider flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-current" /> Quality Rating
          </span>
          <p className="text-2xl sm:text-3xl font-black">
            {metrics.rating} <span className="text-base text-purple-200">/ 5.0</span>
          </p>
          <p className="text-[11px] text-purple-200 pt-1">Across {metrics.reviewCount || 0} client appraisals</p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-purple-500" /> Completed Events
          </span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {metrics.completedEvents || 0}+
          </p>
          <p className="text-[11px] text-slate-400 pt-1">Successful decor deliveries</p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-500" /> Response Rate
          </span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {metrics.responseRate || 100}%
          </p>
          <p className="text-[11px] text-slate-400 pt-1">Avg reply under 1 hour</p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-indigo-500" /> Service Coverage
          </span>
          <p className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
            {agency.serviceAreas?.length || 1} Zones
          </p>
          <p className="text-[11px] text-slate-400 pt-1">Active deployment regions</p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">About Our Agency & Craft</h3>
              </div>
              <button onClick={onOpenEdit} className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer">
                Edit Story
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {agency.about ||
                `${agency.businessName} is a premier event decoration studio in Bangladesh, specializing in bespoke stage designs, royal wedding floral setups, and corporate milestone productions.`}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Category Specializations</h3>
              </div>
              <button onClick={onOpenEdit} className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer">
                Manage
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {agency.categories && agency.categories.length > 0 ? (
                agency.categories.map((cat, idx) => {
                  const catName = typeof cat === "string" ? cat : cat.name || "Specialty";
                  return (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-100 dark:border-purple-900/50 flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-500" /> {catName}
                    </span>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400 italic">No categories assigned yet.</p>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Service Coverage Zones</h3>
              </div>
              <button onClick={onOpenEdit} className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer">
                Edit Zones
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {agency.serviceAreas && agency.serviceAreas.length > 0 ? (
                agency.serviceAreas.map((area, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3 text-purple-500" /> {area}
                  </span>
                ))
              ) : (
                <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
                  Dhaka Metropolitan
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Headquarters & Contact</h3>
              </div>
              <button onClick={onOpenEdit} className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer">
                Edit
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{agency.contactInfo?.phone || "No phone provided"}</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{agency.contactInfo?.email || user?.email}</span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  {agency.contactInfo?.address ? `${agency.contactInfo.address}, ` : ""}
                  {agency.contactInfo?.city || "Dhaka"}
                </span>
              </div>

              {agency.contactInfo?.website && (
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                  <a
                    href={agency.contactInfo.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-purple-600 hover:underline truncate"
                  >
                    {agency.contactInfo.website}
                  </a>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Social Profiles</span>
              <div className="flex items-center gap-2">
                {agency.socialLinks?.facebook && (
                  <a
                    href={agency.socialLinks.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 hover:scale-105 transition-transform"
                    title="Facebook Page"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {agency.socialLinks?.instagram && (
                  <a
                    href={agency.socialLinks.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 hover:scale-105 transition-transform"
                    title="Instagram Portfolio"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {!agency.socialLinks?.facebook && !agency.socialLinks?.instagram && (
                  <span className="text-xs text-slate-400 italic">No social links added</span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Trade & Verification</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Trade License:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {agency.verification?.tradeLicenseNo || (
                    <span className="italic font-sans font-normal text-slate-400">Not yet provided</span>
                  )}
                </span>
              </div>

              {/* Partner Status now derives from the same verification flag as the hero banner badge, instead of being hardcoded "Approved" regardless of actual state */}
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Partner Status:</span>
                {isVerified ? (
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                  </span>
                ) : (
                  <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Pending Review
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Escrow Payout:</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">88.5% Net</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AgencyProfileHero;
