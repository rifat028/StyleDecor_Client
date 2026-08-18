import React, { useContext, useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../auth/AuthContext";
import Swal from "sweetalert2";
import { Calendar, RefreshCw, Sparkles } from "lucide-react";
import MyBookingsToolbar from "../../components/pages/Customer/MyBookings/MyBookingsToolbar";
import MyBookingsTable from "../../components/pages/Customer/MyBookings/MyBookingsTable";
import {
  MyBookingsViewModal,
  EditBookingModal,
  PayModal,
  ReviewModal,
} from "../../components/pages/Customer/MyBookings/MyBookingsModals";

// Main Customer Event Bookings Management Page
const MyBookings = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  // Customer Profile & Data State
  const [customerId, setCustomerId] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Search
  const [statusTab, setStatusTab] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Modals State
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewBooking, setReviewBooking] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Pay Modal State
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payBooking, setPayBooking] = useState(null);
  const [payType, setPayType] = useState("advance_deposit");
  const [payMethod, setPayMethod] = useState("bkash");
  const [isProcessingPay, setIsProcessingPay] = useState(false);

  // Edit Form State
  const [editFormData, setEditFormData] = useState({
    eventDate: "",
    startTime: "16:00",
    endTime: "22:00",
    venueName: "",
    venueAddress: "",
    guestCountEstimate: "100",
    contact: "",
    specialInstructions: "",
  });

  // 1. Load Customer Profile to resolve MongoDB ObjectId
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.email) return;
      try {
        setProfileLoading(true);
        const res = await axiosSecure.get("/users/me");
        const profile = res.data?.data || res.data;
        if (profile?._id) {
          setCustomerId(profile._id);
        }
      } catch (err) {
        console.error("Failed to load customer profile:", err);
      } finally {
        setProfileLoading(false);
      }
    };
    loadProfile();
  }, [axiosSecure, user?.email]);

  // 2. Load Bookings by Customer ID
  const loadBookings = useCallback(async () => {
    if (!customerId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await axiosSecure.get(`/bookings/customer/${customerId}`);
      const list = res.data?.data || res.data || [];
      setBookings(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to load customer bookings:", err);
      setBookings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [axiosSecure, customerId]);

  useEffect(() => {
    if (customerId) {
      loadBookings();
    } else if (!profileLoading) {
      setLoading(false);
    }
  }, [customerId, loadBookings, profileLoading]);

  // Combined Loading State for Immediate Skeletons
  const isInitialLoading = profileLoading || loading;

  // Metric Statistics
  const stats = useMemo(() => {
    return {
      total: bookings.length,
      confirmed: bookings.filter((b) =>
        [
          "confirmed",
          "accepted",
          "advance_paid",
          "advance paid",
          "preparing",
          "on_the_way",
          "on the way",
          "in_progress",
          "inprogress",
        ].includes(String(b.status).toLowerCase())
      ).length,
      completed: bookings.filter((b) =>
        ["completed", "fully_paid", "fully paid"].includes(
          String(b.status).toLowerCase()
        )
      ).length,
      pending: bookings.filter((b) =>
        ["pending", "in_draft", "draft"].includes(
          String(b.status).toLowerCase()
        )
      ).length,
    };
  }, [bookings]);

  // Filtered & Sorted Bookings
  const filteredBookings = useMemo(() => {
    return bookings
      .filter((b) => {
        if (statusTab !== "all") {
          const currentStatus = String(b.status || "").toLowerCase();
          if (statusTab === "confirmed") {
            if (
              ![
                "confirmed",
                "accepted",
                "advance_paid",
                "advance paid",
                "preparing",
                "on_the_way",
                "on the way",
                "in_progress",
                "inprogress",
              ].includes(currentStatus)
            )
              return false;
          } else if (statusTab === "in_progress") {
            if (
              ![
                "in_progress",
                "inprogress",
                "preparing",
                "on_the_way",
                "on the way",
              ].includes(currentStatus)
            )
              return false;
          } else if (statusTab === "completed") {
            if (!["completed", "fully_paid", "fully paid"].includes(currentStatus))
              return false;
          } else if (statusTab === "pending") {
            if (!["pending", "in_draft", "draft"].includes(currentStatus))
              return false;
          } else if (statusTab === "cancelled") {
            if (!["cancelled", "rejected"].includes(currentStatus))
              return false;
          }
        }

        if (searchText.trim()) {
          const q = searchText.toLowerCase();
          const code = (b.bookingCode || "").toLowerCase();
          const title = (
            b.serviceSnapshot?.title ||
            b.serviceName ||
            ""
          ).toLowerCase();
          const venue = (
            b.eventDetails?.venueName ||
            b.location ||
            ""
          ).toLowerCase();
          const address = (b.eventDetails?.venueAddress || "").toLowerCase();
          const decName = (b.decorator?.businessName || "").toLowerCase();

          if (
            !code.includes(q) &&
            !title.includes(q) &&
            !venue.includes(q) &&
            !address.includes(q) &&
            !decName.includes(q)
          ) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "eventDate_asc") {
          const dateA = new Date(
            a.eventDetails?.eventDate || a.bookingDate || 0
          );
          const dateB = new Date(
            b.eventDetails?.eventDate || b.bookingDate || 0
          );
          return dateA - dateB;
        }
        if (sortBy === "eventDate_desc") {
          const dateA = new Date(
            a.eventDetails?.eventDate || a.bookingDate || 0
          );
          const dateB = new Date(
            b.eventDetails?.eventDate || b.bookingDate || 0
          );
          return dateB - dateA;
        }
        if (sortBy === "amount_desc") {
          const amtA = a.pricingBreakdown?.grandTotal || a.totalCost || 0;
          const amtB = b.pricingBreakdown?.grandTotal || b.totalCost || 0;
          return amtB - amtA;
        }
        if (sortBy === "amount_asc") {
          const amtA = a.pricingBreakdown?.grandTotal || a.totalCost || 0;
          const amtB = b.pricingBreakdown?.grandTotal || b.totalCost || 0;
          return amtA - amtB;
        }
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [bookings, statusTab, searchText, sortBy]);

  // Paginated View Slice
  const totalCount = filteredBookings.length;
  const totalPages = Math.ceil(totalCount / limit) || 1;
  const paginatedBookings = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredBookings.slice(start, start + limit);
  }, [filteredBookings, page, limit]);

  // Filter Handlers
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

  const handleSortChange = (val) => {
    setSortBy(val);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchText("");
    setStatusTab("all");
    setSortBy("newest");
    setPage(1);
  };

  // Open View Modal
  const handleOpenView = (b) => {
    setSelectedBooking(b);
    setIsViewModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (b) => {
    setSelectedBooking(b);
    const dateVal = b.eventDetails?.eventDate
      ? new Date(b.eventDetails.eventDate).toISOString().split("T")[0]
      : b.bookingDate || "";

    setEditFormData({
      eventDate: dateVal,
      startTime: b.eventDetails?.startTime || "16:00",
      endTime: b.eventDetails?.endTime || "22:00",
      venueName: b.eventDetails?.venueName || b.location || "",
      venueAddress: b.eventDetails?.venueAddress || b.location || "",
      guestCountEstimate: String(b.eventDetails?.guestCountEstimate || "100"),
      contact: b.contact || user?.phone || "",
      specialInstructions: b.eventDetails?.specialInstructions || "",
    });
    setIsEditModalOpen(true);
  };

  // Submit Edit Form
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!selectedBooking?._id) return;

    try {
      const payload = {
        eventDate: editFormData.eventDate,
        startTime: editFormData.startTime,
        endTime: editFormData.endTime,
        venueName: editFormData.venueName.trim(),
        venueAddress: editFormData.venueAddress.trim(),
        guestCountEstimate: Number(editFormData.guestCountEstimate),
        contact: editFormData.contact.trim(),
        specialInstructions: editFormData.specialInstructions.trim(),
      };

      await axiosSecure.patch(`/bookings/${selectedBooking._id}`, payload);
      Swal.fire({
        icon: "success",
        title: "Booking Updated",
        text: "Your event logistics and contact details have been saved.",
        timer: 1500,
        showConfirmButton: false,
      });

      setIsEditModalOpen(false);
      loadBookings();
    } catch (err) {
      console.error("Failed to update booking:", err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to update booking.",
        "error"
      );
    }
  };

  // Delete / Cancel Booking
  const handleDeleteBooking = async (b) => {
    const isCompleted = ["completed", "Completed"].includes(b.status);
    const confirm = await Swal.fire({
      title: isCompleted ? "Remove Booking Record?" : "Cancel Event Booking?",
      text: `Are you sure you want to ${
        isCompleted ? "remove this booking record" : "cancel this booking"
      } (${b.bookingCode || b.serviceName})?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: isCompleted ? "Yes, Delete" : "Yes, Cancel Booking",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.delete(`/bookings/${b._id}`);
      Swal.fire({
        icon: "success",
        title: "Cancelled",
        text: "The booking has been successfully removed.",
        timer: 1500,
        showConfirmButton: false,
      });
      loadBookings();
    } catch (err) {
      console.error("Failed to delete booking:", err);
      Swal.fire(
        "Error",
        "Failed to cancel booking. Please try again.",
        "error"
      );
    }
  };

  // Open Payment & Checkout Modal
  const handleOpenPayModal = (b) => {
    setPayBooking(b);
    const paidAmt = Number(b.pricingBreakdown?.paidAmount || 0);
    if (paidAmt > 0) {
      setPayType("full_payment");
    } else {
      setPayType("advance_deposit");
    }
    setPayMethod("bkash");
    setIsPayModalOpen(true);
  };

  // Process Payment Submission
  const handleProcessPayment = async (e) => {
    e.preventDefault();
    if (!payBooking?._id) return;

    try {
      setIsProcessingPay(true);
      const grandTotal = Number(
        payBooking.pricingBreakdown?.grandTotal || payBooking.totalCost || 0
      );
      const existingPaid = Number(payBooking.pricingBreakdown?.paidAmount || 0);
      const remainingDue = grandTotal - existingPaid;

      // Note: 40% advance deposit rate used per checkout business flow
      const calcAmount =
        payType === "advance_deposit"
          ? Math.round(grandTotal * 0.4)
          : remainingDue > 0
          ? remainingDue
          : grandTotal;

      if (payMethod === "stripe") {
        const res = await axiosSecure.post(
          "/payments/create-checkout-session",
          {
            bookingId: payBooking._id,
            serviceName:
              payBooking.serviceSnapshot?.title ||
              payBooking.serviceName ||
              "Event Decoration",
            amount: calcAmount,
            clientEmail: user?.email,
          }
        );

        if (res.data?.url) {
          window.location.href = res.data.url;
          return;
        }
      }

      const res = await axiosSecure.post("/payments/initiate", {
        bookingId: payBooking._id,
        paymentType: payType,
        paymentMethod: payMethod,
        amount: calcAmount,
      });

      if (res.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Payment Successful 🎉",
          html: `<p class="text-sm">Payment code: <b class="font-mono text-purple-600">${res.data.paymentCode}</b></p><p class="text-xs text-slate-500 mt-1">Transaction ID: ${res.data.transactionId}</p>`,
        });

        setIsPayModalOpen(false);
        loadBookings();
      }
    } catch (err) {
      console.error("Failed to process payment:", err);
      Swal.fire(
        "Payment Error",
        err.response?.data?.message || "Failed to process payment.",
        "error"
      );
    } finally {
      setIsProcessingPay(false);
    }
  };

  // Open Review Submission Modal
  const handleOpenReviewModal = (b) => {
    setReviewBooking(b);
    setReviewRating(5);
    setHoverRating(0);
    setReviewComment("");
    setIsReviewModalOpen(true);
  };

  // Submit Review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewBooking?._id || !reviewComment.trim()) return;

    try {
      setIsSubmittingReview(true);
      const res = await axiosSecure.post("/reviews", {
        bookingId: reviewBooking._id,
        decoratorId: reviewBooking.decoratorId || reviewBooking.decorator?._id,
        serviceId: reviewBooking.serviceId,
        agentId:
          reviewBooking.assignedAgentId || reviewBooking.assignedAgent?._id,
        rating: Number(reviewRating),
        comment: reviewComment.trim(),
      });

      if (res.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Review Submitted 🎉",
          text: "Thank you for sharing your experience! Your review is now published.",
          timer: 1800,
          showConfirmButton: false,
        });

        setIsReviewModalOpen(false);
        loadBookings();
      }
    } catch (err) {
      console.error("Failed to submit review:", err);
      Swal.fire(
        "Review Error",
        err.response?.data?.message || "Failed to submit review.",
        "error"
      );
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* 1. Top Header Bar: Icon, Title, Subtitle & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-purple-100 dark:bg-purple-950/60 rounded-xl text-purple-600 dark:text-purple-400 shrink-0 shadow-xs">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              My Bookings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Track all your scheduled event setups, monitor assigned decorator agencies, and manage venue logistics.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap sm:flex-nowrap">
          {/* Refresh Action Button */}
          <button
            type="button"
            onClick={() => {
              setRefreshing(true);
              loadBookings();
            }}
            disabled={isInitialLoading || refreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 text-purple-600 dark:text-purple-400 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
            <span>Refresh Data</span>
          </button>

          {/* Primary Explore & Book Action Button */}
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-all shadow-md shadow-purple-600/25 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Book New Service</span>
          </Link>
        </div>
      </div>

      {/* 2. Consolidated Toolbar: Stat Cards & Search/Filter Controls */}
      <MyBookingsToolbar
        stats={stats}
        statusTab={statusTab}
        onSelectStatusTab={handleStatusTabChange}
        loadingStats={isInitialLoading}
        searchText={searchText}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />

      {/* 3. Bookings Table with Pagination & Skeletons */}
      <MyBookingsTable
        bookings={paginatedBookings}
        loading={isInitialLoading}
        onOpenPayModal={handleOpenPayModal}
        onOpenViewModal={handleOpenView}
        onOpenEditModal={handleOpenEdit}
        onOpenReviewModal={handleOpenReviewModal}
        onDeleteBooking={handleDeleteBooking}
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

      {/* 4. Full View Dossier Modal */}
      <MyBookingsViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        selectedBooking={selectedBooking}
      />

      {/* 5. Edit Booking Logistics Modal */}
      <EditBookingModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        selectedBooking={selectedBooking}
        editFormData={editFormData}
        setEditFormData={setEditFormData}
        onSubmit={handleSaveEdit}
      />

      {/* 6. Pay Modal */}
      <PayModal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        payBooking={payBooking}
        payType={payType}
        setPayType={setPayType}
        payMethod={payMethod}
        setPayMethod={setPayMethod}
        isProcessingPay={isProcessingPay}
        onSubmit={handleProcessPayment}
      />

      {/* 7. Rate & Review Celebration Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        reviewBooking={reviewBooking}
        reviewRating={reviewRating}
        setReviewRating={setReviewRating}
        hoverRating={hoverRating}
        setHoverRating={setHoverRating}
        reviewComment={reviewComment}
        setReviewComment={setReviewComment}
        isSubmittingReview={isSubmittingReview}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
};

export default MyBookings;
