import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const EditVideoHeader = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#131313] leading-[120%] font-manrope">
        Edit Video
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
        <Link href="/dashboard/videos">
          <p className="text-base font-medium leading-[120%] text-[#929292] font-manrope hover:underline hover:text-[#1E90FF]">
            Videos
          </p>
        </Link>

        <span>
          {" "}
          <ChevronRight className="text-[#929292] w-[18px] h-[18px]" />
        </span>
        <p className="text-base font-medium leading-[120%] text-[#929292] font-manrope">
          Edit Video
        </p>
      </div>
    </div>
  );
};

export default EditVideoHeader;
