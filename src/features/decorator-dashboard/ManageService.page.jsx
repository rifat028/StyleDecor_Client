import React, { useEffect, useState, useCallback, useMemo } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Layers, Plus, RefreshCw } from "lucide-react";
import ManageServiceToolbar from "../../components/pages/Decorator/ManageService/ManageServiceToolbar";
import ManageServiceTable from "../../components/pages/Decorator/ManageService/ManageServiceTable";
import {
  ManageServiceViewModal,
  ManageServiceFormModal,
} from "../../components/pages/Decorator/ManageService/ManageServiceModals";

const CATEGORIES = [
  "Wedding & Pre-Wedding",
  "Birthday & Milestone",
  "Corporate & Commercial",
  "Home & Rooftop Gatherings",
  "Cultural & Religious Festivals",
  "Lighting & Special FX",
];

// Main Decorator Service Packages Management Page
const ManageService = () => {
  const axiosSecure = useAxiosSecure();

  // Decorator Agency Profile State
  const [myDecorator, setMyDecorator] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Services State
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters and Pagination State
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Modal State
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
    inclusionsText:
      "Complete structural framing & floral setup\nAmbient spotlighting fixtures & wiring\nDelivery, on-site setup, and teardown",
    exclusionsText: "Venue generator fuel\nAdditional sound equipment",
    packageTiers: [
      {
        tier: "Standard Setup",
        price: "",
        featuresText: "Standard floral backdrop, Warm ambient lights",
      },
      {
        tier: "Premium Grand",
        price: "",
        featuresText:
          "Grand 3D floral backdrop, Moving head lighting, Royal seating",
      },
    ],
    status: "active",
  });

  // Fetch current decorator agency profile
  const fetchProfile = useCallback(async () => {
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
  }, [axiosSecure]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Load all service packages for the logged-in decorator
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
      toast.error("Failed to load agency services");
      setServices([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [axiosSecure, myDecorator]);

  useEffect(() => {
    loadMyServices();
  }, [loadMyServices]);

  // Filter and Sort Services List
  const filteredServices = useMemo(() => {
    return services
      .filter((srv) => {
        if (statusFilter !== "all" && srv.status !== statusFilter) return false;
        if (selectedCategory !== "all") {
          const cat =
            typeof srv.category === "string" ? srv.category : srv.category?.name;
          if (cat !== selectedCategory) return false;
        }
        if (searchText.trim()) {
          const q = searchText.toLowerCase();
          const title = (srv.title || srv.serviceName || "").toLowerCase();
          const desc = (
            srv.shortDescription ||
            srv.description ||
            ""
          ).toLowerCase();
          if (!title.includes(q) && !desc.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "rating") {
          return (b.metrics?.rating || 0) - (a.metrics?.rating || 0);
        }
        if (sortBy === "price_asc") {
          const priceA =
            a.pricing?.discountedPrice || a.pricing?.basePrice || a.cost || 0;
          const priceB =
            b.pricing?.discountedPrice || b.pricing?.basePrice || b.cost || 0;
          return priceA - priceB;
        }
        if (sortBy === "price_desc") {
          const priceA =
            a.pricing?.discountedPrice || a.pricing?.basePrice || a.cost || 0;
          const priceB =
            b.pricing?.discountedPrice || b.pricing?.basePrice || b.cost || 0;
          return priceB - priceA;
        }
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [services, statusFilter, selectedCategory, searchText, sortBy]);

  // Paginated View Slice
  const totalCount = filteredServices.length;
  const totalPages = Math.ceil(totalCount / limit) || 1;
  const paginatedServices = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredServices.slice(start, start + limit);
  }, [filteredServices, page, limit]);

  // Statistics Summary
  const stats = useMemo(() => {
    const total = services.length;
    const active = services.filter((s) => s.status === "active").length;
    const inactive = services.filter((s) => s.status !== "active").length;
    return { total, active, inactive };
  }, [services]);

  // Reset pagination on filter change
  const handleSearchChange = (val) => {
    setSearchText(val);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchText("");
    setPage(1);
  };

  const handleCategoryChange = (val) => {
    setSelectedCategory(val);
    setPage(1);
  };

  const handleStatusFilterChange = (val) => {
    setStatusFilter(val);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchText("");
    setSelectedCategory("all");
    setStatusFilter("all");
    setSortBy("newest");
    setPage(1);
  };

  // Open Create Modal
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
      inclusionsText:
        "Complete structural framing & floral setup\nAmbient spotlighting fixtures & wiring\nDelivery, on-site setup, and teardown",
      exclusionsText: "Venue generator fuel\nAdditional sound equipment",
      packageTiers: [
        {
          tier: "Standard Setup",
          price: "",
          featuresText: "Standard floral backdrop, Warm ambient lights",
        },
        {
          tier: "Premium Grand",
          price: "",
          featuresText:
            "Grand 3D floral backdrop, Moving head lighting, Royal seating",
        },
      ],
      status: "active",
    });
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (srv) => {
    setEditingService(srv);
    setFormData({
      title: srv.title || srv.serviceName || "",
      category:
        typeof srv.category === "string"
          ? srv.category
          : srv.category?.name || CATEGORIES[0],
      subCategoryName: srv.subCategory?.name || "",
      shortDescription: srv.shortDescription || srv.description || "",
      fullDescription: srv.fullDescription || "",
      basePrice: srv.pricing?.basePrice || srv.cost || "",
      discountedPrice:
        srv.pricing?.discountedPrice ||
        srv.pricing?.basePrice ||
        srv.cost ||
        "",
      unit: srv.pricing?.unit || srv.unit || "per_event",
      depositRequiredPercent: srv.pricing?.depositRequiredPercent || "25",
      coverImage: srv.coverImage || srv.images?.[0] || "",
      setupDurationHours: srv.specifications?.setupDurationHours || "6",
      teardownDurationHours: srv.specifications?.teardownDurationHours || "2",
      minimumNoticeDays: srv.specifications?.minimumNoticeDays || "3",
      spaceRequirement:
        srv.specifications?.spaceRequirement ||
        "Minimum 16ft width, 10ft depth",
      isOutdoorSuitable: srv.specifications?.isOutdoorSuitable ?? true,
      inclusionsText: Array.isArray(srv.inclusions)
        ? srv.inclusions.join("\n")
        : "",
      exclusionsText: Array.isArray(srv.exclusions)
        ? srv.exclusions.join("\n")
        : "",
      packageTiers:
        srv.packages?.length > 0
          ? srv.packages.map((p) => ({
              tier: p.tier,
              price: p.price,
              featuresText: Array.isArray(p.features)
                ? p.features.join(", ")
                : "",
            }))
          : [{ tier: "Standard Setup", price: "", featuresText: "" }],
      status: srv.status || "active",
    });
    setIsFormModalOpen(true);
  };

  // Open View Details Preview Modal
  const openViewModal = (srv) => {
    setViewingService(srv);
    setIsViewModalOpen(true);
  };

  // Package Tier Handlers with Immutable Object Update
  const handleAddTier = () => {
    setFormData((prev) => ({
      ...prev,
      packageTiers: [
        ...prev.packageTiers,
        { tier: "VIP Custom", price: "", featuresText: "" },
      ],
    }));
  };

  const handleRemoveTier = (idx) => {
    setFormData((prev) => ({
      ...prev,
      packageTiers: prev.packageTiers.filter((_, i) => i !== idx),
    }));
  };

  const handleTierChange = (idx, field, value) => {
    setFormData((prev) => ({
      ...prev,
      packageTiers: prev.packageTiers.map((t, i) =>
        i === idx ? { ...t, [field]: value } : t
      ),
    }));
  };

  // 1-Click Status Toggle Handler
  const handleToggleStatus = async (srv) => {
    const newStatus = srv.status === "active" ? "inactive" : "active";
    try {
      await axiosSecure.patch(`/services/${srv._id}/status`, {
        status: newStatus,
      });
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

  // Form Submission for Create and Update
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
        Swal.fire(
          "Saved!",
          "Your decoration package has been updated.",
          "success"
        );
      } else {
        await axiosSecure.post("/services", payload);
        Swal.fire(
          "Published!",
          "New decoration package listed on the marketplace!",
          "success"
        );
      }
      setIsFormModalOpen(false);
      loadMyServices();
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Operation failed.",
        "error"
      );
    }
  };

  // Delete Service Package Handler
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

  // Profile Loading State
  if (profileLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3 animate-pulse">
          <div className="w-6 h-6 rounded-full bg-purple-200 dark:bg-purple-900" />
          <span className="text-xs font-semibold text-slate-500">
            Loading agency profile...
          </span>
        </div>
      </div>
    );
  }

  // Missing Decorator Registration Fallback
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
    <div className="space-y-6 animate-fade-in pb-10">
      {/* 1. Top Header Bar: Icon, Title, Subtitle & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-purple-100 dark:bg-purple-950/60 rounded-xl text-purple-600 dark:text-purple-400 shrink-0 shadow-xs">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              My Service Packages
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Create, manage, and price all decoration packages offered by {myDecorator?.businessName || "your agency"}.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap sm:flex-nowrap">
          {/* Refresh Action Button */}
          <button
            type="button"
            onClick={() => {
              setRefreshing(true);
              loadMyServices();
            }}
            disabled={loading || refreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 text-purple-600 dark:text-purple-400 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
            <span>Refresh Data</span>
          </button>

          {/* Primary Create Action Button */}
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-all shadow-md shadow-purple-600/25 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Publish New Package</span>
          </button>
        </div>
      </div>

      {/* 2. Consolidated Toolbar: Stat Cards & Search/Filters */}
      <ManageServiceToolbar
        myDecorator={myDecorator}
        stats={stats}
        statusFilter={statusFilter}
        onSelectStatusFilter={handleStatusFilterChange}
        loadingStats={loading}
        searchText={searchText}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        categoriesList={CATEGORIES}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* 3. Services Data Table with Pagination and Skeletons */}
      <ManageServiceTable
        services={paginatedServices}
        loading={loading}
        onView={openViewModal}
        onEdit={openEditModal}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
        onResetFilters={handleResetFilters}
        onOpenAddModal={openAddModal}
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
      />

      {/* 4. View Service Preview Modal */}
      <ManageServiceViewModal
        viewingService={viewingService}
        onClose={() => setIsViewModalOpen(false)}
        onEdit={(srv) => {
          setIsViewModalOpen(false);
          openEditModal(srv);
        }}
        onDelete={handleDelete}
      />

      {/* 5. Create and Edit Service Form Modal */}
      <ManageServiceFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        editingService={editingService}
        formData={formData}
        setFormData={setFormData}
        categoriesList={CATEGORIES}
        onSubmit={handleSubmitForm}
        onAddTier={handleAddTier}
        onRemoveTier={handleRemoveTier}
        onTierChange={handleTierChange}
      />
    </div>
  );
};

export default ManageService;
