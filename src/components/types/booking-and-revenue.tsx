export interface BookingResponse {
  status: string;
  message: {
    bookings: Booking[];
    pagination: Pagination;
    totalData: number;
    totalBookings: number;
    totalRevenue: number;
  };
}

export interface Booking {
  _id: string;
  name: string;
  email: string;
  phone: string;
  eventId: Event;
  slots: Slot[];
  paymentStatus: "paid" | "unpaid" | string;
  paymentIntentId: string;
  totalAmount: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Event {
  _id: string;
  title: string;
  price: number;
  type: string;
  duration: string;
  schedule: Schedule[];
  location: string;
  description: string;
  thumbnail: string;
  images: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Schedule {
  date: string; // ISO string
  startTime: string; // e.g., "09:00"
  endTime: string; // e.g., "11:00"
}

export interface Slot {
  startTime: string; // e.g., "09:15"
  endTime: string; // e.g., "09:30"
  date: string; // e.g., "2025-07-18"
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalData: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
