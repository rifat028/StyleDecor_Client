import React, { useEffect, useState, useCallback } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import Spinner from "../home/components/Spinner";
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  Search,
  CheckCircle2,
  XCircle,
  Star,
  Tag,
  ArrowRight,
  X,
  Sparkles,
  Eye,
  Building,
  MapPin,
  Clock,
  Calendar,
  Check,
  ShieldCheck,
  Package,
} from "lucide-react";

const CATEGORIES = [
  "Wedding & Pre-Wedding",
  "Birthday & Milestone",
  "Corporate & Commercial",
  "Home & Rooftop Gatherings",
  "Cultural & Religious Festivals",
  "Lighting & Special FX",
];

const ManageService = () => {
  const axiosSecure = useAxiosSecure();

  // Decorator Agency Profile State
  const [myDecorator, setMyDecorator] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Services State
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [viewingService, setViewingService] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: CATEGORIES[0],
    subCategoryName: "",
    shortDescription: "",
    fullDescription: "",
    basePrice: "",
    discountedPrice: "",
    unit: "per_event",
    depositRequiredPercent: "25",
    coverImage: "",
    setupDurationHours: "6",
    teardownDurationHours: "2",
    minimumNoticeDays: "3",
    spaceRequirement: "Minimum 16ft width, 10ft depth",
    isOutdoorSuitable: true,
    inclusionsText: "Complete structural framing & floral setup\nAmbient spotlighting fixtures & wiring\nDelivery, on-site setup, and teardown",
    exclusionsText: "Venue generator fuel\nAdditional sound equipment",
    packageTiers: [
      { tier: "Standard Setup", price: "", featuresText: "Standard floral backdrop, Warm ambient lights" },
      { tier: "Premium Grand", price: "", featuresText: "Grand 3D floral backdrop, Moving head lighting, Royal seating" },
    ],
    status: "active",
  });

  // 1. Fetch Current Logged-in Decorator Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setProfileLoading(true);
        const res = await axiosSecure.get("/decorators/me");
        if (res.data?.success && res.data?.data) {
          setMyDecorator(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load decorator agency profile:", err);
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, [axiosSecure]);

  // 2. Load Services Belonging to this Decorator
  const loadMyServices = useCallback(async () => {
    if (!myDecorator?._id) return;
    try {
      setLoading(true);
      const res = await axiosSecure.get(
        `/services/decorator/${myDecorator._id}?status=all`
      );
      const list = res.data?.data || res.data || [];
      setServices(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to load agency services:", err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure, myDecorator]);

  useEffect(() => {
    loadMyServices();
  }, [loadMyServices]);

  // Filter & Sort Logic
  const filteredServices = services
    .filter((srv) => {
      if (statusFilter !== "all" && srv.status !== statusFilter) return false;
      if (selectedCategory !== "all") {
        const cat = typeof srv.category === "string" ? srv.category : srv.category?.name;
        if (cat !== selectedCategory) return false;
      }
      if (searchText.trim()) {
        const q = searchText.toLowerCase();
        const title = (srv.title || srv.serviceName || "").toLowerCase();
        const desc = (srv.shortDescription || srv.description || "").toLowerCase();
        if (!title.includes(q) && !desc.includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "rating") {
        return (b.metrics?.rating || 0) - (a.metrics?.rating || 0);
      }
      if (sortBy === "price_asc") {
        const priceA = a.pricing?.discountedPrice || a.pricing?.basePrice || a.cost || 0;
        const priceB = b.pricing?.discountedPrice || b.pricing?.basePrice || b.cost || 0;
        return priceA - priceB;
      }
      if (sortBy === "price_desc") {
        const priceA = a.pricing?.discountedPrice || a.pricing?.basePrice || a.cost || 0;
        const priceB = b.pricing?.discountedPrice || b.pricing?.basePrice || b.cost || 0;
        return priceB - priceA;
      }
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  // Counters
  const totalCount = services.length;
  const activeCount = services.filter((s) => s.status === "active").length;
  const inactiveCount = services.filter((s) => s.status !== "active").length;

  // Modal Open Handlers
  const openAddModal = () => {
    setEditingService(null);
    setFormData({
      title: "",
      category: CATEGORIES[0],
      subCategoryName: "",
      shortDescription: "",
      fullDescription: "",
      basePrice: "",
      discountedPrice: "",
      unit: "per_event",
      depositRequiredPercent: "25",
      coverImage: "",
      setupDurationHours: "6",
      teardownDurationHours: "2",
      minimumNoticeDays: "3",
      spaceRequirement: "Minimum 16ft width, 10ft depth",
      isOutdoorSuitable: true,
      inclusionsText: "Complete structural framing & floral setup\nAmbient spotlighting fixtures & wiring\nDelivery, on-site setup, and teardown",
      exclusionsText: "Venue generator fuel\nAdditional sound equipment",
      packageTiers: [
        { tier: "Standard Setup", price: "", featuresText: "Standard floral backdrop, Warm ambient lights" },
        { tier: "Premium Grand", price: "", featuresText: "Grand 3D floral backdrop, Moving head lighting, Royal seating" },
      ],
      status: "active",
    });
    setIsFormModalOpen(true);
  };

  const openEditModal = (srv) => {
    setEditingService(srv);
    setFormData({
      title: srv.title || srv.serviceName || "",
      category: typeof srv.category === "string" ? srv.category : (srv.category?.name || CATEGORIES[0]),
      subCategoryName: srv.subCategory?.name || "",
      shortDescription: srv.shortDescription || srv.description || "",
      fullDescription: srv.fullDescription || "",
      basePrice: srv.pricing?.basePrice || srv.cost || "",
      discountedPrice: srv.pricing?.discountedPrice || srv.pricing?.basePrice || srv.cost || "",
      unit: srv.pricing?.unit || srv.unit || "per_event",
      depositRequiredPercent: srv.pricing?.depositRequiredPercent || "25",
      coverImage: srv.coverImage || srv.images?.[0] || "",
      setupDurationHours: srv.specifications?.setupDurationHours || "6",
      teardownDurationHours: srv.specifications?.teardownDurationHours || "2",
      minimumNoticeDays: srv.specifications?.minimumNoticeDays || "3",
      spaceRequirement: srv.specifications?.spaceRequirement || "Minimum 16ft width, 10ft depth",
      isOutdoorSuitable: srv.specifications?.isOutdoorSuitable ?? true,
      inclusionsText: Array.isArray(srv.inclusions) ? srv.inclusions.join("\n") : "",
      exclusionsText: Array.isArray(srv.exclusions) ? srv.exclusions.join("\n") : "",
      packageTiers:
        srv.packages?.length > 0
          ? srv.packages.map((p) => ({
              tier: p.tier,
              price: p.price,
              featuresText: Array.isArray(p.features) ? p.features.join(", ") : "",
            }))
          : [{ tier: "Standard Setup", price: "", featuresText: "" }],
      status: srv.status || "active",
    });
    setIsFormModalOpen(true);
  };

  const openViewModal = (srv) => {
    setViewingService(srv);
    setIsViewModalOpen(true);
  };

  // Add/Remove Package Tier inside Form
  const handleAddTier = () => {
    setFormData((prev) => ({
      ...prev,
      packageTiers: [...prev.packageTiers, { tier: "VIP Custom", price: "", featuresText: "" }],
    }));
  };

  const handleRemoveTier = (idx) => {
    setFormData((prev) => ({
      ...prev,
      packageTiers: prev.packageTiers.filter((_, i) => i !== idx),
    }));
  };

  const handleTierChange = (idx, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.packageTiers];
      updated[idx][field] = value;
      return { ...prev, packageTiers: updated };
    });
  };

  // 1-Click Status Toggle
  const handleToggleStatus = async (srv) => {
    const newStatus = srv.status === "active" ? "inactive" : "active";
    try {
      await axiosSecure.patch(`/services/${srv._id}/status`, { status: newStatus });
      Swal.fire({
        icon: "success",
        title: newStatus === "active" ? "Package Activated" : "Package Paused",
        text: `"${srv.title || srv.serviceName}" is now ${newStatus}.`,
        timer: 1500,
        showConfirmButton: false,
      });
      loadMyServices();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update package status.", "error");
    }
  };

  // Submit Handler (Create or Update)
  const handleSubmitForm = async (e) => {
    e.preventDefault();

    const inclusions = formData.inclusionsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const exclusions = formData.exclusionsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const packages = formData.packageTiers
      .filter((p) => p.tier.trim() && p.price)
      .map((p) => ({
        tier: p.tier.trim(),
        price: Number(p.price),
        features: p.featuresText
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
      }));

    const payload = {
      title: formData.title.trim(),
      category: formData.category,
      subCategory: {
        name: formData.subCategoryName.trim() || formData.category,
      },
      shortDescription: formData.shortDescription.trim(),
      fullDescription: formData.fullDescription.trim(),
      pricing: {
        basePrice: Number(formData.basePrice),
        discountedPrice: Number(formData.discountedPrice || formData.basePrice),
        unit: formData.unit,
        depositRequiredPercent: Number(formData.depositRequiredPercent),
      },
      packages: packages,
      coverImage:
        formData.coverImage.trim() ||
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
      images: [
        formData.coverImage.trim() ||
          "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
      ],
      specifications: {
        setupDurationHours: Number(formData.setupDurationHours) || 6,
        teardownDurationHours: Number(formData.teardownDurationHours) || 2,
        minimumNoticeDays: Number(formData.minimumNoticeDays) || 3,
        spaceRequirement: formData.spaceRequirement.trim(),
        isOutdoorSuitable: Boolean(formData.isOutdoorSuitable),
      },
      inclusions,
      exclusions,
      status: formData.status,
    };

    try {
      if (editingService) {
        await axiosSecure.patch(`/services/${editingService._id}`, payload);
        Swal.fire("Saved!", "Your decoration package has been updated.", "success");
      } else {
        await axiosSecure.post("/services", payload);
        Swal.fire("Published!", "New decoration package listed on the marketplace!", "success");
      }
      setIsFormModalOpen(false);
      loadMyServices();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.response?.data?.message || "Operation failed.", "error");
    }
  };

  // Delete Handler
  const handleDelete = async (srv) => {
    const confirm = await Swal.fire({
      title: "Delete this package?",
      text: `Are you sure you want to remove "${srv.title || srv.serviceName}"? Existing customer bookings will not be affected.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.delete(`/services/${srv._id}`);
      Swal.fire("Deleted!", "Package removed from your portfolio.", "success");
      loadMyServices();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete package.", "error");
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!myDecorator) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <Layers className="w-16 h-16 text-slate-300 dark:text-slate-700" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
          Agency Profile Required
        </h2>
        <p className="text-xs text-slate-500 max-w-md">
          Please complete your decorator agency registration before publishing decoration service packages.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 animate-fade-in space-y-8">
      {/* ================= Header Banner ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Building className="w-3.5 h-3.5" /> {myDecorator.businessName} Portfolio
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            My Service Packages
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Create, manage, and price all decoration packages offered by your agency to clients across Bangladesh.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/25 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Publish New Package
        </button>
      </div>

      {/* ================= Live Statistics Counters ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Total Packages
          </span>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {totalCount}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Active Packages
          </span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {activeCount}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Paused / Drafts
          </span>
          <p className="text-2xl font-black text-slate-600 dark:text-slate-400">
            {inactiveCount}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
            Agency Rating
          </span>
          <p className="text-2xl font-black text-amber-500 flex items-center gap-1">
            ★ {myDecorator.metrics?.rating || "5.0"}
          </p>
        </div>
      </div>

      {/* ================= Filter Controls & Search ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search your packages by title or keyword..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 cursor-pointer"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Paused Only</option>
          </select>

          {/* Sort Filter */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 cursor-pointer"
          >
            <option value="newest">Newest</option>
            <option value="rating">Top Rated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* ================= Services Table ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-20 flex items-center justify-center">
            <Spinner />
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Layers className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No Packages Found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't listed any packages matching this filter. Click "Publish New Package" to create one.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
                  <th className="py-4 px-5">Package</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Starting Price</th>
                  <th className="py-4 px-4">Deposit</th>
                  <th className="py-4 px-4">Tiers</th>
                  <th className="py-4 px-4">Rating</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredServices.map((srv) => {
                  const title = srv.title || srv.serviceName || "Package";
                  const cover = srv.coverImage || srv.images?.[0] || "https://images.unsplash.com/photo-1519741497674-611481863552?w=200";
                  const cat = typeof srv.category === "string" ? srv.category : (srv.category?.name || "Decoration");
                  const price = srv.pricing?.discountedPrice || srv.pricing?.basePrice || srv.cost || 20000;
                  const deposit = srv.pricing?.depositRequiredPercent || 25;
                  const rating = srv.metrics?.rating || srv.rating || 5.0;
                  const isActive = srv.status === "active";

                  return (
                    <tr
                      key={srv._id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Package Title & Cover */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={cover}
                            alt={title}
                            className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0 shadow-xs"
                          />
                          <div className="space-y-0.5 max-w-xs">
                            <p className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                              {title}
                            </p>
                            <span className="text-[11px] text-slate-400 line-clamp-1">
                              {srv.shortDescription || "Event setup package"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900/50 whitespace-nowrap">
                          {cat}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-black text-purple-600 dark:text-purple-400 text-sm whitespace-nowrap">
                        ৳{Number(price).toLocaleString()}
                      </td>

                      {/* Deposit */}
                      <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                        {deposit}%
                      </td>

                      {/* Tiers */}
                      <td className="py-3.5 px-4 font-semibold text-slate-600 dark:text-slate-400">
                        {srv.packages?.length || 1} Variation{srv.packages?.length > 1 ? "s" : ""}
                      </td>

                      {/* Rating */}
                      <td className="py-3.5 px-4 font-bold text-amber-500 whitespace-nowrap">
                        ★ {Number(rating).toFixed(1)}
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleStatus(srv)}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold uppercase transition-all cursor-pointer ${
                            isActive
                              ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                              : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700"
                          }`}
                          title={`Click to ${isActive ? "pause" : "activate"}`}
                        >
                          {isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {srv.status || "active"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openViewModal(srv)}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
                            title="Preview Package"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openEditModal(srv)}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-purple-600 cursor-pointer"
                            title="Edit Package"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(srv)}
                            className="p-2 rounded-xl border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 cursor-pointer"
                            title="Delete Package"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= View Preview Modal ================= */}
      {isViewModalOpen && viewingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                Preview: {viewingService.title || viewingService.serviceName}
              </h3>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex gap-4 items-start">
                <img
                  src={viewingService.coverImage || viewingService.images?.[0] || "https://images.unsplash.com/photo-1519741497674-611481863552?w=300"}
                  alt={viewingService.title}
                  className="w-28 h-24 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0 shadow-md"
                />
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200">
                    {typeof viewingService.category === "string" ? viewingService.category : viewingService.category?.name}
                  </span>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                    {viewingService.title || viewingService.serviceName}
                  </h4>
                  <p className="text-xs text-purple-600 font-bold">
                    Starting ৳{Number(viewingService.pricing?.discountedPrice || viewingService.pricing?.basePrice || viewingService.cost || 0).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">
                  Description
                </h5>
                <p className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 leading-relaxed">
                  {viewingService.shortDescription || viewingService.description || "No description provided."}
                </p>
              </div>

              {viewingService.packages?.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">
                    Package Variations
                  </h5>
                  <div className="space-y-2">
                    {viewingService.packages.map((pkg, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-between"
                      >
                        <span className="font-bold text-slate-800 dark:text-slate-200">{pkg.tier}</span>
                        <span className="font-black text-purple-600">৳{Number(pkg.price).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= Full Create / Edit Modal ================= */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">
                  {editingService ? "Edit Service Package" : "Publish New Decoration Package"}
                </h3>
                <p className="text-xs text-slate-400">
                  {myDecorator.businessName}
                </p>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Basic Details */}
              <div className="space-y-4">
                <h4 className="font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider text-[11px]">
                  1. General Information
                </h4>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Package Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Wedding Reception Stage Setup"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 cursor-pointer"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      SubCategory Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Wedding Stage"
                      value={formData.subCategoryName}
                      onChange={(e) => setFormData({ ...formData, subCategoryName: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Listing Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 cursor-pointer"
                    >
                      <option value="active">Active (Visible)</option>
                      <option value="inactive">Paused (Draft)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider text-[11px]">
                  2. Pricing & Deposit Terms
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Base Price (৳) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1000"
                      placeholder="45000"
                      value={formData.basePrice}
                      onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Discounted Price (৳)
                    </label>
                    <input
                      type="number"
                      min="1000"
                      placeholder="40000"
                      value={formData.discountedPrice}
                      onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Pricing Unit
                    </label>
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 cursor-pointer"
                    >
                      <option value="per_event">Per Event</option>
                      <option value="per_day">Per Day</option>
                      <option value="per_package">Per Package</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Deposit (%)
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="100"
                      value={formData.depositRequiredPercent}
                      onChange={(e) => setFormData({ ...formData, depositRequiredPercent: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>

                {/* Package Variations Tiers */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Package Variations & Tiers (Optional)
                    </label>
                    <button
                      type="button"
                      onClick={handleAddTier}
                      className="text-purple-600 hover:text-purple-700 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Tier
                    </button>
                  </div>

                  <div className="space-y-2">
                    {formData.packageTiers.map((tier, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                      >
                        <div className="sm:col-span-4">
                          <input
                            type="text"
                            placeholder="Tier Name (e.g. Premium)"
                            value={tier.tier}
                            onChange={(e) => handleTierChange(idx, "tier", e.target.value)}
                            className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <input
                            type="number"
                            placeholder="Price (৳)"
                            value={tier.price}
                            onChange={(e) => handleTierChange(idx, "price", e.target.value)}
                            className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900"
                          />
                        </div>
                        <div className="sm:col-span-4">
                          <input
                            type="text"
                            placeholder="Features (comma separated)"
                            value={tier.featuresText}
                            onChange={(e) => handleTierChange(idx, "featuresText", e.target.value)}
                            className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-[11px]"
                          />
                        </div>
                        <div className="sm:col-span-1 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveTier(idx)}
                            className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                            title="Remove Tier"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Photos & Descriptions */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider text-[11px]">
                  3. Media & Descriptions
                </h4>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Cover Photo Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Short Summary *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Brief 1-2 sentence overview of the setup..."
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Full Description & Design Aesthetics
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Comprehensive description of floral grade, lighting fixtures, fabrics..."
                    value={formData.fullDescription}
                    onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="space-y-1">
                  <label className="font-bold text-emerald-600 dark:text-emerald-400">
                    Inclusions (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.inclusionsText}
                    onChange={(e) => setFormData({ ...formData, inclusionsText: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-[11px]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-rose-600 dark:text-rose-400">
                    Exclusions (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.exclusionsText}
                    onChange={(e) => setFormData({ ...formData, exclusionsText: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-[11px]"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer shadow-md shadow-purple-600/30"
                >
                  {editingService ? "Save Changes" : "Publish Package"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageService;
