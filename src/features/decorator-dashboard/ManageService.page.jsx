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

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category: CATEGORIES[0],
    shortDescription: "",
    fullDescription: "",
    basePrice: "",
    discountedPrice: "",
    unit: "per_event",
    depositRequiredPercent: "25",
    coverImage: "",
    status: "active",
  });

  // Load Services
  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      if (searchText.trim()) params.append("search", searchText.trim());

      const res = await axiosSecure.get(`/services?${params.toString()}`);
      const list = res.data?.data || res.data || [];
      setServices(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to load services:", err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure, selectedCategory, searchText]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const openAddModal = () => {
    setEditingService(null);
    setFormData({
      title: "",
      category: CATEGORIES[0],
      shortDescription: "",
      fullDescription: "",
      basePrice: "",
      discountedPrice: "",
      unit: "per_event",
      depositRequiredPercent: "25",
      coverImage: "",
      status: "active",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (srv) => {
    setEditingService(srv);
    setFormData({
      title: srv.title || srv.serviceName || "",
      category: typeof srv.category === "string" ? srv.category : (srv.category?.name || CATEGORIES[0]),
      shortDescription: srv.shortDescription || srv.description || "",
      fullDescription: srv.fullDescription || "",
      basePrice: srv.pricing?.basePrice || srv.cost || "",
      discountedPrice: srv.pricing?.discountedPrice || srv.pricing?.basePrice || srv.cost || "",
      unit: srv.pricing?.unit || srv.unit || "per_event",
      depositRequiredPercent: srv.pricing?.depositRequiredPercent || "25",
      coverImage: srv.coverImage || srv.images?.[0] || "",
      status: srv.status || "active",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: formData.title.trim(),
      category: formData.category,
      shortDescription: formData.shortDescription.trim(),
      fullDescription: formData.fullDescription.trim(),
      pricing: {
        basePrice: Number(formData.basePrice),
        discountedPrice: Number(formData.discountedPrice || formData.basePrice),
        unit: formData.unit,
        depositRequiredPercent: Number(formData.depositRequiredPercent),
      },
      coverImage:
        formData.coverImage.trim() ||
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
      images: [
        formData.coverImage.trim() ||
          "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
      ],
      status: formData.status,
    };

    try {
      if (editingService) {
        await axiosSecure.patch(`/services/${editingService._id}`, payload);
        Swal.fire("Updated!", "Decoration package updated successfully.", "success");
      } else {
        await axiosSecure.post("/services", payload);
        Swal.fire("Published!", "New decoration package added successfully.", "success");
      }
      closeModal();
      loadServices();
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Operation failed.",
        "error"
      );
    }
  };

  // Delete Handler
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete this package?",
      text: "This action will remove the package from the live catalog.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.delete(`/services/${id}`);
      setServices((prev) => prev.filter((s) => s._id !== id));
      Swal.fire("Deleted!", "Package removed from catalog.", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete package.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 animate-fade-in space-y-8">
      {/* Top Banner & Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            Manage Decoration Packages
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Create, edit, and organize all active service listings across your portfolio.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Package
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search packages by title or keyword..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 shrink-0">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Packages Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 flex items-center justify-center">
            <Spinner />
          </div>
        ) : services.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Layers className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No Packages Found
            </h3>
            <p className="text-xs text-slate-500">
              Click "Add New Package" above to publish your first service listing.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
                  <th className="py-4 px-5">Package</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Pricing</th>
                  <th className="py-4 px-4">Deposit</th>
                  <th className="py-4 px-4">Rating</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {services.map((srv) => {
                  const title = srv.title || srv.serviceName || "Package";
                  const cat = typeof srv.category === "string" ? srv.category : (srv.category?.name || "Decor");
                  const price = srv.pricing?.discountedPrice || srv.pricing?.basePrice || srv.cost || 20000;
                  const cover = srv.coverImage || srv.images?.[0] || "https://images.unsplash.com/photo-1519741497674-611481863552?w=200";
                  const deposit = srv.pricing?.depositRequiredPercent || 25;
                  const rating = srv.metrics?.rating || srv.rating || 5.0;
                  const isActive = srv.status === "active";

                  return (
                    <tr
                      key={srv._id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={cover}
                            alt={title}
                            className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                          />
                          <div className="space-y-0.5">
                            <p className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1 max-w-xs">
                              {title}
                            </p>
                            <span className="text-[11px] text-slate-400">
                              {srv.packages?.length || 0} Package Tiers
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900/50">
                          {cat}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-purple-600 dark:text-purple-400 text-sm">
                        ৳{Number(price).toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                        {deposit}%
                      </td>

                      <td className="py-3.5 px-4 font-bold text-amber-500">
                        ★ {Number(rating).toFixed(1)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            isActive
                              ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300"
                              : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          {srv.status || "active"}
                        </span>
                      </td>

                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(srv)}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-200 hover:text-purple-600 cursor-pointer"
                            title="Edit Package"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(srv._id)}
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

      {/* Modal: Add/Edit Package */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <h3 className="text-lg font-bold">
                {editingService ? "Edit Decoration Package" : "Add New Decoration Package"}
              </h3>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Title */}
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

              {/* Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    Listing Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 cursor-pointer"
                  >
                    <option value="active">Active (Visible in Catalog)</option>
                    <option value="inactive">Inactive (Draft)</option>
                  </select>
                </div>
              </div>

              {/* Pricing Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    Advance Deposit (%)
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

              {/* Cover Image URL */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Cover Photo URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>

              {/* Short Description */}
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

              {/* Full Description */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Full Details & Specifications
                </label>
                <textarea
                  rows={4}
                  placeholder="Comprehensive description of inclusions, floral quality, structural details..."
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
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
