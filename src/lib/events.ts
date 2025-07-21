import { getSession } from "next-auth/react";
import type {
  CreateEventRequest,
  EventResponse,
  EventsResponse,
} from "@/components/types/event";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

async function getAuthHeaders(isFormData = false) {
  const session = await getSession();
  console.log(session);
  return {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    Authorization: `Bearer ${session?.accessToken || ""}`,
  };
}

export const eventApi = {
  // Create event
  createEvent: async (data: FormData): Promise<EventResponse> => {
    const headers = await getAuthHeaders(true); // true for FormData
    const response = await fetch(`${BASE_URL}/event`, {
      method: "POST",
      headers,
      body: data,
    });

    if (!response.ok) {
      throw new Error("Failed to create event");
    }

    return response.json();
  },

  // Get all events
  getAllEvents: async (): Promise<EventsResponse> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/event/get-all-events`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }

    return response.json();
  },

  // Update event
  updateEvent: async (
    eventId: string,
    data: CreateEventRequest
  ): Promise<EventResponse> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/event/${eventId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update event");
    }

    return response.json();
  },

  // Delete event
  deleteEvent: async (
    eventId: string
  ): Promise<{ status: boolean; message: string }> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/event/${eventId}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      throw new Error("Failed to delete event");
    }

    return response.json();
  },

  // Get single event
  getEvent: async (eventId: string): Promise<EventResponse> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/event/${eventId}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch event");
    }

    return response.json();
  },
};
