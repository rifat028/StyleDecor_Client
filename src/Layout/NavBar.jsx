import React, { use, useState } from "react";
import logo from "../assets/Logo.png";
import { NavLink, useNavigate } from "react-router";
import { AuthContext } from "../Authentication/AuthContext";
import toast, { Toaster } from "react-hot-toast";
// import { Tooltip } from "react-tooltip";
import { ScaleLoader } from "react-spinners";
import {
  Sun,
  Moon,
  LogIn,
  UserPlus,
  Palette,
  Home as HomeIcon,
  Sparkles,
  Award,
  Info,
  Phone,
  LayoutDashboard,
} from "lucide-react";
import useRole from "../Hooks/useRole";

const AnimatedLabel = ({ children }) => (
  <span className="relative inline-flex items-center gap-1">
    {children}
    <span className="pointer-events-none absolute inset-x-0 -bottom-0.5 h-0.5 origin-center scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
  </span>
);

const navLinks = [
  { to: "/", label: "Home", icon: HomeIcon },
  { to: "/services", label: "Services", icon: Sparkles },
  { to: "/top-decorators", label: "Top Decorators", icon: Award },
  { to: "/about", label: "About Us", icon: Info },
  { to: "/contact", label: "Contact Us", icon: Phone },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, authOnly: true },
];

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
      ? "group flex items-center font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-lg px-4 py-2"
      : "group flex items-center font-medium text-base-content/70 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-transparent hover:translate-x-1 rounded-lg px-4 py-2 transition-all duration-300 ease-out";

  const iconClasses = "h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-0.5";

  const links = (
    <>
      {navLinks
        .filter((link) => !link.authOnly || user)
        .map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink to={to} className={linkClasses}>
              <AnimatedLabel>
                <Icon className={iconClasses} />
                {label}
              </AnimatedLabel>
            </NavLink>
          </li>
        ))}
    </>
  );

  const HandleLogOut = () => {
    logOutUser()
      .then(() => toast.success("Sign Out Successful"))
      .catch((error) => toast.error(error.message));
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", nextTheme);
    setTheme(nextTheme);
  };

  const themeToggleButton = (
    <button
      onClick={toggleTheme}
      className="btn btn-ghost btn-circle btn-sm text-base-content hover:bg-base-200 overflow-hidden"
      title="Toggle Dark Mode"
      aria-label="Toggle Dark Mode"
    >
      <span className="relative block h-5 w-5">
        <Sun
          className={`absolute inset-0 h-5 w-5 transition-all duration-500 ${theme === "dark" ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"
            }`}
        />
        <Moon
          className={`absolute inset-0 h-5 w-5 transition-all duration-500 ${theme === "dark" ? "-rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
            }`}
        />
      </span>
    </button>
  );

  const html = document.querySelector("html");
  html.setAttribute("data-theme", theme);

  return (
    <div className="sticky top-0 z-50 w-full bg-base-100/60 backdrop-blur-xl lg:py-4 transition-all duration-300">
      <div className="navbar w-full lg:max-w-7xl mx-auto h-15 backdrop-blur-xl bg-base-100/80 ring-2 ring-black/10 dark:ring-white/10 shadow-sm lg:rounded-4xl lg:shadow-lg px-4 sm:px-6 lg:px-8">
        <Toaster position="top-center" reverseOrder={false} />

        {/* --- Navbar Start --- */}
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden -ml-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-base-content"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul
              tabIndex="-1"
              className="menu menu-sm dropdown-content bg-base-100 rounded-2xl mt-3 w-56 p-3 shadow-xl border border-base-300 z-50 gap-1"
            >
              {links}
            </ul>
          </div>

          {/* Logo Section */}
          <a href="/" className="hidden lg:block hover:opacity-90 transition-opacity lg:ml-0">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 rounded-full blur-md opacity-40"></div>
              <img
                className="relative rounded-full h-10 w-10 sm:h-12 sm:w-12 object-cover border-[2px] border-white dark:border-gray-800 shadow-md"
                src={logo}
                alt="StyleDecor Logo"
              />
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
            {/* Theme Toggle */}
            {themeToggleButton}

            <button
              onClick={HandleLogOut}
              className="group hidden sm:block px-5 py-2 rounded-full font-semibold text-error hover:bg-transparent hover:translate-x-0.5 transition-all duration-300 ease-out"
            >
              <AnimatedLabel>Log Out</AnimatedLabel>
            </button>

            {/* Profile Dropdown */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="relative rounded-full ring-2 ring-primary/20 hover:ring-primary transition-all p-0.5"
              >
                <img
                  src={user.photoURL}
                  alt="profile"
                  className="rounded-full h-10 w-10 sm:h-11 sm:w-11 object-cover"
                />
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success border-2 border-base-100"></div>
              </div>

              <ul
                tabIndex={0}
                className="dropdown-content menu mt-4 w-60 rounded-2xl shadow-2xl z-[100] bg-base-100 text-base-content border border-base-300 py-3"
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

                <div className="divider my-0 px-4"></div>

                {role === "client" && (
                  <li className="px-2 mt-1">
                    <NavLink
                      to="/join-as-decorator"
                      className="group flex items-center text-purple-700 dark:text-purple-300 rounded-xl font-semibold py-2.5 hover:bg-transparent hover:translate-x-1 transition-all duration-300 ease-out"
                    >
                      <AnimatedLabel>
                        <Palette className={iconClasses} />
                        Join as Decorator
                      </AnimatedLabel>
                    </NavLink>
                  </li>
                )}

                {/* Mobile Logout */}
                <li className="px-2 mt-1 sm:hidden">
                  <button
                    onClick={HandleLogOut}
                    className="group text-error rounded-xl font-semibold py-2.5 hover:bg-transparent hover:translate-x-1 transition-all duration-300 ease-out"
                  >
                    <AnimatedLabel>Log Out</AnimatedLabel>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="navbar-end flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            {themeToggleButton}

            {/* Get Started Dropdown */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="flex items-center gap-1 sm:gap-1.5 px-3.5 sm:px-6 py-2 rounded-full font-semibold text-white text-sm sm:text-base whitespace-nowrap bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md shadow-indigo-500/30 transition-all duration-300"
              >
                Get Started
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              <ul
                tabIndex={0}
                className="dropdown-content menu mt-3 w-[187px] sm:w-[202px] rounded-2xl shadow-2xl z-[100] bg-base-100 border border-base-300 p-3 gap-1.5"
              >
                <li>
                  <button
                    onClick={() => navigate("/register")}
                    className="flex items-center gap-2 font-semibold text-white bg-gradient-to-r from-indigo-400 to-purple-400 hover:from-indigo-600 hover:to-purple-600 shadow-sm rounded-xl py-2.5 transition-colors duration-300 ease-out"
                  >
                    <UserPlus className="h-4 w-4 shrink-0" />
                    Register
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/login")}
                    className="flex items-center gap-2 font-semibold text-white bg-gradient-to-r from-indigo-400 to-purple-400 hover:from-indigo-600 hover:to-purple-600 shadow-sm rounded-xl py-2.5 transition-colors duration-300 ease-out"
                  >
                    <LogIn className="h-4 w-4 shrink-0" />
                    Log In
                  </button>
                </li>
                <div className="divider my-0 px-2"></div>
                <li>
                  <NavLink
                    to="/join-as-decorator"
                    className="flex items-center gap-2 font-semibold text-white bg-gradient-to-r from-indigo-400 to-purple-400 hover:from-indigo-600 hover:to-purple-600 shadow-sm rounded-xl py-2.5 transition-colors duration-300 ease-out"
                  >
                    <Palette className="h-4 w-4 shrink-0" />
                    Join as Decorator
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
