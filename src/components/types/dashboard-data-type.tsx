export interface Slot {
  startTime: string;
  endTime: string;
  date: string;
}

export interface Booking {
  _id: string;
  name: string;
  email: string;
  phone: string;
  eventId: string;
  slots: Slot[];
  paymentStatus: string;
  paymentIntentId: string;
  totalAmount: string;
  createdAt: string;
}

export interface MonthWiseData {
  month: string;
  key: string; // e.g., "2025-07"
  revenue: number;
  bookingsCount: number;
  bookings: Booking[];
  ratio: number;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalData: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface BookingSummaryMessage {
  year: number;
  monthWise: MonthWiseData[];
  totalRevenue: number;
  totalBookings: number;
  pagination: Pagination;
}

export interface BookingSummaryResponse {
  status: string;
  message: BookingSummaryMessage;
}
