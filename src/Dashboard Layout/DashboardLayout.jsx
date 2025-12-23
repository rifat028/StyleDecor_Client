import React from "react";
import NavBar from "../Layout/NavBar";
import { Outlet } from "react-router";

const DashboardLayout = () => {
  return (
    <div>
      <NavBar></NavBar>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Page content here */}
          <label
            htmlFor="my-drawer-3"
            className="btn drawer-button w-full text-center lg:hidden"
          >
            View Menu
          </label>
          <Outlet></Outlet>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-3"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 min-h-full w-80 p-4 pt-10 md:pt-2">
            {/* Sidebar content here */}
            <li>
              <a>Sidebar Item 1</a>
            </li>
            <li>
              <a>Sidebar Item 2</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
