import React from "react";
import { BookingSummery } from "./_components/booking-summery";
import DashOverview from "./_components/dashboard-overview";
import { RevenueStatistics } from "./_components/revenue-statistics";

const DashboardOverview = () => {
  return (
    <div>
      <DashOverview />
      <RevenueStatistics />
      <BookingSummery />
    </div>
  );
};

export default DashboardOverview;
