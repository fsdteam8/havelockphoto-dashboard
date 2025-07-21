"use client";

import { useEvent } from "@/hooks/use-events";
import EventForm from "../../_components/event-form";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

export default function EditEventPage() {
  const params = useParams();
  const eventId = params.id as string;

  const { data: event, isLoading, error } = useEvent(eventId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading event...</span>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Event not found or error loading event.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <EventForm event={event} mode="edit" />
    </div>
  );
}
