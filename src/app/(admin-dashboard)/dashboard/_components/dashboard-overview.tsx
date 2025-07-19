import { BookingSummaryMessage } from "@/components/types/dashboard-data-type";
import Image from "next/image";
import React from "react";
import { GoDotFill } from "react-icons/go";

const DashOverview = ({ data }: { data?: BookingSummaryMessage }) => {
  return (
    <div className="pb-[47px]">
      <h1 className="text-2xl font-bold text-[#131313] leading-[120%] font-manrope">
        Over View
      </h1>
      <p className="text-base font-medium leading-[120%] text-[#929292] font-manrope pt-[14px]">
        Dashboard
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[70px] pt-8 ">
        <div className="flex items-center justify-center gap-[10px] rounded-[6px] bg-[#FAFAFA] shadow-[0px_2px_6px_0px_rgba(0,0,0,0.08)] py-6 px-8">
          <div>
            <h3 className="text-xl font-bold text-[#131313] leading-[120%] font-manrope">
              Own Revenue
            </h3>
            <p className="text-lg font-medium leading-[120%] text-[#424242] font-manrope pt-2 flex items-center gap-1">
              <GoDotFill className="w-4 h-4 text-[#525773]" />

              {data?.totalRevenue ? `£${data.totalRevenue}` : "£0.00"}
            </p>
          </div>
          <div>
            <Image
              src="/assets/images/revenue.png"
              width={58}
              height={58}
              alt="own revenue"
            />
          </div>
        </div>
        <div className="flex items-center justify-center gap-[10px] rounded-[6px] bg-[#FAFAFA] shadow-[0px_2px_6px_0px_rgba(0,0,0,0.08)] py-6 px-8">
          <div>
            <h3 className="text-xl font-bold text-[#131313] leading-[120%] font-manrope">
              Total Events
            </h3>
            <p className="text-lg font-medium leading-[120%] text-[#424242] font-manrope pt-2 flex items-center gap-1">
              <GoDotFill className="w-4 h-4 text-[#008000]" />

              {data?.totalBookings ? data.totalBookings.toString() : "0"}
            </p>
          </div>
          <div>
            <Image
              src="/assets/images/events.png"
              width={58}
              height={58}
              alt="total events"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashOverview;
