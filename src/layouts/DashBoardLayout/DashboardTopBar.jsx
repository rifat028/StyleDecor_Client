import React, { use, useState } from "react";

import { NavLink } from "react-router";
import { AuthContext } from "../../features/auth/AuthContext";
import toast from "react-hot-toast";
import { Sun, Palette, ArrowRight, LogOut, Menu } from "lucide-react";
import { PiMoonStarsFill } from "react-icons/pi";
import useRole from "../../hooks/useRole";

const DashboardTopBar = () => {
  const { user, logOutUser } = use(AuthContext);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const { role, roleLoading } = useRole();

  const HandleLogOut = () => {
    logOutUser()
      .then(() => toast.success("Sign Out Successful"))
      .catch((error) => toast.error(error.message));
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", nextTheme);
    setTheme(nextTheme);
    const html = document.querySelector("html");
    html.setAttribute("data-theme", nextTheme);
  };

  // Ensure theme attribute is set on mount
  React.useEffect(() => {
    const html = document.querySelector("html");
    html.setAttribute("data-theme", theme);
  }, [theme]);

  const themeToggleButton = (
    <button
      onClick={toggleTheme}
      className="group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-200/70 bg-linear-to-br from-white to-blue-50 text-blue-500 shadow-sm ring-1 ring-black/5 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-500/20 active:translate-y-0 active:scale-95 dark:border-white/10 dark:from-slate-800 dark:to-slate-900 dark:text-blue-300 dark:ring-white/5"
      title="Toggle Dark Mode"
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

  return (
    <div className="sticky top-0 z-40 w-full bg-white dark:bg-black border-b border-slate-200 dark:border-slate-800/80 shadow-sm transition-all duration-300">
      <div className="navbar w-full mx-auto px-4 sm:px-6 lg:px-8 min-h-20 h-20">
        
        {/* --- Left: Mobile Toggle --- */}
        <div className="navbar-start flex items-center gap-2">
          {/* Mobile Menu Toggle */}
          <label
            htmlFor="dashboard-drawer"
            className="btn btn-sm btn-ghost drawer-button lg:hidden text-slate-600 dark:text-slate-300 -ml-2"
          >
            <Menu className="w-5 h-5" />
          </label>
        </div>

        {/* --- Center: Empty or Title --- */}
        <div className="navbar-center hidden lg:flex"></div>

        {/* --- Right: Theme & Profile --- */}
        <div className="navbar-end flex gap-3 sm:gap-4 items-center justify-end">
          {themeToggleButton}

          {user && (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="relative rounded-full ring-2 ring-primary/20 hover:ring-primary transition-all p-0.5"
              >
                <img
                  src={user.photoURL}
                  alt="profile"
                  className="rounded-full h-10 w-10 sm:h-10 sm:w-10 object-cover"
                />
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success border-2 border-base-100"></div>
              </div>

              <ul
                tabIndex={0}
                className="dropdown-content mt-4 w-72 rounded-2xl shadow-2xl z-100 bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-white/10 ring-1 ring-black/5 dark:ring-white/5 p-3 space-y-2"
              >
                <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500" />

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

                {!roleLoading && (role === "customer" || role === "client") && (
                  <li>
                    <NavLink
                      to="/join-as-decorator"
                      className="group cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-white/10 hover:border-transparent hover:text-white bg-transparent hover:bg-linear-to-r hover:from-indigo-500 hover:to-purple-600 hover:shadow-md hover:shadow-indigo-500/25 transition-all duration-300 ease-out"
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

                <li>
                  <button
                    onClick={HandleLogOut}
                    className="group cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-white/10 hover:border-transparent hover:text-white bg-transparent hover:bg-linear-to-r hover:from-red-500 hover:to-rose-600 hover:shadow-md hover:shadow-red-500/25 transition-all duration-300 ease-out"
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
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardTopBar;
