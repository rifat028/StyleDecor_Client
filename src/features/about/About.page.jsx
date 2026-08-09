import React from "react";
import { useLoaderData } from "react-router";
import TopSection from "./components/TopSection";
import Stats from "./components/Stats";
import Intro from "./components/Intro";
import Values from "./components/Values";
import CallToAction from "./components/CallToAction";
import HowItWorks from "./components/HowItWorks";

const About = () => {
  const data = useLoaderData();
  const stats = data.stats;
  const values = data.values;
  const steps = data.steps;

  return (
    <div className="min-h-screen bg-base-100 dark:bg-gray-900">
      <TopSection></TopSection>
      <Stats stats={stats}></Stats>
      <Intro></Intro>
      <Values values={values}></Values>
      <HowItWorks steps={steps}></HowItWorks>
      <CallToAction></CallToAction>
    </div>
  );
};

export default About;