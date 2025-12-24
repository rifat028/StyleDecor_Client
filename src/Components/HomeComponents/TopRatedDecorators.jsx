import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import pic from "../../assets/Avatar.jpg";

const TopRatedDecorators = () => {
  const axiosSecure = useAxiosSecure();
  const [decorators, setDecorators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTopRated = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get("/decorator/toprated");
        setDecorators(res.data || []);
      } catch (error) {
        console.error("Failed to load top rated decorators", error);
        setDecorators([]);
      } finally {
        setLoading(false);
      }
    };

    loadTopRated();
  }, [axiosSecure]);

  if (loading) {
    return (
      <div className="py-10 flex justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (decorators.length === 0) {
    return (
      <div className="py-10 text-center text-base-content/70 dark:text-gray-300">
        No decorators found.
      </div>
    );
  }

  return (
    <section className="py-10 md:py-14">
      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-4xl font-bold text-base-content dark:text-white">
          Top Rated <span className="text-purple-500">Decorators</span>
        </h2>
        <p className="mt-2 text-sm md:text-base text-base-content/70 dark:text-gray-300">
          Highly rated decorators with proven experience
        </p>
      </div>

      {/* Marquee */}
      <Marquee
        pauseOnHover
        speed={40}
        gradient={true}
        gradientColor={[245, 245, 245]}
        className="py-4"
      >
        {decorators.map((decorator) => (
          <div
            key={decorator._id}
            className="mx-3 min-w-55 bg-base-200 dark:bg-gray-800 border border-base-300 dark:border-gray-700 rounded-2xl p-4 flex items-center gap-4"
          >
            {/* Photo */}
            <div className="avatar">
              <div className="w-12 h-12 rounded-full ring ring-purple-500 ring-offset-base-100 dark:ring-offset-gray-900">
                <img
                  src={pic || "https://placehold.co/100x100?text=DP"}
                  alt={decorator.name}
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h3 className="font-semibold text-base-content dark:text-white">
                {decorator.name}
              </h3>

              <p className="text-xs text-base-content/70 dark:text-gray-300">
                Experience: {decorator.experience} yrs
              </p>

              <div className="mt-1 flex gap-2 text-xs">
                <span className="badge badge-primary">⭐</span>
                <span className="badge badge-outline">
                  Completed: {decorator.taskCompleted || 0}
                </span>
              </div>
            </div>
          </div>
        ))}
      </Marquee>
    </section>
  );
};

export default TopRatedDecorators;
