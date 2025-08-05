import React from "react";
import { Avatar } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";

const DashboardHeader = () => {
  const { data: session } = useSession();

  return (
    <header className="w-full fixed top-0 left-0 z-40 bg-[#FAFAFA]">
      <div className="max-w-full mx-auto flex items-center justify-end px-4 sm:px-6 lg:px-8 h-[100px]">
        <div className="flex items-center gap-4">
          <h3 className=" font-manrope text-base font-semibold leading-[120%]">
            {session?.user?.name}
          </h3>
          <Avatar className="border-2 p-4 h-5 w-5 flex items-center justify-center bg-[#FAFAFA] text-red-600">
            {session?.user?.name ? session.user.name[0].toUpperCase() : ""}
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;










