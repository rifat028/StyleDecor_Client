import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AuthContext } from "../Authentication/AuthContext";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import Spinner from "../Components/Spinner";
import toast, { Toaster } from "react-hot-toast";

const ServiceBooking = () => {
  const { id } = useParams(); // service id
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // user inputs
  const [bookingDate, setBookingDate] = useState("");
  const [location, setLocation] = useState("");
  const [unit, setUnit] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  // load single service
  useEffect(() => {
    const loadService = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(`/services/${id}`);
        setService(res.data);
      } catch (error) {
        console.error("Failed to load service:", error);
        setService(null);
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [axiosSecure, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Prefilled + user input data to store in DB
    const bookingData = {
      clientName: user?.displayName,
      clientEmail: user?.email,
      serviceId: id,
      serviceName: service?.serviceName,
      serviceCategory: service?.serviceCategory,
      serviceProviderEmail: service?.createdByEmail, // from service doc
      unit,
      totalCost,
      bookingDate,
      location,
      // optional extra fields (helpful later)
      status: "pending",
      paid: false,
      createdAt: new Date().toISOString(),
    };
    // console.log(bookingData);

    try {
      setSubmitting(true);
      const res = await axiosSecure.post("/bookings", bookingData);

      // If your backend sends insertedId
      if (res?.data?.insertedId) {
        toast.success("Booking Successful");
        setTimeout(() => {
          navigate("/dashboard/my-bookings");
        }, 1000);
      } else {
        alert("✅ Booking submitted!");
        // navigate("/dashboard/my-bookings");
      }
    } catch (error) {
      console.error("Booking create failed:", error);
      alert("❌ Failed to create booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Spinner></Spinner>;
  }

  if (!service) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-base-content dark:text-slate-200">
          Service not found.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 dark:bg-slate-950">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Header */}
      <div className="bg-base-200 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-base-content dark:text-white">
            Book <span className="text-purple-500">Service</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-sm md:text-base text-base-content/70 dark:text-slate-300">
            Your basic details are auto-filled. Please choose booking date, unit
            and location.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4"
            >
              <h2 className="text-xl font-semibold text-base-content dark:text-white">
                Booking Form
              </h2>

              {/* Client Name (prefilled) */}
              <div>
                <label className="label">
                  <span className="label-text dark:text-slate-200">
                    Client Name
                  </span>
                </label>
                <input
                  type="text"
                  value={user?.displayName || ""}
                  disabled
                  className="input input-bordered w-full dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
              </div>

              {/* Client Email (prefilled) */}
              <div>
                <label className="label">
                  <span className="label-text dark:text-slate-200">
                    Client Email
                  </span>
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="input input-bordered w-full dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
              </div>

              {/* Service Name (prefilled) */}
              <div>
                <label className="label">
                  <span className="label-text dark:text-slate-200">
                    Service Name
                  </span>
                </label>
                <input
                  type="text"
                  value={service?.serviceName || ""}
                  disabled
                  className="input input-bordered w-full dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
              </div>

              {/* Service Category (prefilled) */}
              <div>
                <label className="label">
                  <span className="label-text dark:text-slate-200">
                    Service Category
                  </span>
                </label>
                <input
                  type="text"
                  value={service?.serviceCategory || ""}
                  disabled
                  className="input input-bordered w-full dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
              </div>

              {/* Service Provider Email (prefilled) */}
              <div>
                <label className="label">
                  <span className="label-text dark:text-slate-200">
                    Service Provider
                  </span>
                </label>
                <input
                  type="email"
                  value={service?.createdByEmail || ""}
                  disabled
                  className="input input-bordered w-full dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
              </div>

              {/* Enter Decoration Unit */}
              <div>
                <label className="label">
                  <span className="label-text dark:text-slate-200">
                    Enter Decoration Unit
                  </span>
                </label>
                <input
                  type="number"
                  required
                  onChange={(e) => {
                    setUnit(e.target.value);
                    setTotalCost(service?.cost * e.target.value);
                  }}
                  placeholder={`how many ${service.unit.slice(4)}`}
                  className="input input-bordered w-full dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
              </div>

              {/* Total Cost Calculation */}
              <div>
                <label className="label">
                  <span className="label-text dark:text-slate-200">
                    Total Cost
                  </span>
                </label>
                <input
                  type="number"
                  value={service?.cost * unit || ""}
                  disabled
                  className="input input-bordered w-full dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
              </div>

              {/* Booking Date (user input) */}
              <div>
                <label className="label">
                  <span className="label-text dark:text-slate-200">
                    Booking Date
                  </span>
                </label>
                <input
                  type="date"
                  required
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="input input-bordered w-full dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
              </div>

              {/* Location (user input) */}
              <div>
                <label className="label">
                  <span className="label-text dark:text-slate-200">
                    Location
                  </span>
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Dhanmondi, Dhaka"
                  className="input input-bordered w-full dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full transition duration-300 hover:scale-103 hover:bg-purple-600"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Confirm Booking"}
              </button>

              <p className="text-xs text-base-content/60 dark:text-slate-400 text-center">
                After booking, you can pay from your dashboard.
              </p>
            </form>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-5">
            <div className="bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-2xl p-6 shadow-sm sticky top-6">
              <h3 className="text-xl font-semibold text-base-content dark:text-white">
                Service Summary
              </h3>

              <div className="mt-4 space-y-2">
                <p className="text-sm text-base-content/70 dark:text-slate-300">
                  <span className="font-semibold text-base-content dark:text-white">
                    Category:
                  </span>{" "}
                  {service?.serviceCategory}
                </p>
                <p className="text-sm text-base-content/70 dark:text-slate-300">
                  <span className="font-semibold text-base-content dark:text-white">
                    Unit:
                  </span>{" "}
                  {service?.unit}
                </p>
                <p className="text-sm text-base-content/70 dark:text-slate-300">
                  <span className="font-semibold text-base-content dark:text-white">
                    Rating:
                  </span>{" "}
                  {service?.rating} ⭐ ({service?.totalReviews} reviews)
                </p>
              </div>

              <div className="mt-5 border-t border-base-300 dark:border-slate-700 pt-4">
                <p className="text-sm text-base-content/60 dark:text-slate-400">
                  Price
                </p>
                <p className="text-2xl font-bold text-base-content dark:text-white">
                  ৳{service?.cost}
                </p>
              </div>

              <p className="mt-3 text-xs text-base-content/60 dark:text-slate-400">
                Make sure your date and location are correct before submitting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceBooking;
