/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import HavelockPhotoPagination from "@/components/ui/havelockphoto-pagination";
import { SquarePen, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useEvents, useDeleteEvent } from "@/hooks/use-events";
import type { Event, EventsApiResponse } from "@/components/types/event";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const MyEventsContainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);

  // Updated to handle the new API response structure
  const {
    data: apiResponse,
    isLoading,
    error,
  } = useEvents() as {
    data: EventsApiResponse | undefined;
    isLoading: boolean;
    error: any;
  };

  const deleteEventMutation = useDeleteEvent();

  console.log(apiResponse, "API Response in MyEventsContainer");

  // Extract events and pagination from API response
  const events = apiResponse?.events || [];
  const pagination = apiResponse?.pagination;

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEventMutation.mutateAsync(eventId);
      setDeleteEventId(null);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const formatEventDate = (event: Event) => {
    if (event.schedule && event.schedule.length > 0) {
      const firstSchedule = event.schedule[0];
      const date = new Date(firstSchedule.date);
      return format(date, "MM/dd/yyyy") + ` ${firstSchedule.startTime}`;
    }
    return format(new Date(event.createdAt), "MM/dd/yyyy hh:mm a");
  };

  // Format event types - handle array of types
  const formatEventTypes = (types: string[]) => {
    if (!types || types.length === 0) return "N/A";

    if (types.length === 1) {
      return types[0];
    }

    if (types.length <= 3) {
      return types.join(", ");
    }

    return `${types.slice(0, 2).join(", ")} +${types.length - 2} more`;
  };

  // Handle page changes - this would typically trigger a new API call
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // In a real implementation, you'd refetch data with the new page
    // refetch({ page })
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading events...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading events. Please try again.</p>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No events found.</p>
        <Link href="/dashboard/my-events/create-event">
          <Button className="mt-4">Create Your First Event</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="pt-[32px]">
        <table className="w-full">
          <thead className="">
            <tr className=" border-x border-t border-[#B6B6B6] flex items-center justify-between gap-[135px]">
              <th className="w-[400px] text-base font-bold text-[#131313] leading-[120%] font-manrope text-left py-[15px] pl-[50px]">
                Event Name
              </th>
              <th className="w-[100px] text-base font-bold text-[#131313] leading-[120%] font-manrope text-left py-[15px]">
                Price
              </th>
              {/* <th className="w-[150px] text-base font-bold text-[#131313] leading-[120%] font-manrope text-left py-[15px]">
                Type
              </th> */}
              <th className="w-[150px] text-base font-bold text-[#131313] leading-[120%] font-manrope text-left py-[15px]">
                Date
              </th>
              <th className="w-[130px] text-base font-bold text-[#131313] leading-[120%] font-manrope text-right py-[15px] pr-[50px]">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr
                key={event._id}
                className={`${
                  index === events.length - 1 ? "border-b" : "border-b-0"
                } border-t border-x border-[#B6B6B6] flex items-center justify-between gap-[135px]`}
              >
                <td className="w-[400px] flex items-center gap-[10px] pl-[50px] py-[10px]">
                  <div className="max-w-[100px] ">
                    <Image
                      src={
                        event.thumbnail ||
                        "/placeholder.svg?height=60&width=100&query=event" ||
                        "/placeholder.svg"
                      }
                      alt={event.title}
                      width={100}
                      height={60}
                      className="w-[100px] h-[60px] rounded-[8px] object-cover"
                    />
                  </div>
                  <h4 className="w-[290px] text-base font-medium text-[#424242] leading-[120%] font-manrope text-left py-[10px]">
                    {event.title}
                  </h4>
                </td>
                <td className="w-[100px] text-base font-medium text-[#424242] leading-[120%] font-manrope text-left py-[10px]">
                  ${event.price.toFixed(2)}
                </td>
                {/* <td className="w-[150px] text-base font-medium text-[#424242] leading-[120%] font-manrope text-left py-[10px]">
                  <div className="flex flex-wrap gap-1">
                    {event.type && event.type.length > 0 ? (
                      event.type.length <= 2 ? (
                        event.type.map((type, typeIndex) => (
                          <Badge
                            key={typeIndex}
                            variant="secondary"
                            className="text-xs px-2 py-1"
                          >
                            {type}
                          </Badge>
                        ))
                      ) : (
                        <>
                          {event.type.slice(0, 1).map((type, typeIndex) => (
                            <Badge
                              key={typeIndex}
                              variant="secondary"
                              className="text-xs px-2 py-1"
                            >
                              {type}
                            </Badge>
                          ))}
                          <Badge
                            variant="outline"
                            className="text-xs px-2 py-1"
                          >
                            +{event.type.length - 1}
                          </Badge>
                        </>
                      )
                    ) : (
                      <span className="text-gray-400 text-sm">No type</span>
                    )}
                  </div>
                </td> */}
                <td className="w-[150px] text-base font-medium text-[#424242] leading-[120%] font-manrope text-left py-[10px]">
                  {formatEventDate(event)}
                </td>
                <td className="w-[130px] text-right py-[10px] pr-[50px]">
                  <div className="flex items-center justify-end gap-4">
                    <Link href={`/dashboard/my-events/edit-event/${event._id}`}>
                      <button>
                        <SquarePen className="w-5 h-5" />
                      </button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="-mt-2">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the event &apos;{event.title}
                            &apos;.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="text-white bg-red-600 hover:bg-red-700 focus:ring-red-500"
                            onClick={() => handleDeleteEvent(event._id)}
                            disabled={deleteEventMutation.isPending}
                          >
                            {deleteEventMutation.isPending ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                Deleting...
                              </>
                            ) : (
                              "Delete"
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-white flex items-center justify-between py-[10px] px-[50px]">
        <p className="text-sm font-medium leading-[120%] font-manrope text-[#707070]">
          Showing {((pagination?.currentPage || 1) - 1) * events.length + 1} to{" "}
          {Math.min(
            (pagination?.currentPage || 1) * events.length,
            pagination?.totalData || events.length
          )}{" "}
          of {pagination?.totalData || events.length} results
        </p>
        <div>
          <HavelockPhotoPagination
            totalPages={pagination?.totalPages || 1}
            currentPage={pagination?.currentPage || 1}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default MyEventsContainer;
