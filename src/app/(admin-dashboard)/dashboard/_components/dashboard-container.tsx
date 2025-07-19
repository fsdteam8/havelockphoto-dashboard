"use client";
import React from "react";
import DashOverview from "./dashboard-overview";
import { RevenueStatistics } from "./revenue-statistics";
import { BookingSummery } from "./booking-summery";
import { useQuery } from "@tanstack/react-query";
import { BookingSummaryResponse } from "@/components/types/dashboard-data-type";

const DashboardContainer = () => {
  const { data, isLoading, isError, error } = useQuery<BookingSummaryResponse>({
    queryKey: ["dashboard-overview"],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/booking/summary?filter=month&year=2025`
      ).then((res) => res.json()),
  });

  console.log(data?.message?.monthWise);
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;
  return (
    <div>
      <DashOverview data={data?.message} />
      <RevenueStatistics />
      <BookingSummery />
    </div>
  );
};

export default DashboardContainer;
