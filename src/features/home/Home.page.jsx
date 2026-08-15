import React from "react";
import Banner from "./components/Banner";
import Categories from "./components/Categories";
import CoverageMap from "./components/CoverageMap";
import { useLoaderData } from "react-router";
import LatestServices from "./components/LatestServices";
import TopRatedDecorators from "./components/TopRatedDecorators";
import FeaturedReviews from "./components/FeaturedReviews";
import HowItWorks from "./components/HowItWorks";
import TrustAssurances from "./components/TrustAssurances";
import JoinAsDecoratorCTA from "./components/JoinAsDecoratorCTA";

const Home = () => {
  const coverage = useLoaderData();

  return (
    <div>
      <Banner></Banner>
      <Categories></Categories>
      <LatestServices></LatestServices>
      <HowItWorks></HowItWorks>
      <TrustAssurances></TrustAssurances>
      <TopRatedDecorators></TopRatedDecorators>
      <FeaturedReviews></FeaturedReviews>
      <CoverageMap coverage={coverage}></CoverageMap>
      <JoinAsDecoratorCTA></JoinAsDecoratorCTA>
    </div>
  );
};

export default Home;
