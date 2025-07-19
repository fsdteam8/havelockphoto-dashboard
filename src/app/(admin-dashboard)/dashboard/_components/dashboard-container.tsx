"use client";
import React from "react";
import DashOverview from "./dashboard-overview";
import { RevenueStatistics } from "./revenue-statistics";
import { BookingSummery } from "./booking-summery";
import { useQuery } from "@tanstack/react-query";
import { BookingSummaryResponse } from "@/components/types/dashboard-data-type";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardContainer = () => {
  const { data, isLoading, isError, error } = useQuery<BookingSummaryResponse>({
    queryKey: ["dashboard-overview"],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/booking/summary?filter=month&year=2025`
      ).then((res) => res.json()),
  });

  if (isLoading)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Own Revenue Skeleton */}
        <div className="bg-white dark:bg-muted rounded-xl shadow p-6 flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" /> {/* Own Revenue Label */}
            <Skeleton className="h-6 w-16" /> {/* £1200 */}
          </div>
          <Skeleton className="h-12 w-12 rounded-md" /> {/* Icon */}
        </div>

        {/* Total Events Skeleton */}
        <div className="bg-white dark:bg-muted rounded-xl shadow p-6 flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" /> {/* Total Events Label */}
            <Skeleton className="h-6 w-8" /> {/* 5 */}
          </div>
          <Skeleton className="h-12 w-12 rounded-md" /> {/* Icon */}
        </div>
      </div>
    );
  if (isError) return <div className="p-10 rounded-lg bg-white text-black">Error: {error?.message}</div>;
  return (
    <div>
      <DashOverview data={data?.message} />
      <RevenueStatistics />
      <BookingSummery />
    </div>
  );
};

export default DashboardContainer;
