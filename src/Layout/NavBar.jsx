import React, { use, useState, useRef, useEffect } from "react";
import darkLogo from "../assets/Dark Logo.png";
import lightLogo from "../assets/Light Logo.png";
import { NavLink, useNavigate, useLocation } from "react-router";
import { AuthContext } from "../Authentication/AuthContext";
import toast, { Toaster } from "react-hot-toast";
// import { Tooltip } from "react-tooltip";
import { ScaleLoader } from "react-spinners";
import {
  Sun,
  LogIn,
  UserPlus,
  Palette,
  Home as HomeIcon,
  Sparkles,
  Award,
  Info,
  Phone,
  LayoutDashboard,
  ArrowRight,
  LogOut,
} from "lucide-react";
import { PiMoonStarsFill } from "react-icons/pi";
import useRole from "../Hooks/useRole";

// Animated label component with hover underline effect
const AnimatedLabel = ({ children, disableHover = false }) => (
  <span className="relative inline-flex items-center gap-1">
    {children}
    {!disableHover && (
      <span className="pointer-events-none absolute inset-x-0 -bottom-0.5 h-0.5 origin-center scale-x-0 bg-current transition-transform duration-500 ease-out group-hover:scale-x-100" />
    )}
  </span>
);

// Navigation routes configuration array
const navLinks = [
  { to: "/", label: "Home", icon: HomeIcon },
  { to: "/services", label: "Services", icon: Sparkles },
  { to: "/top-decorators", label: "Top Decorators", icon: Award },
  { to: "/about", label: "About Us", icon: Info },
  { to: "/contact", label: "Contact Us", icon: Phone },
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    authOnly: true,
  },
];

// Main navigation bar component
const NavBar = () => {
  const navigate = useNavigate();
  const { user, logOutUser, loading } = use(AuthContext);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const { role, roleLoading } = useRole();

  const location = useLocation();

  // Refs for the sliding active indicator
  const navContainerRef = useRef(null);
  const itemRefs = useRef({});
  const [indicatorStyle, setIndicatorStyle] = useState({ opacity: 0, width: 0, transform: "translateX(0px)" });

  // Update sliding indicator position whenever route changes
  useEffect(() => {
    const visibleLinks = navLinks.filter((link) => !link.authOnly || user);
    const activeLink = visibleLinks.find(({ to }) =>
      to === "/" ? location.pathname === "/" : location.pathname.startsWith(to)
    );
    if (activeLink && itemRefs.current[activeLink.to] && navContainerRef.current) {
      const container = navContainerRef.current;
      const item = itemRefs.current[activeLink.to];
      const containerRect = container.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      setIndicatorStyle({
        opacity: 1,
        width: itemRect.width,
        transform: `translateX(${itemRect.left - containerRect.left}px)`,
      });
    } else {
      setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [location.pathname, user]);

  if (roleLoading && user) {
    return <span className="loading loading-spinner" />;
  }



  // Dynamic styling function for active/inactive nav links — no background, only text color
  const linkClasses = ({ isActive }) =>
    isActive
      ? "group relative flex items-center font-semibold text-indigo-600 dark:text-indigo-300 rounded-full px-4 py-2 transition-colors duration-300 ease-out !bg-transparent hover:!bg-transparent focus:!bg-transparent active:!bg-transparent"
      : "group flex items-center font-medium text-base-content/70 hover:text-indigo-600 dark:hover:text-indigo-400 bg-transparent rounded-full px-4 py-2 transition-colors duration-300 ease-out";

  const iconClasses =
    "h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-0.5";
  const iconClassesStatic = "h-4 w-4 shrink-0";

  // Filtered navigation list items component
  const links = (
    <>
      {navLinks
        .filter((link) => !link.authOnly || user)
        .map(({ to, label, icon: Icon }) => (
          <li key={to} ref={(el) => (itemRefs.current[to] = el)}>
            <NavLink
              to={to}
              className={linkClasses}
            >
              {({ isActive }) => (
                <AnimatedLabel disableHover={isActive}>
                  <Icon
                    className={isActive ? iconClassesStatic : iconClasses}
                  />
                  {label}
                </AnimatedLabel>
              )}
            </NavLink>
          </li>
        ))}
    </>
  );

  // Event handler for user logout
  const HandleLogOut = () => {
    logOutUser()
      .then(() => toast.success("Sign Out Successful"))
      .catch((error) => toast.error(error.message));
  };

  // Event handler for dark/light theme toggle
  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", nextTheme);
    setTheme(nextTheme);
  };

  // Dark/light mode theme toggle button element
  const themeToggleButton = (
    <button
      onClick={toggleTheme}
      className="group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-200/70 bg-gradient-to-br from-white to-blue-50 text-blue-500 shadow-sm ring-1 ring-black/5 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-500/20 active:translate-y-0 active:scale-95 dark:border-white/10 dark:from-slate-800 dark:to-slate-900 dark:text-blue-300 dark:ring-white/5"
      title="Toggle Dark Mode"
      aria-label="Toggle Dark Mode"
    >
      <span className="relative block h-5 w-5 overflow-hidden">
        <Sun
          className={`absolute inset-0 h-5 w-5 transition-all duration-500 ease-out ${
            theme !== "dark"
              ? "rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100"
          }`}
        />
        <PiMoonStarsFill
          className={`absolute inset-0 h-5 w-5 transition-all duration-500 ease-out ${
            theme !== "dark"
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
          }`}
        />
      </span>
    </button>
  );

  const html = document.querySelector("html");
  html.setAttribute("data-theme", theme);

  return (
    <div className="sticky top-0 z-50 w-full bg-blue-100/70 dark:bg-black backdrop-blur-xl lg:py-4 transition-all duration-300">
      <div className="navbar w-full lg:max-w-7xl mx-auto h-15 backdrop-blur-xl bg-blue-50/80 dark:bg-base-100/90 ring-2 ring-blue-900/10 dark:ring-white/10 shadow-sm lg:rounded-4xl lg:shadow-lg px-4 sm:px-6 lg:px-8">
        <Toaster position="top-center" reverseOrder={false} />

        {/* --- Navbar Start --- */}
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost lg:hidden -ml-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-base-content"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
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
          <a
            href="/"
            className="group hidden lg:block hover:opacity-90 transition-opacity lg:ml-0"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 rounded-full blur-md opacity-40 transition-transform duration-[800ms] group-hover:scale-[1.05]"></div>
              <img
                className="relative rounded-full h-10 w-[120px] lg:h-11 lg:w-[132px] object-cover border-[2px] border-white dark:border-gray-800 shadow-md transition-transform duration-[800ms] group-hover:scale-[1.05]"
                src={theme === "dark" ? darkLogo : lightLogo}
                alt="StyleDecor Logo"
              />
            </div>
          </a>
        </div>

        {/* --- Navbar Center --- */}
        <div className="navbar-center hidden lg:flex">
          <div className="relative">
            {/* Sliding active indicator */}
            <div
              className="absolute inset-y-[5px] left-0 pointer-events-none rounded-full backdrop-blur-sm border-2 border-blue-400/70 dark:border-blue-400/60 ring-1 ring-blue-300/40 dark:ring-blue-300/30 shadow-md shadow-blue-400/20 dark:shadow-blue-500/20 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{
                ...indicatorStyle,
                background: "radial-gradient(ellipse at center, transparent 25%, rgba(96,165,250,0.22) 100%)",
              }}
            />
            <ul ref={navContainerRef} className="menu menu-horizontal px-1 gap-1 items-center">
              {links}
            </ul>
          </div>
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
                className="dropdown-content mt-4 w-72 rounded-2xl shadow-2xl z-[100] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-gray-200/80 dark:border-white/10 ring-1 ring-black/5 dark:ring-white/5 p-3 space-y-2"
              >
                {/* Gradient accent bar */}
                <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                {/* User Info */}
                <li className="px-4 py-2 hover:bg-transparent cursor-default">
                  <div className="flex flex-col gap-1 items-start">
                    <span className="font-bold text-base truncate w-full text-gray-800 dark:text-gray-100">
                      {user?.displayName || "User"}
                    </span>
                    <span className="text-xs opacity-70 truncate w-full text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </span>
                  </div>
                </li>

                <div className="h-px bg-gray-200 dark:bg-white/10 mx-2 my-2" />

                {role === "client" && (
                  <li>
                    <NavLink
                      to="/join-as-decorator"
                      className="group cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-white/10 hover:border-transparent hover:text-white bg-transparent hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:shadow-md hover:shadow-indigo-500/25 transition-all duration-300 ease-out"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 group-hover:bg-white/20 group-hover:text-white transition-colors duration-300">
                        <Palette className="h-4 w-4" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-bold">Join as Decorator</div>
                        <div className="text-[11px] text-gray-500 dark:text-gray-400 group-hover:text-white/70 transition-colors duration-300">Showcase your talent</div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 dark:text-gray-500 opacity-50 group-hover:text-white group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
                    </NavLink>
                  </li>
                )}

                {/* Logout Button */}
                <li>
                  <button
                    onClick={HandleLogOut}
                    className="group cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-white/10 hover:border-transparent hover:text-white bg-transparent hover:bg-gradient-to-r hover:from-red-500 hover:to-rose-600 hover:shadow-md hover:shadow-red-500/25 transition-all duration-300 ease-out"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 group-hover:bg-white/20 group-hover:text-white transition-colors duration-300">
                      <LogOut className="h-4 w-4" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-bold">Log Out</div>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400 group-hover:text-white/70 transition-colors duration-300">See you later</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 dark:text-gray-500 opacity-50 group-hover:text-white group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
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
                className="group cursor-pointer relative flex items-center gap-1 sm:gap-1.5 overflow-hidden px-3.5 sm:px-6 py-2 rounded-full font-semibold text-white text-sm sm:text-base whitespace-nowrap bg-gradient-to-b from-indigo-500 via-indigo-600 to-purple-700 border border-blue-300/70 ring-2 ring-blue-200/50 shadow-[0_4px_0_rgba(67,56,202,0.7),0_10px_20px_-6px_rgba(99,102,241,0.6)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_6px_0_rgba(67,56,202,0.7),0_14px_24px_-6px_rgba(99,102,241,0.6)] active:translate-y-0.5 active:shadow-[0_1px_0_rgba(67,56,202,0.7),0_4px_10px_-4px_rgba(99,102,241,0.6)]"
              >
                {/* Glossy top highlight for 3D effect */}
                <span className="pointer-events-none absolute inset-x-1 top-1 h-1/2 rounded-full bg-white/12 blur-[2px]" />

                <span className="relative z-10 flex items-center gap-1 sm:gap-1.5">
                  Get Started
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </div>

              <ul
                tabIndex={0}
                className="dropdown-content mt-3 w-72 rounded-2xl shadow-2xl z-[100] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-gray-200/80 dark:border-white/10 ring-1 ring-black/5 dark:ring-white/5 p-3 space-y-2"
              >
                {/* Gradient accent bar */}
                <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                <li>
                  <button
                    onClick={() => navigate("/register")}
                    className="group cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-white/10 hover:border-transparent hover:text-white bg-transparent hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:shadow-md hover:shadow-indigo-500/25 transition-all duration-300 ease-out"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 group-hover:bg-white/20 group-hover:text-white transition-colors duration-300">
                      <UserPlus className="h-4 w-4" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-bold">Register</div>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400 group-hover:text-white/70 transition-colors duration-300">Create a new account</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 dark:text-gray-500 opacity-50 group-hover:text-white group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/login")}
                    className="group cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-white/10 hover:border-transparent hover:text-white bg-transparent hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:shadow-md hover:shadow-indigo-500/25 transition-all duration-300 ease-out"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 group-hover:bg-white/20 group-hover:text-white transition-colors duration-300">
                      <LogIn className="h-4 w-4" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-bold">Log In</div>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400 group-hover:text-white/70 transition-colors duration-300">Welcome back</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 dark:text-gray-500 opacity-50 group-hover:text-white group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
                  </button>
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
