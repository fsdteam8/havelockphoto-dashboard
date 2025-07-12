import Image from "next/image";
import React from "react";
import { GoDotFill } from "react-icons/go";

const DashOverview = () => {
  const overviewData = [
    {
      id: 1,
      name: "Own Revenue",
      value: "£132,570",
      image: "/assets/images/revenue.png",
      color: "#525773",
    },
    {
      id: 2,
      name: "Total Events",
      value: "20.00",
      image: "/assets/images/events.png",
      color: "#008000",
    },
  ];
  return (
    <div className="pb-[47px]">
      <h1 className="text-2xl font-bold text-[#131313] leading-[120%] font-manrope">
        Over View
      </h1>
      <p className="text-base font-medium leading-[120%] text-[#929292] font-manrope pt-[14px]">
        Dashboard
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[70px] pt-8 ">
        {overviewData?.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-center gap-[10px] rounded-[6px] bg-[#FAFAFA] shadow-[0px_2px_6px_0px_rgba(0,0,0,0.08)] py-6 px-8"
          >
            <div>
              <h3 className="text-xl font-bold text-[#131313] leading-[120%] font-manrope">
                {item?.name}
              </h3>
              <p className="text-lg font-medium leading-[120%] text-[#424242] font-manrope pt-2 flex items-center gap-1">
                <GoDotFill className="w-4 h-4" style={{ color: item.color }} />

                {item?.value}
              </p>
            </div>
            <div>
              <Image src={item.image} width={58} height={58} alt={item.name} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashOverview;
