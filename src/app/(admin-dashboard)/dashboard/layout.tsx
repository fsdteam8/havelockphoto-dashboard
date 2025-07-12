import React from "react";
import "@/app/globals.css";
import DashboardHeader from "./_components/dashboard-header";
import DashboardSidebar from "./_components/dashboard-sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <DashboardHeader />
      <div className="w-full flex items-center">
        <DashboardSidebar />
        <main>{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
