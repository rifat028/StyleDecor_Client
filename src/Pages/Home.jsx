import React from "react";
import Banner from "../Components/HomeComponents/Banner";
import CoverageMap from "../Components/HomeComponents/CoverageMap";
import { useLoaderData } from "react-router";

const Home = () => {
  const coverage = useLoaderData();
  // console.log(coverage);
  return (
    <div>
      <Banner></Banner>
      <CoverageMap coverage={coverage}></CoverageMap>
    </div>
  );
};

export default Home;
