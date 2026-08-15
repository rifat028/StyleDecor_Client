import React, { useContext, useEffect, useState, useCallback } from "react";
import { Link } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../auth/AuthContext";
import Spinner from "../home/components/Spinner";
import Swal from "sweetalert2";
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
  Calendar,
  Layers,
  Award,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Facebook,
  Instagram,
  Linkedin,
  Clock,
  Trash2,
  Save,
  X,
  Plus,
  ArrowRight,
  Camera,
  Image as ImageIcon,
  Activity,
  Briefcase,
} from "lucide-react";

const POPULAR_ZONES = [
  "Dhaka",
  "Gulshan",
  "Banani",
  "Dhanmondi",
  "Uttara",
  "Mirpur",
  "Bashundhara",
  "Mohakhali",
  "Chattogram",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Cumilla",
  "Gazipur",
];

const POPULAR_CATEGORIES = [
  "Wedding & Pre-Wedding",
  "Corporate Galas & Expos",
  "Birthday & Milestones",
  "Gaye Holud & Sangeet",
  "Floral & Botanical Styling",
  "Rooftop & Boutique Gatherings",
  "Lighting & Stage Setup",
];

const AgencyProfile = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Edit Form State
  const [formData, setFormData] = useState({
    businessName: "",
    tagline: "",
    about: "",
    logo: "",
    coverImage: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    city: "Dhaka",
    tradeLicenseNo: "",
    facebook: "",
    instagram: "",
    serviceAreas: ["Dhaka"],
    categories: [],
    status: "active",
  });

  const [newZoneInput, setNewZoneInput] = useState("");

  // 1. Fetch Current Logged-in Decorator Profile (GET /decorators/me)
  const loadAgencyProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/decorators/me");
      const dec = res.data?.data || res.data;
      if (dec) {
        setAgency(dec);
        setFormData({
          businessName: dec.businessName || "",
          tagline: dec.tagline || "",
          about: dec.about || "",
          logo: dec.logo || "",
          coverImage: dec.coverImage || "",
          phone: dec.contactInfo?.phone || "",
          email: dec.contactInfo?.email || user?.email || "",
          website: dec.contactInfo?.website || "",
          address: dec.contactInfo?.address || "",
          city: dec.contactInfo?.city || "Dhaka",
          tradeLicenseNo: dec.verification?.tradeLicenseNo || "",
          facebook: dec.socialLinks?.facebook || "",
          instagram: dec.socialLinks?.instagram || "",
          serviceAreas: Array.isArray(dec.serviceAreas) ? dec.serviceAreas : ["Dhaka"],
          categories: Array.isArray(dec.categories)
            ? dec.categories.map((c) => (typeof c === "string" ? c : c.name || ""))
            : [],
          status: dec.status || "active",
        });
      } else {
        setAgency(null);
      }
    } catch (err) {
      console.warn("Decorator profile not found or error:", err.message);
      setAgency(null);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure, user?.email]);

  useEffect(() => {
    loadAgencyProfile();
  }, [loadAgencyProfile]);

  // Open Edit Modal
  const handleOpenEdit = () => {
    if (agency) {
      setFormData({
        businessName: agency.businessName || "",
        tagline: agency.tagline || "",
        about: agency.about || "",
        logo: agency.logo || "",
        coverImage: agency.coverImage || "",
        phone: agency.contactInfo?.phone || "",
        email: agency.contactInfo?.email || user?.email || "",
        website: agency.contactInfo?.website || "",
        address: agency.contactInfo?.address || "",
        city: agency.contactInfo?.city || "Dhaka",
        tradeLicenseNo: agency.verification?.tradeLicenseNo || "",
        facebook: agency.socialLinks?.facebook || "",
        instagram: agency.socialLinks?.instagram || "",
        serviceAreas: Array.isArray(agency.serviceAreas) ? agency.serviceAreas : ["Dhaka"],
        categories: Array.isArray(agency.categories)
          ? agency.categories.map((c) => (typeof c === "string" ? c : c.name || ""))
          : [],
        status: agency.status || "active",
      });
    }
    setIsEditModalOpen(true);
  };

  // Submit Update (PATCH /decorators/:id or POST /decorators if new)
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!formData.businessName.trim()) {
      Swal.fire("Error", "Business name is required.", "error");
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        businessName: formData.businessName.trim(),
        tagline: formData.tagline.trim(),
        about: formData.about.trim(),
        logo: formData.logo.trim() || undefined,
        coverImage: formData.coverImage.trim() || undefined,
        contactInfo: {
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          website: formData.website.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
        },
        serviceAreas: formData.serviceAreas,
        categories: formData.categories.map((c) => (typeof c === "string" ? { name: c } : c)),
        tradeLicenseNo: formData.tradeLicenseNo.trim(),
        socialLinks: {
          facebook: formData.facebook.trim(),
          instagram: formData.instagram.trim(),
        },
        status: formData.status,
      };

      let res;
      if (agency?._id) {
        // Update existing agency profile
        res = await axiosSecure.patch(`/decorators/${agency._id}`, payload);
      } else {
        // Create new agency profile
        res = await axiosSecure.post("/decorators", payload);
      }

      if (res.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Agency Profile Saved 🎉",
          text: "Your agency identity, contact, and branding have been updated.",
          timer: 1800,
          showConfirmButton: false,
        });

        setIsEditModalOpen(false);
        loadAgencyProfile();
      }
    } catch (err) {
      console.error("Failed to save agency profile:", err);
      Swal.fire("Error", err.response?.data?.message || "Failed to update agency profile.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Quick Operational Duty Status Toggle
  const handleStatusChange = async (newStatus) => {
    if (!agency?._id) return;
    try {
      const res = await axiosSecure.patch(`/decorators/${agency._id}`, {
        status: newStatus,
      });
      if (res.data?.success) {
        setAgency((prev) => ({ ...prev, status: newStatus }));
        Swal.fire({
          icon: "success",
          title: `Status: ${newStatus.toUpperCase()}`,
          text: `Agency operational status updated.`,
          timer: 1200,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      Swal.fire("Error", "Failed to update status.", "error");
    }
  };

  // Zone Tag Helpers
  const handleAddZone = () => {
    const zone = newZoneInput.trim();
    if (!zone) return;
    if (!formData.serviceAreas.includes(zone)) {
      setFormData((prev) => ({
        ...prev,
        serviceAreas: [...prev.serviceAreas, zone],
      }));
    }
    setNewZoneInput("");
  };

  const handleRemoveZone = (zoneToRemove) => {
    setFormData((prev) => ({
      ...prev,
      serviceAreas: prev.serviceAreas.filter((z) => z !== zoneToRemove),
    }));
  };

  const handleToggleCategory = (catName) => {
    setFormData((prev) => {
      const exists = prev.categories.includes(catName);
      if (exists) {
        return { ...prev, categories: prev.categories.filter((c) => c !== catName) };
      } else {
        return { ...prev, categories: [...prev.categories, catName] };
      }
    });
  };

  if (loading && !agency) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // If no agency profile found for user
  if (!agency) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 flex flex-col items-center justify-center text-center space-y-5">
        <div className="p-6 rounded-3xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
          <Building className="w-12 h-12 mx-auto" />
        </div>
        <div className="max-w-md space-y-1">
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            Set Up Your Agency Profile
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Create your official event decorator agency storefront to showcase signature packages, manage field specialists, and receive client bookings.
          </p>
        </div>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" /> Create Agency Profile Now
        </button>
      </div>
    );
  }

  const metrics = agency.metrics || {
    rating: 5.0,
    reviewCount: 12,
    completedEvents: 45,
    responseRate: 100,
    responseTimeHours: 1.0,
  };

  const isVerified = Boolean(agency.verification?.isVerified);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 animate-fade-in space-y-8">
      {/* ================= Agency Hero Banner ================= */}
      <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        {/* Cover Photo */}
        <div className="relative h-48 sm:h-64 md:h-72 w-full bg-slate-800">
          <img
            src={
              agency.coverImage ||
              "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600"
            }
            alt={agency.businessName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

          {/* Quick Edit Cover Button */}
          <button
            onClick={handleOpenEdit}
            className="absolute top-4 right-4 px-3.5 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all border border-white/20"
          >
            <Camera className="w-3.5 h-3.5" /> Edit Cover & Brand
          </button>
        </div>

        {/* Agency Identity Bar */}
        <div className="p-6 sm:p-8 -mt-16 sm:-mt-20 relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            {/* Logo Avatar */}
            <div className="relative">
              <img
                src={
                  agency.logo ||
                  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=300"
                }
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

            {/* Name, Tagline, & Meta */}
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

          {/* Action Buttons & Status Selector */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Operational Status Selector */}
            <select
              value={agency.status || "active"}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-3.5 py-2.5 rounded-2xl text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-pointer focus:ring-2 focus:ring-purple-500/20"
            >
              <option value="active">🟢 Active & Accepting Orders</option>
              <option value="busy">🟡 High Workload / Busy</option>
              <option value="on_leave">🔵 On Temporary Leave</option>
              <option value="suspended">🔴 Closed</option>
            </select>

            <button
              onClick={handleOpenEdit}
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

      {/* ================= KPI Performance Cards ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Rating */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-lg shadow-purple-600/20 space-y-1">
          <span className="text-[11px] font-bold text-purple-200 uppercase tracking-wider flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-current" /> Quality Rating
          </span>
          <p className="text-2xl sm:text-3xl font-black">
            {metrics.rating} <span className="text-base text-purple-200">/ 5.0</span>
          </p>
          <p className="text-[11px] text-purple-200 pt-1">
            Across {metrics.reviewCount || 0} client appraisals
          </p>
        </div>

        {/* Executed Events */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-purple-500" /> Completed Events
          </span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {metrics.completedEvents || 0}+
          </p>
          <p className="text-[11px] text-slate-400 pt-1">Successful decor deliveries</p>
        </div>

        {/* Response Rate */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-500" /> Response Rate
          </span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {metrics.responseRate || 100}%
          </p>
          <p className="text-[11px] text-slate-400 pt-1">Avg reply under 1 hour</p>
        </div>

        {/* Coverage Zones */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-indigo-500" /> Service Coverage
          </span>
          <p className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
            {agency.serviceAreas?.length || 1} Zones
          </p>
          <p className="text-[11px] text-slate-400 pt-1">Active deployment regions</p>
        </div>
      </div>

      {/* ================= Details Grid ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Brand Story & Specializations (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* About / Story */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  About Our Agency & Craft
                </h3>
              </div>
              <button
                onClick={handleOpenEdit}
                className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
              >
                Edit Story
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {agency.about ||
                `${agency.businessName} is a premier event decoration studio in Bangladesh, specializing in bespoke stage designs, royal wedding floral setups, and corporate milestone productions.`}
            </p>
          </div>

          {/* Specialization Categories */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Category Specializations
                </h3>
              </div>
              <button
                onClick={handleOpenEdit}
                className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
              >
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

          {/* Service Coverage Zones */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Service Coverage Zones
                </h3>
              </div>
              <button
                onClick={handleOpenEdit}
                className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
              >
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

        {/* Right Column: Contact & Official Verification (1 Col) */}
        <div className="space-y-6">
          {/* Contact Information */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Headquarters & Contact
                </h3>
              </div>
              <button
                onClick={handleOpenEdit}
                className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
              >
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

            {/* Social Footprint */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Social Profiles
              </span>
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

          {/* Official Verification Box */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Trade & Verification
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Trade License:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {agency.verification?.tradeLicenseNo || "TL-2026-DH-0918"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Partner Status:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Escrow Payout:</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">88.5% Net</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= Edit / Create Modal ================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">
                  {agency?._id ? "Edit Agency Profile" : "Register Agency Profile"}
                </h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 dark:text-slate-300">
              {/* Business Name & Tagline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DreamCraft Events & Decors"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Tagline / Sub-Headline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Weddings & Floral Wonders"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
              </div>

              {/* Logo & Cover Photo URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Logo Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Cover Banner Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
              </div>

              {/* About / Bio */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  About Brand & Craft Story
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your design aesthetics, experience, team expertise, and decor specialties..."
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              {/* Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Phone</label>
                  <input
                    type="text"
                    placeholder="+880 1711-223344"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">City</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
                  >
                    {POPULAR_ZONES.map((z, idx) => (
                      <option key={idx} value={z}>{z}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Trade License No</label>
                  <input
                    type="text"
                    placeholder="TL-2026-DH-XXXX"
                    value={formData.tradeLicenseNo}
                    onChange={(e) => setFormData({ ...formData, tradeLicenseNo: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Address & Website */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Headquarters Address</label>
                  <input
                    type="text"
                    placeholder="Road 11, Block D, Banani"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Website URL</label>
                  <input
                    type="url"
                    placeholder="https://dreamcraftevents.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Facebook URL</label>
                  <input
                    type="url"
                    placeholder="https://facebook.com/dreamcraftevents"
                    value={formData.facebook}
                    onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Instagram URL</label>
                  <input
                    type="url"
                    placeholder="https://instagram.com/dreamcraftevents"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Coverage Zones */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Service Coverage Zones:
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {formData.serviceAreas.map((area, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-[11px] font-bold border border-purple-200 dark:border-purple-800 flex items-center gap-1"
                    >
                      {area}
                      <button
                        type="button"
                        onClick={() => handleRemoveZone(area)}
                        className="hover:text-red-500 cursor-pointer ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Add custom zone (e.g. Uttara Sector 4)"
                    value={newZoneInput}
                    onChange={(e) => setNewZoneInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddZone();
                      }
                    }}
                    className="flex-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddZone}
                    className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold cursor-pointer hover:bg-slate-300"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Category Specializations */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Specialization Categories:
                </label>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_CATEGORIES.map((cat, idx) => {
                    const isSelected = formData.categories.includes(cat);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleToggleCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer shadow-md shadow-purple-600/30 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Saving..." : "Save Agency Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgencyProfile;
