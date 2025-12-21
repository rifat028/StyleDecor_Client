import React from "react";
import Banner from "../Components/HomeComponents/Banner";
import CoverageMap from "../Components/HomeComponents/CoverageMap";
import { useLoaderData } from "react-router";
import LatestServices from "../Components/HomeComponents/LatestServices";

const Home = () => {
  const coverage = useLoaderData();
  // console.log(coverage);
  return (
    <div className="mt-2 md:mt-10">
      <Banner></Banner>
      <LatestServices></LatestServices>
      <CoverageMap coverage={coverage}></CoverageMap>
    </div>
  );
};

export default Home;
