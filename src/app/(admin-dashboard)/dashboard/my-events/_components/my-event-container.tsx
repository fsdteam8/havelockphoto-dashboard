"use client";
import HavelockPhotoPagination from "@/components/ui/havelockphoto-pagination";
import { SquarePen, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const MyEventsContainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  interface bookingDataType {
    id: number;
    img: string;
    name: string;
    price: string;
    type: string;
    date: string;
  }
  const bookingData: bookingDataType[] = [
    {
      id: 1,
      img: "/assets/images/event1.jpg",
      name: "LinkedIn Profile Picture",
      price: "$150.00",
      type: "In Studio",
      date: "04/21/2025 03:18pm",
    },
    {
      id: 2,
      img: "/assets/images/event2.jpg",
      name: "Branding Photography",
      price: "$399.00",
      type: "In Studio",
      date: "04/21/2025 03:18pm",
    },
    {
      id: 3,
      img: "/assets/images/event1.jpg",
      name: "LinkedIn Profile Picture",
      price: "$200.00",
      type: "In Studio",
      date: "04/21/2025 03:18pm",
    },
    {
      id: 4,
      img: "/assets/images/event2.jpg",
      name: "Branding Photography",
      price: "$200.00",
      type: "In Studio",
      date: "04/21/2025 03:18pm",
    },
    {
      id: 5,
      img: "/assets/images/event1.jpg",
      name: "Branding Photography",
      price: "$200.00",
      type: "In Studio",
      date: "04/21/2025 03:18pm",
    },
    {
      id: 6,
      img: "/assets/images/event2.jpg",
      name: "Branding Photography",
      price: "$200.00",
      type: "In Studio",
      date: "04/21/2025 03:18pm",
    },
    {
      id: 7,
      img: "/assets/images/event1.jpg",
      name: "Branding Photography",
      price: "$200.00",
      type: "In Studio",
      date: "04/21/2025 03:18pm",
    },
  ];

  return (
    <div>
      <div className="pt-[32px]">
        <table className="w-full">
          <thead className="">
            <tr className=" border-x border-t border-[#B6B6B6] flex items-center justify-between gap-[135px]">
              <th className="w-[400px] text-base font-bold text-[#131313] leading-[120%] font-manrope text-left py-[15px] pl-[50px]">
                Event Name
              </th>
              <th className="w-[100px] text-base font-bold text-[#131313] leading-[120%] font-manrope text-left py-[15px]">
                Price
              </th>
              <th className="w-[150px] text-base font-bold text-[#131313] leading-[120%] font-manrope text-left py-[15px]">
                Type
              </th>
              <th className="w-[150px] text-base font-bold text-[#131313] leading-[120%] font-manrope text-left py-[15px]">
                Date
              </th>
              <th className="w-[130px] text-base font-bold text-[#131313] leading-[120%] font-manrope text-right py-[15px] pr-[50px]">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {bookingData.map((item) => (
              <tr
                key={item.id}
                className={`${
                  item.id === 7 ? "border-b" : "border-b-0"
                } border-t border-x border-[#B6B6B6] flex items-center justify-between gap-[135px]`}
              >
                <td className="w-[400px] flex items-center gap-[10px] pl-[50px] py-[10px]">
                  <Image
                    src={item.img}
                    alt={item.name}
                    width={100}
                    height={60}
                    className="w-[100px] h-[60px] rounded-[8px] object-cover"
                  />
                  <h4 className="w-[290px] text-base font-medium text-[#424242] leading-[120%] font-manrope text-left py-[10px]">
                    {item.name}
                  </h4>
                </td>
                <td className="w-[100px] text-base font-medium text-[#424242] leading-[120%] font-manrope text-left py-[10px]">
                  {item.price}
                </td>
                <td className="w-[150px] text-base font-medium text-[#424242] leading-[120%] font-manrope text-left py-[10px]">
                  {item.type}
                </td>
                <td className="w-[150px] text-base font-medium text-[#424242] leading-[120%] font-manrope text-left py-[10px]">
                  {item.date}
                </td>
                <td className="w-[130px] text-right py-[10px] pr-[50px]">
                  <div className="flex items-center justify-end gap-4">
                    <Link href="/dashboard/my-events/edit-event">
                      <button>
                        <SquarePen className="w-5 h-5" />
                      </button>
                    </Link>

                    <button>
                      {" "}
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-white flex items-center justify-between py-[10px] px-[50px]">
        <p className="text-sm font-medium leading-[120%] font-manrope text-[#707070]">
          Showing 1 to 5 of 10 results
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

export default MyEventsContainer;
