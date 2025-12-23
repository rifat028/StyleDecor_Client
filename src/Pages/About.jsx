import React from "react";
import { useLoaderData } from "react-router";
import TopSection from "../Components/AboutComponents/TopSection";
import Stats from "../Components/AboutComponents/Stats";
import Intro from "../Components/AboutComponents/Intro";
import Values from "../Components/AboutComponents/Values";
import CallToAction from "../Components/AboutComponents/CallToAction";
import HowItWorks from "../Components/AboutComponents/HowItWorks";

const About = () => {
  const data = useLoaderData();
  const stats = data.stats;
  const values = data.values;
  const steps = data.steps;
  console.log(stats, values, steps);

  return (
    <div className="min-h-screen bg-base-100 dark:bg-gray-900">
      {/* Header / Hero */}
      <TopSection></TopSection>
      {/* Stats */}
      <Stats stats={stats}></Stats>

      {/* Who we are */}
      <Intro></Intro>

      {/* Core values */}
      <Values values={values}></Values>

      {/* How it works */}
      <HowItWorks steps={steps}></HowItWorks>

      {/* Bottom CTA */}
      <CallToAction></CallToAction>
    </div>
  );
};

export default About;
