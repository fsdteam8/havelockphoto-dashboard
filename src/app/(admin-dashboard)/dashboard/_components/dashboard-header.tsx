import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DashboardHeader = () => {
  return (
    <div className="h-[100px] w-full bg-[#FAFAFA] flex items-center justify-end ">
      <div className="flex items-center gap-4 py-[25px] pr-[50px] ">
        <h3
          className="text-[#1F2937] font-manrope text-base not-italic font-semibold leading-[120%]
 "
        >
          Guy Hawkins
        </h3>
        <Avatar>
          <AvatarImage
            src="/assets/images/profile.jpg"
            alt="profile"
            width={50}
            height={50}
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default DashboardHeader;
