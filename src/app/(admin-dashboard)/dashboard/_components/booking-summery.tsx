
"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "An area chart with a legend";

const chartData = [
  { month: "January", ThisYear: 186, LastYear: 80 },
  { month: "February", ThisYear: 305, LastYear: 200 },
  { month: "March", ThisYear: 237, LastYear: 120 },
  { month: "April", ThisYear: 73, LastYear: 190 },
  { month: "May", ThisYear: 209, LastYear: 130 },
  { month: "June", ThisYear: 214, LastYear: 140 },
  { month: "July", ThisYear: 198, LastYear: 150 },
  { month: "August", ThisYear: 225, LastYear: 160 },
  { month: "September", ThisYear: 175, LastYear: 135 },
  { month: "October", ThisYear: 245, LastYear: 170 },
  { month: "November", ThisYear: 190, LastYear: 110 },
  { month: "December", ThisYear: 280, LastYear: 200 },
];

const chartConfig = {
  ThisYear: {
    label: "This Year",
    color: "#a384e8",
  },
  LastYear: {
    label: "Last Year",
    
    color: "#84c2bb",
  },
} satisfies ChartConfig;

export function BookingSummery() {
  return (
    <Card className="max-h-[425px] mt-[29px] mb-[60px]">
      <CardHeader>
        <CardTitle className="text-[32px] font-semibold text-[#1C2024] leading-[16px] pb-[6px]">
          Booking Summery
        </CardTitle>
        <CardDescription className="text-sm text-[#60646C] leading-[120%] font-normal">
          Showing total visitors for 1 year
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full max-h-[285px]">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            
            <Area
              dataKey="ThisYear"
              type="natural"
              fill="var(--color-ThisYear)"
              fillOpacity={0.4}
              stroke="var(--color-ThisYear)"
              stackId="a"
            />
            <Area
              dataKey="LastYear"
              type="natural"
              fill="var(--color-LastYear)"
              fillOpacity={0.4}
              stroke="var(--color-LastYear)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
