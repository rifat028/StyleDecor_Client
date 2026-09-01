import React, { useEffect, useState, useCallback } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Users, Shield, Palette, Briefcase, UserCheck } from "lucide-react";
import DashboardPageHeader from "../../components/ui/DashboardPageHeader";
import UserManagementToolbar from "../../components/pages/Admin/UserManagement/UserManagementToolbar";
import UserManagementTable from "../../components/pages/Admin/UserManagement/UserManagementTable";
import UserManagementModals from "../../components/pages/Admin/UserManagement/UserManagementModals";
import { BANGLADESH_DIVISIONS } from "../../lib/constants";

// Protected super admin email constant
const SUPER_ADMIN_EMAIL = "admin.styledecor1@gmail.com";

const allowedRoles = ["all", "admin", "decorator", "agent", "customer"];

const divisionsList = ["all", ...BANGLADESH_DIVISIONS];

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

// Role badge styling component with categorical colors, unified width, and center alignment
const getRoleBadge = (role) => {
  switch (role) {
    case "admin":
      return (
        <span className="inline-flex items-center justify-center gap-1.5 w-28 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-center">
          <Shield className="w-3 h-3 shrink-0" /> Admin
        </span>
      );
    case "decorator":
      return (
        <span className="inline-flex items-center justify-center gap-1.5 w-28 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-center">
          <Palette className="w-3 h-3 shrink-0" /> Decorator
        </span>
      );
    case "agent":
      return (
        <span className="inline-flex items-center justify-center gap-1.5 w-28 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-center">
          <Briefcase className="w-3 h-3 shrink-0" /> Agent
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center justify-center gap-1.5 w-28 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-center">
          <UserCheck className="w-3 h-3 shrink-0" /> Customer
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
  const [divisionFilter, setDivisionFilter] = useState("all");
  const [districtFilter, setDistrictFilter] = useState("all");
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
    home: "",
    district: "",
    division: "Dhaka",
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

  // Load user statistics summary with client-side distribution fallback if backend is missing byRole
  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const res = await axiosSecure.get("/users/stats");
      let statsData = res.data || {};

      // If backend does not provide byRole, compute client-side distribution
      if (!statsData?.byRole) {
        try {
          const usersRes = await axiosSecure.get("/users?limit=5000");
          const allFetched = usersRes.data?.users || [];
          const byRole = {
            admin: { divisions: {}, districts: {}, divisionDistricts: {} },
            decorator: { divisions: {}, districts: {}, divisionDistricts: {} },
            agent: { divisions: {}, districts: {}, divisionDistricts: {} },
            customer: { divisions: {}, districts: {}, divisionDistricts: {} },
          };
          const divisionDistricts = {};

          allFetched.forEach((u) => {
            const role = u.role?.toLowerCase()?.trim();
            const division = u.address?.division?.trim();
            const district = u.address?.district?.trim();

            if (division && district) {
              if (!divisionDistricts[division]) divisionDistricts[division] = {};
              divisionDistricts[division][district] = (divisionDistricts[division][district] || 0) + 1;
            }

            if (role) {
              if (!byRole[role]) {
                byRole[role] = { divisions: {}, districts: {}, divisionDistricts: {} };
              }
              if (division) {
                byRole[role].divisions[division] = (byRole[role].divisions[division] || 0) + 1;
                if (district) {
                  if (!byRole[role].divisionDistricts[division]) {
                    byRole[role].divisionDistricts[division] = {};
                  }
                  byRole[role].divisionDistricts[division][district] =
                    (byRole[role].divisionDistricts[division][district] || 0) + 1;
                }
              }
              if (district) {
                byRole[role].districts[district] = (byRole[role].districts[district] || 0) + 1;
              }
            }
          });

          statsData = {
            ...statsData,
            byRole,
            divisionDistricts,
          };
        } catch (fetchErr) {
          console.warn("Could not compute distribution map client-side:", fetchErr);
        }
      }

      setStats(statsData);
    } catch (err) {
      console.error("Failed to load user stats:", err);
    } finally {
      setStatsLoading(false);
    }
  }, [axiosSecure]);

  // Ensure active role distribution is cached if byRole is missing for that role
  useEffect(() => {
    if (roleFilter === "all" || !stats) return;
    const roleKey = Object.keys(stats?.byRole || {}).find(
      (k) => k.toLowerCase() === roleFilter.toLowerCase()
    );
    if (stats?.byRole && roleKey && stats.byRole[roleKey]?.divisions) {
      return;
    }

    let isCancelled = false;
    const fetchRoleDist = async () => {
      try {
        const res = await axiosSecure.get(`/users?role=${roleFilter}&limit=2000`);
        if (isCancelled) return;
        const roleUsers = res.data?.users || [];
        const roleDivisions = {};
        const roleDistricts = {};
        const roleDivisionDistricts = {};

        roleUsers.forEach((u) => {
          const div = u.address?.division?.trim();
          const dist = u.address?.district?.trim();
          if (div) {
            roleDivisions[div] = (roleDivisions[div] || 0) + 1;
            if (dist) {
              if (!roleDivisionDistricts[div]) roleDivisionDistricts[div] = {};
              roleDivisionDistricts[div][dist] = (roleDivisionDistricts[div][dist] || 0) + 1;
            }
          }
          if (dist) {
            roleDistricts[dist] = (roleDistricts[dist] || 0) + 1;
          }
        });

        setStats((prevStats) => {
          if (!prevStats) return prevStats;
          const prevByRole = prevStats.byRole || {};
          return {
            ...prevStats,
            byRole: {
              ...prevByRole,
              [roleFilter]: {
                divisions: roleDivisions,
                districts: roleDistricts,
                divisionDistricts: roleDivisionDistricts,
              },
            },
          };
        });
      } catch (err) {
        console.warn("Could not fetch distribution for role:", roleFilter, err);
      }
    };

    fetchRoleDist();
    return () => {
      isCancelled = true;
    };
  }, [roleFilter, stats, axiosSecure]);

  // Load users list with query parameters
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page,
        limit,
        role: roleFilter,
        division: divisionFilter,
        district: districtFilter,
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
  }, [axiosSecure, page, limit, roleFilter, divisionFilter, districtFilter, debouncedSearch]);

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
    setDivisionFilter("all");
    setDistrictFilter("all");
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
      home: user.address?.home || user.address?.street || "",
      district: user.address?.district || user.address?.area || "",
      division: user.address?.division || user.address?.city || "Dhaka",
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
          home: editFormData.home,
          district: editFormData.district,
          division: editFormData.division,
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
      {/* 1. Standardized Top Header Bar */}
      <DashboardPageHeader
        icon={Users}
        title="User Management"
        subtitle="Manage accounts, grant decorator/agent permissions, and update user records."
        onRefresh={() => {
          loadUsers();
          loadStats();
        }}
        refreshing={loading && users.length > 0}
        refreshDisabled={loading}
      />

      {/* 2. Consolidated Toolbar (Stats & Search/Filters: ~130 lines) */}
      <UserManagementToolbar
        stats={stats}
        roleFilter={roleFilter}
        onSelectRoleFilter={(r) => {
          setRoleFilter(r);
          setPage(1);
        }}
        loadingStats={statsLoading || !stats}
        search={search}
        onSearchChange={setSearch}
        onClearSearch={() => {
          setSearch("");
          setDebouncedSearch("");
          setPage(1);
        }}
        divisionFilter={divisionFilter}
        onDivisionFilterChange={(val) => {
          setDivisionFilter(val);
          setDistrictFilter("all");
          setPage(1);
        }}
        districtFilter={districtFilter}
        onDistrictFilterChange={(val) => {
          setDistrictFilter(val);
          setPage(1);
        }}
        allowedRoles={allowedRoles}
        divisionsList={divisionsList}
      />

      {/* 3. Consolidated Table Component (~200 lines) */}
      <UserManagementTable
        users={users}
        loading={loading}
        superAdminEmail={SUPER_ADMIN_EMAIL}
        onView={setViewingUser}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteUser}
        onQuickRoleChange={handleQuickRoleChange}
        getPlaceholderAvatar={getPlaceholderAvatar}
        getRoleBadge={getRoleBadge}
        onResetFilters={handleResetFilters}
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

      {/* 4. Consolidated Modals Component (~260 lines) */}
      <UserManagementModals
        viewingUser={viewingUser}
        onCloseView={() => setViewingUser(null)}
        editingUser={editingUser}
        onCloseEdit={() => setEditingUser(null)}
        editFormData={editFormData}
        setEditFormData={setEditFormData}
        onSaveEdit={handleSaveEdit}
        submittingEdit={submittingEdit}
        divisionsList={divisionsList}
        superAdminEmail={SUPER_ADMIN_EMAIL}
        getPlaceholderAvatar={getPlaceholderAvatar}
        getRoleBadge={getRoleBadge}
      />
    </div>
  );
};

export default ManageUser;
