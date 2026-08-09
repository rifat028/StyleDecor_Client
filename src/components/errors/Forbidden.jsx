import React from "react";
import { Link } from "react-router";

const Forbidden = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center bg-base-200 dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
        <h1 className="text-5xl font-bold text-orange-500 mb-4">403</h1>

        <h2 className="text-2xl font-semibold text-base-content dark:text-white mb-2">
          Forbidden Access
        </h2>

        <p className="text-sm text-base-content/70 dark:text-gray-300 mb-6">
          You are logged in, but you do not have permission to view this page.
          If you think this is a mistake, please contact the administrator.
        </p>

        <div className="flex gap-3 justify-center">
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>

          <Link to="/dashboard" className="btn btn-outline">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
