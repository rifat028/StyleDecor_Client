import React, { useEffect, useState, useCallback, useMemo } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Spinner from "../home/components/Spinner";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  Layers,
  Plus,
  Search,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Tag,
  FolderPlus,
  RefreshCw,
  X,
  ListTree,
} from "lucide-react";

// Helper to generate URL-friendly slugs
const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
};

// Sleek Modern Switch Toggle Component with top label
const SwitchToggle = ({ checked, onChange, label, disabled = false }) => (
  <div className="flex flex-col items-center select-none">
    {label !== false && (
      <span
        className={`text-[10px] font-bold uppercase tracking-wider mb-1 transition-colors ${
          checked
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-slate-400 dark:text-slate-500"
        }`}
      >
        {checked ? "Active" : "Inactive"}
      </span>
    )}
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
        checked
          ? "bg-emerald-500 dark:bg-emerald-600"
          : "bg-slate-300 dark:bg-slate-700"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  </div>
);

const ManageCategories = () => {
  const axiosSecure = useAxiosSecure();

  // Categories list state
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Accordion expansion state: Default is ALL COLLAPSED ({})
  const [expandedCategories, setExpandedCategories] = useState({});

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [subCategoryModalTarget, setSubCategoryModalTarget] = useState(null);
  const [editingSubCategory, setEditingSubCategory] = useState(null);

  // Form State - Create Category
  const [createFormData, setCreateFormData] = useState({
    name: "",
    description: "",
    order: 1,
    status: "active",
    subCategories: [],
  });
  const [tempSubName, setTempSubName] = useState("");
  const [submittingCreate, setSubmittingCreate] = useState(false);

  // Form State - Edit Category (Status field removed from modal)
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    order: 1,
  });
  const [submittingEdit, setSubmittingEdit] = useState(false);

  // Form State - Add Single Subcategory
  const [newSubData, setNewSubData] = useState({
    name: "",
    slug: "",
    status: "active",
    order: 1,
  });
  const [submittingSub, setSubmittingSub] = useState(false);

  // Form State - Edit Subcategory
  const [editSubData, setEditSubData] = useState({
    name: "",
    slug: "",
    order: 1,
  });
  const [submittingEditSub, setSubmittingEditSub] = useState(false);

  // Fetch Categories
  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/categories");
      const data = res.data?.data || res.data || [];
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories:", err);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Toggle Single Category Accordion
  const toggleExpand = (catId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  // Check if all are currently expanded
  const areAllExpanded = useMemo(() => {
    if (categories.length === 0) return false;
    return categories.every((cat) => expandedCategories[cat._id]);
  }, [categories, expandedCategories]);

  // Toggle Expand All / Collapse All
  const handleToggleExpandAll = () => {
    if (areAllExpanded) {
      setExpandedCategories({});
    } else {
      const allExpanded = {};
      categories.forEach((cat) => {
        allExpanded[cat._id] = true;
      });
      setExpandedCategories(allExpanded);
    }
  };

  // Filter Categories
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchesStatus =
        statusFilter === "all" || cat.status === statusFilter;
      const searchLower = search.toLowerCase().trim();
      const matchesSearch =
        !searchLower ||
        cat.name.toLowerCase().includes(searchLower) ||
        cat.description?.toLowerCase().includes(searchLower) ||
        cat.subCategories?.some((sub) =>
          sub.name.toLowerCase().includes(searchLower)
        );
      return matchesStatus && matchesSearch;
    });
  }, [categories, statusFilter, search]);

  // Derived Stats
  const stats = useMemo(() => {
    const totalCategories = categories.length;
    let totalSubCategories = 0;
    let activeCategories = 0;

    categories.forEach((cat) => {
      if (cat.status === "active") activeCategories++;
      if (Array.isArray(cat.subCategories)) {
        totalSubCategories += cat.subCategories.length;
      }
    });

    return {
      totalCategories,
      totalSubCategories,
      activeCategories,
      inactiveCategories: totalCategories - activeCategories,
    };
  }, [categories]);

  // ================= TOGGLE CATEGORY STATUS (PATCH /categories/:id) =================
  const handleToggleCategoryStatus = async (category) => {
    const nextStatus = category.status === "active" ? "inactive" : "active";

    // Optimistic update
    setCategories((prev) =>
      prev.map((c) =>
        c._id === category._id ? { ...c, status: nextStatus } : c
      )
    );

    try {
      await axiosSecure.patch(`/categories/${category._id}`, {
        status: nextStatus,
      });
      toast.success(`"${category.name}" is now ${nextStatus.toUpperCase()}`);
    } catch (err) {
      console.error("Status toggle failed:", err);
      toast.error("Failed to change category status");
      // Rollback
      setCategories((prev) =>
        prev.map((c) =>
          c._id === category._id ? { ...c, status: category.status } : c
        )
      );
    }
  };

  // ================= TOGGLE SUBCATEGORY STATUS (PATCH /categories/:id/subcategories/:subId) =================
  const handleToggleSubCategoryStatus = async (categoryId, subCategory) => {
    const nextStatus = subCategory.status === "active" ? "inactive" : "active";

    // Optimistic update
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat._id === categoryId) {
          const updatedSubs = cat.subCategories.map((sub) =>
            sub.id === subCategory.id ? { ...sub, status: nextStatus } : sub
          );
          return { ...cat, subCategories: updatedSubs };
        }
        return cat;
      })
    );

    try {
      await axiosSecure.patch(
        `/categories/${categoryId}/subcategories/${subCategory.id}`,
        { status: nextStatus }
      );
      toast.success(`"${subCategory.name}" is now ${nextStatus.toUpperCase()}`);
    } catch (err) {
      console.error("Subcategory status toggle failed:", err);
      toast.error("Failed to toggle subcategory status");
      // Rollback
      setCategories((prev) =>
        prev.map((cat) => {
          if (cat._id === categoryId) {
            const rolledSubs = cat.subCategories.map((sub) =>
              sub.id === subCategory.id
                ? { ...sub, status: subCategory.status }
                : sub
            );
            return { ...cat, subCategories: rolledSubs };
          }
          return cat;
        })
      );
    }
  };

  // ================= 1. CREATE CATEGORY (POST /categories) =================
  const handleAddTempSubCategory = () => {
    if (!tempSubName.trim()) return;
    const newSub = {
      id: `sub_temp_${Date.now()}`,
      name: tempSubName.trim(),
      slug: generateSlug(tempSubName),
      status: "active",
      order: createFormData.subCategories.length + 1,
    };
    setCreateFormData((prev) => ({
      ...prev,
      subCategories: [...prev.subCategories, newSub],
    }));
    setTempSubName("");
  };

  const handleRemoveTempSub = (subId) => {
    setCreateFormData((prev) => ({
      ...prev,
      subCategories: prev.subCategories.filter((s) => s.id !== subId),
    }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!createFormData.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    setSubmittingCreate(true);

    try {
      await axiosSecure.post("/categories", createFormData);
      toast.success("Category created successfully!");
      setIsCreateModalOpen(false);
      setCreateFormData({
        name: "",
        description: "",
        order: categories.length + 1,
        status: "active",
        subCategories: [],
      });
      loadCategories();
    } catch (err) {
      console.error("Create category failed:", err);
      toast.error(err.response?.data?.message || "Failed to create category");
    } finally {
      setSubmittingCreate(false);
    }
  };

  // ================= 2. UPDATE CATEGORY (PATCH /categories/:id) =================
  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setEditFormData({
      name: category.name || "",
      description: category.description || "",
      order: category.order !== undefined ? category.order : 1,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingCategory) return;
    setSubmittingEdit(true);

    try {
      await axiosSecure.patch(
        `/categories/${editingCategory._id}`,
        editFormData
      );
      toast.success("Category updated successfully!");
      setEditingCategory(null);
      loadCategories();
    } catch (err) {
      console.error("Update category failed:", err);
      toast.error(err.response?.data?.message || "Failed to update category");
    } finally {
      setSubmittingEdit(false);
    }
  };

  // ================= 3. DELETE CATEGORY (DELETE /categories/:id) =================
  const handleDeleteCategory = async (category) => {
    const confirm = await Swal.fire({
      title: `Delete "${category.name}"?`,
      text: `This will permanently delete the category and all ${category.subCategories?.length || 0} subcategories!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete Category",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.delete(`/categories/${category._id}`);
      toast.success("Category deleted successfully");
      loadCategories();
    } catch (err) {
      console.error("Delete category failed:", err);
      toast.error(err.response?.data?.message || "Failed to delete category");
    }
  };

  // ================= 4. ADD SUBCATEGORY (POST /categories/:id/subcategories) =================
  const handleOpenAddSub = (category) => {
    setSubCategoryModalTarget(category);
    setNewSubData({
      name: "",
      slug: "",
      status: "active",
      order: (category.subCategories?.length || 0) + 1,
    });
  };

  const handleSubNameChange = (e) => {
    const name = e.target.value;
    setNewSubData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const handleAddSubSubmit = async (e) => {
    e.preventDefault();
    if (!subCategoryModalTarget || !newSubData.name.trim()) return;
    setSubmittingSub(true);

    try {
      await axiosSecure.post(
        `/categories/${subCategoryModalTarget._id}/subcategories`,
        newSubData
      );
      toast.success("Subcategory added successfully!");
      setSubCategoryModalTarget(null);
      loadCategories();
    } catch (err) {
      console.error("Add subcategory failed:", err);
      toast.error(err.response?.data?.message || "Failed to add subcategory");
    } finally {
      setSubmittingSub(false);
    }
  };

  // ================= 5. EDIT SUBCATEGORY (PATCH /categories/:id/subcategories/:subId) =================
  const handleOpenEditSub = (categoryId, subCategory) => {
    setEditingSubCategory({ categoryId, sub: subCategory });
    setEditSubData({
      name: subCategory.name || "",
      slug: subCategory.slug || "",
      order: subCategory.order !== undefined ? subCategory.order : 1,
    });
  };

  const handleEditSubNameChange = (e) => {
    const name = e.target.value;
    setEditSubData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const handleEditSubSubmit = async (e) => {
    e.preventDefault();
    if (!editingSubCategory || !editSubData.name.trim()) return;
    setSubmittingEditSub(true);

    try {
      await axiosSecure.patch(
        `/categories/${editingSubCategory.categoryId}/subcategories/${editingSubCategory.sub.id}`,
        editSubData
      );
      toast.success("Subcategory updated successfully!");
      setEditingSubCategory(null);
      loadCategories();
    } catch (err) {
      console.error("Edit subcategory failed:", err);
      toast.error(err.response?.data?.message || "Failed to update subcategory");
    } finally {
      setSubmittingEditSub(false);
    }
  };

  // ================= 6. DELETE SUBCATEGORY (DELETE /categories/:id/subcategories/:subId) =================
  const handleDeleteSubCategory = async (catId, subCategory) => {
    const confirm = await Swal.fire({
      title: `Delete subcategory "${subCategory.name}"?`,
      text: "This subcategory will be removed from this category.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Remove",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.delete(
        `/categories/${catId}/subcategories/${subCategory.id}`
      );
      toast.success("Subcategory deleted successfully");
      loadCategories();
    } catch (err) {
      console.error("Delete subcategory failed:", err);
      toast.error(err.response?.data?.message || "Failed to delete subcategory");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner Header */}
      <div className="relative rounded-3xl overflow-hidden bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-900/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-600/30 rounded-2xl border border-indigo-400/30">
                <Layers className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Category Management
                </h1>
                <p className="text-sm text-indigo-200/80 mt-0.5">
                  Organize service catalog hierarchies, toggle active states, and manage subcategories.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            {/* Expand / Collapse All Button */}
            <button
              onClick={handleToggleExpandAll}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all cursor-pointer"
            >
              <ChevronsUpDown className="w-4 h-4" />
              {areAllExpanded ? "Collapse All" : "Expand All"}
            </button>

            {/* Refresh Button */}
            <button
              onClick={() => loadCategories()}
              title="Refresh"
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Add Category Button */}
            <button
              onClick={() => {
                setCreateFormData({
                  name: "",
                  description: "",
                  order: categories.length + 1,
                  status: "active",
                  subCategories: [],
                });
                setIsCreateModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Category
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <p className="text-xs text-indigo-200">Total Categories</p>
            <p className="text-xl font-black mt-0.5">{stats.totalCategories}</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <p className="text-xs text-purple-300">Total Subcategories</p>
            <p className="text-xl font-black mt-0.5">{stats.totalSubCategories}</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <p className="text-xs text-emerald-300">Active Categories</p>
            <p className="text-xl font-black mt-0.5">{stats.activeCategories}</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <p className="text-xs text-rose-300">Inactive Categories</p>
            <p className="text-xl font-black mt-0.5">{stats.inactiveCategories}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search category or subcategory..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer w-full sm:w-auto"
          >
            <option value="all">Status: All</option>
            <option value="active">Status: Active Only</option>
            <option value="inactive">Status: Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Category List Accordion */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Spinner />
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
          <Layers className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">
            No Categories Found
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Try modifying your search filter or click "+ Add Category" to create one.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCategories.map((category) => {
            const isExpanded = !!expandedCategories[category._id];
            const subCount = category.subCategories?.length || 0;
            const isActive = category.status === "active";

            return (
              <div
                key={category._id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden transition-all"
              >
                {/* Category Header Bar */}
                <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <div
                    onClick={() => toggleExpand(category._id)}
                    className="flex items-start sm:items-center gap-4 cursor-pointer flex-1"
                  >
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 shrink-0">
                      <ListTree className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          #{category.order || 1}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                          {category.name}
                        </h3>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300">
                          {subCount} {subCount === 1 ? "Subcategory" : "Subcategories"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {category.description || "No description provided."}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Switch Toggle with Top Label */}
                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                    {/* Category Modern Switch Toggle */}
                    <div className="px-2 py-1 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                      <SwitchToggle
                        checked={isActive}
                        onChange={() => handleToggleCategoryStatus(category)}
                      />
                    </div>

                    {/* Add Subcategory */}
                    <button
                      onClick={() => handleOpenAddSub(category)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-all cursor-pointer"
                    >
                      <FolderPlus className="w-3.5 h-3.5" />
                      Add Sub
                    </button>

                    {/* Edit Category */}
                    <button
                      onClick={() => handleOpenEdit(category)}
                      title="Edit Category Details"
                      className="p-2 rounded-xl text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete Category */}
                    <button
                      onClick={() => handleDeleteCategory(category)}
                      title="Delete Entire Category"
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Expand/Collapse Chevron */}
                    <button
                      onClick={() => toggleExpand(category._id)}
                      className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Subcategories Table Drawer */}
                {isExpanded && (
                  <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4 sm:p-6 animate-fade-in">
                    {subCount === 0 ? (
                      <div className="text-center py-6 text-xs text-slate-400">
                        No subcategories registered yet. Click "+ Add Sub" to create the first one.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase font-bold tracking-wider">
                              <th className="py-2.5 px-3">Order</th>
                              <th className="py-2.5 px-3">Subcategory Name</th>
                              <th className="py-2.5 px-3">Slug Identifier</th>
                              <th className="py-2.5 px-3 text-center">Status</th>
                              <th className="py-2.5 px-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {category.subCategories.map((sub, sIdx) => {
                              const isSubActive = sub.status === "active";

                              return (
                                <tr
                                  key={sub.id || sIdx}
                                  className="hover:bg-white dark:hover:bg-slate-800/40 transition-colors"
                                >
                                  <td className="py-3 px-3 font-bold text-slate-500">
                                    #{sub.order || sIdx + 1}
                                  </td>
                                  <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-100">
                                    {sub.name}
                                  </td>
                                  <td className="py-3 px-3 text-slate-500 font-mono">
                                    {sub.slug}
                                  </td>

                                  {/* Subcategory Modern Switch Toggle */}
                                  <td className="py-3 px-3 text-center">
                                    <div className="inline-block py-0.5">
                                      <SwitchToggle
                                        checked={isSubActive}
                                        onChange={() =>
                                          handleToggleSubCategoryStatus(
                                            category._id,
                                            sub
                                          )
                                        }
                                      />
                                    </div>
                                  </td>

                                  {/* Actions: Edit & Delete Subcategory */}
                                  <td className="py-3 px-3 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                      {/* Edit Subcategory Button */}
                                      <button
                                        onClick={() =>
                                          handleOpenEditSub(category._id, sub)
                                        }
                                        title="Edit Subcategory"
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition-colors cursor-pointer"
                                      >
                                        <Edit2 className="w-3.5 h-3.5" />
                                      </button>

                                      {/* Delete Subcategory Button */}
                                      <button
                                        onClick={() =>
                                          handleDeleteSubCategory(
                                            category._id,
                                            sub
                                          )
                                        }
                                        title="Delete Subcategory"
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
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
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ================= MODAL: 1. CREATE CATEGORY (POST /categories) ================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Create New Category
                  </h3>
                  <p className="text-xs text-slate-400">
                    Add a primary category and build its nested subcategories.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wedding & Pre-Wedding"
                    value={createFormData.name}
                    onChange={(e) =>
                      setCreateFormData({ ...createFormData, name: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={createFormData.order}
                    onChange={(e) =>
                      setCreateFormData({
                        ...createFormData,
                        order: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Summary of decorations and offerings under this category..."
                  value={createFormData.description}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Dynamic Subcategories Setup */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
                  Add Initial Subcategories (Optional)
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Wedding Stage, Haldi Setup..."
                    value={tempSubName}
                    onChange={(e) => setTempSubName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTempSubCategory();
                      }
                    }}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTempSubCategory}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    + Add
                  </button>
                </div>

                {createFormData.subCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    {createFormData.subCategories.map((s, idx) => (
                      <span
                        key={s.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full text-xs text-slate-700 dark:text-slate-200 font-semibold"
                      >
                        #{idx + 1} {s.name}
                        <button
                          type="button"
                          onClick={() => handleRemoveTempSub(s.id)}
                          className="text-slate-400 hover:text-rose-500 ml-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingCreate}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/25 disabled:opacity-50 cursor-pointer"
                >
                  {submittingCreate ? "Creating..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: 2. EDIT CATEGORY (PATCH /categories/:id) ================= */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-xl">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Edit Category Details
                  </h3>
                  <p className="text-xs text-slate-400">
                    Update category name, description, and display order.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingCategory(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, name: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editFormData.order}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        order: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingEdit}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold shadow-md shadow-amber-500/25 disabled:opacity-50 cursor-pointer"
                >
                  {submittingEdit ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: 4. ADD SUBCATEGORY (POST /categories/:id/subcategories) ================= */}
      {subCategoryModalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Add Subcategory
                  </h3>
                  <p className="text-xs text-slate-400">
                    Parent: {subCategoryModalTarget.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSubCategoryModalTarget(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Subcategory Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Haldi & Mehendi Setup"
                  value={newSubData.name}
                  onChange={handleSubNameChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Slug (Auto-generated)
                </label>
                <input
                  type="text"
                  required
                  placeholder="haldi-mehendi-setup"
                  value={newSubData.slug}
                  onChange={(e) =>
                    setNewSubData({ ...newSubData, slug: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  min={1}
                  value={newSubData.order}
                  onChange={(e) =>
                    setNewSubData({
                      ...newSubData,
                      order: Number(e.target.value),
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSubCategoryModalTarget(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingSub}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/25 disabled:opacity-50 cursor-pointer"
                >
                  {submittingSub ? "Adding..." : "Add Subcategory"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: 5. EDIT SUBCATEGORY (PATCH /categories/:id/subcategories/:subId) ================= */}
      {editingSubCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-xl">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Edit Subcategory
                  </h3>
                  <p className="text-xs text-slate-400">
                    Update subcategory name, slug, and display order.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingSubCategory(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Subcategory Name *
                </label>
                <input
                  type="text"
                  required
                  value={editSubData.name}
                  onChange={handleEditSubNameChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  required
                  value={editSubData.slug}
                  onChange={(e) =>
                    setEditSubData({ ...editSubData, slug: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  min={1}
                  value={editSubData.order}
                  onChange={(e) =>
                    setEditSubData({
                      ...editSubData,
                      order: Number(e.target.value),
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingSubCategory(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingEditSub}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold shadow-md shadow-amber-500/25 disabled:opacity-50 cursor-pointer"
                >
                  {submittingEditSub ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;
