import React, { useEffect, useState, useCallback } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  Users,
  RefreshCw,
  Shield,
  Palette,
  Briefcase,
  UserCheck,
} from "lucide-react";
import EmptyState from "../../components/ui/EmptyState";
import Pagination from "../../components/ui/Pagination";
import TableSkeleton from "../../components/ui/TableSkeleton";
import ManageUserStats from "../../components/pages/Admin/UserManagement/ManageUserStats";
import ManageUserFilters from "../../components/pages/Admin/UserManagement/ManageUserFilters";
import UserTableRow from "../../components/pages/Admin/UserManagement/UserTableRow";
import ManageUserViewModal from "../../components/pages/Admin/UserManagement/ManageUserViewModal";
import ManageUserEditModal from "../../components/pages/Admin/UserManagement/ManageUserEditModal";

// Protected super admin email constant
const SUPER_ADMIN_EMAIL = "admin.styledecor1@gmail.com";

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
    admin: "E11D48",
    decorator: "9333EA",
    agent: "D97706",
    customer: "4F46E5",
  };
  const color = bgColors[role] || "4F46E5";
  const initials = encodeURIComponent(name || "User");
  return `https://ui-avatars.com/api/?name=${initials}&background=${color}&color=ffffff&bold=true&size=150`;
};

// Role badge styling component with categorical colors
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

// Admin manage user dashboard page
const ManageUser = () => {
  const axiosSecure = useAxiosSecure();

  // State management
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
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

  // Debounce search query input (350ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [search]);

  // Load user statistics summary
  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const res = await axiosSecure.get("/users/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load user stats:", err);
    } finally {
      setStatsLoading(false);
    }
  }, [axiosSecure]);

  // Load users list with query parameters
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

  // Reset all filters
  const handleResetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setRoleFilter("all");
    setCityFilter("all");
    setPage(1);
  };

  // Handle role quick-switch dropdown change
  const handleQuickRoleChange = async (user, newRole) => {
    if (user.role === newRole) return;
    if (user.email === SUPER_ADMIN_EMAIL) {
      toast.error("Super Admin role cannot be modified");
      return;
    }

    const confirm = await Swal.fire({
      title: `Change role to ${newRole}?`,
      text: `Are you sure you want to update ${user.name}'s role to ${newRole.toUpperCase()}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#9333ea",
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

  // Open edit modal and populate initial form data
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

  // Handle user edit form submit
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

  // Handle delete user with confirmation
  const handleDeleteUser = async (user) => {
    if (user.email === SUPER_ADMIN_EMAIL) {
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

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* 1. Top Header Bar: Icon, Title & Subtitle on Left, Action on Right */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-purple-100 dark:bg-purple-950/60 rounded-xl text-purple-600 dark:text-purple-400 shrink-0 shadow-xs">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              User Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Manage accounts, grant decorator/agent permissions, and update user records.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            loadUsers();
            loadStats();
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-all shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* 2. Stat Cards Section */}
      <ManageUserStats
        stats={stats}
        roleFilter={roleFilter}
        onSelectRoleFilter={(r) => {
          setRoleFilter(r);
          setPage(1);
        }}
        loading={statsLoading || !stats}
      />

      {/* 3. Search & Filter Bar Section */}
      <ManageUserFilters
        search={search}
        onSearchChange={setSearch}
        onClearSearch={() => {
          setSearch("");
          setDebouncedSearch("");
          setPage(1);
        }}
        roleFilter={roleFilter}
        onRoleFilterChange={(val) => {
          setRoleFilter(val);
          setPage(1);
        }}
        cityFilter={cityFilter}
        onCityFilterChange={(val) => {
          setCityFilter(val);
          setPage(1);
        }}
        allowedRoles={allowedRoles}
        citiesList={citiesList}
      />

      {/* 4. Users Table (Unrounded Crisp Container) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden rounded-none">
        {loading ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-2 min-w-55">User Profile</th>
                  <th className="py-3.5 px-2 min-w-45">Contact & City</th>
                  <th className="py-3.5 px-2 min-w-32.5">System Role</th>
                  <th className="py-3.5 px-2 text-center min-w-35">Quick Role Switch</th>
                  <th className="py-3.5 px-2 text-center min-w-30">Actions</th>
                </tr>
              </thead>
              <TableSkeleton rows={5} columns={5} />
            </table>
          </div>
        ) : users.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No Users Found"
            message="Try adjusting your search criteria or role filters."
            action={{
              label: "Clear All Filters",
              onClick: handleResetFilters,
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-2 min-w-55">User Profile</th>
                  <th className="py-3.5 px-2 min-w-45">Contact & City</th>
                  <th className="py-3.5 px-2 min-w-32.5">System Role</th>
                  <th className="py-3.5 px-2 text-center min-w-35">Quick Role Switch</th>
                  <th className="py-3.5 px-2 text-center min-w-30">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {users.map((user) => (
                  <UserTableRow
                    key={user._id}
                    user={user}
                    superAdminEmail={SUPER_ADMIN_EMAIL}
                    onView={setViewingUser}
                    onEdit={handleOpenEdit}
                    onDelete={handleDeleteUser}
                    onQuickRoleChange={handleQuickRoleChange}
                    getPlaceholderAvatar={getPlaceholderAvatar}
                    getRoleBadge={getRoleBadge}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. Pagination Footer (Matching Background Color with Table Header) */}
        {!loading && users.length > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            totalCount={totalCount}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
            itemLabel="users"
          />
        )}
      </div>

      {/* 6. View User Details Modal */}
      <ManageUserViewModal
        user={viewingUser}
        isOpen={!!viewingUser}
        onClose={() => setViewingUser(null)}
        getPlaceholderAvatar={getPlaceholderAvatar}
        getRoleBadge={getRoleBadge}
      />

      {/* 7. Edit User Form Modal */}
      <ManageUserEditModal
        user={editingUser}
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        editFormData={editFormData}
        setEditFormData={setEditFormData}
        onSubmit={handleSaveEdit}
        submitting={submittingEdit}
        citiesList={citiesList}
        superAdminEmail={SUPER_ADMIN_EMAIL}
      />
    </div>
  );
};

export default ManageUser;
