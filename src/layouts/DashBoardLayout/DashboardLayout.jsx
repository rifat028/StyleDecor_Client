import React, { useState } from "react";
import DashboardTopBar from "./DashboardTopBar";
import { Outlet } from "react-router";
import SideNavigation from "./SideNavigation";

const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="h-screen w-full flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      <div className="drawer lg:drawer-open flex-1 h-full overflow-hidden">
        <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
        
        {/* Main Content Area */}
        <div className="drawer-content flex flex-col relative w-full h-full overflow-hidden">
          <DashboardTopBar />
          
          {/* Outlet Canvas */}
          <div className="flex-1 w-full p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="drawer-side z-50 lg:z-auto">
          <label
            htmlFor="dashboard-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className={`bg-white dark:bg-black h-full ${isCollapsed ? 'w-24' : 'w-64 md:w-72'} border-r border-slate-200 dark:border-slate-800/80 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-none flex flex-col transition-all duration-300 overflow-hidden`}>
            <SideNavigation isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
