import React, { useContext, useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../auth/AuthContext";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Spinner from "../home/components/Spinner";
import {
  Palette,
  ShieldCheck,
  Award,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Clock,
  Building,
  MapPin,
  FileText,
  Phone,
  Globe,
  ArrowRight,
  UserCheck,
  Check,
} from "lucide-react";

const TOP_CITIES = [
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Rangpur",
  "Mymensingh",
  "Cumilla",
  "Gazipur",
];

const JoinAsDecorator = () => {
  const axiosSecure = useAxiosSecure();
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [existingDecorator, setExistingDecorator] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    businessName: "",
    tagline: "",
    about: "",
    city: "Dhaka",
    serviceAreas: ["Dhaka"],
    phone: "",
    website: "",
    tradeLicenseNo: "",
    facebook: "",
    instagram: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Load existing decorator status if logged in
  useEffect(() => {
    if (!user?.email) {
      setExistingDecorator(null);
      return;
    }

    const checkExisting = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get("/decorators/me");
        const dec = res.data?.data || res.data;
        if (dec && dec._id) {
          setExistingDecorator(dec);
        }
      } catch (err) {
        // Not a decorator yet or 404
        setExistingDecorator(null);
      } finally {
        setLoading(false);
      }
    };

    checkExisting();
  }, [axiosSecure, user?.email]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleArea = (city) => {
    setFormData((prev) => {
      const exists = prev.serviceAreas.includes(city);
      if (exists) {
        if (prev.serviceAreas.length === 1) return prev; // keep at least 1
        return {
          ...prev,
          serviceAreas: prev.serviceAreas.filter((c) => c !== city),
        };
      } else {
        return { ...prev, serviceAreas: [...prev.serviceAreas, city] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login", { state: "/join-as-decorator" });
      return;
    }

    if (!formData.businessName.trim()) {
      toast.error("Please enter your agency or brand name");
      return;
    }

    const payload = {
      businessName: formData.businessName.trim(),
      tagline: formData.tagline.trim(),
      about: formData.about.trim(),
      contactInfo: {
        phone: formData.phone.trim() || user.phoneNumber || "",
        email: user.email,
        website: formData.website.trim(),
        city: formData.city,
      },
      serviceAreas: formData.serviceAreas,
      tradeLicenseNo: formData.tradeLicenseNo.trim(),
      facebook: formData.facebook.trim(),
      instagram: formData.instagram.trim(),
    };

    try {
      setSubmitting(true);
      const res = await axiosSecure.post("/decorators", payload);
      const created = res.data?.data || res.data;
      setExistingDecorator(created);

      Swal.fire({
        title: "Application Submitted!",
        text: "Your decorator application has been submitted and is pending administrator review.",
        icon: "success",
        confirmButtonColor: "#4F46E5",
      });
    } catch (err) {
      console.error("Failed to apply as decorator:", err);
      toast.error(
        err.response?.data?.message || "Failed to submit application"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Hero Header */}
        <div className="relative rounded-3xl overflow-hidden bg-linear-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white p-8 sm:p-12 shadow-2xl border border-indigo-800/40 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Vendor Partnership Program
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-2xl mx-auto">
            Scale Your Decoration Business with StyleDecor
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Connect with thousands of premium clients seeking wedding stages, birthday setups, and corporate event designs across Bangladesh.
          </p>

          {/* Value Props Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10 text-left">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                <ShieldCheck className="w-4 h-4" /> 100% Escrow Protection
              </div>
              <p className="text-xs text-slate-400">
                Guaranteed on-time payments for all completed projects.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <TrendingUp className="w-4 h-4" /> Verified Client Leads
              </div>
              <p className="text-xs text-slate-400">
                Receive direct inquiries from serious customers in your cities.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Award className="w-4 h-4" /> Verified Agency Badge
              </div>
              <p className="text-xs text-slate-400">
                Build trust with customer reviews and showcase your portfolio.
              </p>
            </div>
          </div>
        </div>

        {/* Existing Status Banner (if already applied) */}
        {existingDecorator && (
          <div
            className={`rounded-3xl p-6 sm:p-8 border shadow-lg ${
              existingDecorator.status === "active"
                ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800"
                : "bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800"
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3.5 rounded-2xl text-white ${
                    existingDecorator.status === "active"
                      ? "bg-emerald-600"
                      : "bg-amber-600"
                  }`}
                >
                  {existingDecorator.status === "active" ? (
                    <CheckCircle2 className="w-7 h-7" />
                  ) : (
                    <Clock className="w-7 h-7" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {existingDecorator.status === "active"
                      ? `Active Partner: ${existingDecorator.businessName}`
                      : `Application Status: Under Review`}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {existingDecorator.status === "active"
                      ? "Your agency profile is fully approved and active on the marketplace."
                      : "We are reviewing your trade license & agency credentials. You will receive an update shortly."}
                  </p>
                </div>
              </div>

              {existingDecorator.status === "active" ? (
                <Link
                  to="/dashboard/my-projects"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  Go to Assigned Events <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-200/60 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 uppercase shrink-0">
                  Pending Review
                </span>
              )}
            </div>
          </div>
        )}

        {/* Application Form or Login Prompt */}
        {!existingDecorator && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-8">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
                  <Palette className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  Decorator Registration Form
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Fill in your agency details to submit your application.
                </p>
              </div>

              {!user && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">Already a user?</span>
                  <Link
                    to="/login"
                    state="/join-as-decorator"
                    className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-100 cursor-pointer"
                  >
                    Log In
                  </Link>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-sm">
              {/* Agency Branding */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  1. Agency & Brand Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Business / Agency Name *
                    </label>
                    <input
                      type="text"
                      name="businessName"
                      required
                      placeholder="e.g. DreamCraft Events & Decors"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Tagline / Motto
                    </label>
                    <input
                      type="text"
                      name="tagline"
                      placeholder="e.g. Crafting Royal Weddings & Magical Moments"
                      value={formData.tagline}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    About Your Agency
                  </label>
                  <textarea
                    name="about"
                    rows={3}
                    placeholder="Describe your decoration expertise, experience, and signature themes..."
                    value={formData.about}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Operations & Location */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  2. Operational Location & Coverage
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Primary Base City *
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                      {TOP_CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Trade License / NID Number
                    </label>
                    <input
                      type="text"
                      name="tradeLicenseNo"
                      placeholder="e.g. TRAD/DNCC/012948/2026"
                      value={formData.tradeLicenseNo}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Select All Service Coverage Areas
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TOP_CITIES.map((city) => {
                      const isSelected = formData.serviceAreas.includes(city);
                      return (
                        <button
                          key={city}
                          type="button"
                          onClick={() => handleToggleArea(city)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                            isSelected
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                          {city}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  3. Contact & Social Links
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Business Phone *
                    </label>
                    <input
                      type="text"
                      name="phone"
                      placeholder="e.g. +880 1700-000002"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Website URL
                    </label>
                    <input
                      type="text"
                      name="website"
                      placeholder="https://youragency.com"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    "Submitting Application..."
                  ) : !user ? (
                    <>
                      Sign In & Apply as Decorator <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Submit Decorator Application <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinAsDecorator;
