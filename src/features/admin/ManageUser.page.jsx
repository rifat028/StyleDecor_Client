import React, { useEffect, useState, useCallback, useMemo } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Spinner from "../home/components/Spinner";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  Users,
  Search,
  Filter,
  Trash2,
  Edit2,
  Eye,
  Shield,
  Palette,
  Briefcase,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Phone,
  Mail,
  MapPin,
  X,
  RefreshCw,
} from "lucide-react";

const allowedRoles = ["all", "admin", "decorator", "agent", "customer"];

const citiesList = [
  "all",
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

// Helper to generate consistent placeholder avatar with role-specific colors
const getPlaceholderAvatar = (name = "User", role = "customer") => {
  const bgColors = {
    admin: "E11D48", // rose-600
    decorator: "9333EA", // purple-600
    agent: "D97706", // amber-600
    customer: "4F46E5", // indigo-600
  };
  const color = bgColors[role] || "4F46E5";
  const initials = encodeURIComponent(name || "User");
  return `https://ui-avatars.com/api/?name=${initials}&background=${color}&color=ffffff&bold=true&size=150`;
};

const ManageUser = () => {
  const axiosSecure = useAxiosSecure();

  // State
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modals state
  const [viewingUser, setViewingUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    phone: "",
    photoUrl: "",
    role: "customer",
    street: "",
    area: "",
    city: "Dhaka",
    postalCode: "",
  });
  const [submittingEdit, setSubmittingEdit] = useState(false);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [search]);

  // Load User Stats
  const loadStats = useCallback(async () => {
    try {
      const res = await axiosSecure.get("/users/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load user stats:", err);
    }
  }, [axiosSecure]);

  // Load Users List
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page,
        limit,
        role: roleFilter,
        city: cityFilter,
        search: debouncedSearch,
      });

      const res = await axiosSecure.get(`/users?${queryParams.toString()}`);
      const fetchedUsers = res.data?.users || [];
      const fetchedTotalPages = res.data?.totalPages || 1;
      const fetchedTotalCount = res.data?.totalCount || 0;

      setUsers(fetchedUsers);
      setTotalPages(fetchedTotalPages);
      setTotalCount(fetchedTotalCount);

      // Auto-correct if current page exceeds total pages
      if (page > fetchedTotalPages && fetchedTotalPages > 0) {
        setPage(fetchedTotalPages);
      }
    } catch (err) {
      console.error("Failed to load users:", err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [axiosSecure, page, limit, roleFilter, cityFilter, debouncedSearch]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Role Badge Styling
  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <Shield className="w-3 h-3" /> Admin
          </span>
        );
      case "decorator":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            <Palette className="w-3 h-3" /> Decorator
          </span>
        );
      case "agent":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Briefcase className="w-3 h-3" /> Agent
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            <UserCheck className="w-3 h-3" /> Customer
          </span>
        );
    }
  };

  // Handle Role Change Directly
  const handleQuickRoleChange = async (user, newRole) => {
    if (user.role === newRole) return;
    if (user.email === "admin.styledecor1@gmail.com") {
      toast.error("Super Admin role cannot be modified");
      return;
    }

    const confirm = await Swal.fire({
      title: `Change role to ${newRole}?`,
      text: `Are you sure you want to update ${user.name}'s role to ${newRole.toUpperCase()}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Update",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.patch("/users/role", {
        email: user.email,
        role: newRole,
      });
      toast.success(`Role updated to ${newRole}`);
      loadUsers();
      loadStats();
    } catch (err) {
      console.error("Role update failed:", err);
      toast.error(err.response?.data?.message || "Failed to update role");
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name || "",
      phone: user.phone || "",
      photoUrl: user.photoUrl || "",
      role: user.role || "customer",
      street: user.address?.street || "",
      area: user.address?.area || "",
      city: user.address?.city || "Dhaka",
      postalCode: user.address?.postalCode || "",
    });
  };

  // Handle Edit Submit
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    setSubmittingEdit(true);

    try {
      const payload = {
        name: editFormData.name,
        phone: editFormData.phone,
        photoUrl: editFormData.photoUrl,
        role: editFormData.role,
        address: {
          street: editFormData.street,
          area: editFormData.area,
          city: editFormData.city,
          postalCode: editFormData.postalCode,
        },
      };

      await axiosSecure.patch(`/users/admin/${editingUser._id}`, payload);
      toast.success("User details updated successfully!");
      setEditingUser(null);
      loadUsers();
      loadStats();
    } catch (err) {
      console.error("Update failed:", err);
      toast.error(err.response?.data?.message || "Failed to update user");
    } finally {
      setSubmittingEdit(false);
    }
  };

  // Delete User
  const handleDeleteUser = async (user) => {
    if (user.email === "admin.styledecor1@gmail.com") {
      toast.error("Super Admin cannot be deleted");
      return;
    }

    const confirm = await Swal.fire({
      title: `Delete ${user.name}?`,
      text: "This action will permanently remove the user from StyleDecor database.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete User",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.delete(`/users/${user._id}`);
      toast.success("User deleted successfully");
      loadUsers();
      loadStats();
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  // Generate Page Numbers Array for Pagination
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      let start = Math.max(2, page - 1);
      let end = Math.min(totalPages - 1, page + 1);

      if (page <= 3) {
        start = 2;
        end = 4;
      } else if (page >= totalPages - 2) {
        start = totalPages - 3;
        end = totalPages - 1;
      }

      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push("...");

      pages.push(totalPages);
    }
    return pages;
  }, [page, totalPages]);

  // Calculate range string
  const startItem = totalCount === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalCount);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Top Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-900/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-600/30 rounded-2xl border border-indigo-400/30">
                <Users className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  User Management
                </h1>
                <p className="text-sm text-indigo-200/80 mt-0.5">
                  Manage accounts, grant decorator/agent permissions, and update user records.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              loadUsers();
              loadStats();
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-sm font-semibold transition-all self-start md:self-auto cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" /> Refresh Data
          </button>
        </div>

        {/* Stats Pill Counters */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-white/10">
            <div
              onClick={() => {
                setRoleFilter("all");
                setPage(1);
              }}
              className={`cursor-pointer p-3 rounded-2xl backdrop-blur-md border transition-all ${
                roleFilter === "all"
                  ? "bg-white/20 border-white/40 ring-2 ring-white/30"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <p className="text-xs text-indigo-200">Total Users</p>
              <p className="text-xl font-black mt-0.5">{stats.totalUsers}</p>
            </div>

            <div
              onClick={() => {
                setRoleFilter("customer");
                setPage(1);
              }}
              className={`cursor-pointer p-3 rounded-2xl backdrop-blur-md border transition-all ${
                roleFilter === "customer"
                  ? "bg-indigo-500/30 border-indigo-400/60 ring-2 ring-indigo-400/30"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <p className="text-xs text-indigo-300">Customers</p>
              <p className="text-xl font-black mt-0.5">{stats.roles?.customer || 0}</p>
            </div>

            <div
              onClick={() => {
                setRoleFilter("decorator");
                setPage(1);
              }}
              className={`cursor-pointer p-3 rounded-2xl backdrop-blur-md border transition-all ${
                roleFilter === "decorator"
                  ? "bg-purple-500/30 border-purple-400/60 ring-2 ring-purple-400/30"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <p className="text-xs text-purple-300">Decorators</p>
              <p className="text-xl font-black mt-0.5">{stats.roles?.decorator || 0}</p>
            </div>

            <div
              onClick={() => {
                setRoleFilter("agent");
                setPage(1);
              }}
              className={`cursor-pointer p-3 rounded-2xl backdrop-blur-md border transition-all ${
                roleFilter === "agent"
                  ? "bg-amber-500/30 border-amber-400/60 ring-2 ring-amber-400/30"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <p className="text-xs text-amber-300">Agents</p>
              <p className="text-xl font-black mt-0.5">{stats.roles?.agent || 0}</p>
            </div>

            <div
              onClick={() => {
                setRoleFilter("admin");
                setPage(1);
              }}
              className={`cursor-pointer p-3 rounded-2xl backdrop-blur-md border transition-all ${
                roleFilter === "admin"
                  ? "bg-rose-500/30 border-rose-400/60 ring-2 ring-rose-400/30"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <p className="text-xs text-rose-300">Admins</p>
              <p className="text-xl font-black mt-0.5">{stats.roles?.admin || 0}</p>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Box */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setDebouncedSearch("");
                setPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 capitalize cursor-pointer"
            >
              {allowedRoles.map((r) => (
                <option key={r} value={r}>
                  Role: {r === "all" ? "All Roles" : r}
                </option>
              ))}
            </select>
          </div>

          {/* City Filter */}
          <select
            value={cityFilter}
            onChange={(e) => {
              setCityFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            {citiesList.map((c) => (
              <option key={c} value={c}>
                City: {c === "all" ? "All Cities" : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <Spinner />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 px-4">
            <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">
              No Users Found
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Try adjusting your search criteria or role filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">User Profile</th>
                  <th className="py-4 px-6">Contact & City</th>
                  <th className="py-4 px-6">System Role</th>
                  <th className="py-4 px-6 text-center">Quick Role Switch</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* User Profile */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={
                            user.photoUrl ||
                            getPlaceholderAvatar(user.name, user.role)
                          }
                          alt={user.name}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = getPlaceholderAvatar(user.name, user.role);
                          }}
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-500/20 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            {user.name}
                            {user.email === "admin.styledecor1@gmail.com" && (
                              <span className="text-[10px] bg-rose-500 text-white font-black px-1.5 py-0.5 rounded">
                                SUPER ADMIN
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact & City */}
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {user.phone || "No phone"}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {user.address?.area
                            ? `${user.address.area}, ${user.address.city || "Dhaka"}`
                            : `${user.address?.city || "Dhaka"}`}
                        </p>
                      </div>
                    </td>

                    {/* System Role */}
                    <td className="py-4 px-6">{getRoleBadge(user.role)}</td>

                    {/* Quick Role Switch Dropdown */}
                    <td className="py-4 px-6 text-center">
                      <select
                        value={user.role}
                        disabled={user.email === "admin.styledecor1@gmail.com"}
                        onChange={(e) => handleQuickRoleChange(user, e.target.value)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="customer">Customer</option>
                        <option value="decorator">Decorator</option>
                        <option value="agent">Agent</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* View Details */}
                        <button
                          onClick={() => setViewingUser(user)}
                          title="View Full Profile"
                          className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit User */}
                        <button
                          onClick={() => handleOpenEdit(user)}
                          title="Edit User Details"
                          className="p-2 rounded-xl text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Delete User */}
                        {user.email !== "admin.styledecor1@gmail.com" && (
                          <button
                            onClick={() => handleDeleteUser(user)}
                            title="Delete User"
                            className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Robust Pagination Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/70 dark:bg-slate-800/40">
          {/* Info and Page Size Selector */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <p>
              Showing <span className="font-bold text-slate-700 dark:text-slate-200">{startItem}</span> to{" "}
              <span className="font-bold text-slate-700 dark:text-slate-200">{endItem}</span> of{" "}
              <span className="font-bold text-slate-700 dark:text-slate-200">{totalCount}</span> users
            </p>

            <div className="flex items-center gap-1.5">
              <span>Per page:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {/* Numbered Page Buttons & Navigation */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              {/* First Page */}
              <button
                onClick={() => setPage(1)}
                disabled={page <= 1}
                title="First Page"
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>

              {/* Prev Page */}
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                title="Previous Page"
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Numbered Page Pills */}
              {pageNumbers.map((p, idx) =>
                p === "..." ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-2 py-1 text-slate-400 font-bold select-none text-xs"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={`page-${p}`}
                    onClick={() => setPage(p)}
                    className={`min-w-[34px] h-[34px] flex items-center justify-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      page === p
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25 ring-2 ring-indigo-400/40"
                        : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              {/* Next Page */}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                title="Next Page"
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Last Page */}
              <button
                onClick={() => setPage(totalPages)}
                disabled={page >= totalPages}
                title="Last Page"
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================= VIEW USER DETAILS MODAL ================= */}
      {viewingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={
                    viewingUser.photoUrl ||
                    getPlaceholderAvatar(viewingUser.name, viewingUser.role)
                  }
                  alt={viewingUser.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = getPlaceholderAvatar(viewingUser.name, viewingUser.role);
                  }}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500 shrink-0"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {viewingUser.name}
                  </h3>
                  <p className="text-xs text-slate-400">{viewingUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingUser(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[11px] font-bold uppercase text-slate-400">
                    Role
                  </p>
                  <div className="mt-1">{getRoleBadge(viewingUser.role)}</div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[11px] font-bold uppercase text-slate-400">
                    Phone
                  </p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">
                    {viewingUser.phone || "N/A"}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                <p className="text-xs font-bold uppercase text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Full Address
                </p>
                <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <p>
                    <span className="font-semibold text-slate-500">Street:</span>{" "}
                    {viewingUser.address?.street || "Not specified"}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-500">Area:</span>{" "}
                    {viewingUser.address?.area || "Not specified"}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-500">City:</span>{" "}
                    {viewingUser.address?.city || "Dhaka"}, Bangladesh
                  </p>
                  <p>
                    <span className="font-semibold text-slate-500">Postal Code:</span>{" "}
                    {viewingUser.address?.postalCode || "N/A"}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-500 space-y-1">
                <p>
                  <span className="font-semibold">MongoDB ID:</span> {viewingUser._id}
                </p>
                {viewingUser.firebaseUid && (
                  <p>
                    <span className="font-semibold">Firebase UID:</span>{" "}
                    {viewingUser.firebaseUid}
                  </p>
                )}
                {viewingUser.createdAt && (
                  <p>
                    <span className="font-semibold">Registered:</span>{" "}
                    {new Date(viewingUser.createdAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewingUser(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT USER MODAL ================= */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Edit User: {editingUser.name}
                </h3>
                <p className="text-xs text-slate-400">
                  Update account parameters and assigned system role.
                </p>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={editFormData.phone}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                    System Role
                  </label>
                  <select
                    disabled={editingUser.email === "admin.styledecor1@gmail.com"}
                    value={editFormData.role}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, role: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="customer">Customer</option>
                    <option value="decorator">Decorator</option>
                    <option value="agent">Agent</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                    City
                  </label>
                  <select
                    value={editFormData.city}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, city: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    {citiesList
                      .filter((c) => c !== "all")
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Photo URL
                </label>
                <input
                  type="url"
                  value={editFormData.photoUrl}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, photoUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={editFormData.street}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, street: e.target.value })
                    }
                    placeholder="House 24, Road 8/A"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Area / Neighborhood
                  </label>
                  <input
                    type="text"
                    value={editFormData.area}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, area: e.target.value })
                    }
                    placeholder="Dhanmondi"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={editFormData.postalCode}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      postalCode: e.target.value,
                    })
                  }
                  placeholder="1209"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingEdit}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {submittingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUser;
