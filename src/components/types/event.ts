export interface EventSchedule {
  date: string;
  startTime: string;
  endTime: string;
}
export interface EventDetail {
  types: string[];
  image: string;
}
export interface Event {
  _id: string;
  title: string;
  // description?: string;
  price: number;
  type: string[];
  duration: string;
  schedule: {
    date: string;
    startTime: string;
    endTime: string;
  }[];
  location: string;
  thumbnail: string;
  images?: string[];
  eventDetails: EventDetail[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  price: number;
  type: string;
  duration: string; // This will be "15m" or "2h" format
  location: string;
  schedule: EventSchedule[];
}

export interface EventResponse {
  status: boolean;
  message: string;
  data: Event;
}

export interface EventsResponse {
  status: boolean;
  message: string;
  data: Event[];
}

export interface DurationUnit {
  value: "h" | "m";
  label: string;
}

// Add API response types
export interface EventsApiResponse {
  status: boolean;
  message: string;
  events: Event[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalData: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
