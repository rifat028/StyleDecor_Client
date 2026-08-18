import React, { useContext, useEffect, useMemo, useState, useCallback } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../auth/AuthContext";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Calendar } from "lucide-react";
import DashboardPageHeader from "../../components/ui/DashboardPageHeader";
import MyProjectsToolbar from "../../components/pages/Decorator/MyProjects/MyProjectsToolbar";
import MyProjectsTable from "../../components/pages/Decorator/MyProjects/MyProjectsTable";
import {
  MyProjectsViewModal,
  UpdateStatusModal,
  AssignSpecialistModal,
} from "../../components/pages/Decorator/MyProjects/MyProjectsModals";

const STATUS_STEPS = [
  "in_draft",
  "pending",
  "accepted",
  "advance_paid",
  "preparing",
  "on_the_way",
  "in_progress",
  "completed",
  "fully_paid",
  "rejected",
];

// Main Decorator Event Projects Management Page
const MyProjects = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  // Decorator Agency State
  const [decoratorId, setDecoratorId] = useState(null);
  const [decoratorProfile, setDecoratorProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Projects & Specialists State
  const [bookings, setBookings] = useState([]);
  const [agencyAgents, setAgencyAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filter & Pagination State
  const [statusTab, setStatusTab] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Modals State
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [bookingPayments, setBookingPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [nextStatus, setNextStatus] = useState("");

  // 1. Fetch Decorator Agency Profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.email) return;
      try {
        setProfileLoading(true);
        let dec = null;
        try {
          const res = await axiosSecure.get("/decorators/me");
          dec = res.data?.data || res.data;
        } catch {
          const res = await axiosSecure.get(
            `/decorators/${encodeURIComponent(user.email)}`
          );
          dec = res.data?.data || res.data;
        }

        if (dec?._id) {
          setDecoratorId(dec._id);
          setDecoratorProfile(dec);
        }
      } catch (err) {
        console.error("Failed to load decorator agency profile:", err);
      } finally {
        setProfileLoading(false);
      }
    };
    loadProfile();
  }, [axiosSecure, user?.email]);

  // 2. Load Bookings for this Decorator
  const loadProjects = useCallback(async () => {
    if (!decoratorId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await axiosSecure.get(`/bookings/decorator/${decoratorId}`);
      const list = res.data?.data || res.data || [];
      setBookings(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to load projects:", err);
      toast.error("Failed to load event projects");
      setBookings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [axiosSecure, decoratorId]);

  // 3. Load Agency Field Specialists
  const loadAgencyAgents = useCallback(async () => {
    if (!decoratorId) return;
    try {
      const res = await axiosSecure.get(`/agents/decorator/${decoratorId}`);
      const list = res.data?.data || [];
      setAgencyAgents(Array.isArray(list) ? list : []);
    } catch (err) {
      console.warn("Failed to load agency agents for assignment:", err);
    }
  }, [axiosSecure, decoratorId]);

  useEffect(() => {
    if (decoratorId) {
      loadProjects();
      loadAgencyAgents();
    } else if (!profileLoading) {
      setLoading(false);
    }
  }, [loadProjects, loadAgencyAgents, decoratorId, profileLoading]);

  // Combined Loading State for Immediate Skeleton Presentation
  const isInitialLoading = profileLoading || loading;

  // Metric Stats Summary
  const stats = useMemo(() => {
    return {
      total: bookings.length,
      active: bookings.filter((b) =>
        [
          "accepted",
          "advance_paid",
          "advance paid",
          "preparing",
          "on_the_way",
          "on the way",
          "in_progress",
          "inprogress",
        ].includes(b.status)
      ).length,
      completed: bookings.filter((b) =>
        ["completed", "fully_paid", "fully paid"].includes(b.status)
      ).length,
      pending: bookings.filter((b) =>
        ["pending", "in_draft", "draft"].includes(b.status)
      ).length,
    };
  }, [bookings]);

  // Filtered Bookings List
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (statusTab === "active_group") {
        const isActive = [
          "accepted",
          "advance_paid",
          "advance paid",
          "preparing",
          "on_the_way",
          "on the way",
          "in_progress",
          "inprogress",
        ].includes(b.status);
        if (!isActive) return false;
      } else if (statusTab === "completed_group") {
        const isCompleted = ["completed", "fully_paid", "fully paid"].includes(
          b.status
        );
        if (!isCompleted) return false;
      } else if (statusTab !== "all" && b.status !== statusTab) {
        return false;
      }

      if (searchText.trim()) {
        const q = searchText.toLowerCase();
        const code = (b.bookingCode || "").toLowerCase();
        const title = (
          b.serviceSnapshot?.title ||
          b.serviceName ||
          ""
        ).toLowerCase();
        const client = (b.customer?.name || b.clientName || "").toLowerCase();
        const venue = (
          b.eventDetails?.venueName ||
          b.location ||
          ""
        ).toLowerCase();
        if (
          !code.includes(q) &&
          !title.includes(q) &&
          !client.includes(q) &&
          !venue.includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [bookings, statusTab, searchText]);

  // Paginated View Slice
  const totalCount = filteredBookings.length;
  const totalPages = Math.ceil(totalCount / limit) || 1;
  const paginatedBookings = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredBookings.slice(start, start + limit);
  }, [filteredBookings, page, limit]);

  // Reset pagination on filter change
  const handleSearchChange = (val) => {
    setSearchText(val);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchText("");
    setPage(1);
  };

  const handleStatusTabChange = (val) => {
    setStatusTab(val);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchText("");
    setStatusTab("all");
    setPage(1);
  };

  // Open Assign Specialist Modal
  const handleOpenAssignModal = (b) => {
    setSelectedBooking(b);
    setSelectedAgentId(b.assignedAgentId || b.assignedAgent?._id || "");
    setIsAssignModalOpen(true);
  };

  // Submit Assign Specialist
  const handleAssignAgent = async (e) => {
    e.preventDefault();
    if (!selectedBooking?._id || !selectedAgentId) return;

    try {
      const res = await axiosSecure.patch(
        `/bookings/${selectedBooking._id}/assign`,
        {
          assignedAgentId: selectedAgentId,
        }
      );

      if (res.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Specialist Assigned 🎉",
          text: "The field specialist has been assigned to this event project.",
          timer: 1500,
          showConfirmButton: false,
        });

        setIsAssignModalOpen(false);
        loadProjects();
      }
    } catch (err) {
      console.error("Failed to assign agent:", err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to assign field specialist.",
        "error"
      );
    }
  };

  // Open Project & Payment Audit Dossier Modal
  const handleOpenView = async (b) => {
    setSelectedBooking(b);
    setIsViewModalOpen(true);
    setBookingPayments([]);
    setPaymentsLoading(true);

    try {
      const res = await axiosSecure.get(`/payments/booking/${b._id}`);
      const list = res.data?.data || [];
      setBookingPayments(Array.isArray(list) ? list : []);
    } catch (err) {
      console.warn("Failed to load payments for booking:", err);
      setBookingPayments([]);
    } finally {
      setPaymentsLoading(false);
    }
  };

  // Status Change Modal Handlers
  const openStatusModal = (b) => {
    setSelectedBooking(b);
    setNextStatus(b.status || STATUS_STEPS[0]);
    setIsStatusModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedBooking?._id || !nextStatus) return;

    try {
      await axiosSecure.patch(`/bookings/${selectedBooking._id}/status`, {
        status: nextStatus,
      });

      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: `Project is now marked as "${nextStatus.replace(/_/g, " ")}".`,
        timer: 1500,
        showConfirmButton: false,
      });

      setIsStatusModalOpen(false);
      loadProjects();
    } catch (err) {
      console.error("Failed to update status:", err);
      Swal.fire("Error", "Failed to update project status.", "error");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* 1. Standardized Top Header Bar */}
      <DashboardPageHeader
        icon={Calendar}
        title="My Event Projects"
        subtitle={`Manage live orders, audit customer payment receipts, and advance execution stages for ${decoratorProfile?.businessName || "your agency"}.`}
        onRefresh={() => {
          setRefreshing(true);
          loadProjects();
          loadAgencyAgents();
        }}
        refreshing={refreshing}
        refreshDisabled={isInitialLoading || refreshing}
      />

      {/* 2. Consolidated Toolbar: Stat Cards & Search Filters */}
      <MyProjectsToolbar
        stats={stats}
        statusTab={statusTab}
        onSelectStatusTab={handleStatusTabChange}
        loadingStats={isInitialLoading}
        searchText={searchText}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
      />

      {/* 3. Projects Table with Pagination & Skeletons */}
      <MyProjectsTable
        bookings={paginatedBookings}
        loading={isInitialLoading}
        onOpenAssignModal={handleOpenAssignModal}
        onOpenViewModal={handleOpenView}
        onOpenStatusModal={openStatusModal}
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

      {/* 4. Project Dossier & Payments Audit Modal */}
      <MyProjectsViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        selectedBooking={selectedBooking}
        bookingPayments={bookingPayments}
        paymentsLoading={paymentsLoading}
      />

      {/* 5. Advance Project Lifecycle Stage Modal */}
      <UpdateStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        selectedBooking={selectedBooking}
        nextStatus={nextStatus}
        setNextStatus={setNextStatus}
        statusSteps={STATUS_STEPS}
        onSubmit={handleUpdateStatus}
      />

      {/* 6. Assign Field Specialist Modal */}
      <AssignSpecialistModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        selectedBooking={selectedBooking}
        agencyAgents={agencyAgents}
        selectedAgentId={selectedAgentId}
        setSelectedAgentId={setSelectedAgentId}
        onSubmit={handleAssignAgent}
      />
    </div>
  );
};

export default MyProjects;
