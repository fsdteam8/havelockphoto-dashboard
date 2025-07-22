"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import HavelockphotoDropDownSelector from "@/components/ui/HavelockphotoDropDownSelector";
import { useState } from "react";

export const description = "A bar chart";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#E76E50",
  },
} satisfies ChartConfig;

// data type

export interface BookingSummaryResponse {
  status: string;
  message: {
    year: number;
    monthWise: MonthlyBookingSummary[];
  };
}

export interface MonthlyBookingSummary {
  month: string; // e.g., "Jul"
  key: string; // e.g., "2025-07"
  revenue: number; // e.g., 1200
  bookingsCount: number; // e.g., 5
}

const yearList = [
  { id: 4, name: "2023", value: 2023 },
  { id: 5, name: "2024", value: 2024 },
  { id: 6, name: "2025", value: 2025 },
  { id: 7, name: "2026", value: 2026 },
  { id: 8, name: "2027", value: 2027 },
  { id: 9, name: "2028", value: 2028 },
  { id: 10, name: "2029", value: 2029 },
  { id: 11, name: "2030", value: 2030 },
];
export function RevenueStatistics() {
  const [selectedYear, setSelectedYear] = useState<string | number | undefined>(
    new Date().getFullYear()
  );
  const { data, isLoading, isError, error } = useQuery<BookingSummaryResponse>({
    queryKey: ["revenue-statistics", selectedYear],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/booking/summary?filter=month&year=${selectedYear}`
      ).then((res) => res.json()),
  });

  if (isLoading)
    return (
      <div className="w-full bg-white rounded-lg">
        <Card className="w-full">
          <CardHeader className="pb-4">
            {/* Title Skeleton */}
            <Skeleton className="h-6 w-48" />
            {/* Subtitle Skeleton */}
            <Skeleton className="h-4 w-32 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Chart Area Skeleton */}
              <div className="relative h-64 flex items-end justify-between gap-2 px-4">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-1 flex-1"
                  >
                    <div className="flex items-end gap-1 h-48">
                      {/* Primary Bar Skeleton */}
                      <Skeleton
                        className="min-w-[12px] rounded-t-sm"
                        style={{
                          height: `${Math.random() * 60 + 40}%`, // Random heights between 40-100%
                        }}
                      />
                      {/* Secondary Bar Skeleton */}
                      <Skeleton
                        className="min-w-[12px] rounded-t-sm"
                        style={{
                          height: `${Math.random() * 50 + 30}%`, // Random heights between 30-80%
                        }}
                      />
                    </div>
                    {/* Month Label Skeleton */}
                    <Skeleton className="h-3 w-6 mt-2" />
                  </div>
                ))}
              </div>

              {/* Trending Information Skeleton */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  if (isError) return <div>Error: {error?.message}</div>;

  console.log(data?.message);
  return (
    <Card className="max-h-[473px] bg-[#FCFCFC]">
      <div className="w-full flex items-center justify-between pr-10">
        <CardHeader>
          <CardTitle className="text-[32px] font-semibold text-[#1C2024] leading-[16px] pb-[6px]">
            {" "}
            Revenue Statistics{" "}
          </CardTitle>
          <CardDescription className="text-sm text-[#60646C] leading-[120%] font-normal">
            January - December {data?.message?.year}
          </CardDescription>
        </CardHeader>
        <div className="text-primary ">
          <HavelockphotoDropDownSelector
            list={yearList}
            selectedValue={selectedYear}
            onValueChange={setSelectedYear}
            placeholderText="Select a year"
          />
        </div>
      </div>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full max-h-[290px]">
          <BarChart accessibilityLayer data={data?.message?.monthWise}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel className="bg-white" />}
            />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 text-sm leading-normal font-semibold ">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
