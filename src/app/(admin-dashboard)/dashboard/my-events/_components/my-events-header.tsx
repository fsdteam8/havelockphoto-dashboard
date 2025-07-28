import { ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

const MyEventsHeader = () => {
  return (
    <div className="w-full flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-[#131313] leading-[120%] font-manrope">
          My Events 
        </h1>
        <div className="flex items-center gap-2 pt-[14px]">
          <Link href={"/dashboard"}>
            <p className="text-base font-medium leading-[120%] text-[#929292] font-manrope hover:underline hover:text-[#1E90FF]">
              Dashboard
            </p>
          </Link>
          <span>
            {" "}
            <ChevronRight className="text-[#929292] w-[18px] h-[18px]" />
          </span>
          <p className="text-base font-medium leading-[120%] text-[#929292] font-manrope">
            My Events
          </p>
        </div>
      </div>
      <div>
        <Link href="/dashboard/my-events/add-event">
          <button className="flex items-center gap-2 bg-primary text-[#F4F4F4] text-base font-normal leading-[120%] font-manrope tracking-[0%] py-[15px] px-[26px] rounded-[8px]">
            <Plus className="w-6 h-6" /> Event
          </button>
        </Link>
      </div>
    </div>
  ); 
};

export default MyEventsHeader;
