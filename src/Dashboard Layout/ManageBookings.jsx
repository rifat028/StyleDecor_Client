import React, { useEffect, useMemo, useState } from "react";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import Spinner from "../Components/Spinner";

/**
 * ✅ ManageBooking.jsx (Admin) - Updated
 * Changes:
 * 1) Pagination: 10 per page
 * 2) Sorting by bookingDate for BOTH assigned/unassigned
 * 3) Sorting by status for assigned bookings (custom order)
 *
 * ✅ Server-side sorting is easy for bookingDate -> we do it server side.
 * ✅ Status custom order is harder in Mongo (unless you store statusIndex).
 *    So we do status sorting client-side only for assigned bookings.
 *
 * APIs used (same as before + one updated GET param):
 * - GET /bookings?assigned=true|false&paid=true|false&page=1&limit=10&sortDate=asc|desc
 * - GET /decorators?status=accepted&location=Dhaka
 * - PATCH /bookings/:id/assign
 * - PATCH /decorators/:id/task
 */

const PAGE_SIZE = 5;

const ManageBooking = () => {
  const axiosSecure = useAxiosSecure();

  // left filter
  const [assignFilter, setAssignFilter] = useState("unassigned"); // default
  // right filter
  const [paidFilter, setPaidFilter] = useState("all"); // all | paid | unpaid

  // sorting
  const [dateSort, setDateSort] = useState("desc"); // asc | desc
  const [statusSort, setStatusSort] = useState("none"); // none | asc | desc (only for assigned)

  // pagination
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // data
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [decorators, setDecorators] = useState([]);
  const [decoratorLoading, setDecoratorLoading] = useState(false);

  // custom status order for assigned
  const statusOrder = useMemo(
    () => ({
      Assigned: 1,
      "Planning Phase": 2,
      "Materials Prepared": 3,
      "On the Way to Venue": 4,
      "Setup in Progress": 5,
      Completed: 6,
    }),
    []
  );

  // ------- Load bookings with pagination + bookingDate sort (server-side) -------
  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);

        const assigned = assignFilter === "assigned" ? "true" : "false";

        let url = `/bookings?assigned=${assigned}&page=${page}&limit=${PAGE_SIZE}&sortDate=${dateSort}`;
        if (paidFilter !== "all") {
          url += `&paid=${paidFilter === "paid" ? "true" : "false"}`;
        }
        const res = await axiosSecure.get(url);
        setBookings(res.data?.data || []);
        setTotalCount(res.data?.totalCount || 0);
      } catch (err) {
        console.error("Failed to load bookings:", err);
        setBookings([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [axiosSecure, assignFilter, paidFilter, dateSort, page]);

  // reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [assignFilter, paidFilter, dateSort]);

  // -------================== Client-side status sort (assigned only) ===========================-------
  const visibleBookings = useMemo(() => {
    if (assignFilter !== "assigned") return bookings;
    if (statusSort === "none") return bookings;

    const copy = [...bookings];
    copy.sort((a, b) => {
      const aVal = statusOrder[a.status] || 999;
      const bVal = statusOrder[b.status] || 999;
      return statusSort === "asc" ? aVal - bVal : bVal - aVal;
    });
    return copy;
  }, [bookings, assignFilter, statusSort, statusOrder]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // ------- Modal open/load decorators by location -------
  const openAssignModal = async (booking) => {
    setSelectedBooking(booking);
    setModalOpen(true);
    setDecorators([]);
    setDecoratorLoading(true);

    try {
      const res = await axiosSecure.get(
        `/decorators?status=accepted&location=${encodeURIComponent(
          booking.location
        )}`
      );
      setDecorators(res.data || []);
    } catch (err) {
      console.error("Failed to load decorators:", err);
      setDecorators([]);
    } finally {
      setDecoratorLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedBooking(null);
    setDecorators([]);
  };

  // ------- Assign flow -------
  const handleSelectDecorator = async (decorator) => {
    if (!selectedBooking?._id) return;

    const confirm = await Swal.fire({
      title: "Assign this decorator?",
      text: `Booking will be assigned to ${decorator.name}.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Assign",
      cancelButtonText: "Cancel",
    });
    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.patch(`/bookings/${selectedBooking._id}/assign`, {
        assignTo: decorator._id,
        status: "Assigned",
        assigned: true,
      });

      await axiosSecure.patch(`/decorators/${decorator._id}/task`, {
        incPendingBy: 1,
      });

      Swal.fire("Assigned!", "Booking assigned successfully.", "success");

      // Remove from current page list immediately (unassigned view)
      setBookings((prev) => prev.filter((b) => b._id !== selectedBooking._id));
      setTotalCount((prev) => Math.max(0, prev - 1));

      closeModal();
    } catch (err) {
      console.error("Assign failed:", err);
      Swal.fire("Error", "Failed to assign decorator.", "error");
    }
  };

  // ------- UI helpers -------
  const paidBadge = (paid) =>
    paid ? (
      <span className="badge badge-success">Paid</span>
    ) : (
      <span className="badge badge-error">Unpaid</span>
    );

  const statusBadge = (status) => {
    if (!status) return <span className="badge badge-warning">pending</span>;
    const st = String(status).toLowerCase();
    if (st === "completed")
      return <span className="badge badge-success">Completed</span>;
    if (st.includes("assigned"))
      return <span className="badge badge-info">Assigned</span>;
    return <span className="badge badge-warning">{status}</span>;
  };

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="min-h-screen bg-base-100 dark:bg-gray-900">
      {/* Top section */}
      <div className="bg-base-200 dark:bg-slate-900 mb-6">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-base-content dark:text-white">
            Manage <span className="text-purple-500">Bookings</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-sm md:text-base text-base-content/70 dark:text-slate-300">
            Assign decorators to bookings and monitor progress.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-10">
        {/* Controls row */}
        <div className="mb-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Left: radio */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="assignFilter"
                className="radio radio-primary"
                checked={assignFilter === "unassigned"}
                onChange={() => setAssignFilter("unassigned")}
              />
              <span className="text-base-content dark:text-white">
                Unassigned
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="assignFilter"
                className="radio radio-primary"
                checked={assignFilter === "assigned"}
                onChange={() => setAssignFilter("assigned")}
              />
              <span className="text-base-content dark:text-white">
                Assigned
              </span>
            </label>
          </div>

          {/* Right: Filters + Sorting */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-end">
            {/* Paid filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-base-content/70 dark:text-gray-200">
                Payment:
              </span>
              <select
                className="select select-bordered select-sm dark:bg-gray-900 dark:text-white dark:border-gray-600"
                value={paidFilter}
                onChange={(e) => setPaidFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>

            {/* Date sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-base-content/70 dark:text-gray-200">
                Date:
              </span>
              <select
                className="select select-bordered select-sm dark:bg-gray-900 dark:text-white dark:border-gray-600"
                value={dateSort}
                onChange={(e) => setDateSort(e.target.value)}
              >
                <option value="desc">Newest first</option>
                <option value="asc">Oldest first</option>
              </select>
            </div>

            {/* Status sort (assigned only) */}
            {assignFilter === "assigned" && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-base-content/70 dark:text-gray-200">
                  Status:
                </span>
                <select
                  className="select select-bordered select-sm dark:bg-gray-900 dark:text-white dark:border-gray-600"
                  value={statusSort}
                  onChange={(e) => setStatusSort(e.target.value)}
                >
                  <option value="none">No sort</option>
                  <option value="asc">Low → High</option>
                  <option value="desc">High → Low</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <Spinner></Spinner>
        ) : visibleBookings.length === 0 ? (
          <div className="rounded-2xl border border-base-300 dark:border-gray-700 bg-base-200 dark:bg-gray-800 p-8 text-center">
            <p className="text-base-content dark:text-white font-medium">
              No bookings found.
            </p>
            <p className="mt-2 text-sm text-base-content/70 dark:text-gray-300">
              Try changing filters.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-base-300 dark:border-gray-700 bg-base-100 dark:bg-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead className="bg-base-200 dark:bg-gray-700">
                  <tr className="text-base-content dark:text-white">
                    <th>#</th>
                    <th>Client</th>
                    <th>Service</th>
                    <th>Location</th>
                    <th>Booking Date</th>
                    <th>Total</th>
                    <th>Paid</th>
                    <th>Status</th>
                    {assignFilter === "unassigned" ? (
                      <th className="text-center">Action</th>
                    ) : (
                      <th>Assigned To</th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {visibleBookings.map((b, index) => (
                    <tr
                      key={b._id}
                      className="text-base-content dark:text-gray-100"
                    >
                      {/* index should reflect page */}
                      <td>{(page - 1) * PAGE_SIZE + index + 1}</td>

                      <td className="min-w-50">
                        <p className="font-semibold">{b.clientName}</p>
                        <p className="text-xs text-base-content/60 dark:text-gray-300">
                          {b.clientEmail}
                        </p>
                      </td>

                      <td className="min-w-55">
                        <p className="font-semibold">{b.serviceName}</p>
                        <p className="text-xs text-base-content/60 dark:text-gray-300 capitalize">
                          {b.serviceCategory}
                        </p>
                      </td>

                      <td className="min-w-28">{b.location}</td>
                      <td className="min-w-25">{b.bookingDate}</td>
                      <td className="min-w-20">৳{b.totalCost}</td>
                      <td className="min-w-22">{paidBadge(b.paid)}</td>

                      <td className="min-w-30">
                        {assignFilter === "unassigned"
                          ? statusBadge("pending")
                          : statusBadge(b.status || "Assigned")}
                      </td>

                      {assignFilter === "unassigned" ? (
                        <td className="min-w-40">
                          <div className="flex justify-center">
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => openAssignModal(b)}
                            >
                              Assign Decorator
                            </button>
                          </div>
                        </td>
                      ) : (
                        <td className="min-w-55">
                          <span className="text-sm text-base-content/80 dark:text-gray-200">
                            {b.assignTo || "—"}
                          </span>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer pagination */}
            <div className="px-4 py-3 bg-base-200 dark:bg-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-sm text-base-content/70 dark:text-gray-200">
                Showing{" "}
                <span className="font-semibold">
                  {(page - 1) * PAGE_SIZE + 1}
                </span>{" "}
                -{" "}
                <span className="font-semibold">
                  {Math.min(page * PAGE_SIZE, totalCount)}
                </span>{" "}
                of <span className="font-semibold">{totalCount}</span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  className="btn btn-sm"
                  onClick={goPrev}
                  disabled={page === 1}
                >
                  Prev
                </button>
                <span className="text-sm text-base-content dark:text-white">
                  Page <b>{page}</b> / {totalPages}
                </span>
                <button
                  className="btn btn-sm"
                  onClick={goNext}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- Assign Modal ---------------- */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={closeModal}
            />

            <div className="relative w-full max-w-4xl rounded-2xl bg-base-100 dark:bg-gray-800 border border-base-300 dark:border-gray-700 shadow-lg overflow-hidden">
              <div className="p-4 md:p-6 border-b border-base-300 dark:border-gray-700 flex items-start justify-between">
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-base-content dark:text-white">
                    Assign Decorator
                  </h3>
                  <p className="text-sm text-base-content/70 dark:text-gray-300 mt-1">
                    Area:{" "}
                    <span className="font-semibold">
                      {selectedBooking?.location}
                    </span>
                  </p>
                </div>

                <button className="btn btn-sm" onClick={closeModal}>
                  Close
                </button>
              </div>

              <div className="p-4 md:p-6">
                {decoratorLoading ? (
                  <Spinner></Spinner>
                ) : decorators.length === 0 ? (
                  <div className="rounded-xl border border-base-300 dark:border-gray-700 bg-base-200 dark:bg-gray-900 p-6 text-center">
                    <p className="text-base-content dark:text-white font-medium">
                      No decorators found in this area.
                    </p>
                    <p className="text-sm text-base-content/70 dark:text-gray-300 mt-1">
                      Add decorators for this location first.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table w-full">
                      <thead className="bg-base-200 dark:bg-gray-700">
                        <tr className="text-base-content dark:text-white">
                          <th>#</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Expertise</th>
                          <th>Experience</th>
                          <th>Pending</th>
                          <th className="text-center">Select</th>
                        </tr>
                      </thead>
                      <tbody>
                        {decorators.map((d, idx) => (
                          <tr
                            key={d._id}
                            className="text-base-content dark:text-gray-100"
                          >
                            <td>{idx + 1}</td>
                            <td className="font-semibold">{d.name}</td>
                            <td className="min-w-50">{d.email}</td>
                            <td className="capitalize">
                              {d.decorationExpertise}
                            </td>
                            <td>{d.experience} yr</td>
                            <td>{d.taskPending ?? 0}</td>
                            <td>
                              <div className="flex justify-center">
                                <button
                                  className="btn btn-sm btn-primary"
                                  onClick={() => handleSelectDecorator(d)}
                                >
                                  Select
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBooking;
