import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { AuthContext } from "../auth/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Spinner from "../home/components/Spinner";
import Swal from "sweetalert2";
import {
  Calendar,
  Clock,
  MapPin,
  Building,
  User,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ChevronLeft,
  Sparkles,
  Layers,
  FileText,
  DollarSign,
  Info,
  Check,
  Award,
} from "lucide-react";

const ServiceBooking = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const initialPkgIdx = parseInt(searchParams.get("pkg") || "0", 10);

  // Data States
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedPackageIndex, setSelectedPackageIndex] = useState(
    isNaN(initialPkgIdx) ? 0 : initialPkgIdx
  );

  // Form State
  const [formData, setFormData] = useState({
    eventDate: "",
    startTime: "16:00",
    endTime: "22:00",
    venueName: "",
    venueAddress: "",
    guestCountEstimate: 100,
    contact: "",
    altContact: "",
    specialInstructions: "",
    colorTheme: "",
  });

  const [formErrors, setFormErrors] = useState({});

  // Minimum allowable date (today + minNoticeDays)
  const minNoticeDays = service?.specifications?.minimumNoticeDays || 2;
  const minSelectableDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + minNoticeDays);
    return d.toISOString().split("T")[0];
  }, [minNoticeDays]);

  // Load Service and Decorator Info
  useEffect(() => {
    const loadService = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(`/services/${id}`);
        const data = res.data?.data || res.data;
        setService(data);

        // Pre-fill user contact if available
        if (user?.phoneNumber) {
          setFormData((prev) => ({ ...prev, contact: user.phoneNumber }));
        }
      } catch (err) {
        console.error("Failed to load service details:", err);
        Swal.fire("Error", "Could not load service details. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadService();
    }
  }, [axiosSecure, id, user?.phoneNumber]);

  // Calculate pricing breakdown
  const pricingCalculations = useMemo(() => {
    if (!service) return { unitPrice: 0, subtotal: 0, tax: 0, grandTotal: 0, deposit: 0, remaining: 0 };

    const packages = service.packages || [];
    const basePrice = service.pricing?.discountedPrice || service.pricing?.basePrice || service.cost || 25000;
    const currentPkg = packages[selectedPackageIndex];
    const unitPrice = currentPkg?.price ? Number(currentPkg.price) : Number(basePrice);
    const subtotal = unitPrice;
    const tax = Math.round(subtotal * 0.05); // 5% platform service tax
    const grandTotal = subtotal + tax;
    const depositPercent = service.pricing?.depositRequiredPercent || 25;
    const deposit = Math.round((grandTotal * depositPercent) / 100);
    const remaining = grandTotal - deposit;

    return {
      packageName: currentPkg?.tier || "Standard Setup",
      unitPrice,
      subtotal,
      tax,
      grandTotal,
      depositPercent,
      deposit,
      remaining,
    };
  }, [service, selectedPackageIndex]);

  // Form Field Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Form Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.eventDate) {
      errors.eventDate = "Please choose an event date";
    } else if (formData.eventDate < minSelectableDate) {
      errors.eventDate = `This service requires at least ${minNoticeDays} days advance notice.`;
    }

    if (!formData.venueName.trim()) {
      errors.venueName = "Venue name is required";
    }

    if (!formData.venueAddress.trim()) {
      errors.venueAddress = "Venue address is required";
    }

    if (!formData.contact.trim()) {
      errors.contact = "Primary contact number is required";
    } else if (!/^(?:\+88|88)?01[3-9]\d{8}$/.test(formData.contact.trim().replace(/[\s-]/g, ""))) {
      errors.contact = "Please provide a valid Bangladeshi phone number (e.g., 017XXXXXXXX)";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Booking Order
  const handleSubmitBooking = async (e) => {
    e.preventDefault();

    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Authentication Required",
        text: "You must be logged in to book an event decoration service.",
        confirmButtonText: "Log In Now",
      }).then(() => {
        navigate("/login", { state: { from: `/service-booking/${id}` } });
      });
      return;
    }

    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Missing Required Information",
        text: "Please review and complete the highlighted event logistics fields.",
      });
      return;
    }

    const decoratorId = service.decoratorId || service.decorator?._id;
    const subCategoryName =
      typeof service.subCategory === "object"
        ? service.subCategory?.name
        : service.subCategory || service.category;

    const payload = {
      serviceId: service._id,
      decoratorId: decoratorId,
      selectedPackage: pricingCalculations.packageName,
      unitPrice: pricingCalculations.unitPrice,
      eventDate: formData.eventDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      venueName: formData.venueName.trim(),
      venueAddress: formData.venueAddress.trim(),
      guestCountEstimate: Number(formData.guestCountEstimate) || 100,
      contact: formData.contact.trim(),
      specialInstructions: [
        formData.colorTheme ? `Theme / Palette: ${formData.colorTheme}` : "",
        formData.specialInstructions,
        formData.altContact ? `Alt Phone: ${formData.altContact}` : "",
      ]
        .filter(Boolean)
        .join(" | "),
      // Backward compatibility fields
      clientName: user.displayName || "Valued Client",
      clientEmail: user.email,
      serviceName: service.title || service.serviceName,
      serviceCategory:
        typeof service.category === "string" ? service.category : service.category?.name,
      location: formData.venueAddress.trim(),
      totalCost: pricingCalculations.grandTotal,
      unit: 1,
      status: "pending",
      paymentStatus: "unpaid",
    };

    try {
      setSubmitting(true);
      const res = await axiosSecure.post("/bookings", payload);

      if (res.data?.success || res.data?.insertedId) {
        const bookingCode = res.data?.bookingCode || "BK-CONFIRMED";

        await Swal.fire({
          icon: "success",
          title: "Reservation Requested!",
          html: `
            <div class="space-y-3 text-left text-xs p-2">
              <p class="text-slate-600 font-medium">Your event reservation order has been placed successfully.</p>
              <div class="p-3 bg-purple-50 rounded-xl border border-purple-200">
                <span class="text-[10px] uppercase font-bold text-purple-600">Booking Reference</span>
                <p class="text-base font-black text-purple-900">${bookingCode}</p>
              </div>
              <p class="text-slate-500">The decorator agency will review your schedule and assign on-site event specialists.</p>
            </div>
          `,
          confirmButtonText: "View My Bookings",
          confirmButtonColor: "#9333ea",
        });

        navigate("/dashboard/my-bookings");
      } else {
        throw new Error(res.data?.message || "Failed to create booking");
      }
    } catch (err) {
      console.error("Booking submission error:", err);
      Swal.fire({
        icon: "error",
        title: "Order Failed",
        text: err.response?.data?.message || err.message || "Failed to submit booking reservation.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 space-y-4">
        <Spinner />
        <p className="text-xs font-semibold text-slate-500 animate-pulse">
          Loading event reservation details...
        </p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 space-y-4 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
          Service Not Found
        </h2>
        <p className="text-xs text-slate-500 max-w-md">
          The requested decoration setup could not be located or may have been temporarily unlisted.
        </p>
        <Link
          to="/services"
          className="px-5 py-2.5 rounded-2xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition-all"
        >
          Explore Other Services
        </Link>
      </div>
    );
  }

  const categoryTitle =
    typeof service.category === "string" ? service.category : service.category?.name || "Event Decor";
  const subCategoryTitle =
    typeof service.subCategory === "object"
      ? service.subCategory?.name
      : service.subCategory || categoryTitle;
  const packagesList = service.packages || [];
  const decorator = service.decorator || null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20 animate-fade-in">
      {/* Top Header Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center justify-between py-2 text-xs">
          <Link
            to={`/services/${id}`}
            className="font-bold text-slate-600 dark:text-slate-400 hover:text-purple-600 flex items-center gap-1.5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Service Details
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold text-[11px] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Secure Event Booking
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 space-y-8">
        {/* Page Title Banner */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 uppercase">
                {categoryTitle}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {subCategoryTitle}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Reserve Event Decoration
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Specify your event schedule, venue address, and logistics notes. Your selected decorator agency will verify availability and assign specialists.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-purple-50 dark:bg-purple-950/30 p-3.5 rounded-2xl border border-purple-200/80 dark:border-purple-900/50 shrink-0">
            <ShieldCheck className="w-8 h-8 text-purple-600 dark:text-purple-400 shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-slate-900 dark:text-slate-100">StyleDecor Guarantee</p>
              <p className="text-[11px] text-slate-500">100% Escrow Protection & On-Time Setup</p>
            </div>
          </div>
        </div>

        {/* Form & Sidebar Grid */}
        <form onSubmit={handleSubmitBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ================= Left Column: Booking Form (8 Cols) ================= */}
          <div className="lg:col-span-8 space-y-8">
            {/* 1. Selected Service & Decorator Summary Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Layers className="w-4 h-4 text-purple-600" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  1. Selected Service & Agency
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img
                  src={
                    service.coverImage ||
                    service.images?.[0] ||
                    "https://images.unsplash.com/photo-1519741497674-611481863552?w=500"
                  }
                  alt={service.title}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                />

                <div className="space-y-1.5 flex-1">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                    {service.title || service.serviceName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {service.shortDescription || service.description}
                  </p>

                  {decorator && (
                    <div className="flex items-center gap-2 pt-1">
                      <Building className="w-3.5 h-3.5 text-purple-600" />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {decorator.businessName || "Verified Agency"}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold">
                        {decorator.contactInfo?.city || "Dhaka"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Package Tiers Selector */}
              {packagesList.length > 0 && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Select Package Variation / Tier:
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {packagesList.map((pkg, idx) => {
                      const isSelected = selectedPackageIndex === idx;
                      return (
                        <div
                          key={idx}
                          onClick={() => setSelectedPackageIndex(idx)}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                            isSelected
                              ? "border-purple-600 bg-purple-50/60 dark:bg-purple-950/40 shadow-xs ring-1 ring-purple-600/30"
                              : "border-slate-200 dark:border-slate-700 hover:border-purple-300 bg-slate-50/50 dark:bg-slate-800/40"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100">
                                {pkg.tier}
                              </span>
                              {isSelected && (
                                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                              {pkg.description || "Complete setup package"}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                            <span className="text-sm font-black text-purple-600 dark:text-purple-400">
                              ৳{Number(pkg.price).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Event Date & Venue Logistics */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Calendar className="w-4 h-4 text-purple-600" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  2. Event Schedule & Venue Logistics
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                {/* Event Date */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Event Date *</span>
                    <span className="text-[10px] text-purple-600 font-semibold">
                      Min. {minNoticeDays} days notice
                    </span>
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    min={minSelectableDate}
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    className={`w-full p-3 rounded-xl border ${
                      formErrors.eventDate
                        ? "border-rose-500 bg-rose-50/30"
                        : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    } font-semibold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 cursor-pointer`}
                  />
                  {formErrors.eventDate && (
                    <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {formErrors.eventDate}
                    </p>
                  )}
                </div>

                {/* Guest Estimate */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Estimated Guest Count
                  </label>
                  <input
                    type="number"
                    name="guestCountEstimate"
                    min="10"
                    max="10000"
                    value={formData.guestCountEstimate}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g. 250"
                  />
                </div>

                {/* Start Time */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Event Start Time *
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  />
                </div>

                {/* End Time */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Event End Time *
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  />
                </div>

                {/* Venue Name */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Venue / Convention Hall Name *
                  </label>
                  <input
                    type="text"
                    name="venueName"
                    value={formData.venueName}
                    onChange={handleInputChange}
                    className={`w-full p-3 rounded-xl border ${
                      formErrors.venueName
                        ? "border-rose-500 bg-rose-50/30"
                        : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    } font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500`}
                    placeholder="e.g. Sena Kunja Grand Ballroom / Home Rooftop"
                  />
                  {formErrors.venueName && (
                    <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {formErrors.venueName}
                    </p>
                  )}
                </div>

                {/* Venue Address */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Full Venue Street Address & Landmark *
                  </label>
                  <input
                    type="text"
                    name="venueAddress"
                    value={formData.venueAddress}
                    onChange={handleInputChange}
                    className={`w-full p-3 rounded-xl border ${
                      formErrors.venueAddress
                        ? "border-rose-500 bg-rose-50/30"
                        : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    } font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500`}
                    placeholder="e.g. Dhaka Cantonment, Next to VIP Gate, Dhaka"
                  />
                  {formErrors.venueAddress && (
                    <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {formErrors.venueAddress}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Customer Contact & Custom Theme Preferences */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <User className="w-4 h-4 text-purple-600" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  3. Contact Info & Special Theme Requests
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                {/* Client Name */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Client Full Name
                  </label>
                  <input
                    type="text"
                    disabled
                    value={user?.displayName || "Valued Client"}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 font-semibold text-slate-600 dark:text-slate-400 cursor-not-allowed"
                  />
                </div>

                {/* Client Email */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Account Email
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ""}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 font-semibold text-slate-600 dark:text-slate-400 cursor-not-allowed"
                  />
                </div>

                {/* Primary Phone */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Primary Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className={`w-full p-3 rounded-xl border ${
                      formErrors.contact
                        ? "border-rose-500 bg-rose-50/30"
                        : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    } font-semibold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500`}
                    placeholder="e.g. 017XXXXXXXX"
                  />
                  {formErrors.contact && (
                    <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {formErrors.contact}
                    </p>
                  )}
                </div>

                {/* Emergency Phone */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Emergency / Alternative Phone
                  </label>
                  <input
                    type="tel"
                    name="altContact"
                    value={formData.altContact}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500"
                    placeholder="Optional backup phone"
                  />
                </div>

                {/* Color Theme Preference */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Theme / Color Palette Preference
                  </label>
                  <input
                    type="text"
                    name="colorTheme"
                    value={formData.colorTheme}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g. Lavender & Champagne Gold / Traditional Marigold Yellow"
                  />
                </div>

                {/* Special Notes */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Special Instructions / Stage Access Notes
                  </label>
                  <textarea
                    name="specialInstructions"
                    rows="3"
                    value={formData.specialInstructions}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500"
                    placeholder="Any specific entry timing, low-fog cues, freight elevator access, or custom neon signage requirements..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ================= Right Column: Sticky Pricing & Checkout (4 Cols) ================= */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6 sticky top-24">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  Order Summary
                </h3>
                <p className="text-xs text-slate-400">
                  Selected Package: <span className="font-bold text-purple-600">{pricingCalculations.packageName}</span>
                </p>
              </div>

              {/* Price Calculation Lines */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Package Base Price</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    ৳{pricingCalculations.subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    Platform Service Tax (5%)
                    <Info className="w-3 h-3 text-slate-400" />
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    ৳{pricingCalculations.tax.toLocaleString()}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm">
                  <span className="font-extrabold text-slate-900 dark:text-slate-100">
                    Grand Total
                  </span>
                  <span className="font-black text-xl text-purple-600 dark:text-purple-400">
                    ৳{pricingCalculations.grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Deposit Schedule Breakdown */}
              <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/50 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-purple-900 dark:text-purple-200">
                    Advance Deposit ({pricingCalculations.depositPercent}%)
                  </span>
                  <span className="text-purple-700 dark:text-purple-300 font-extrabold">
                    ৳{pricingCalculations.deposit.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Remaining Balance Due:</span>
                  <span>৳{pricingCalculations.remaining.toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-slate-400 pt-1">
                  * Deposit payable after agency review and confirmation.
                </p>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Spinner /> Placing Reservation...
                  </>
                ) : (
                  <>
                    Confirm & Reserve Setup <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Security & Support Guarantee */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Secure Escrow Protection Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Verified On-Site Agency Specialists</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Free Rescheduling up to 48 Hours Before</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceBooking;
