import {
  CalendarPlus2,
  LayoutDashboard,
  NotebookTabs,
  Settings,
  ShieldCheck,
} from "lucide-react";

import { ReactNode } from "react";

interface DashboardSidebarItemsDataType {
  id: number;
  name: string;
  href: string;
  icon: ReactNode | string;
}

export const DashboardSidebarItems: DashboardSidebarItemsDataType[] = [
  {
    id: 1,
    name: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    id: 2,
    name: "My Events",
    href: "/dashboard/my-events",
    icon: <CalendarPlus2 />,
  },
  {
    id: 3,
    name: "Booking",
    href: "/dashboard/booking",
    icon: <NotebookTabs />,
  },
  // {
  //   id: 4,
  //   name: "Videos",
  //   href: "/dashboard/videos",
  //   icon: <FileVideo />,
  // },
  {
    id: 4,
    name: "Revenue",
    href: "/dashboard/revenue",
    icon: <ShieldCheck />,
  },
  {
    id: 5,
    name: "Setting",
    href: "/dashboard/setting",
    icon: <Settings />,
  },
];
