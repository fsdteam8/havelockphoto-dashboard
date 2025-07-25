"use client";
import { BookingResponse } from "@/components/types/booking-and-revenue";
import HavelockPhotoPagination from "@/components/ui/havelockphoto-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

const RevenueContainer = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, error } = useQuery<BookingResponse>({
    queryKey: ["revenue-all-data", currentPage],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/booking/summary?filter=all&page=${currentPage}&limit=8`
      ).then((res) => res.json()),
  });

  console.log(data?.message?.bookings);

  if (isLoading)
    return (
      <div className="w-full bg-gray-50 mt-10">
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Header */}
          <div className="flex items-center justify-between gap-10 p-4 border-b bg-gray-50 font-medium text-sm">
            <div>Payment Id</div>
            <div>Amount</div>
          </div>

          {/* Skeleton Rows */}
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-10 p-4 border-b last:border-b-0 "
            >
              {/* Event Name with Image */}
              <div className="flex items-center gap-3">
                <Skeleton className="w-16 h-12 rounded" />
                <Skeleton className="h-4 w-24" />
              </div>

              {/* Action */}
              <div>
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  if (isError) return <div>Error: {error?.message}</div>;

  return (
    <div>
      <div className="pt-[32px]">
        <table className="w-full">
          <thead className="">
            <tr className=" border border-[#B6B6B6]">
              <th className="text-base font-bold text-[#131313] leading-[120%] font-manrope text-left py-[15px] pl-[50px]">
                Payment ID
              </th>
              {/* <th className="text-base font-bold text-[#131313] leading-[120%] font-manrope py-[15px]">
                Season
              </th> */}
              <th className="text-base font-bold text-[#131313] leading-[120%] font-manrope py-[15px] pr-[50px]">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.message?.bookings?.map((item) => (
              <tr key={item._id} className=" border border-[#B6B6B6]">
                <td className="text-base font-semibold text-[#131313] leading-[120%] font-manrope text-left pl-[50px] py-[30px]">
                  {item.paymentIntentId}
                </td>
                {/* <td className="text-base font-medium text-[#424242] leading-[120%] font-manrope text-center py-[30px]">
                  {item.season}
                </td> */}
                <td className="text-base font-medium text-[#424242] leading-[120%] font-manrope text-center pr-[50px] py-[30px]">
                  € {item.totalAmount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        {data &&
          data?.message &&
          data?.message?.pagination &&
          data?.message?.pagination?.totalPages > 1 && (
            <div className="bg-white flex items-center justify-between py-[10px] px-[50px]">
              <p className="text-sm font-medium leading-[120%] font-manrope text-[#707070]">
                Showing {currentPage} to 8 of{" "}
                {data?.message?.pagination?.totalData} results
              </p>

              <div>
                <HavelockPhotoPagination
                  totalPages={data?.message?.pagination?.totalPages}
                  currentPage={currentPage}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default RevenueContainer;
