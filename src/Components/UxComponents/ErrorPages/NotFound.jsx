import React from "react";
import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center bg-base-200 dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
        <h1 className="text-6xl font-bold text-purple-500 mb-4">404</h1>

        <h2 className="text-2xl font-semibold text-base-content dark:text-white mb-3">
          Page Not Found
        </h2>

        <p className="text-sm text-base-content/70 dark:text-gray-300 mb-6">
          Sorry, the page you are looking for doesn’t exist or has been moved.
        </p>

        <div className="flex justify-center gap-3">
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
