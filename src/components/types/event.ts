export interface EventSchedule {
  date: string;
  startTime: string;
  endTime: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  price: number;
  type: string;
  duration: string;
  location: string;
  schedule: EventSchedule[];
  thumbnail: string;
  images: string[];
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
