import React from "react";
import { Link } from "react-router";

const Unauthorize = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center bg-base-200 dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
        <h1 className="text-5xl font-bold text-red-500 mb-4">401</h1>

        <h2 className="text-2xl font-semibold text-base-content dark:text-white mb-2">
          Unauthorized Access
        </h2>

        <p className="text-sm text-base-content/70 dark:text-gray-300 mb-6">
          You don’t have permission to access this page. Please login with the
          correct account or contact support.
        </p>

        <div className="flex gap-3 justify-center">
          <Link to="/login" className="btn btn-primary">
            Go to Login
          </Link>

          <Link to="/" className="btn btn-outline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorize;
