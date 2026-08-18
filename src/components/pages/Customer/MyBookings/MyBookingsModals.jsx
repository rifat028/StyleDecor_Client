import React from "react";
import {
  Calendar,
  MapPin,
  ShieldCheck,
  Star,
} from "lucide-react";
import Modal from "../../../ui/Modal";

// 1. Full View Dossier Modal
export const MyBookingsViewModal = ({ isOpen, onClose, selectedBooking }) => {
  if (!isOpen || !selectedBooking) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Booking Dossier: ${selectedBooking.bookingCode || `BK-${selectedBooking._id.slice(-6).toUpperCase()}`}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6 text-xs text-slate-600 dark:text-slate-300">
        {/* Service & Agency Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
              {selectedBooking.serviceSnapshot?.category ||
                selectedBooking.serviceCategory ||
                "Event Decor"}
            </span>
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {selectedBooking.serviceSnapshot?.title || selectedBooking.serviceName}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Package Tier:{" "}
              <span className="font-semibold text-purple-600 dark:text-purple-400">
                {selectedBooking.serviceSnapshot?.selectedPackage ||
                  selectedBooking.packageTier ||
                  "Standard Setup"}
              </span>
            </p>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Providing Agency
            </span>
            <p className="font-bold text-slate-900 dark:text-slate-100">
              {selectedBooking.decorator?.businessName || "StyleDecor Verified Agency"}
            </p>
            <p className="text-[11px] text-slate-400">
              {selectedBooking.decorator?.contactInfo?.phone || "Support Available"}
            </p>
          </div>
        </div>

        {/* Dedicated Agent Card (if assigned) */}
        {selectedBooking.assignedAgent && (
          <div className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40 flex items-center gap-3">
            <img
              src={
                selectedBooking.assignedAgent.photoUrl ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
              }
              alt={selectedBooking.assignedAgent.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500 shrink-0"
            />
            <div>
              <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                Dedicated Event Specialist Assigned
              </span>
              <p className="font-bold text-slate-900 dark:text-slate-100">
                {selectedBooking.assignedAgent.name} (
                {selectedBooking.assignedAgent.designation || "Lead Decorator"})
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Direct Contact: {selectedBooking.assignedAgent.phone}
              </p>
            </div>
          </div>
        )}

        {/* Event Logistics Matrix */}
        <div className="space-y-2">
          <h5 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">
            Event Logistics & Schedule
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-1">
              <span className="text-[10px] text-slate-400">Event Date & Timing</span>
              <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                {selectedBooking.eventDetails?.eventDate
                  ? new Date(
                      selectedBooking.eventDetails.eventDate
                    ).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : selectedBooking.bookingDate || "TBD"}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Hours: {selectedBooking.eventDetails?.startTime || "16:00"} –{" "}
                {selectedBooking.eventDetails?.endTime || "22:00"}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-1">
              <span className="text-[10px] text-slate-400">Venue & Location</span>
              <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                {selectedBooking.eventDetails?.venueName ||
                  selectedBooking.location ||
                  "Venue TBD"}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                {selectedBooking.eventDetails?.venueAddress ||
                  selectedBooking.location ||
                  "Dhaka"}
              </p>
            </div>
          </div>
        </div>

        {/* Special Instructions */}
        {selectedBooking.eventDetails?.specialInstructions && (
          <div className="space-y-1">
            <h5 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">
              Special Instructions
            </h5>
            <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 italic">
              "{selectedBooking.eventDetails.specialInstructions}"
            </p>
          </div>
        )}

        {/* Financial Breakdown Summary */}
        <div className="p-4 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-2">
          <h5 className="font-bold text-purple-950 dark:text-purple-200 uppercase tracking-wider text-[11px]">
            Financial Breakdown
          </h5>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Package Subtotal</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              ৳
              {Number(
                selectedBooking.pricingBreakdown?.subtotal ||
                  selectedBooking.totalCost ||
                  0
              ).toLocaleString()}
            </span>
          </div>
          {selectedBooking.pricingBreakdown?.serviceTax > 0 && (
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Platform Service Tax</span>
              <span>
                ৳{Number(selectedBooking.pricingBreakdown.serviceTax).toLocaleString()}
              </span>
            </div>
          )}
          <div className="pt-2 border-t border-purple-200/60 dark:border-purple-900/60 flex justify-between font-black text-sm text-slate-900 dark:text-slate-100">
            <span>Grand Total</span>
            <span className="text-purple-600 dark:text-purple-400">
              ৳
              {Number(
                selectedBooking.pricingBreakdown?.grandTotal ||
                  selectedBooking.totalCost ||
                  0
              ).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Modal Close Button */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer text-xs transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </Modal>
  );
};

// 2. Edit Booking Logistics Modal
export const EditBookingModal = ({
  isOpen,
  onClose,
  selectedBooking,
  editFormData,
  setEditFormData,
  onSubmit,
}) => {
  if (!isOpen || !selectedBooking) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Event Logistics"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={onSubmit} className="space-y-4 text-xs">
        {/* Date & Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              Event Date *
            </label>
            <input
              type="date"
              required
              value={editFormData.eventDate}
              onChange={(e) =>
                setEditFormData({ ...editFormData, eventDate: e.target.value })
              }
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              Contact Phone Number *
            </label>
            <input
              type="text"
              required
              placeholder="+880 17XXXXXXXX"
              value={editFormData.contact}
              onChange={(e) =>
                setEditFormData({ ...editFormData, contact: e.target.value })
              }
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
        </div>

        {/* Start Time & End Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              Event Start Time
            </label>
            <input
              type="time"
              value={editFormData.startTime}
              onChange={(e) =>
                setEditFormData({ ...editFormData, startTime: e.target.value })
              }
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              Event End Time
            </label>
            <input
              type="time"
              value={editFormData.endTime}
              onChange={(e) =>
                setEditFormData({ ...editFormData, endTime: e.target.value })
              }
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
        </div>

        {/* Venue Name & Address */}
        <div className="space-y-1">
          <label className="font-bold text-slate-700 dark:text-slate-300">
            Venue / Banquet Hall Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Sena Kunja Grand Ballroom"
            value={editFormData.venueName}
            onChange={(e) =>
              setEditFormData({ ...editFormData, venueName: e.target.value })
            }
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500/20"
          />
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-700 dark:text-slate-300">
            Venue Full Address *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Dhaka Cantonment, Dhaka"
            value={editFormData.venueAddress}
            onChange={(e) =>
              setEditFormData({ ...editFormData, venueAddress: e.target.value })
            }
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500/20"
          />
        </div>

        {/* Guest Count */}
        <div className="space-y-1">
          <label className="font-bold text-slate-700 dark:text-slate-300">
            Estimated Guest Count
          </label>
          <input
            type="number"
            min="10"
            placeholder="100"
            value={editFormData.guestCountEstimate}
            onChange={(e) =>
              setEditFormData({
                ...editFormData,
                guestCountEstimate: e.target.value,
              })
            }
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500/20"
          />
        </div>

        {/* Special Instructions */}
        <div className="space-y-1">
          <label className="font-bold text-slate-700 dark:text-slate-300">
            Special Instructions / Requests
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Stage lighting setup needs to be done before 3 PM..."
            value={editFormData.specialInstructions}
            onChange={(e) =>
              setEditFormData({
                ...editFormData,
                specialInstructions: e.target.value,
              })
            }
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500/20"
          />
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer text-xs shadow-md shadow-purple-600/25 transition-all"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
};

// 3. Pay Modal (Advance Deposit vs Full Settlement)
export const PayModal = ({
  isOpen,
  onClose,
  payBooking,
  payType,
  setPayType,
  payMethod,
  setPayMethod,
  isProcessingPay,
  onSubmit,
}) => {
  if (!isOpen || !payBooking) return null;

  const grandTotal = Number(
    payBooking.pricingBreakdown?.grandTotal || payBooking.totalCost || 0
  );
  const paidAmount = Number(payBooking.pricingBreakdown?.paidAmount || 0);
  const remainingDue = Math.max(0, grandTotal - paidAmount);
  const depositAmount = Math.round(grandTotal * 0.4);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Payment Checkout: ${payBooking.bookingCode || "Event Booking"}`}
      maxWidth="max-w-lg"
    >
      <form onSubmit={onSubmit} className="space-y-4 text-xs text-slate-700 dark:text-slate-200">
        {/* Service & Total Banner */}
        <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 space-y-1">
          <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
            Service Reservation
          </span>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            {payBooking.serviceSnapshot?.title || payBooking.serviceName}
          </h4>
          <div className="pt-2 flex items-center justify-between text-xs font-semibold">
            <span>Grand Total: ৳{grandTotal.toLocaleString()}</span>
            <span className="text-emerald-600 dark:text-emerald-400">
              Paid: ৳{paidAmount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Payment Type Selection */}
        <div className="space-y-2">
          <label className="font-bold text-slate-800 dark:text-slate-100">
            Select Payment Stage:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPayType("advance_deposit")}
              className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                payType === "advance_deposit"
                  ? "border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold shadow-xs"
                  : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-slate-300"
              }`}
            >
              <p className="font-bold">40% Advance Deposit</p>
              <p className="text-[11px] text-slate-500">
                ৳{depositAmount.toLocaleString()}
              </p>
            </button>

            <button
              type="button"
              onClick={() => setPayType("full_payment")}
              className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                payType === "full_payment"
                  ? "border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold shadow-xs"
                  : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-slate-300"
              }`}
            >
              <p className="font-bold">Full Settlement</p>
              <p className="text-[11px] text-slate-500">
                ৳{(remainingDue > 0 ? remainingDue : grandTotal).toLocaleString()}
              </p>
            </button>
          </div>
        </div>

        {/* Payment Method Gateway Selection */}
        <div className="space-y-2">
          <label className="font-bold text-slate-800 dark:text-slate-100">
            Choose Payment Gateway:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "bkash", name: "bKash" },
              { id: "nagad", name: "Nagad" },
              { id: "sslcommerz", name: "SSLCommerz" },
              { id: "bank_transfer", name: "Bank Transfer" },
              { id: "stripe", name: "Stripe Card" },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setPayMethod(m.id)}
                className={`p-2.5 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                  payMethod === m.id
                    ? "border-purple-600 bg-purple-600 text-white shadow-sm"
                    : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>

        {/* Escrow Assurance */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 text-[11px] text-slate-500 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Your funds are protected under StyleDecor Escrow until event completion.</span>
        </div>

        {/* Modal Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer text-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isProcessingPay}
            className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer text-xs shadow-md shadow-purple-600/25 disabled:opacity-50 transition-all"
          >
            {isProcessingPay
              ? "Processing..."
              : `Pay ৳${(payType === "advance_deposit" ? depositAmount : remainingDue > 0 ? remainingDue : grandTotal).toLocaleString()}`}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// 4. Rate & Review Celebration Modal
export const ReviewModal = ({
  isOpen,
  onClose,
  reviewBooking,
  reviewRating,
  setReviewRating,
  hoverRating,
  setHoverRating,
  reviewComment,
  setReviewComment,
  isSubmittingReview,
  onSubmit,
}) => {
  if (!isOpen || !reviewBooking) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Rate Your Celebration Setup"
      maxWidth="max-w-lg"
    >
      <form onSubmit={onSubmit} className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
        {/* Event Info Card */}
        <div className="p-3.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 space-y-1">
          <p className="font-extrabold text-sm text-purple-950 dark:text-purple-200">
            {reviewBooking.serviceSnapshot?.title || reviewBooking.serviceName}
          </p>
          <p className="text-[11px] text-slate-500 flex items-center gap-2">
            <span>Venue: {reviewBooking.eventDetails?.venueName || "Venue"}</span>
            {reviewBooking.assignedAgent?.name && (
              <span>
                • Specialist:{" "}
                <b className="text-purple-700 dark:text-purple-300">
                  {reviewBooking.assignedAgent.name}
                </b>
              </span>
            )}
          </p>
        </div>

        {/* Star Rating Selector */}
        <div className="space-y-1.5 text-center py-1">
          <label className="font-bold text-xs text-slate-800 dark:text-slate-200 block">
            How would you rate the decoration and execution?
          </label>
          <div className="flex items-center justify-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => {
              const isFilled = (hoverRating || reviewRating) >= star;
              return (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setReviewRating(star)}
                  className="p-1 transition-transform hover:scale-125 cursor-pointer focus:outline-hidden"
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      isFilled
                        ? "text-amber-400 fill-amber-400 drop-shadow-xs"
                        : "text-slate-300 dark:text-slate-700"
                    }`}
                  />
                </button>
              );
            })}
          </div>
          <span className="text-xs font-black text-amber-500">
            {reviewRating === 5 && "★★★★★ Outstanding & Flawless!"}
            {reviewRating === 4 && "★★★★☆ Great Setup & Execution"}
            {reviewRating === 3 && "★★★☆☆ Satisfactory"}
            {reviewRating === 2 && "★★☆☆☆ Needs Improvement"}
            {reviewRating === 1 && "★☆☆☆☆ Disappointed"}
          </span>
        </div>

        {/* Quick Feedback Chips */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-slate-300">
            Quick Comments:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {[
              "Fairytale wedding stage setup!",
              "On-time delivery and friendly specialists.",
              "The lighting and flower canopy were breathtaking!",
              "Professional crew, zero stress execution.",
            ].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() =>
                  setReviewComment((prev) =>
                    prev ? `${prev} ${chip}` : chip
                  )
                }
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-950/60 text-[10px] font-semibold text-slate-600 dark:text-slate-300 cursor-pointer transition-all border border-slate-200 dark:border-slate-700"
              >
                + {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Comment Textarea */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-slate-300">
            Detailed Feedback:
          </label>
          <textarea
            rows={3}
            required
            placeholder="Share details about the stage styling, floral quality, lighting, and specialist coordination..."
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-purple-500/20"
          />
        </div>

        {/* Modal Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer text-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmittingReview || !reviewComment.trim()}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer text-xs shadow-md shadow-purple-600/25 disabled:opacity-50 flex items-center gap-1.5 transition-all"
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{isSubmittingReview ? "Submitting..." : "Publish Review"}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
