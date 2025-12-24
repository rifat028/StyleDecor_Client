import React from "react";
import { NavLink } from "react-router";
import useRole from "../Hooks/useRole";

const SideNavigation = () => {
  const { role, roleLoading } = useRole();

  if (roleLoading) {
    return <span className="loading loading-spinner" />;
  }

  return (
    <>
      <li>
        <NavLink to="/dashboard/my-profile">My Profile</NavLink>
      </li>
      {role === "client" && (
        <>
          <li>
            <NavLink to="/dashboard/my-bookings">My Bookings</NavLink>
          </li>
        </>
      )}
      {role === "admin" && (
        <>
          <li>
            <NavLink to="/dashboard/manage-decorators">
              Manage Decorators
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/manage-services">Manage Services</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/manage-bookings">Manage Bookings</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/analytics">Analytics</NavLink>
          </li>
        </>
      )}
      {role === "decorator" && (
        <>
          <li>
            <NavLink to="/dashboard/my-projects">My Projects</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/my-earnings">My Earnings</NavLink>
          </li>
        </>
      )}
    </>
  );
};

export default SideNavigation;
