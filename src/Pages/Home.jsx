import React from "react";
import Banner from "../Components/HomeComponents/Banner";
import Categories from "../Components/HomeComponents/Categories";
import CoverageMap from "../Components/HomeComponents/CoverageMap";
import { useLoaderData } from "react-router";
import LatestServices from "../Components/HomeComponents/LatestServices";
import TopRatedDecorators from "../Components/HomeComponents/TopRatedDecorators";

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
