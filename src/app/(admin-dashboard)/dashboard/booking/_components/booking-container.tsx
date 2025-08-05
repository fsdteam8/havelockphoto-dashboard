"use client";
import { BookingResponse } from "@/components/types/booking-and-revenue";
import HavelockPhotoPagination from "@/components/ui/havelockphoto-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React, { useState } from "react";

const BookingContainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError, error } = useQuery<BookingResponse>({
    queryKey: ["booking-all-data", currentPage],
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
          <div className="grid grid-cols-5 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
            <div>Event Name</div>
            <div>Price</div>
            <div>Address</div>
            <div>Date</div>
            <div>Action</div>
          </div>

          {/* Skeleton Rows */}
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-5 gap-4 p-4 border-b last:border-b-0 items-center"
            >
              {/* Event Name with Image */}
              <div className="flex items-center gap-3">
                <Skeleton className="w-16 h-12 rounded" />
                <Skeleton className="h-4 w-24" />
              </div>

              {/* Price */}
              <div>
                <Skeleton className="h-4 w-12" />
              </div>

              {/* Address */}
              <div>
                <Skeleton className="h-4 w-16" />
              </div>

              {/* Date */}
              <div className="space-y-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
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
            <tr className=" border-x border-t border-[#B6B6B6] flex items-center justify-between gap-[155px]">
              <th className="w-[300px] text-base font-bold text-[#131313] leading-[120%] font-manrope text-left py-[15px] pl-[50px]">
                Event Name
              </th>
              <th className="w-[100px] text-base font-bold text-[#131313] leading-[120%] font-manrope text-left py-[15px]">
                Price
              </th>
              <th className="w-[130px] text-base font-bold text-[#131313] leading-[120%] font-manrope text-left py-[15px]">
                Email
              </th>
              <th className="w-[150px] text-base font-bold text-[#131313] leading-[120%] font-manrope text-left py-[15px]">
                Date
              </th>
              <th className="w-[170px] text-base font-bold text-[#131313] leading-[120%] font-manrope text-center py-[15px] pr-[50px]">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="border-b border-[#B6B6B6]">
            {data?.message?.bookings.map((item) => (
              <tr
                key={item._id}
                className={`border-t border-x border-[#B6B6B6] flex items-center justify-between gap-[155px]`}
              >
                <td className="w-[300px] flex items-center gap-[10px] pl-[50px] py-[20px]">
                  <h4 className="w-[190px] text-base font-medium text-[#424242] leading-[120%] font-manrope text-left py-[20px]">
                    {item?.name}
                  </h4>
                </td>
                <td className="w-[100px] text-base font-medium text-[#424242] leading-[120%] font-manrope text-left py-[20px]">
                  £ {item?.totalAmount}
                </td>
                <td className="w-[130px] text-base font-medium text-[#424242] leading-[120%] font-manrope text-left py-[20px]">
                  {item?.email}
                </td>
                <td className="w-[140px] text-base font-medium text-[#424242] leading-[120%] font-manrope text-left py-[20px]">
                  {moment(item.createdAt).format("MM/DD/YYYY hh:mma")}
                </td>
                {/* <td className="w-[170px] text-base font-medium text-[#424242] leading-[120%] font-manrope text-center pr-[50px] py-[20px] flex flex-col gap-2">
                  <button className="py-[5px] px-[15px] bg-[#008000] rounded-[32px] text-sm font-semibold leading-[120%] text-[#F4F4F4] font-manrope">
                    {item?.paymentStatus}
                  </button>
                 
                </td> */}


                <td className="w-[170px] text-base font-medium text-[#424242] leading-[120%] font-manrope text-center pr-[50px] py-[20px] flex flex-col gap-2">
  <button
    className={`py-[5px] px-[15px] rounded-[32px] text-sm font-semibold leading-[120%] text-[#F4F4F4] font-manrope
      ${
        item?.paymentStatus === "cancelled"
          ? "bg-red-600" // red
          : item?.paymentStatus === "paid"
          ? "bg-[#008000]" // green
          : "bg-[#CBA0E3]" // default fallback (optional)
      }
    `}
  >
    {item?.paymentStatus}
  </button>
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

export default BookingContainer;
