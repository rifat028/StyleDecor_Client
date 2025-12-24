import React, { useContext, useEffect, useMemo, useState } from "react";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { AuthContext } from "../Authentication/AuthContext";
import Swal from "sweetalert2";

/**
 * MyProjects.jsx (Decorator)
 *
 * ✅ Shows:
 * 1) Today's projects (assignTo = this decorator, status != Completed, bookingDate = today)
 * 2) All active projects (assignTo = this decorator, status != Completed)
 *
 * ✅ Update status:
 * Steps: (Assigned, Planning, Equipping, On Way, Setting up, Completed)
 * Dropdown shows ONLY remaining steps.
 *
 * ---------------------------
 * IMPORTANT (About assignTo)
 * In your admin assign flow you used assignTo = decorator._id
 * So here we try to find the decorator _id first by email.
 *
 * Expected APIs:
 * - GET /decorators?email=decorator@email.com  -> returns array (or single)
 * - GET /bookings/decorator/:decoratorId       -> returns all bookings for this decorator
 * - PATCH /bookings/:id/status                -> update booking status
 *
 * If your backend returns bookings differently, just adjust the endpoints.
 */

const MyProjects = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const [decoratorId, setDecoratorId] = useState(null);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [nextStatus, setNextStatus] = useState("");

  const STATUS_STEPS = useMemo(
    () => [
      "Assigned",
      "Planning",
      "Equipping",
      "On Way",
      "Setting up",
      "Completed",
    ],
    []
  );

  const today = useMemo(() => {
    // yyyy-mm-dd
    return new Date().toISOString().split("T")[0];
  }, []);

  // ---------- Load decorator id by email (because assignTo is decorator._id) ----------
  useEffect(() => {
    const loadDecorator = async () => {
      if (!user?.email) return;

      try {
        // ✅ expects: GET /decorators?email=user.email -> [decorator]
        const res = await axiosSecure.get(`/decorators/${user.email}`);
        const dec = Array.isArray(res.data) ? res.data[0] : res.data;

        // If your API returns {data:[...]} then use: res.data.data[0]
        const id = dec?._id || null;
        setDecoratorId(id);
      } catch (err) {
        console.error("Failed to load decorator profile:", err);
        setDecoratorId(null);
      }
    };

    loadDecorator();
  }, [axiosSecure, user?.email]);

  // ---------- Load bookings for this decorator ----------
  useEffect(() => {
    const loadProjects = async () => {
      if (!decoratorId) return;

      try {
        setLoading(true);

        // ✅ expects: GET /bookings/decorator/:decoratorId -> bookings array
        const res = await axiosSecure.get(`/bookings/decorator/${decoratorId}`);
        const data = res.data || [];
        setBookings(data);
      } catch (err) {
        console.error("Failed to load projects:", err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [axiosSecure, decoratorId]);

  // ---------- Derived lists ----------
  const activeBookings = useMemo(() => {
    return bookings.filter(
      (b) => String(b.status || "").toLowerCase() !== "completed"
    );
  }, [bookings]);

  const todaysBookings = useMemo(() => {
    return activeBookings.filter((b) => b.bookingDate === today);
  }, [activeBookings, today]);

  // ---------- Remaining status options ----------
  const getRemainingStatuses = (currentStatus) => {
    const idx = STATUS_STEPS.findIndex((s) => s === currentStatus);
    if (idx === -1) {
      // if status missing/unknown, allow all (except current)
      return STATUS_STEPS;
    }
    return STATUS_STEPS.slice(idx + 1); // only remaining steps
  };

  // ---------- Open/Close modal ----------
  const openStatusModal = (booking) => {
    setSelectedBooking(booking);

    const remaining = getRemainingStatuses(booking.status || "Assigned");
    setNextStatus(remaining[0] || "");
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedBooking(null);
    setNextStatus("");
    setModalOpen(false);
  };

  // ---------- Update status ----------
  const handleUpdateStatus = async () => {
    if (!selectedBooking?._id || !nextStatus) return;

    const confirm = await Swal.fire({
      title: "Update status?",
      text: `Change status to "${nextStatus}"`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Update",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      // ✅ expects: PATCH /bookings/:id/status  body: { status: "Planning" }
      await axiosSecure.patch(`/bookings/${selectedBooking._id}/status`, {
        status: nextStatus,
      });

      Swal.fire("Updated!", "Project status updated successfully.", "success");

      // update UI instantly
      setBookings((prev) =>
        prev.map((b) =>
          b._id === selectedBooking._id ? { ...b, status: nextStatus } : b
        )
      );

      closeModal();
    } catch (err) {
      console.error("Status update failed:", err);
      Swal.fire("Error", "Failed to update status.", "error");
    }
  };

  // ---------- Helpers ----------
  const statusBadge = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "completed")
      return <span className="badge badge-success">Completed</span>;
    if (s === "assigned")
      return <span className="badge badge-info">Assigned</span>;
    return <span className="badge badge-warning">{status}</span>;
  };

  const Table = ({ title, subtitle, data }) => (
    <div className="rounded-2xl border border-base-300 dark:border-gray-700 bg-base-100 dark:bg-gray-800 overflow-hidden mb-6">
      <div className="p-4 md:p-6 border-b border-base-300 dark:border-gray-700">
        <h2 className="text-lg md:text-xl font-bold text-base-content dark:text-white">
          {title}
        </h2>
        <p className="text-sm text-base-content/70 dark:text-gray-300 mt-1">
          {subtitle}
        </p>
      </div>

      {data.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-base-content dark:text-white font-medium">
            No projects found.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-base-200 dark:bg-gray-700">
              <tr className="text-base-content dark:text-white">
                <th>#</th>
                <th>Service</th>
                <th>Client</th>
                <th>Date</th>
                <th>Location</th>
                <th>Total</th>
                <th>Status</th>
                <th className="text-center">Update</th>
              </tr>
            </thead>

            <tbody>
              {data.map((b, idx) => (
                <tr
                  key={b._id}
                  className="text-base-content dark:text-gray-100"
                >
                  <td>{idx + 1}</td>

                  <td className="min-w-55">
                    <p className="font-semibold">{b.serviceName}</p>
                    <p className="text-xs text-base-content/60 dark:text-gray-300 capitalize">
                      {b.serviceCategory}
                    </p>
                  </td>

                  <td className="min-w-50">
                    <p className="font-semibold">{b.clientName}</p>
                    <p className="text-xs text-base-content/60 dark:text-gray-300">
                      {b.clientEmail}
                    </p>
                  </td>

                  <td className="min-w-30">{b.bookingDate}</td>
                  <td className="min-w-35">{b.location}</td>
                  <td className="min-w-25">৳{b.totalCost}</td>
                  <td className="min-w-36">{statusBadge(b.status)}</td>

                  <td className="min-w-35">
                    {String(b.status || "").toLowerCase() !== "completed" ? (
                      <div className="flex justify-center">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => openStatusModal(b)}
                        >
                          Update
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <span className="text-sm text-base-content/60 dark:text-gray-300">
                          —
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-base-100 dark:bg-gray-900">
      {/* Top section */}
      <div className="bg-base-100 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-base-content dark:text-white">
            My <span className="text-purple-500">Projects</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-sm md:text-base text-base-content/70 dark:text-slate-300">
            View today’s projects, all active projects, and update status
            step-by-step.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="min-h-[50vh] flex items-center justify-center">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : (
          <>
            {/* 2) Today's projects */}
            <Table
              title="Today’s Projects"
              subtitle={`Projects scheduled for today (${today}) and not completed.`}
              data={todaysBookings}
            />

            {/* 3) All active projects */}
            <Table
              title="All Active Projects"
              subtitle="All assigned projects that are not completed."
              data={activeBookings}
            />
          </>
        )}
      </div>

      {/* Status Update Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />

          {/* modal */}
          <div className="relative w-full max-w-lg rounded-2xl bg-base-100 dark:bg-gray-800 border border-base-300 dark:border-gray-700 shadow-lg overflow-hidden">
            <div className="p-4 md:p-6 border-b border-base-300 dark:border-gray-700 flex items-start justify-between">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-base-content dark:text-white">
                  Update Project Status
                </h3>
                <p className="text-sm text-base-content/70 dark:text-gray-300 mt-1">
                  Current:{" "}
                  <span className="font-semibold">
                    {selectedBooking?.status || "Assigned"}
                  </span>
                </p>
              </div>

              <button className="btn btn-sm" onClick={closeModal}>
                Close
              </button>
            </div>

            <div className="p-4 md:p-6">
              <div className="mb-3">
                <label className="label">
                  <span className="label-text dark:text-white">
                    Select next status
                  </span>
                </label>

                <select
                  className="select select-bordered w-full dark:bg-gray-900 dark:text-white dark:border-gray-600"
                  value={nextStatus}
                  onChange={(e) => setNextStatus(e.target.value)}
                >
                  {getRemainingStatuses(
                    selectedBooking?.status || "Assigned"
                  ).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <p className="text-xs text-base-content/60 dark:text-gray-300 mt-2">
                  Only remaining steps are shown.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button className="btn btn-sm" onClick={closeModal}>
                  Cancel
                </button>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={handleUpdateStatus}
                  disabled={!nextStatus}
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProjects;
