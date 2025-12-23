import React from "react";

const BookingNotFound = () => {
  return (
    <div className="rounded-2xl border border-base-300 dark:border-gray-700 bg-base-200 dark:bg-gray-800 p-8 text-center">
      <p className="text-base-content dark:text-white font-medium">
        No bookings found.
      </p>
      <p className="mt-2 text-sm text-base-content/70 dark:text-gray-300">
        Book a service and your bookings will appear here.
      </p>
    </div>
  );
};

export default BookingNotFound;
