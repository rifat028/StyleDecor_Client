import React, { useContext, useEffect, useState } from "react";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { AuthContext } from "../Authentication/AuthContext";
import Swal from "sweetalert2";

const JoinAsDecorator = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [status, setStatus] = useState("");

  // form state
  const [expertise, setExpertise] = useState("home");
  const [location, setLocation] = useState("Dhaka");
  const [experience, setExperience] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ✅ load user data from server using email
  useEffect(() => {
    if (!user?.email) return;

    const loadUser = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(`/users/${user.email}`);
        setUserInfo(res.data);
        const res2 = await axiosSecure.get(`/decorators/${user.email}`);
        setStatus(res2?.data?.status);
      } catch (err) {
        console.error("Failed to load user info:", err);
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [axiosSecure, user?.email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!experience || Number(experience) < 0) {
      Swal.fire("Invalid", "Please enter a valid experience year.", "warning");
      return;
    }

    const payload = {
      name: userInfo.name,
      email: userInfo.email,
      photoURL: userInfo.photoURL,
      decorationExpertise: expertise,
      location,
      experience: Number(experience),
      status: "pending", // ✅ additional data
    };

    try {
      setSubmitting(true);
      await axiosSecure.post("/decorators", payload);
      const res2 = await axiosSecure.get(`/decorators/${user.email}`);
      setStatus(res2?.data?.status);

      Swal.fire(
        "Submitted!",
        "Your decorator request is pending approval.",
        "success"
      );

      // optional: reset fields
      setExpertise("home");
      setLocation("Dhaka");
      setExperience("");
    } catch (err) {
      console.error("Failed to submit decorator request:", err);
      Swal.fire("Error", "Failed to submit request. Try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-base-content dark:text-white">
          Could not load your profile. Please login again.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 dark:bg-gray-900">
      {/* Top section */}
      <div className="bg-base-200 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-base-content dark:text-white">
            Join as a <span className="text-purple-500">Decorator</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-sm md:text-base text-base-content/70 dark:text-slate-300">
            Fill out this form to request a decorator account. Admin will review
            and approve your request.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-base-100 dark:bg-gray-800 border border-base-300 dark:border-gray-700 rounded-2xl p-6 md:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="grid gap-4">
            {/* Prefilled fields */}
            <div>
              <label className="label">
                <span className="label-text dark:text-gray-200">Name</span>
              </label>
              <input
                value={userInfo.name || ""}
                disabled
                className="input input-bordered w-full dark:bg-gray-900 dark:text-white disabled:opacity-70"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text dark:text-gray-200">Email</span>
              </label>
              <input
                value={userInfo.email || ""}
                disabled
                className="input input-bordered w-full dark:bg-gray-900 dark:text-white disabled:opacity-70"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text dark:text-gray-200">Photo URL</span>
              </label>
              <input
                value={userInfo.photoURL || ""}
                disabled
                className="input input-bordered w-full dark:bg-gray-900 dark:text-white disabled:opacity-70"
              />
            </div>

            {/* Expertise dropdown */}
            <div>
              <label className="label">
                <span className="label-text dark:text-gray-200">
                  Decoration Expertise
                </span>
              </label>
              <select
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
                className="select select-bordered w-full dark:bg-gray-900 dark:text-white dark:border-gray-600"
                required
              >
                <option value="home">Home</option>
                <option value="wedding">Wedding</option>
                <option value="office">Office</option>
                <option value="seminar">Seminar</option>
                <option value="meeting">Meeting</option>
              </select>
            </div>

            {/* Location dropdown */}
            <div>
              <label className="label">
                <span className="label-text dark:text-gray-200">Location</span>
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="select select-bordered w-full dark:bg-gray-900 dark:text-white dark:border-gray-600"
                required
              >
                <option>Dhaka</option>
                <option>Chattogram</option>
                <option>Sylhet</option>
                <option>Rajshahi</option>
                <option>Khulna</option>
                <option>Barishal</option>
                <option>Rangpur</option>
                <option>Mymensingh</option>
                <option>Cumilla</option>
                <option>Narayanganj</option>
                <option>Gazipur</option>
                <option>Bogura</option>
                <option>Jessore</option>
                <option>Noakhali</option>
                <option>Cox's Bazar</option>
                <option>Pabna</option>
                <option>Dinajpur</option>
              </select>
            </div>

            {/* Experience */}
            <div>
              <label className="label">
                <span className="label-text dark:text-gray-200">
                  Experience (years)
                </span>
              </label>
              <input
                type="number"
                min="0"
                placeholder="e.g., 3"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="input input-bordered w-full dark:bg-gray-900 dark:text-white dark:border-gray-600"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary w-full mt-2"
              disabled={submitting || status}
            >
              {status
                ? `Your request is ${status}`
                : submitting
                ? "Submitting..."
                : "Submit Request"}
            </button>

            <p className="text-xs text-base-content/60 dark:text-gray-300 text-center">
              Status will be set to <b>pending</b> until admin approval.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinAsDecorator;
