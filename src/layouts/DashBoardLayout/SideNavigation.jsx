import React, { use, useState } from "react";
import { NavLink } from "react-router";
import useRole from "../../hooks/useRole";
import { AuthContext } from "../../features/auth/AuthContext";
import toast from "react-hot-toast";
import darkLogo from "../../assets/logos/dark-logo.png";
import lightLogo from "../../assets/logos/light-logo.png";
import darkSquareLogo from "../../assets/logos/dark-square-logo.png";
import lightSquareLogo from "../../assets/logos/light-square-logo.png";
import {
  UserCircle,
  Calendar,
  CreditCard,
  Users,
  UserCog,
  Layers,
  Briefcase,
  BarChart3,
  Palette,
  Wallet,
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react";
import LogoutModal from "../../components/ui/LogoutModal";

// eslint-disable-next-line no-unused-vars
const NavItem = ({ to, icon: Icon, label, isCollapsed }) => {
  const linkClass = ({ isActive }) =>
    isActive
      ? `flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 mb-1.5 rounded-lg text-indigo-600 dark:text-blue-300 font-semibold transition-colors duration-300 ease-out relative group backdrop-blur-sm border-2 border-blue-400/70 dark:border-blue-400/60 ring-1 ring-blue-300/40 dark:ring-blue-300/30 shadow-md shadow-blue-400/20 dark:shadow-blue-500/20 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(96,165,250,0.22)_100%)]`
      : `flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 mb-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-blue-400 font-medium transition-colors duration-300 ease-out relative group border-2 border-transparent ring-1 ring-transparent shadow-none bg-transparent`;

  return (
    <li>
      <NavLink to={to} className={linkClass}>
        <Icon className="w-5 h-5 shrink-0" />
        {!isCollapsed && <span className="whitespace-nowrap transition-all duration-300">{label}</span>}
      </NavLink>
    </li>
  );
};

const SideNavigation = ({ isCollapsed, setIsCollapsed }) => {
  const { role, roleLoading } = useRole();
  const { logOutUser } = use(AuthContext);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const HandleLogOut = () => {
    logOutUser()
      .then(() => {
        toast.success("Sign Out Successful");
        setIsLogoutModalOpen(false);
      })
      .catch((error) => {
        toast.error(error.message);
        setIsLogoutModalOpen(false);
      });
  };

  if (roleLoading) {
    return (
      <div className="flex flex-col flex-1 w-full h-full min-h-0">
        {/* Skeleton Header */}
        <div className={`relative h-20 shrink-0 border-b border-slate-200 dark:border-slate-800/80 dark:bg-black flex items-center ${isCollapsed ? 'justify-center gap-2 px-2' : 'pl-8 pr-4 justify-between'}`}>
          {isCollapsed ? (
            <div className="skeleton h-10 w-10 rounded-lg dark:bg-slate-800/50"></div>
          ) : (
            <div className="skeleton h-12 w-32 rounded-lg dark:bg-slate-800/50"></div>
          )}
          {!isCollapsed && (
            <div className="skeleton h-8 w-8 rounded-lg dark:bg-slate-800/50"></div>
          )}
        </div>

        {/* Skeleton Menu Items */}
        <ul className={`flex flex-col w-full flex-1 p-4 overflow-hidden ${isCollapsed ? 'px-3' : ''}`}>
          {[...Array(6)].map((_, i) => (
            <li key={i}>
              <div className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 mb-1.5 rounded-lg border-2 border-transparent`}>
                <div className="skeleton w-5 h-5 rounded-full shrink-0 dark:bg-slate-800/50"></div>
                {!isCollapsed && <div className={`skeleton h-4 rounded dark:bg-slate-800/50 ${i % 2 === 0 ? 'w-24' : 'w-32'}`}></div>}
              </div>
            </li>
          ))}
        </ul>
        
        {/* Skeleton Footer */}
        <div className={`p-4 border-t border-slate-200 dark:border-slate-800/80 ${isCollapsed ? 'px-3' : ''}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} w-full py-3 rounded-lg border-2 border-transparent`}>
            <div className="skeleton w-5 h-5 rounded-full shrink-0 dark:bg-slate-800/50"></div>
            {!isCollapsed && <div className="skeleton h-4 w-16 rounded dark:bg-slate-800/50"></div>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col flex-1 w-full h-full min-h-0">
        <div className={`relative h-20 shrink-0 border-b border-slate-200 dark:border-slate-800/80 dark:bg-black flex items-center ${isCollapsed ? 'justify-center gap-2 px-2' : 'pl-8 pr-4 justify-between'}`}>
          <a href="/" className="inline-flex items-center hover:opacity-90 transition-opacity">
            {isCollapsed ? (
              <>
                <img className="h-10 w-10 object-contain block dark:hidden" src={lightSquareLogo} alt="StyleDecor Logo" />
                <img className="h-10 w-10 object-contain hidden dark:block" src={darkSquareLogo} alt="StyleDecor Logo" />
              </>
            ) : (
              <>
                <img className="h-12 lg:h-14 object-contain block dark:hidden" src={lightLogo} alt="StyleDecor Logo" />
                <img className="h-12 lg:h-14 object-contain hidden dark:block" src={darkLogo} alt="StyleDecor Logo" />
              </>
            )}
          </a>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden lg:flex items-center justify-center shrink-0 ${isCollapsed ? '' : ''}`}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        <ul className={`flex flex-col w-full flex-1 p-4 overflow-y-auto ${isCollapsed ? 'px-3' : ''}`}>
          <NavItem to="/dashboard/my-profile" icon={UserCircle} label="My Profile" isCollapsed={isCollapsed} />

          {(role === "customer" || role === "client") && (
            <>
              <NavItem to="/dashboard/my-bookings" icon={Calendar} label="My Bookings" isCollapsed={isCollapsed} />
              <NavItem to="/dashboard/transactions" icon={CreditCard} label="Transactions" isCollapsed={isCollapsed} />
            </>
          )}

          {role === "agent" && (
            <>
              <NavItem to="/dashboard/my-projects" icon={Briefcase} label="Assigned Events" isCollapsed={isCollapsed} />
            </>
          )}

          {role === "admin" && (
            <>
              <NavItem to="/dashboard/manage-users" icon={UserCog} label="Manage Users" isCollapsed={isCollapsed} />
              <NavItem to="/dashboard/manage-categories" icon={Layers} label="Manage Categories" isCollapsed={isCollapsed} />
              <NavItem to="/dashboard/manage-decorators" icon={Users} label="Manage Decorators" isCollapsed={isCollapsed} />
              <NavItem to="/dashboard/manage-services" icon={Briefcase} label="Manage Services" isCollapsed={isCollapsed} />
              <NavItem to="/dashboard/manage-bookings" icon={Calendar} label="Manage Bookings" isCollapsed={isCollapsed} />
              <NavItem to="/dashboard/analytics" icon={BarChart3} label="Analytics" isCollapsed={isCollapsed} />
            </>
          )}

          {role === "decorator" && (
            <>
              <NavItem to="/dashboard/my-services" icon={Layers} label="My Services" isCollapsed={isCollapsed} />
              <NavItem to="/dashboard/my-projects" icon={Palette} label="My Projects" isCollapsed={isCollapsed} />
              <NavItem to="/dashboard/my-earnings" icon={Wallet} label="My Earnings" isCollapsed={isCollapsed} />
            </>
          )}
        </ul>
        
        <div className={`p-4 border-t border-slate-200 dark:border-slate-800/80 ${isCollapsed ? 'px-3' : ''}`}>
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} w-full py-3 rounded-lg text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 font-medium transition-colors duration-300 ease-out group border-2 border-transparent`}
            title={isCollapsed ? "Log Out" : ""}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="whitespace-nowrap transition-all duration-300">Log Out</span>}
          </button>
        </div>
      </div>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={HandleLogOut}
      />
    </>
  );
};

export default SideNavigation;
