"use client";
import HavelockPhotoPagination from "@/components/ui/havelockphoto-pagination";
import Image from "next/image";
import React, { useState } from "react";

const BookingContainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  interface bookingDataType {
    id: number;
    img: string;
    name: string;
    price: string;
    address: string;
    date: string;
  }
  const bookingData: bookingDataType[] = [
    {
      id: 1,
      img: "/assets/images/event1.jpg",
      name: "LinkedIn Profile Picture",
      price: "$200.00",
      address: "2972 Westheimer Rd. Santa Ana, Illinois 85486 ",
      date: "04/21/2025 03:18pm",
    },
    {
      id: 2,
      img: "/assets/images/event2.jpg",
      name: "Branding Photography",
      price: "$200.00",
      address: "2972 Westheimer Rd. Santa Ana, Illinois 85486 ",
      date: "04/21/2025 03:18pm",
    },
    {
      id: 3,
      img: "/assets/images/event1.jpg",
      name: "LinkedIn Profile Picture",
      price: "$200.00",
      address: "2972 Westheimer Rd. Santa Ana, Illinois 85486 ",
      date: "04/21/2025 03:18pm",
    },
    {
      id: 4,
      img: "/assets/images/event2.jpg",
      name: "Branding Photography",
      price: "$200.00",
      address: "2972 Westheimer Rd. Santa Ana, Illinois 85486 ",
      date: "04/21/2025 03:18pm",
    },
    {
      id: 5,
      img: "/assets/images/event1.jpg",
      name: "Branding Photography",
      price: "$200.00",
      address: "2972 Westheimer Rd. Santa Ana, Illinois 85486 ",
      date: "04/21/2025 03:18pm",
    },
  ];

  return (
    <div>
      <div className="pt-[32px]">
        <table className="w-full">
          <thead className="">
            <tr className=" border-x border-t border-[#B6B6B6] flex items-center justify-between gap-[155px]">
              <th className="w-[300px] text-base font-bold text-[#131313] leading-[120%] font-manrope text-left py-[15px] pl-[50px]">
                Event Name
              </th>
              <th className="w-[100px] text-base font-bold text-[#131313] leading-[120%] font-manrope text-left py-[15px]">
                Price
              </th>
              <th className="w-[130px] text-base font-bold text-[#131313] leading-[120%] font-manrope text-left py-[15px]">
                Address
              </th>
              <th className="w-[150px] text-base font-bold text-[#131313] leading-[120%] font-manrope text-left py-[15px]">
                Date
              </th>
              <th className="w-[170px] text-base font-bold text-[#131313] leading-[120%] font-manrope text-center py-[15px] pr-[50px]">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {bookingData.map((item) => (
              <tr
                key={item.id}
                className={`${
                  item.id === 5 ? "border-b" : "border-b-0"
                } border-t border-x border-[#B6B6B6] flex items-center justify-between gap-[155px]`}
              >
                <td className="w-[300px] flex items-center gap-[10px] pl-[50px] py-[20px]">
                  <div className="max-w-[100px]">
                    <Image
                      src={item.img}
                      alt={item.name}
                      width={100}
                      height={60}
                      className="w-[100px] h-[60px] rounded-[8px] object-cover"
                    />
                  </div>
                  <h4 className="w-[190px] text-base font-medium text-[#424242] leading-[120%] font-manrope text-left py-[20px]">
                    {item.name}
                  </h4>
                </td>
                <td className="w-[100px] text-base font-medium text-[#424242] leading-[120%] font-manrope text-left py-[20px]">
                  {item.price}
                </td>
                <td className="w-[130px] text-base font-medium text-[#424242] leading-[120%] font-manrope text-left py-[20px]">
                  {item.address}
                </td>
                <td className="w-[150px] text-base font-medium text-[#424242] leading-[120%] font-manrope text-left py-[20px]">
                  {item.date}
                </td>
                <td className="w-[170px] text-base font-medium text-[#424242] leading-[120%] font-manrope text-center pr-[50px] py-[20px] flex flex-col gap-2">
                  <button className="py-[5px] px-[15px] bg-[#008000] rounded-[32px] text-sm font-semibold leading-[120%] text-[#F4F4F4] font-manrope">
                    Completed
                  </button>
                  <button className="py-[5px] px-[12px] bg-[#CBA0E3] rounded-[32px] text-sm font-semibold leading-[120%] text-[#F4F4F4] font-manrope">
                    Scheduling
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-white flex items-center justify-between py-[10px] px-[50px]">
        <p className="text-sm font-medium leading-[120%] font-manrope text-[#707070]">
          Showing 1 to 5 of 12 results
        </p>

        <div>
          <HavelockPhotoPagination
            totalPages={5}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingContainer;
