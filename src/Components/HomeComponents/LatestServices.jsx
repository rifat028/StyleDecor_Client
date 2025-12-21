import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import ServiceCard from "../ServiceComponents/ServiceCard";
import { useNavigate } from "react-router";

const LatestServices = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [latestServices, setLatestServices] = useState([]);
  useEffect(() => {
    axiosSecure("/services/latest").then((data) =>
      setLatestServices(data.data)
    );
  }, [axiosSecure]);
  console.log(latestServices);
  return (
    <div>
      <h1 className="text-3xl md:text-5xl font-bold text-center dark:text-white py-6 md:py-10">
        Explore our <span className="text-purple-500">latest services</span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mx-2 md:mx-20">
        {latestServices.map((service, index) => (
          <ServiceCard service={service} key={index}></ServiceCard>
        ))}
      </div>
      <div className="flex justify-center py-4 md:py-8">
        <button
          className="bg-yellow-500 hover:bg-yellow-400 text-white font-bold 
                       py-2 px-4 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
          onClick={() => navigate("/services")}
        >
          Explore All Services →
        </button>
      </div>
    </div>
  );
};

export default LatestServices;
