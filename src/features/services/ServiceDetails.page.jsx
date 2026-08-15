import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Spinner from "../home/components/Spinner";
import {
  Star,
  CheckCircle2,
  XCircle,
  MapPin,
  ShieldCheck,
  Clock,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  Share2,
  Building,
  Check,
  Info,
  MessageSquare,
  Award,
} from "lucide-react";
import toast from "react-hot-toast";

const ServiceDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackageIndex, setSelectedPackageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState("");

  // Service Reviews State (GET /reviews/service/:serviceId)
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsAggregate, setReviewsAggregate] = useState(5.0);
  const [ratingDistribution, setRatingDistribution] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

  useEffect(() => {
    const loadServiceAndReviews = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(`/services/${id}`);
        const data = res.data?.data || res.data;
        if (data) {
          setService(data);
          const cover = data.coverImage || data.images?.[0] || "";
          setSelectedImage(cover);
        } else {
          setService(null);
        }
      } catch (error) {
        console.error("Failed to load service details", error);
        setService(null);
      } finally {
        setLoading(false);
      }

      // Load Service Reviews
      try {
        setReviewsLoading(true);
        const revRes = await axiosSecure.get(`/reviews/service/${id}`);
        if (revRes.data?.success) {
          setReviews(revRes.data.data || []);
          setReviewsAggregate(revRes.data.aggregateRating || 5.0);
          setRatingDistribution(revRes.data.ratingDistribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
        }
      } catch (revErr) {
        console.warn("Failed to load service reviews:", revErr.message);
      } finally {
        setReviewsLoading(false);
      }
    };

    loadServiceAndReviews();
  }, [axiosSecure, id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: service?.title || "StyleDecor Package",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Package link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <Layers className="w-16 h-16 text-slate-300 dark:text-slate-700" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Service Package Not Found
        </h2>
        <p className="text-sm text-slate-500 max-w-md">
          The decoration package you are looking for does not exist or has been removed.
        </p>
        <Link
          to="/services"
          className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-all"
        >
          Browse All Services
        </Link>
      </div>
    );
  }

  const {
    title = service.serviceName || "Signature Event Decoration Package",
    category = service.serviceCategory || "Wedding & Pre-Wedding",
    subCategory = {},
    shortDescription = service.description || "",
    fullDescription = "",
    pricing = {},
    packages = [],
    images = [],
    coverImage = "",
    specifications = {},
    inclusions = [],
    exclusions = [],
    metrics = {},
    decorator = null,
  } = service;

  const catName = typeof category === "string" ? category : category.name;
  const rating = metrics.rating || service.rating || 5.0;
  const reviewsCount = metrics.reviewCount || service.totalReviews || 24;
  const bookingCount = metrics.bookingCount || 40;
  const basePrice = pricing.basePrice || service.cost || 25000;
  const discountedPrice = pricing.discountedPrice || basePrice;
  const depositPercent = pricing.depositRequiredPercent || 25;

  const currentPackage = packages[selectedPackageIndex] || null;
  const selectedPrice = currentPackage ? currentPackage.price : discountedPrice;
  const depositAmount = Math.round((selectedPrice * depositPercent) / 100);

  const galleryImages = [
    ...(coverImage ? [coverImage] : []),
    ...(Array.isArray(images) ? images : []),
  ].filter((img, idx, arr) => arr.indexOf(img) === idx && img);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20 animate-fade-in">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center justify-between gap-4 py-2 text-xs">
          <Link
            to="/services"
            className="font-bold text-slate-600 dark:text-slate-400 hover:text-purple-600 flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Services
          </Link>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            title="Share Package"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ================= Left Column: Gallery & Details (8 Cols) ================= */}
          <div className="lg:col-span-8 space-y-8">
            {/* Gallery Section */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              {/* Main Photo */}
              <div className="relative h-72 sm:h-96 md:h-[440px] w-full rounded-2xl overflow-hidden bg-slate-900 shadow-md">
                <img
                  src={
                    selectedImage ||
                    coverImage ||
                    galleryImages[0] ||
                    "https://images.unsplash.com/photo-1519741497674-611481863552?w=1000"
                  }
                  alt={title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-black/60 text-white backdrop-blur-md text-xs font-bold">
                  {catName}
                </div>
              </div>

              {/* Thumbnails */}
              {galleryImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {galleryImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(imgUrl)}
                      className={`h-20 w-24 sm:w-28 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        selectedImage === imgUrl
                          ? "border-purple-600 shadow-md scale-105"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Service Header & Summary */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    {catName}
                  </span>
                  {subCategory?.name && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {subCategory.name}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
                  {title}
                </h1>

                {/* Rating & Event Stats */}
                <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{Number(rating).toFixed(1)}</span>
                    <span className="text-slate-400">({reviewsCount} Reviews)</span>
                  </div>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="text-slate-600 dark:text-slate-400 font-medium">
                    {bookingCount}+ Verified Bookings
                  </span>
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  {shortDescription}
                </p>
                {fullDescription && (
                  <p className="whitespace-pre-line text-xs sm:text-sm">
                    {fullDescription}
                  </p>
                )}
              </div>

              {/* Specifications Matrix */}
              {specifications && (
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Execution & Setup Specifications
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Setup Time</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        {specifications.setupDurationHours || 6} Hours
                      </p>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Teardown</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        {specifications.teardownDurationHours || 2} Hours
                      </p>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Min. Notice</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        {specifications.minimumNoticeDays || 3} Days Prior
                      </p>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Outdoor Safe</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        {specifications.isOutdoorSuitable ? "Yes (Weatherproof)" : "Indoor Preferred"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Inclusions & Exclusions */}
              {(inclusions?.length > 0 || exclusions?.length > 0) && (
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {inclusions?.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Package Inclusions
                      </h4>
                      <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                        {inclusions.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {exclusions?.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                        <XCircle className="w-4 h-4" /> Excluded Items
                      </h4>
                      <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                        {exclusions.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-rose-500 font-bold text-xs shrink-0 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Decorator Agency Attribution Card */}
            {decorator && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <img
                    src={decorator.logo || "https://ui-avatars.com/api/?name=Decorator&background=7C3AED&color=ffffff"}
                    alt={decorator.businessName}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-100 dark:ring-purple-900 shadow-md shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                        {decorator.businessName}
                      </h3>
                      {decorator.verification?.isVerified && (
                        <ShieldCheck className="w-4 h-4 text-purple-600" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {decorator.tagline || "Verified Professional Event Decorator"}
                    </p>
                    <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Based in {decorator.contactInfo?.city || "Dhaka"}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/decorators/${decorator._id}`}
                  className="px-5 py-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-600 text-purple-700 dark:text-purple-300 hover:text-white font-bold text-xs border border-purple-200 dark:border-purple-800 transition-all shrink-0 flex items-center gap-1.5"
                >
                  View Agency Profile <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* ================= Verified Service Reviews Section (GET /reviews/service/:serviceId) ================= */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                    <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                    Verified Customer Feedback
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                    Package Reviews & Ratings
                  </h3>
                </div>

                <div className="flex items-center gap-3 bg-purple-50 dark:bg-purple-950/40 p-3 rounded-2xl border border-purple-100 dark:border-purple-900/50">
                  <div className="text-right">
                    <p className="text-2xl font-black text-purple-700 dark:text-purple-300 leading-none">
                      {reviewsAggregate}
                    </p>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                      {reviews.length} verified {reviews.length === 1 ? "review" : "reviews"}
                    </span>
                  </div>
                  <div className="flex items-center text-amber-400">
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              {reviewsLoading ? (
                <div className="py-8 flex justify-center">
                  <Spinner />
                </div>
              ) : reviews.length === 0 ? (
                <div className="py-10 text-center space-y-2 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                    No Customer Reviews for this Package Yet
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Be the first to book and share your celebration experience!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div
                      key={rev._id}
                      className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={rev.customerPhotoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                            alt={rev.customerName}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/20"
                          />
                          <div>
                            <h5 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                              {rev.customerName || "Valued Client"}
                            </h5>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-purple-500" />
                              {new Date(rev.createdAt || Date.now()).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-0.5 text-amber-500 text-xs font-black bg-white dark:bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-200/60 dark:border-slate-700">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{rev.rating}.0</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-700 dark:text-slate-300 italic">
                        "{rev.comment}"
                      </p>

                      {/* Setup Photos if available */}
                      {rev.images && rev.images.length > 0 && (
                        <div className="flex items-center gap-2 pt-1">
                          {rev.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt="Setup thumbnail"
                              className="w-14 h-14 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                            />
                          ))}
                        </div>
                      )}

                      {/* Lead Specialist Attribution */}
                      {rev.agentName && (
                        <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-[10px] text-slate-400">
                          <span className="inline-flex items-center gap-1 font-semibold text-purple-600 dark:text-purple-400">
                            <Award className="w-3 h-3" /> Lead Specialist: {rev.agentName}
                          </span>
                        </div>
                      )}

                      {/* Official Vendor Reply if any */}
                      {rev.vendorReply && rev.vendorReply.reply && (
                        <div className="p-3.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 text-[11px] text-slate-700 dark:text-slate-300 space-y-1">
                          <span className="font-bold text-purple-800 dark:text-purple-300 flex items-center gap-1">
                            <Building className="w-3 h-3" /> Agency Official Response:
                          </span>
                          <p className="italic">"{rev.vendorReply.reply}"</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ================= Right Column: Sticky Booking / Package Selector (4 Cols) ================= */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl sticky top-24 space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Package Tier
                </span>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-black text-purple-600 dark:text-purple-400">
                    ৳{Number(selectedPrice).toLocaleString()}
                  </h3>
                  {basePrice > selectedPrice && (
                    <span className="text-xs text-slate-400 line-through">
                      ৳{Number(basePrice).toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {pricing.unit ? pricing.unit.replace("_", " ") : "per event"} • Guaranteed Escrow Safety
                </p>
              </div>

              {/* Package Tiers Selector */}
              {packages.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Available Variations:
                  </span>
                  <div className="space-y-2">
                    {packages.map((pkg, idx) => {
                      const isSelected = selectedPackageIndex === idx;
                      return (
                        <div
                          key={idx}
                          onClick={() => setSelectedPackageIndex(idx)}
                          className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? "border-purple-600 bg-purple-50/50 dark:bg-purple-950/40 shadow-xs"
                              : "border-slate-200 dark:border-slate-700 hover:border-purple-300"
                          }`}
                        >
                          <div>
                            <p className="font-bold text-xs text-slate-900 dark:text-slate-100">
                              {pkg.tier}
                            </p>
                            <span className="text-[11px] text-slate-500">
                              {pkg.features?.length || 0} features included
                            </span>
                          </div>

                          <span className="font-extrabold text-sm text-purple-600 dark:text-purple-400">
                            ৳{Number(pkg.price).toLocaleString()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Deposit Requirement Note */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 space-y-1 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-700 dark:text-slate-300">
                  <span>Advance Deposit ({depositPercent}%)</span>
                  <span className="text-purple-600 dark:text-purple-400">
                    ৳{depositAmount.toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Remaining ৳{(selectedPrice - depositAmount).toLocaleString()} payable after setup completion.
                </p>
              </div>

              {/* Book Button */}
              <button
                onClick={() => navigate(`/service-booking/${id}?pkg=${selectedPackageIndex}`)}
                className="w-full py-3.5 px-6 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Proceed to Book Event <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <span className="text-[11px] text-slate-400 inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
                  100% Refund Guarantee on Unfulfilled Orders
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
