import React from "react";
import { NavLink } from "react-router";

const SideNavigation = () => {
  return (
    <>
      <li>
        <NavLink to="/dashboard/my-profile">My Profile</NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/my-bookings">My Bookings</NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/manage-decorators">Manage Decorators</NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/manage-services">Manage Services</NavLink>
      </li>
    </>
  );
};

export default SideNavigation;
