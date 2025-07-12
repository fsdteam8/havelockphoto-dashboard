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

export const description = "A multiple bar chart";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },

  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
  { month: "July", desktop: 198, mobile: 160 },
  { month: "August", desktop: 250, mobile: 175 },
  { month: "September", desktop: 220, mobile: 150 },
  { month: "October", desktop: 275, mobile: 180 },
  { month: "November", desktop: 240, mobile: 170 },
  { month: "December", desktop: 300, mobile: 210 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2A9D90",
  },
  mobile: {
    label: "Mobile",
    color: "#E76E50",
  },
} satisfies ChartConfig;

export function RevenueStatistics() {
  return (
    <Card className="max-h-[473px]">
      <CardHeader>
        <CardTitle className="text-[32px] font-semibold text-[#1C2024] leading-[16px] pb-[6px]">
          Revenue Statistics
        </CardTitle>
        <CardDescription className="text-sm text-[#60646C] leading-[120%] font-normal">
          January - December2024
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[290px] w-full">
          <BarChart accessibilityLayer data={chartData}>
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
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
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
