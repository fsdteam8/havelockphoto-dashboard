"use client";
import { BookingResponse } from "@/components/types/booking-and-revenue";
import HavelockPhotoPagination from "@/components/ui/havelockphoto-pagination";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import Image from "next/image";
import React, { useState } from "react";

const BookingContainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError, error } = useQuery<BookingResponse>({
    queryKey: ["booking-all-data", currentPage],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/booking/summary?filter=all`
      ).then((res) => res.json()),
  });

  console.log(data?.message?.bookings);

  if (isLoading) return <div>Loading...</div>;
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
            {data?.message?.bookings.map((item) => (
              <tr
                key={item._id}
                className={`border-t border-x border-[#B6B6B6] flex items-center justify-between gap-[155px]`}
              >
                <td className="w-[300px] flex items-center gap-[10px] pl-[50px] py-[20px]">
                  <div className="max-w-[100px]">
                    <Image
                      src={item?.eventId?.images[0]}
                      alt={item?.eventId?.title}
                      width={100}
                      height={60}
                      className="w-[100px] h-[60px] rounded-[8px] object-cover"
                    />
                  </div>
                  <h4 className="w-[190px] text-base font-medium text-[#424242] leading-[120%] font-manrope text-left py-[20px]">
                    {item?.eventId?.title}
                  </h4>
                </td>
                <td className="w-[100px] text-base font-medium text-[#424242] leading-[120%] font-manrope text-left py-[20px]">
                  {item?.eventId?.price}
                </td>
                <td className="w-[130px] text-base font-medium text-[#424242] leading-[120%] font-manrope text-left py-[20px]">
                  {item?.eventId?.location}
                </td>
                <td className="w-[150px] text-base font-medium text-[#424242] leading-[120%] font-manrope text-left py-[20px]">
                  {moment(item.createdAt).format("MM/DD/YYYY hh:mma")}
                </td>
                <td className="w-[170px] text-base font-medium text-[#424242] leading-[120%] font-manrope text-center pr-[50px] py-[20px] flex flex-col gap-2">
                  <button className="py-[5px] px-[15px] bg-[#008000] rounded-[32px] text-sm font-semibold leading-[120%] text-[#F4F4F4] font-manrope">
                    {item?.paymentStatus}
                  </button>
                  {/* <button className="py-[5px] px-[12px] bg-[#CBA0E3] rounded-[32px] text-sm font-semibold leading-[120%] text-[#F4F4F4] font-manrope">
                    Scheduling
                  </button> */}
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
