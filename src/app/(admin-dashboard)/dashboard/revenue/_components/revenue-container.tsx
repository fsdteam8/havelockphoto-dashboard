"use client"
import HavelockPhotoPagination from "@/components/ui/havelockphoto-pagination";
import React, { useState } from "react";

const RevenueContainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  interface revenueDataType {
    id: number;
    paymentId: string;
    season: number;
    amount: string;
  }
  const revenueData: revenueDataType[] = [
    {
      id: 1,
      paymentId: "10001",
      season: 1,
      amount: "$250",
    },
    {
      id: 2,
      paymentId: "10002",
      season: 2,
      amount: "$320",
    },
    {
      id: 3,
      paymentId: "10003",
      season: 3,
      amount: "$150",
    },
    {
      id: 4,
      paymentId: "10004",
      season: 1,
      amount: "$400",
    },
    {
      id: 5,
      paymentId: "10005",
      season: 2,
      amount: "$275",
    },
    {
      id: 6,
      paymentId: "10006",
      season: 3,
      amount: "$360",
    },
     {
      id: 7,
      paymentId: "10005",
      season: 2,
      amount: "$275",
    }
  ];

  return (
    <div>
      <div className="pt-[32px]">
        <table className="w-full">
          <thead className="">
            <tr className=" border border-[#B6B6B6]">
              <th className="text-base font-bold text-[#131313] leading-[120%] font-manrope text-left py-[15px] pl-[50px]">
                Payment ID
              </th>
              <th className="text-base font-bold text-[#131313] leading-[120%] font-manrope py-[15px]">
                Season
              </th>
              <th className="text-base font-bold text-[#131313] leading-[120%] font-manrope py-[15px] pr-[50px]">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {revenueData.map((item) => (
              <tr key={item.id} className=" border border-[#B6B6B6]">
                <td className="text-base font-semibold text-[#131313] leading-[120%] font-manrope text-left pl-[50px] py-[30px]">
                  {item.paymentId}
                </td>
                <td className="text-base font-medium text-[#424242] leading-[120%] font-manrope text-center py-[30px]">
                  {item.season}
                </td>
                <td className="text-base font-medium text-[#424242] leading-[120%] font-manrope text-center pr-[50px] py-[30px]">
                  {item.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-white flex items-center justify-between py-[10px] px-[50px]">
        <p className="text-sm font-medium leading-[120%] font-manrope text-[#707070]">Showing 1 to 5 of 12 results</p>

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

export default RevenueContainer;
