import React from "react";
import Banner from "../../Components/Pages/PublicPages/HomeComponents/Banner";
import Categories from "../../Components/Pages/PublicPages/HomeComponents/Categories";
import CoverageMap from "../../Components/Pages/PublicPages/HomeComponents/CoverageMap";
import { useLoaderData } from "react-router";
import LatestServices from "../../Components/Pages/PublicPages/HomeComponents/LatestServices";
import TopRatedDecorators from "../../Components/Pages/PublicPages/HomeComponents/TopRatedDecorators";

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
