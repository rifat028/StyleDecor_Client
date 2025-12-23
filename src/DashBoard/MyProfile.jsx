import React, { use, useEffect, useState } from "react";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { AuthContext } from "../Authentication/AuthContext";
import Spinner from "../Components/Spinner";

const MyProfile = () => {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await axiosSecure.get(`/users/${user?.email}`);
        // console.log(res.data);
        setUserData(res.data);
      } catch (error) {
        console.error("Failed to load user profile", error);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [axiosSecure, user]);

  if (loading) {
    return <Spinner></Spinner>;
  }

  if (!userData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-700 dark:text-gray-300 font-bold">
          User profile not found.
        </p>
      </div>
    );
  }

  const { name, email, photoUrl, role } = userData;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
          My Profile
        </h1>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Profile Image */}
            <div className="shrink-0">
              <img
                src={photoUrl}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-purple-500"
              />
            </div>

            {/* Profile Info */}
            <div className="w-full space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Full Name
                </p>
                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                  {name}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Email Address
                </p>
                <p className="text-lg text-gray-800 dark:text-white">{email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  User Type
                </p>
                <span className="inline-block mt-1 px-4 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200">
                  {role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Extra note */}
        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          Profile information is managed by the system administrator.
        </p>
      </div>
    </div>
  );
};

export default MyProfile;
