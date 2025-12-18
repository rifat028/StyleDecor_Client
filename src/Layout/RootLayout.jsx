import React from "react";
import { Outlet } from "react-router";
import Footer from "./Footer";

const RootLayout = () => {
  return (
    <div>
      <Outlet></Outlet>
      <Footer></Footer>
    </div>
  );
};

export default RootLayout;
