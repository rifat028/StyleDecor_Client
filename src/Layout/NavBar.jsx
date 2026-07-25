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

  const { role, roleLoading } = useRole();

  if (roleLoading && user) {
    return <span className="loading loading-spinner" />;
  }

  const linkClasses = ({ isActive }) =>
    isActive
      ? "font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-lg px-4 py-2"
      : "font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors px-4 py-2";

  const links = (
    <>
      <li>
        <NavLink to="/" className={linkClasses}>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/services" className={linkClasses}>
          Services
        </NavLink>
      </li>
      <li>
        <NavLink to="/top-decorators" className={linkClasses}>
          Top Decorators
        </NavLink>
      </li>
      <li>
        <NavLink to="/about" className={linkClasses}>
          About Us
        </NavLink>
      </li>
      <li>
        <NavLink to="/contact" className={linkClasses}>
          Contact Us
        </NavLink>
      </li>
      {(!user || role === "client") && (
        <li>
          <NavLink
            to="/join-as-decorator"
            className="font-semibold text-purple-700 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50 rounded-full px-5 py-2 mt-1 lg:mt-0 lg:ml-2 transition-colors"
          >
            Join as Decorator
          </NavLink>
        </li>
      )}
      {!user && (
        <li className="lg:hidden mt-2">
          <NavLink to="/login" className="font-semibold text-center text-indigo-600 bg-indigo-50 rounded-lg py-2">
            Login / Register
          </NavLink>
        </li>
      )}
      {user && (
        <li className="lg:hidden">
          <NavLink to="/dashboard" className={linkClasses}>
            Dashboard
          </NavLink>
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
    const status = e.target.checked;
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
    <div className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm transition-all duration-300">
      <div className="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20">
        <Toaster position="top-center" reverseOrder={false} />
        
        {/* --- Navbar Start --- */}
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden -ml-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-700 dark:text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul
              tabIndex="-1"
              className="menu menu-sm dropdown-content bg-white dark:bg-gray-900 rounded-2xl mt-3 w-56 p-3 shadow-xl border border-gray-100 dark:border-gray-800 z-50 gap-1"
            >
              {links}
            </ul>
          </div>
          
          {/* Logo Section */}
          <a href="/" className="hover:opacity-90 transition-opacity ml-2 lg:ml-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 rounded-full blur-md opacity-40"></div>
                <img
                  className="relative rounded-full h-10 w-10 sm:h-12 sm:w-12 object-cover border-[2px] border-white dark:border-gray-800 shadow-md"
                  src={logo}
                  alt="StyleDecor Logo"
                />
              </div>
              <div className="hidden md:block text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 tracking-tight">
                StyleDecor
              </div>
            </div>
          </a>
        </div>

        {/* --- Navbar Center --- */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-1 items-center">{links}</ul>
        </div>

        {/* --- Navbar End --- */}
        {user && loading ? (
          <div className="navbar-end flex gap-4">
            <ScaleLoader color={"#7C3AED"} height={20} />
          </div>
        ) : user ? (
          <div className="navbar-end flex gap-3 sm:gap-4 items-center">
            <button
              onClick={HandleLogOut}
              className="hidden sm:block px-5 py-2 rounded-full font-semibold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 transition-colors duration-300"
            >
              Log Out
            </button>
            
            {/* Profile Dropdown */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="relative rounded-full ring-2 ring-indigo-100 dark:ring-indigo-900/30 hover:ring-indigo-400 dark:hover:ring-indigo-500 transition-all p-0.5"
              >
                <img
                  src={user.photoURL}
                  alt="profile"
                  className="rounded-full h-10 w-10 sm:h-11 sm:w-11 object-cover"
                />
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-900"></div>
              </div>

              <ul
                tabIndex={0}
                className="dropdown-content menu mt-4 w-60 rounded-2xl shadow-2xl z-[100] bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-800 py-3"
              >
                {/* User Info */}
                <li className="px-4 py-2 hover:bg-transparent cursor-default">
                  <div className="flex flex-col gap-1 items-start">
                    <span className="font-bold text-base truncate w-full">
                      {user?.displayName || "User"}
                    </span>
                    <span className="text-xs opacity-70 truncate w-full">
                      {user?.email}
                    </span>
                  </div>
                </li>
                
                <div className="divider my-0 dark:opacity-30 px-4"></div>
                
                {/* Theme Toggle */}
                <li className="px-2">
                  <div className="flex justify-between items-center w-full px-2 py-2">
                    <span className="font-medium text-sm">Dark Mode</span>
                    <input
                      type="checkbox"
                      defaultChecked={theme == "dark"}
                      onChange={HandleTheme}
                      className="toggle toggle-sm toggle-primary"
                    />
                  </div>
                </li>

                <div className="divider my-0 dark:opacity-30 px-4"></div>

                {/* Dashboard Link */}
                <li className="px-2 mt-1">
                  <NavLink
                    to="/dashboard"
                    className="hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl font-semibold py-2.5"
                  >
                    Dashboard
                  </NavLink>
                </li>
                
                {/* Mobile Logout */}
                <li className="px-2 mt-1 sm:hidden">
                  <button
                    onClick={HandleLogOut}
                    className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-semibold py-2.5"
                  >
                    Log Out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="navbar-end flex items-center gap-3">
            {/* Desktop Theme Toggle */}
            <div className="hidden sm:flex items-center mr-2">
              <input
                type="checkbox"
                defaultChecked={theme == "dark"}
                onChange={HandleTheme}
                className="toggle toggle-sm toggle-primary"
                title="Toggle Dark Mode"
              />
            </div>
            
            {/* Auth Buttons */}
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 rounded-full font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 dark:text-indigo-400 transition-colors duration-300 shadow-sm"
            >
              Log In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="hidden md:block px-6 py-2 rounded-full font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
