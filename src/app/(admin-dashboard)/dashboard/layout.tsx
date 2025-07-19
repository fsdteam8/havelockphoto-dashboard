import React from "react";
import "@/app/globals.css";
import DashboardHeader from "./_components/dashboard-header";
import DashboardSidebar from "./_components/dashboard-sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <DashboardHeader />
      <div className="w-full flex">
        <DashboardSidebar />
        <main className="w-full px-[50px] pt-4">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
