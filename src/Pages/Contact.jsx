import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const Contact = () => {
  const [loading, setLoading] = useState(false);

  // Beginner-friendly form handler (no backend required)
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Fake submit delay (replace with API call later)
    setTimeout(() => {
      setLoading(false);
      toast.success("Successfully sent");
      e.target.reset();
    }, 800);
  };

  return (
    <div className="min-h-screen bg-base-100 dark:bg-slate-950">
      <Toaster position="top-center" reverseOrder={false} />
      {/* Header */}
      <div className="bg-base-200 dark:bg-slate-900">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:py-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-base-content dark:text-slate-100">
            Contact StyleDecor
          </h1>
          <p className="mt-2 max-w-2xl text-sm sm:text-base text-base-content/70 dark:text-slate-300">
            Have a question about a service, package, or booking? Send us a
            message—our team will respond as soon as possible.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Contact Info */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-base-300 dark:border-slate-800 bg-base-100 dark:bg-slate-950 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-base-content dark:text-slate-100">
                Get in touch
              </h2>

              <div className="mt-4 space-y-4">
                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-10 w-10 rounded-xl bg-base-200 dark:bg-slate-900 flex items-center justify-center">
                    <span className="text-lg">📞</span>
                  </div>
                  <div>
                    <p className="font-medium text-base-content dark:text-slate-100">
                      Phone
                    </p>
                    <a
                      href="tel:+8801000000000"
                      className="text-sm text-base-content/70 hover:underline dark:text-slate-300"
                    >
                      +880 10 0000 0000
                    </a>
                    <p className="text-xs text-base-content/60 dark:text-slate-400">
                      Sat–Thu, 10:00 AM – 8:00 PM
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-10 w-10 rounded-xl bg-base-200 dark:bg-slate-900 flex items-center justify-center">
                    <span className="text-lg">✉️</span>
                  </div>
                  <div>
                    <p className="font-medium text-base-content dark:text-slate-100">
                      Email
                    </p>
                    <a
                      href="mailto:support@styledecor.com"
                      className="text-sm text-base-content/70 hover:underline dark:text-slate-300"
                    >
                      support@styledecor.com
                    </a>
                    <p className="text-xs text-base-content/60 dark:text-slate-400">
                      We usually reply within 24 hours
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-10 w-10 rounded-xl bg-base-200 dark:bg-slate-900 flex items-center justify-center">
                    <span className="text-lg">📍</span>
                  </div>
                  <div>
                    <p className="font-medium text-base-content dark:text-slate-100">
                      Office
                    </p>
                    <p className="text-sm text-base-content/70 dark:text-slate-300">
                      House 12, Road 5, Dhanmondi, Dhaka
                    </p>
                    <p className="text-xs text-base-content/60 dark:text-slate-400">
                      (Change this to your real address)
                    </p>
                  </div>
                </div>

                {/* Social */}
                <div className="pt-2">
                  <p className="font-medium text-base-content dark:text-slate-100 hover:scale-105 transition duration-300">
                    Social
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <a
                      href="#"
                      className="btn btn-sm btn-outline dark:border-slate-700 dark:text-slate-100 hover:scale-105 transition duration-300"
                    >
                      Facebook
                    </a>
                    <a
                      href="#"
                      className="btn btn-sm btn-outline dark:border-slate-700 dark:text-slate-100 hover:scale-105 transition duration-300"
                    >
                      Instagram
                    </a>
                    <a
                      href="#"
                      className="btn btn-sm btn-outline dark:border-slate-700 dark:text-slate-100"
                    >
                      YouTube
                    </a>
                  </div>
                </div>
              </div>

              {/* Small note */}
              <div className="mt-6 rounded-xl bg-base-200 dark:bg-slate-900 p-4">
                <p className="text-sm text-base-content/80 dark:text-slate-300">
                  For faster booking support, please include your{" "}
                  <span className="font-semibold">booking ID</span> (if you have
                  one).
                </p>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-base-300 dark:border-slate-800 bg-base-100 dark:bg-slate-950 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-base-content dark:text-slate-100">
                Send a message
              </h2>
              <p className="mt-1 text-sm text-base-content/70 dark:text-slate-300">
                Fill out the form and we’ll get back to you soon.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">
                      <span className="label-text dark:text-slate-200">
                        Your Name
                      </span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g., Moderator Khan"
                      className="input input-bordered w-full bg-base-100 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text dark:text-slate-200">
                        Email
                      </span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="e.g., you@example.com"
                      className="input input-bordered w-full bg-base-100 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                    />
                  </div>
                </div>

                {/* Phone + Topic */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">
                      <span className="label-text dark:text-slate-200">
                        Phone (optional)
                      </span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="e.g., 01XXXXXXXXX"
                      className="input input-bordered w-full bg-base-100 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text dark:text-slate-200">
                        Topic
                      </span>
                    </label>
                    <select
                      name="topic"
                      defaultValue="Booking"
                      className="select select-bordered w-full bg-base-100 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                    >
                      <option>Booking</option>
                      <option>Service & Packages</option>
                      <option>Payment</option>
                      <option>Support</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="label">
                    <span className="label-text dark:text-slate-200">
                      Message
                    </span>
                  </label>
                  <textarea
                    name="message"
                    required
                    placeholder="Write your message here..."
                    className="textarea textarea-bordered w-full min-h-35 bg-base-100 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                  />
                  <p className="mt-1 text-xs text-base-content/60 dark:text-slate-400">
                    Tip: Mention date, location, and service name for quicker
                    help.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between pt-2">
                  <button
                    type="submit"
                    className="btn btn-primary w-full sm:w-auto transition duration-300 transform hover:scale-105 hover:bg-indigo-600"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </button>

                  <div className="text-xs text-base-content/60 dark:text-slate-400">
                    By sending, you agree to be contacted by StyleDecor.
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
