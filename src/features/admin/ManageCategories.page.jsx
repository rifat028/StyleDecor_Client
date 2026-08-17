import React, { useEffect, useState, useCallback, useMemo } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Layers, Plus, RefreshCw } from "lucide-react";
import CategoryManagementToolbar from "../../components/pages/Admin/CategoryManagement/CategoryManagementToolbar";
import CategoryAccordionList from "../../components/pages/Admin/CategoryManagement/CategoryAccordionList";
import CategoryManagementModals from "../../components/pages/Admin/CategoryManagement/CategoryManagementModals";

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

// Admin category management dashboard page
const ManageCategories = () => {
  const axiosSecure = useAxiosSecure();

  // Categories list state
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Accordion expansion state: Default is all collapsed ({})
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

  // Form State - Edit Category
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

  // Debounce search query input (350ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 350);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch Categories list
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

  // Check if all categories are currently expanded
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

  // Filter Categories by status and search query
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchesStatus =
        statusFilter === "all" || cat.status === statusFilter;
      const searchLower = debouncedSearch.toLowerCase().trim();
      const matchesSearch =
        !searchLower ||
        cat.name.toLowerCase().includes(searchLower) ||
        cat.description?.toLowerCase().includes(searchLower) ||
        cat.subCategories?.some((sub) =>
          sub.name.toLowerCase().includes(searchLower)
        );
      return matchesStatus && matchesSearch;
    });
  }, [categories, statusFilter, debouncedSearch]);

  // Calculate high-level category statistics
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

  // Handle Category status switch toggle with optimistic update & rollback
  const handleToggleCategoryStatus = async (category) => {
    const nextStatus = category.status === "active" ? "inactive" : "active";

    // Optimistic state update
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
      // Rollback on failure
      setCategories((prev) =>
        prev.map((c) =>
          c._id === category._id ? { ...c, status: category.status } : c
        )
      );
    }
  };

  // Handle Subcategory status switch toggle with optimistic update
  const handleToggleSubCategoryStatus = async (categoryId, subCategory) => {
    const nextStatus = subCategory.status === "active" ? "inactive" : "active";

    // Optimistic state update
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat._id === categoryId) {
          const updatedSubs = cat.subCategories.map((sub) =>
            (sub.id === subCategory.id || sub._id === subCategory._id)
              ? { ...sub, status: nextStatus }
              : sub
          );
          return { ...cat, subCategories: updatedSubs };
        }
        return cat;
      })
    );

    try {
      await axiosSecure.patch(
        `/categories/${categoryId}/subcategories/${subCategory.id || subCategory._id}`,
        { status: nextStatus }
      );
      toast.success(
        `Subcategory "${subCategory.name}" is now ${nextStatus.toUpperCase()}`
      );
    } catch (err) {
      console.error("Subcategory status toggle failed:", err);
      toast.error("Failed to change subcategory status");
      loadCategories();
    }
  };

  // Handle Category Creation
  const handleAddSubTag = () => {
    if (!tempSubName.trim()) return;
    const newSub = {
      id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
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

  const handleRemoveSubTag = (index) => {
    setCreateFormData((prev) => ({
      ...prev,
      subCategories: prev.subCategories.filter((_, idx) => idx !== index),
    }));
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!createFormData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setSubmittingCreate(true);
    try {
      const payload = {
        name: createFormData.name.trim(),
        slug: generateSlug(createFormData.name),
        description: createFormData.description.trim(),
        order: Number(createFormData.order) || 1,
        status: createFormData.status,
        subCategories: createFormData.subCategories.map((sub, idx) => ({
          name: sub.name,
          slug: sub.slug || generateSlug(sub.name),
          status: sub.status || "active",
          order: idx + 1,
        })),
      };

      await axiosSecure.post("/categories", payload);
      toast.success("Category created successfully!");
      setIsCreateModalOpen(false);
      setCreateFormData({
        name: "",
        description: "",
        order: 1,
        status: "active",
        subCategories: [],
      });
      loadCategories();
    } catch (err) {
      console.error("Create failed:", err);
      toast.error(err.response?.data?.message || "Failed to create category");
    } finally {
      setSubmittingCreate(false);
    }
  };

  // Handle Category Edit
  const handleOpenEditCategory = (category) => {
    setEditingCategory(category);
    setEditFormData({
      name: category.name || "",
      description: category.description || "",
      order: category.order || 1,
    });
  };

  const handleSaveEditCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory) return;
    setSubmittingEdit(true);

    try {
      const payload = {
        name: editFormData.name.trim(),
        slug: generateSlug(editFormData.name),
        description: editFormData.description.trim(),
        order: Number(editFormData.order) || 1,
      };

      await axiosSecure.patch(`/categories/${editingCategory._id}`, payload);
      toast.success("Category details updated successfully!");
      setEditingCategory(null);
      loadCategories();
    } catch (err) {
      console.error("Edit failed:", err);
      toast.error(err.response?.data?.message || "Failed to update category");
    } finally {
      setSubmittingEdit(false);
    }
  };

  // Handle Delete Category
  const handleDeleteCategory = async (category) => {
    const confirm = await Swal.fire({
      title: `Delete "${category.name}"?`,
      text: "All associated subcategories will be permanently deleted. This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete Category",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.delete(`/categories/${category._id}`);
      toast.success(`Category "${category.name}" deleted successfully`);
      loadCategories();
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error(err.response?.data?.message || "Failed to delete category");
    }
  };

  // Handle Add Single Subcategory
  const handleOpenAddSub = (category) => {
    setSubCategoryModalTarget(category);
    setNewSubData({
      name: "",
      slug: "",
      status: "active",
      order: (category.subCategories?.length || 0) + 1,
    });
  };

  const handleAddSubCategory = async (e) => {
    e.preventDefault();
    if (!subCategoryModalTarget || !newSubData.name.trim()) return;
    setSubmittingSub(true);

    try {
      const payload = {
        name: newSubData.name.trim(),
        slug: newSubData.slug || generateSlug(newSubData.name),
        status: newSubData.status,
        order: Number(newSubData.order) || 1,
      };

      await axiosSecure.post(
        `/categories/${subCategoryModalTarget._id}/subcategories`,
        payload
      );
      toast.success("Subcategory added successfully!");
      setSubCategoryModalTarget(null);
      loadCategories();
    } catch (err) {
      console.error("Add subcategory failed:", err);
      toast.error(
        err.response?.data?.message || "Failed to add subcategory"
      );
    } finally {
      setSubmittingSub(false);
    }
  };

  // Handle Edit Subcategory
  const handleOpenEditSub = (category, subCategory) => {
    setEditingSubCategory({ category, subCategory });
    setEditSubData({
      name: subCategory.name || "",
      slug: subCategory.slug || "",
      order: subCategory.order || 1,
    });
  };

  const handleSaveEditSub = async (e) => {
    e.preventDefault();
    if (!editingSubCategory) return;
    setSubmittingEditSub(true);

    const { category, subCategory } = editingSubCategory;
    const subId = subCategory.id || subCategory._id;

    try {
      const payload = {
        name: editSubData.name.trim(),
        slug: editSubData.slug || generateSlug(editSubData.name),
        order: Number(editSubData.order) || 1,
      };

      await axiosSecure.patch(
        `/categories/${category._id}/subcategories/${subId}`,
        payload
      );
      toast.success("Subcategory updated successfully!");
      setEditingSubCategory(null);
      loadCategories();
    } catch (err) {
      console.error("Edit subcategory failed:", err);
      toast.error(
        err.response?.data?.message || "Failed to update subcategory"
      );
    } finally {
      setSubmittingEditSub(false);
    }
  };

  // Handle Delete Subcategory
  const handleDeleteSubCategory = async (categoryId, subCategory) => {
    const confirm = await Swal.fire({
      title: `Delete "${subCategory.name}"?`,
      text: "Are you sure you want to remove this subcategory?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    const subId = subCategory.id || subCategory._id;

    try {
      await axiosSecure.delete(
        `/categories/${categoryId}/subcategories/${subId}`
      );
      toast.success("Subcategory deleted successfully");
      loadCategories();
    } catch (err) {
      console.error("Delete subcategory failed:", err);
      toast.error(
        err.response?.data?.message || "Failed to delete subcategory"
      );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* 1. Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-purple-100 dark:bg-purple-950/60 rounded-xl text-purple-600 dark:text-purple-400 shrink-0 shadow-xs">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Manage Categories
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Organize service categories, subcategory options, and catalog visibility.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          {/* Refresh Data Button */}
          <button
            type="button"
            onClick={loadCategories}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-all shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Refresh</span>
          </button>

          {/* Add Category Primary Button */}
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* 2. Consolidated Toolbar (~130 lines) */}
      <CategoryManagementToolbar
        stats={stats}
        statusFilter={statusFilter}
        onSelectStatusFilter={setStatusFilter}
        loadingStats={loading}
        search={search}
        onSearchChange={setSearch}
        onClearSearch={() => {
          setSearch("");
          setDebouncedSearch("");
        }}
        areAllExpanded={areAllExpanded}
        onToggleExpandAll={handleToggleExpandAll}
        categoriesCount={filteredCategories.length}
      />

      {/* 3. Consolidated Accordion List Component (~280 lines) */}
      <CategoryAccordionList
        categories={filteredCategories}
        loading={loading}
        expandedCategories={expandedCategories}
        onToggleExpand={toggleExpand}
        onToggleStatus={handleToggleCategoryStatus}
        onOpenEdit={handleOpenEditCategory}
        onDeleteCategory={handleDeleteCategory}
        onOpenAddSub={handleOpenAddSub}
        onOpenEditSub={handleOpenEditSub}
        onToggleSubStatus={handleToggleSubCategoryStatus}
        onDeleteSub={handleDeleteSubCategory}
        onResetFilters={() => {
          setSearch("");
          setDebouncedSearch("");
          setStatusFilter("all");
        }}
      />

      {/* 4. Consolidated Modals Suite (~330 lines) */}
      <CategoryManagementModals
        isCreateOpen={isCreateModalOpen}
        onCloseCreate={() => setIsCreateModalOpen(false)}
        createFormData={createFormData}
        setCreateFormData={setCreateFormData}
        tempSubName={tempSubName}
        setTempSubName={setTempSubName}
        onAddSubTag={handleAddSubTag}
        onRemoveSubTag={handleRemoveSubTag}
        onCreateSubmit={handleCreateCategory}
        submittingCreate={submittingCreate}
        editingCategory={editingCategory}
        onCloseEditCategory={() => setEditingCategory(null)}
        editFormData={editFormData}
        setEditFormData={setEditFormData}
        onEditCategorySubmit={handleSaveEditCategory}
        submittingEditCategory={submittingEdit}
        subCategoryModalTarget={subCategoryModalTarget}
        onCloseAddSub={() => setSubCategoryModalTarget(null)}
        newSubData={newSubData}
        setNewSubData={setNewSubData}
        onAddSubSubmit={handleAddSubCategory}
        submittingAddSub={submittingSub}
        editingSubCategory={editingSubCategory}
        onCloseEditSub={() => setEditingSubCategory(null)}
        editSubData={editSubData}
        setEditSubData={setEditSubData}
        onEditSubSubmit={handleSaveEditSub}
        submittingEditSub={submittingEditSub}
        generateSlug={generateSlug}
      />
    </div>
  );
};

export default ManageCategories;
