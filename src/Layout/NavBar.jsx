import React, { use, useState } from "react";
import logo from "../assets/Logo.png";
import { NavLink, useNavigate } from "react-router";
import { AuthContext } from "../Authentication/AuthContext";
import toast, { Toaster } from "react-hot-toast";
// import { Tooltip } from "react-tooltip";
import { ScaleLoader } from "react-spinners";
import useRole from "../Hooks/useRole";

const NavBar = () => {
  const navigate = useNavigate();
  const { user, logOutUser, loading } = use(AuthContext);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // console.log(user, user.photoURL);

  const { role, roleLoading } = useRole();

  if (roleLoading && user) {
    return <span className="loading loading-spinner" />;
  }

  const links = (
    <>
      <li className="font-bold">
        <NavLink to="/">Home</NavLink>
      </li>
      <li className="font-bold">
        <NavLink to="/services">Services</NavLink>
      </li>
      {user && (
        <li className="font-bold">
          <NavLink to="/dashboard">Dashboard</NavLink>
        </li>
      )}
      <li className="font-bold">
        <NavLink to="/about">About</NavLink>
      </li>
      <li className="font-bold">
        <NavLink to="/contact">Contact</NavLink>
      </li>
      {user && role === "client" && (
        <li className="font-semibold bg-purple-100 rounded-4xl">
          <NavLink to="/join-as-decorator">Join As Decorator</NavLink>
        </li>
      )}
    </>
  );

  const HandleLogOut = () => {
    logOutUser()
      .then(() => toast.success("Sign Out Successful"))
      .catch((error) => toast.error(error.message));
  };

  const HandleTheme = (e) => {
    // console.log(e.target.checked);
    const status = e.target.checked;
    // console.log(html.getAttribute("data-theme"));
    if (status) {
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    } else {
      localStorage.setItem("theme", "light");
      setTheme("light");
    }
  };

  const html = document.querySelector("html");
  html.setAttribute("data-theme", theme);

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow z-10"
          >
            {links}
          </ul>
        </div>
        <a href="/">
          <div className="flex items-center justify-between btn btn-ghost text-4xl font-bold">
            <div>
              <img
                className="rounded-full h-10 border-2 border-blue-500"
                src={logo}
                alt=""
              />
            </div>
            <div className="hidden md:block text-blue-700 mb-1">StyleDecor</div>
          </div>
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{links}</ul>
      </div>
      {user && loading ? (
        <div className="navbar-end flex gap-4">
          <ScaleLoader color={"#7C3AED"} />
        </div>
      ) : user ? (
        <div className="navbar-end flex gap-4">
          {/* <input
            type="checkbox"
            defaultChecked={theme == "dark"}
            onChange={HandleTheme}
            value="synthwave"
            className="toggle"
          /> */}
          <button
            onClick={HandleLogOut}
            className=" bg-indigo-700 hover:bg-indigo-600 text-white font-bold 
                       py-2 px-4 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
          >
            Log Out
          </button>
          {/* =========================== profile dropdown ========================== */}
          {/* Profile Dropdown */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="ring-2 ring-blue-500 rounded-full border-gray-200 dark:border-gray-700
               border-2 cursor-pointer p-0.5 hover:ring-indigo-500 transition"
            >
              <img
                src={user.photoURL}
                alt="profile"
                className="rounded-full h-8 w-8 sm:h-9 sm:w-9 object-cover"
              />
            </div>

            <ul
              tabIndex={0}
              className="dropdown-content menu mt-3 w-48 sm:w-52 rounded-xl shadow-lg z-999 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
            >
              {/* User Info */}
              <li className=" py-1 text-sm font-semibold opacity-80  my-0">
                <span className="text-xs opacity-60 text-left">
                  {user?.email}
                </span>
              </li>
              <div className="divider my-1 dark:opacity-30"></div>
              <li className="px-3 py-1 text-sm font-semibold opacity-80 ">
                {user?.displayName || "User"}
                <br />
              </li>
              <div className="divider my-1 dark:opacity-30"></div>

              <li className=" py-1 text-sm font-semibold opacity-80 ">
                <div>
                  <span>Dark Mode</span>
                  <input
                    type="checkbox"
                    defaultChecked={theme == "dark"}
                    onChange={HandleTheme}
                    value="synthwave"
                    className="toggle"
                  />
                </div>
              </li>

              <div className="divider my-1 dark:opacity-30"></div>

              {/* Links */}
              <li>
                <NavLink
                  to="/dashboard"
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-semibold"
                >
                  Dashboard
                </NavLink>
              </li>
              <div className="divider my-1 dark:opacity-30"></div>

              {/* Logout */}
              <li>
                <button
                  onClick={HandleLogOut}
                  className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-semibold"
                >
                  Log Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="navbar-end flex gap-4">
          <input
            type="checkbox"
            defaultChecked={theme == "dark"}
            onChange={HandleTheme}
            value="synthwave"
            className="toggle"
          />
          <button
            onClick={() => navigate("/login")}
            className=" bg-indigo-700 hover:bg-indigo-600 text-white font-bold 
                       py-2 px-4 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
          >
            LogIn
          </button>
          <button
            onClick={() => navigate("/register")}
            className=" bg-indigo-700 hover:bg-indigo-600 text-white font-bold hidden md:block
                       py-2 px-4 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
          >
            Register
          </button>
        </div>
      )}
    </div>
  );
};

export default NavBar;
