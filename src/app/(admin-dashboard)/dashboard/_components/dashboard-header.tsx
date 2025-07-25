import React from "react";
import { Avatar } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";

const DashboardHeader = () => {
  const { data: session } = useSession();
  return (
    <div className="h-[100px] w-full sticky top-0 z-40 bg-[#FAFAFA] flex items-center justify-end ">
      <div className="flex items-center gap-4 py-[25px] pr-[50px] ">
        <h3
          className="text-[#1F2937] font-manrope text-base not-italic font-semibold leading-[120%]
 "
        >
          {session?.user?.name}
        </h3>
        <Avatar className=" border-2 p-4 h-5 w-5 flex items-center justify-center">
          {session?.user?.name ? session.user.name[0].toUpperCase() : ""}
        </Avatar>
      </div>
    </div>
  );
};

export default DashboardHeader;
