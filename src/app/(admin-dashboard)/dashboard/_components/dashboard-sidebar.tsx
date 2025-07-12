"use client"
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { DashboardSidebarItems } from "./dashboard-sidebar-items";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

const DashboardSidebar = () => {
    const pathName = usePathname();
  return (
    <aside className="w-[350px] h-screen sticky top-0 z-50 bg-[#FAFAFA] border-r border-[#D9D9D9] py-6 px-4 -mt-[100px]">
      <div className="flex flex-col items-center ">
        {/* Logo */}
        <Image
          src="/assets/images/logo.png"
          width={45}
          height={64}
          alt="logo"
        />

        {/* Navigation Links */}
        <nav className="w-full space-y-3 pt-[46px]">
          {DashboardSidebarItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 py-[14px] px-[16px] text-lg font-normal leading-[120%] font-manrope ${pathName === item.href ? "text-white bg-[#1E90FF] rounded-[8px]" : "text-[#1F2937] bg-transparent"}`}
            >
            {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="w-full pt-[173px] px-4">
            
            <button className="flex items-center justify-start gap-3 text-lg font-semibold text-[#1F2937] leading-[120%] font-manrope"><LogOut /> Log Out</button>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
