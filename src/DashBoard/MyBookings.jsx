import React, { useContext, useEffect, useMemo, useState } from "react";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { AuthContext } from "../Authentication/AuthContext";
import Swal from "sweetalert2";
import { Tooltip } from "react-tooltip";
import { FaEdit, FaTrashAlt, FaCreditCard } from "react-icons/fa";
import Spinner from "../Components/Spinner";
import BookingNotFound from "../Components/MyBookingsComponents/BookingNotFound";

const MyBookings = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // edit form state (only editable fields)
  const [editContact, setEditContact] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editUnit, setEditUnit] = useState("");
  const [editDate, setEditDate] = useState("");

  const tooltipId = useMemo(() => "booking-actions-tooltip", []);

  useEffect(() => {
    if (!user?.email) return;

    const loadBookings = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(`/bookings/${user.email}`);
        setBookings(res.data || []);
      } catch (error) {
        console.error("Failed to load bookings:", error);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [axiosSecure, user?.email]);

  // ---------- Actions ----------
  const handleCancelBooking = async (bookingId) => {
    const result = await Swal.fire({
      title: "Cancel booking?",
      text: "This booking will be removed permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it",
      cancelButtonText: "No",
    });

    if (!result.isConfirmed) return;

    try {
      // ✅ Server should have: DELETE /bookings/:id
      await axiosSecure.delete(`/bookings/${bookingId}`);

      // update UI
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));

      Swal.fire({
        title: "Cancelled!",
        text: "Your booking has been cancelled.",
        icon: "success",
      });
    } catch (error) {
      console.error("Cancel failed:", error);
      Swal.fire({
        title: "Failed!",
        text: "Could not cancel booking. Please try again.",
        icon: "error",
      });
    }
  };

  const openEditModal = (booking) => {
    setSelectedBooking(booking);
    setEditContact(booking?.contact || "");
    setEditLocation(booking?.location || "");
    setEditUnit(String(booking?.unit ?? ""));
    setEditDate(booking?.bookingDate || "");
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setSelectedBooking(null);
  };

  const handleConfirmEdit = async (e) => {
    e.preventDefault();
    if (!selectedBooking?._id) return;

    const result = await Swal.fire({
      title: "Save changes?",
      text: "Your booking information will be updated.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, update",
      cancelButtonText: "No",
    });

    if (!result.isConfirmed) return;

    const updatedData = {
      contact: editContact,
      location: editLocation,
      unit: editUnit,
      bookingDate: editDate,
      totalCost: Number(editUnit) * selectedBooking.unitCost,
    };

    try {
      // ✅ Server should have: PATCH /bookings/:id
      const res = await axiosSecure.patch(
        `/bookings/${selectedBooking._id}`,
        updatedData
      );

      // update UI (optimistic update)
      if (res?.data?.modifiedCount > 0 || res?.data?.acknowledged) {
        setBookings((prev) =>
          prev.map((b) =>
            b._id === selectedBooking._id ? { ...b, ...updatedData } : b
          )
        );
      } else {
        // even if backend doesn't return modifiedCount, still update locally
        setBookings((prev) =>
          prev.map((b) =>
            b._id === selectedBooking._id ? { ...b, ...updatedData } : b
          )
        );
      }

      closeEditModal();
      Swal.fire({
        title: "Updated!",
        text: "Booking updated successfully.",
        icon: "success",
      });
    } catch (error) {
      console.error("Edit failed:", error);
      Swal.fire({
        title: "Failed!",
        text: "Could not update booking. Please try again.",
        icon: "error",
      });
    }
  };

  const handlePay = async () => {
    // 🔥 You said you will implement later
    Swal.fire({
      title: "Coming soon",
      text: "Payment will be implemented later.",
      icon: "info",
    });
  };

  if (loading) {
    return <Spinner></Spinner>;
  }

  return (
    <div className="min-h-screen bg-base-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8 pt-5 md:pt-0">
        {/* Title */}
        <div className="bg-base-200 dark:bg-slate-900 mb-5 rounded-2xl">
          <div className="max-w-7xl mx-auto px-4 py-10 md:py-14 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-base-content dark:text-white">
              My <span className="text-purple-500">Bookings</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-sm md:text-base text-base-content/70 dark:text-slate-300">
              Here is your booking history. You can see status and payment info.
            </p>
          </div>
        </div>

        {/* Empty state */}
        {bookings.length === 0 ? (
          <BookingNotFound></BookingNotFound>
        ) : (
          <div className="rounded-2xl border border-base-300 dark:border-gray-700 bg-base-100 dark:bg-gray-800 overflow-hidden">
            {/* ✅ Responsive table wrapper */}
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead className="bg-base-200 dark:bg-gray-700">
                  <tr className="text-base-content dark:text-white">
                    <th>#</th>
                    <th>Service</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Total Cost</th>
                    <th>Unit</th>
                    <th>Status</th>
                    <th>Paid</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((booking, index) => (
                    <tr
                      key={booking._id || index}
                      className="text-base-content dark:text-gray-100"
                    >
                      <td>{index + 1}</td>

                      <td className="min-w-60">
                        <p className="font-semibold">{booking.serviceName}</p>
                        <p className="text-xs text-base-content/60 dark:text-gray-300">
                          Provider: {booking.serviceProviderEmail}
                        </p>
                      </td>

                      <td className="capitalize">{booking.serviceCategory}</td>
                      <td className="min-w-30">{booking.bookingDate}</td>
                      <td className="min-w-35">{booking.location}</td>
                      <td className="min-w-30">৳{booking.totalCost}</td>
                      <td className="min-w-20">{booking.unit}</td>

                      <td className="min-w-30">
                        <span
                          className={`badge ${
                            booking.status === "completed"
                              ? "badge-success"
                              : booking.status === "confirmed"
                              ? "badge-info"
                              : "badge-warning"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>

                      <td className="min-w-22">
                        <span
                          className={`badge ${
                            booking.paid ? "badge-success" : "badge-error"
                          }`}
                        >
                          {booking.paid ? "Yes" : "No"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="min-w-37">
                        <div className="flex items-center justify-center gap-3">
                          {/* Edit */}
                          <button
                            type="button"
                            className="btn btn-sm btn-outline dark:border-gray-600"
                            data-tooltip-id={tooltipId}
                            data-tooltip-content="Edit"
                            onClick={() => openEditModal(booking)}
                          >
                            <FaEdit />
                          </button>

                          {/* Cancel */}
                          <button
                            type="button"
                            className="btn btn-sm btn-outline dark:border-gray-600"
                            data-tooltip-id={tooltipId}
                            data-tooltip-content="Cancel"
                            onClick={() => handleCancelBooking(booking._id)}
                          >
                            <FaTrashAlt />
                          </button>

                          {/* Pay */}
                          <button
                            type="button"
                            className="btn btn-sm btn-outline dark:border-gray-600"
                            data-tooltip-id={tooltipId}
                            data-tooltip-content="Pay"
                            onClick={handlePay}
                          >
                            <FaCreditCard />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Tooltip component */}
              <Tooltip id={tooltipId} place="top" />
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-base-200 dark:bg-gray-700 flex items-center justify-between">
              <p className="text-sm text-base-content/70 dark:text-gray-200">
                Total bookings:{" "}
                <span className="font-semibold">{bookings.length}</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ===================== Edit Modal ===================== */}
      {isEditOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeEditModal}
          />

          {/* modal box */}
          <div className="relative w-full max-w-2xl rounded-2xl bg-base-100 dark:bg-gray-800 border border-base-300 dark:border-gray-700 p-6 shadow-lg">
            <h3 className="text-xl font-bold text-base-content dark:text-white">
              Edit Booking
            </h3>
            <p className="mt-1 text-sm text-base-content/70 dark:text-gray-300">
              Only contact, location, unit and date can be changed.
            </p>

            <form onSubmit={handleConfirmEdit} className="mt-5 grid gap-4">
              {/* Editable fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text dark:text-gray-200">
                      Contact No
                    </span>
                  </label>
                  <input
                    value={editContact}
                    onChange={(e) => setEditContact(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="input input-bordered w-full dark:bg-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text dark:text-gray-200">Unit</span>
                  </label>
                  <input
                    value={editUnit}
                    onChange={(e) => setEditUnit(e.target.value)}
                    placeholder="1"
                    className="input input-bordered w-full dark:bg-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text dark:text-gray-200">
                      Booking Date
                    </span>
                  </label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="input input-bordered w-full dark:bg-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text dark:text-gray-200">
                      Location
                    </span>
                  </label>
                  <input
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    placeholder="Dhaka"
                    className="input input-bordered w-full dark:bg-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-2 flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  type="button"
                  className="btn btn-outline dark:border-gray-600 dark:text-gray-100"
                  onClick={closeEditModal}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
