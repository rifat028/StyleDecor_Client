import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Spinner from "../home/components/Spinner";
import toast from "react-hot-toast";
import {
  Palette,
  ShieldCheck,
  MapPin,
  Star,
  Award,
  Phone,
  Mail,
  Globe,
  Sparkles,
  Calendar,
  Users,
  MessageSquare,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Building,
  Layers,
  Facebook,
  Instagram,
  Clock,
  ThumbsUp,
  Share2,
} from "lucide-react";

const getPlaceholderLogo = (name = "Decorator") => {
  const initials = encodeURIComponent(name || "Decorator");
  return `https://ui-avatars.com/api/?name=${initials}&background=7C3AED&color=ffffff&bold=true&size=200`;
};

const DecoratorProfile = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // Data States
  const [decorator, setDecorator] = useState(null);
  const [services, setServices] = useState([]);
  const [agents, setAgents] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Tab / Section Scroll
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    if (!id) return;

    const loadAllAgencyData = async () => {
      try {
        setLoading(true);

        // 1. Fetch Decorator Agency Profile (GET /decorators/id/:id)
        const decRes = await axiosSecure.get(`/decorators/id/${id}`);
        const decData = decRes.data?.data || decRes.data;
        setDecorator(decData);

        // 2. Fetch Active Services by Agency (GET /services/decorator/:decoratorId)
        try {
          const sRes = await axiosSecure.get(`/services/decorator/${id}`);
          setServices(sRes.data?.data || []);
        } catch (sErr) {
          console.warn("Could not load agency services:", sErr);
        }

        // 3. Fetch Agency Agents (GET /agents/decorator/:decoratorId)
        try {
          const aRes = await axiosSecure.get(`/agents/decorator/${id}`);
          setAgents(aRes.data?.data || []);
        } catch (aErr) {
          console.warn("Could not load agency agents:", aErr);
        }

        // 4. Fetch Agency Reviews (GET /reviews/decorator/:decoratorId)
        try {
          const rRes = await axiosSecure.get(`/reviews/decorator/${id}`);
          setReviews(rRes.data?.data || []);
        } catch (rErr) {
          console.warn("Could not load agency reviews:", rErr);
        }
      } catch (err) {
        console.error("Failed to load decorator agency profile:", err);
        toast.error("Failed to load decorator profile");
      } finally {
        setLoading(false);
      }
    };

    loadAllAgencyData();
  }, [axiosSecure, id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: decorator?.businessName || "StyleDecor Agency",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Profile link copied to clipboard!");
    }
  };

  const scrollToSection = (sectionId) => {
    setActiveTab(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!decorator) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <Palette className="w-16 h-16 text-slate-300 dark:text-slate-700" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Decorator Agency Not Found
        </h2>
        <p className="text-sm text-slate-500 max-w-md">
          The decorator agency profile you are looking for does not exist or may have been updated.
        </p>
        <Link
          to="/decorators"
          className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-all"
        >
          Explore All Decorators
        </Link>
      </div>
    );
  }

  const {
    businessName,
    tagline,
    about,
    logo,
    coverImage,
    contactInfo = {},
    serviceAreas = [],
    metrics = {},
    verification = {},
    tradeLicenseNo,
    facebook,
    instagram,
  } = decorator;

  const isVerified = Boolean(verification.isVerified);
  const rating = metrics.rating ? Number(metrics.rating).toFixed(1) : "5.0";
  const completedEvents = metrics.completedEvents || 0;
  const reviewsCount = reviews.length > 0 ? reviews.length : (metrics.reviewsCount || 24);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20 animate-fade-in">
      {/* ================= 1. Top Cover Photo (CP) & Display Picture (DP) ================= */}
      <div className="relative">
        {/* Cover Photo Backdrop */}
        <div className="h-64 sm:h-80 md:h-96 w-full relative overflow-hidden bg-slate-900">
          <img
            src={
              coverImage ||
              "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&auto=format&fit=crop"
            }
            alt={businessName}
            className="w-full h-full object-cover object-center opacity-85 scale-105 transform hover:scale-100 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Quick Share / Back Button on Cover */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
            <Link
              to="/decorators"
              className="px-4 py-2 rounded-2xl bg-black/40 hover:bg-black/60 text-white backdrop-blur-md text-xs font-bold transition-all flex items-center gap-1.5 border border-white/10"
            >
              <ChevronRight className="w-4 h-4 rotate-180" /> All Decorators
            </Link>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-2xl bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-all border border-white/10 cursor-pointer"
              title="Share Agency"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Agency Identity Header Card (Overlapping CP) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-28 relative z-20">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col md:flex-row md:items-end justify-between gap-6">
            {/* Left: DP / Logo & Titles */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              {/* DP / Logo */}
              <div className="relative -mt-16 sm:-mt-20">
                <img
                  src={logo || getPlaceholderLogo(businessName)}
                  alt={businessName}
                  onError={(e) => {
                    e.currentTarget.src = getPlaceholderLogo(businessName);
                  }}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover ring-4 ring-white dark:ring-slate-900 shadow-2xl bg-white dark:bg-slate-800"
                />
                {isVerified && (
                  <div
                    className="absolute -bottom-2 -right-2 p-2 bg-purple-600 text-white rounded-2xl shadow-lg ring-4 ring-white dark:ring-slate-900"
                    title="Verified Agency Partner"
                  >
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                )}
              </div>

              {/* Title & Slogan */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                    {businessName}
                  </h1>
                  {isVerified && (
                    <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified Agency
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
                  {tagline || "Luxury Wedding, Stage & Milestone Event Architects"}
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1 font-semibold text-purple-600 dark:text-purple-400">
                    <MapPin className="w-3.5 h-3.5" />
                    {contactInfo.city || "Dhaka"}, Bangladesh
                  </span>
                  {tradeLicenseNo && (
                    <span className="text-slate-400">
                      License: <span className="font-medium text-slate-600 dark:text-slate-300">{tradeLicenseNo}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Metrics & Booking Quick Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-end gap-3 shrink-0">
              {/* Rating Card */}
              <div className="px-4 py-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-center">
                <div className="flex items-center justify-center gap-1 text-amber-600 dark:text-amber-400 font-black text-base">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {rating}
                </div>
                <p className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase">
                  {reviewsCount} Reviews
                </p>
              </div>

              {/* Events Done */}
              <div className="px-4 py-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-center">
                <p className="font-black text-base text-emerald-600 dark:text-emerald-400">
                  {completedEvents}+
                </p>
                <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase">
                  Events Done
                </p>
              </div>

              {/* Contact Button */}
              {contactInfo.phone && (
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Phone className="w-4 h-4" /> Call Agency
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= Sticky Agency Website Navigation Tabs ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="sticky top-20 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-1.5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-start gap-2 overflow-x-auto">
          {[
            { id: "about", label: "Agency Overview", icon: Building },
            { id: "services", label: `Active Services (${services.length})`, icon: Layers },
            { id: "agents", label: `Team & Agents (${agents.length})`, icon: Users },
            { id: "reviews", label: `Public Reviews (${reviews.length})`, icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= Main Agency Content Sections ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-12">
        {/* ================= 2. Information About That Agency ================= */}
        <section id="about" className="scroll-mt-36 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: About Story & Aesthetics */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  About {businessName}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Our history, artistic philosophy, and event execution approach
                </p>
              </div>

              <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-4">
                <p className="whitespace-pre-line">
                  {about ||
                    `${businessName} is one of Bangladesh's premier decoration and event architecture studios. Specializing in bespoke wedding setups, floral installations, corporate stages, and private celebrations, our team transforms spaces into unforgettable visual experiences.`}
                </p>
              </div>

              {/* Service Areas Coverage */}
              {serviceAreas.length > 0 && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Operational Service Coverage Areas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {serviceAreas.map((area, idx) => (
                      <span
                        key={idx}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-semibold border border-purple-100 dark:border-purple-900/40 flex items-center gap-1.5"
                      >
                        <MapPin className="w-3.5 h-3.5 text-purple-500" /> {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Contact & Verification Dossier */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Building className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                Agency Information
              </h3>

              <div className="space-y-4 text-xs">
                {/* Phone */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Official Phone
                  </span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-purple-500" />
                    {contactInfo.phone || "Available upon booking inquiry"}
                  </p>
                </div>

                {/* Email */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Agency Email
                  </span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-purple-500" />
                    {contactInfo.email || "contact@styledecor.com"}
                  </p>
                </div>

                {/* Base Location */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Headquarters / Base
                  </span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-purple-500" />
                    {contactInfo.city || "Dhaka"}, Bangladesh
                  </p>
                </div>

                {/* Website */}
                {contactInfo.website && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Official Website
                    </span>
                    <a
                      href={contactInfo.website}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1.5 truncate"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      {contactInfo.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ================= 3. Active Services of That Agency ================= */}
        <section id="services" className="scroll-mt-36 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
                <Layers className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                Active Decoration Services ({services.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Handcrafted packages and stage solutions offered by {businessName}
              </p>
            </div>
          </div>

          {services.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-800 space-y-3">
              <Layers className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                No Services Listed Currently
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                This agency has not published public service packages yet. You can contact them directly for custom event quotes.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((srv) => {
                const title = srv.title || srv.serviceName || "Signature Decoration Package";
                const catName = srv.category?.name || srv.serviceCategory || "Event Styling";
                const price = srv.pricing?.discountedPrice || srv.pricing?.basePrice || srv.cost || 25000;
                const cover = srv.coverImage || srv.images?.[0] || "https://images.unsplash.com/photo-1519741497674-611481863552?w=600";
                const srvRating = srv.metrics?.rating || srv.rating || 4.9;

                return (
                  <div
                    key={srv._id}
                    className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Image Container */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={cover}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/50 text-white backdrop-blur-md text-[11px] font-bold">
                        {catName}
                      </div>

                      <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center gap-1 shadow-sm">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {Number(srvRating).toFixed(1)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {srv.shortDescription || srv.description || "Custom handcrafted stage setup with premium floral accents."}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-400">
                            Starting from
                          </span>
                          <p className="text-base font-black text-purple-600 dark:text-purple-400">
                            ৳{Number(price).toLocaleString()}
                          </p>
                        </div>

                        <Link
                          to={`/services/${srv._id}`}
                          className="px-4 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-600 text-purple-700 dark:text-purple-300 hover:text-white text-xs font-bold transition-all duration-200 flex items-center gap-1 cursor-pointer"
                        >
                          View Details <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ================= 4. Agents / Creative Team of That Agency ================= */}
        <section id="agents" className="scroll-mt-36 space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              Agency Agents & Decor Specialists ({agents.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Dedicated field coordinators, floral architects, and setup supervisors from {businessName}
            </p>
          </div>

          {agents.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-slate-200/80 dark:border-slate-800 space-y-2">
              <Users className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Direct Agency Coordination
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                All events for this agency are directly supervised by {businessName}'s master decorators.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {agents.map((ag) => (
                <div
                  key={ag._id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col items-center text-center space-y-3"
                >
                  <img
                    src={ag.photoUrl || getPlaceholderLogo(ag.name)}
                    alt={ag.name}
                    className="w-20 h-20 rounded-2xl object-cover ring-2 ring-purple-100 dark:ring-purple-900 shadow-sm"
                  />
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {ag.name}
                    </h4>
                    <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                      {ag.designation || "Senior Event Specialist"}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {ag.experienceYears || 2}+ Years Exp. • {ag.assignedArea?.city || (typeof ag.assignedArea === 'string' ? ag.assignedArea : "Dhaka")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ================= 5. Public Customer Reviews on That Agency ================= */}
        <section id="reviews" className="scroll-mt-36 space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
                <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                Verified Client Reviews ({reviews.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Authentic feedback from couples and clients who booked {businessName}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-black bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                ★ {rating} / 5.0 Overall Rating
              </span>
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-800 space-y-3">
              <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                No Reviews Yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Be the first to experience {businessName}'s decoration artistry and leave a review.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((rev) => (
                <div
                  key={rev._id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4"
                >
                  {/* Reviewer Header */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.customerPhotoUrl || getPlaceholderLogo(rev.customerName)}
                        alt={rev.customerName}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                          {rev.customerName || "Verified Client"}
                        </h4>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Verified Booking
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < (rev.rating || 5)
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300 dark:text-slate-700"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    "{rev.comment}"
                  </p>

                  {/* Review Date */}
                  <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>
                      {new Date(rev.createdAt || Date.now()).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DecoratorProfile;
