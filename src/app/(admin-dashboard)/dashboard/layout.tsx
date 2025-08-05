"use client";
import React from "react";
import "@/app/globals.css";
import DashboardHeader from "./_components/dashboard-header";
import DashboardSidebar from "./_components/dashboard-sidebar";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    redirect("/login");
  }

  return (
    <div className="  ">
      <DashboardHeader />
      <div className="w-full flex">
        <div>
          <DashboardSidebar />
        </div>
        <main className="w-full px-[50px] pt-4 overflow-x-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
