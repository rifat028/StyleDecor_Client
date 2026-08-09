import React from "react";
import Banner from "./components/Banner";
import Categories from "./components/Categories";
import CoverageMap from "./components/CoverageMap";
import { useLoaderData } from "react-router";
import LatestServices from "./components/LatestServices";
import TopRatedDecorators from "./components/TopRatedDecorators";

const Home = () => {
  const coverage = useLoaderData();
  // console.log(coverage);
  return (
    <div>
      <Banner></Banner>
      <Categories></Categories>
      <LatestServices></LatestServices>
      <TopRatedDecorators></TopRatedDecorators>
      <CoverageMap coverage={coverage}></CoverageMap>
    </div>
  );
};

export default Home;
