import React, { use, useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../auth/AuthContext";
import Spinner from "../home/components/Spinner";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Calendar,
  Edit3,
  CheckCircle2,
  XCircle,
  Building,
  Navigation,
  Globe,
  Check,
  X,
  Sparkles,
} from "lucide-react";

const topCitiesInBD = [
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

const MyProfile = () => {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [userData, setUserData] = useState(null);
  const [decoratorData, setDecoratorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingDecorator, setIsEditingDecorator] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingDecorator, setSavingDecorator] = useState(false);

  // User Profile Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    photoUrl: "",
    street: "",
    area: "",
    city: "Dhaka",
    postalCode: "",
  });

  // Decorator Agency Form State
  const [decoratorForm, setDecoratorForm] = useState({
    businessName: "",
    tagline: "",
    about: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    city: "Dhaka",
    serviceAreas: ["Dhaka"],
  });

  const loadUser = async () => {
    try {
      const res = await axiosSecure.get("/users/me");
      const u = res.data;
      setUserData(u);
      if (u) {
        setFormData({
          name: u.name || "",
          phone: u.phone || "",
          photoUrl: u.photoUrl || "",
          street: u.address?.street || "",
          area: u.address?.area || "",
          city: u.address?.city || "Dhaka",
          postalCode: u.address?.postalCode || "",
        });

        // If user is a decorator, load agency info
        if (u.role === "decorator") {
          try {
            const decRes = await axiosSecure.get("/decorators/me");
            const dec = decRes.data?.data || decRes.data;
            setDecoratorData(dec);
            if (dec) {
              setDecoratorForm({
                businessName: dec.businessName || "",
                tagline: dec.tagline || "",
                about: dec.about || "",
                phone: dec.contactInfo?.phone || "",
                email: dec.contactInfo?.email || u.email || "",
                website: dec.contactInfo?.website || "",
                address: dec.contactInfo?.address || "",
                city: dec.contactInfo?.city || "Dhaka",
                serviceAreas: Array.isArray(dec.serviceAreas)
                  ? dec.serviceAreas
                  : ["Dhaka"],
              });
            }
          } catch (decErr) {
            console.warn("No linked decorator profile found:", decErr.message);
          }
        }
      }
    } catch (error) {
      console.error("Failed to load user profile", error);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, [axiosSecure, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDecoratorInputChange = (e) => {
    const { name, value } = e.target;
    setDecoratorForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleServiceArea = (city) => {
    setDecoratorForm((prev) => {
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

  // Update User Profile (PATCH /users/profile)
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        photoUrl: formData.photoUrl,
        address: {
          street: formData.street,
          area: formData.area,
          city: formData.city,
          postalCode: formData.postalCode,
        },
      };

      const res = await axiosSecure.patch("/users/profile", payload);
      if (res.data?.user) {
        setUserData(res.data.user);
      }
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Update Decorator Agency Profile (PATCH /decorators/:id)
  const handleUpdateDecoratorProfile = async (e) => {
    e.preventDefault();
    if (!decoratorData?._id) return;
    setSavingDecorator(true);

    try {
      const payload = {
        businessName: decoratorForm.businessName.trim(),
        tagline: decoratorForm.tagline.trim(),
        about: decoratorForm.about.trim(),
        contactInfo: {
          phone: decoratorForm.phone.trim(),
          email: decoratorForm.email.trim(),
          website: decoratorForm.website.trim(),
          address: decoratorForm.address.trim(),
          city: decoratorForm.city,
        },
        serviceAreas: decoratorForm.serviceAreas,
      };

      const res = await axiosSecure.patch(
        `/decorators/${decoratorData._id}`,
        payload
      );
      const updated = res.data?.data || res.data;
      if (updated) {
        setDecoratorData(updated);
      }
      toast.success("Agency profile updated successfully!");
      setIsEditingDecorator(false);
    } catch (error) {
      console.error("Failed to update decorator profile", error);
      toast.error(
        error.response?.data?.message || "Failed to update agency profile"
      );
    } finally {
      setSavingDecorator(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (!userData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <XCircle className="w-12 h-12 text-rose-500 mb-3" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
          User Profile Not Found
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          We couldn't retrieve your profile data. Please try signing in again.
        </p>
      </div>
    );
  }

  const { name, email, photoUrl, role, address, createdAt } = userData;

  const roleBadgeStyles = {
    admin:
      "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/60",
    decorator:
      "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60",
    agent:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60",
    customer:
      "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60",
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner Header */}
      <div className="relative rounded-3xl overflow-hidden bg-linear-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-6 sm:p-10 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative group">
              <img
                src={
                  photoUrl ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"
                }
                alt={name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white/20 shadow-2xl shadow-black/40"
              />
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full ring-2 ring-indigo-900 shadow">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {name || "User Profile"}
                </h1>
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                    roleBadgeStyles[role] || roleBadgeStyles.customer
                  }`}
                >
                  {role || "Customer"}
                </span>
              </div>
              <p className="text-indigo-200/90 text-sm flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                {email}
              </p>
              <p className="text-indigo-300/70 text-xs flex items-center justify-center sm:justify-start gap-1.5 pt-1">
                <Calendar className="w-3.5 h-3.5" />
                Member since {new Date(createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-sm font-semibold transition-all duration-200 shadow-lg cursor-pointer self-stretch sm:self-auto justify-center"
          >
            <Edit3 className="w-4 h-4" />
            {isEditing ? "Cancel Editing" : "Edit Personal Info"}
          </button>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column / Basic Info Card */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Account Details
            </h3>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Full Name
                </p>
                <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">
                  {name || "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Email Address
                </p>
                <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {email}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Phone Number
                </p>
                <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {userData.phone || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Account Type
                </p>
                <p className="font-medium capitalize text-slate-800 dark:text-slate-200 mt-0.5">
                  {role || "Customer"} Account
                </p>
              </div>
            </div>
          </div>

          {/* Verification Status Card */}
          <div className="bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-3xl p-6 border border-emerald-200/70 dark:border-emerald-800/40">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500 text-white rounded-xl shadow-md shadow-emerald-500/20">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-emerald-950 dark:text-emerald-300">
                  Account Status
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-400/90 mt-0.5">
                  Verified & Active Member
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right / Address Details & Editor */}
        <div className="lg:col-span-2 space-y-6">
          {isEditing ? (
            /* Profile Edit Form */
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-indigo-200 dark:border-indigo-900/60 shadow-lg ring-4 ring-indigo-500/5 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                    Edit Profile Details
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Update your personal and primary delivery/event address.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Tanvir Ahmed"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. +880 1700-000000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Avatar Image URL
                  </label>
                  <input
                    type="text"
                    name="photoUrl"
                    value={formData.photoUrl}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-3">
                    Address Settings
                  </h4>

                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                          Street / Holding
                        </label>
                        <input
                          type="text"
                          name="street"
                          value={formData.street}
                          onChange={handleInputChange}
                          placeholder="House 12, Road 5"
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                          Area / Neighborhood
                        </label>
                        <input
                          type="text"
                          name="area"
                          value={formData.area}
                          onChange={handleInputChange}
                          placeholder="Dhanmondi"
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                          City
                        </label>
                        <select
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        >
                          {topCitiesInBD.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          placeholder="1209"
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {saving ? "Saving Changes..." : "Save Profile"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Address Card */
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Primary Event & Residential Address
                </h3>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                  {address?.city || "Dhaka"} Division
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Building className="w-3.5 h-3.5" />
                    Street & Holding
                  </div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {address?.street || "No street address configured"}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Navigation className="w-3.5 h-3.5" />
                    Area & Neighborhood
                  </div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {address?.area || "Not specified"}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5" />
                    City
                  </div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {address?.city || "Dhaka"}, Bangladesh
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5" />
                    Postal Code
                  </div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {address?.postalCode || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Decorator Agency Profile Card & Inline Editor */}
          {userData.role === "decorator" && decoratorData && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-purple-200/80 dark:border-purple-900/40 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-2xl border border-purple-100 dark:border-purple-900/50">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {decoratorData.businessName}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {decoratorData.tagline || "Registered Decoration Agency"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    ★ {decoratorData.metrics?.rating || "5.0"} Rating
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {decoratorData.metrics?.completedEvents || 0} Events
                  </span>

                  {/* Toggle Agency Edit Button */}
                  <button
                    onClick={() => setIsEditingDecorator(!isEditingDecorator)}
                    className="p-2 rounded-xl text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-colors cursor-pointer"
                    title="Edit Agency Profile"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {isEditingDecorator ? (
                /* Agency Edit Form (PATCH /decorators/:id) */
                <form
                  onSubmit={handleUpdateDecoratorProfile}
                  className="space-y-4 pt-2 animate-fade-in"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                        Agency Business Name *
                      </label>
                      <input
                        type="text"
                        name="businessName"
                        required
                        value={decoratorForm.businessName}
                        onChange={handleDecoratorInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                        Tagline / Motto
                      </label>
                      <input
                        type="text"
                        name="tagline"
                        value={decoratorForm.tagline}
                        onChange={handleDecoratorInputChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                      About Your Agency
                    </label>
                    <textarea
                      name="about"
                      rows={3}
                      value={decoratorForm.about}
                      onChange={handleDecoratorInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Contact Phone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={decoratorForm.phone}
                        onChange={handleDecoratorInputChange}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Agency Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={decoratorForm.email}
                        onChange={handleDecoratorInputChange}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Website
                      </label>
                      <input
                        type="text"
                        name="website"
                        value={decoratorForm.website}
                        onChange={handleDecoratorInputChange}
                        placeholder="https://..."
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
                      Operational Service Areas
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {topCitiesInBD.map((c) => {
                        const isSelected = decoratorForm.serviceAreas.includes(c);
                        return (
                          <button
                            key={c}
                            type="button"
                            onClick={() => handleToggleServiceArea(c)}
                            className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                              isSelected
                                ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                            {c}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsEditingDecorator(false)}
                      className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingDecorator}
                      className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold shadow-md shadow-purple-500/25 disabled:opacity-50 cursor-pointer"
                    >
                      {savingDecorator
                        ? "Saving..."
                        : "Save Agency Profile"}
                    </button>
                  </div>
                </form>
              ) : (
                /* Agency View Mode */
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      About Agency
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {decoratorData.about || "No description provided."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[11px] font-bold text-slate-400 uppercase">
                        Phone
                      </p>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                        {decoratorData.contactInfo?.phone || "N/A"}
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[11px] font-bold text-slate-400 uppercase">
                        Email
                      </p>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                        {decoratorData.contactInfo?.email || "N/A"}
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[11px] font-bold text-slate-400 uppercase">
                        Website
                      </p>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5 truncate">
                        {decoratorData.contactInfo?.website || "N/A"}
                      </p>
                    </div>
                  </div>

                  {decoratorData.serviceAreas?.length > 0 && (
                    <div className="pt-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Operational Coverage Areas
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {decoratorData.serviceAreas.map((area, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
