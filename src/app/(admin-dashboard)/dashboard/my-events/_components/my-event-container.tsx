"use client"

import HavelockPhotoPagination from "@/components/ui/havelockphoto-pagination"
import { SquarePen, Trash2, Loader2, ChevronUp, ChevronDown } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useMemo } from "react"
import { useEvents, useDeleteEvent } from "@/hooks/use-events"
import type { Event, EventsApiResponse } from "@/components/types/event"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
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
} from "@/components/ui/alert-dialog"

type SortOption = "general" | "latest-to-upcoming" | "upcoming-to-latest"

const MyEventsContainer = () => {
  const [sortBy, setSortBy] = useState<SortOption>("general")

  const {
    data: apiResponse,
    isLoading,
    error,
  } = useEvents() as {
    data: EventsApiResponse | undefined
    isLoading: boolean
    error: unknown
  }

  const deleteEventMutation = useDeleteEvent()

  // Memoize events array to prevent dependency changes
  const events = useMemo(() => {
    return apiResponse?.events || []
  }, [apiResponse?.events])

  const pagination = apiResponse?.pagination

  // Get event date for sorting
  const getEventDate = (event: Event): Date => {
    if (event.schedule && event.schedule.length > 0) {
      return new Date(event.schedule[0].date)
    }
    return new Date(event.createdAt)
  }

  // Sort events based on selected option
  const sortedEvents = useMemo(() => {
    if (sortBy === "general") {
      return events
    }

    const sorted = [...events].sort((a, b) => {
      const dateA = getEventDate(a)
      const dateB = getEventDate(b)

      if (sortBy === "latest-to-upcoming") {
        return dateB.getTime() - dateA.getTime() // Descending (latest first)
      } else {
        return dateA.getTime() - dateB.getTime() // Ascending (upcoming first)
      }
    })

    return sorted
  }, [events, sortBy])

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEventMutation.mutateAsync(eventId)
    } catch (error) {
      console.error("Error deleting event:", error)
    }
  }

  const formatEventDate = (event: Event): string => {
    if (event.schedule && event.schedule.length > 0) {
      const firstSchedule = event.schedule[0]
      const date = new Date(firstSchedule.date)
      return format(date, "MM/dd/yyyy") + ` ${firstSchedule.startTime}`
    }
    return format(new Date(event.createdAt), "MM/dd/yyyy hh:mm a")
  }

  const handlePageChange = (page: number) => {
    // Handle page change logic here if needed
    console.log("Page changed to:", page)
  }

  const handleSortToggle = () => {
    let nextSort: SortOption

    if (sortBy === "general") {
      nextSort = "upcoming-to-latest"
    } else if (sortBy === "upcoming-to-latest") {
      nextSort = "latest-to-upcoming"
    } else {
      nextSort = "general"
    }

    setSortBy(nextSort)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading events...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading events. Please try again.</p>
      </div>
    )
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No events found.</p>
        <Link href="/dashboard/my-events/add-event">
          <Button className="mt-4">Create Your First Event</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="pt-[32px]">
        <table className="w-full">
          <thead>
            <tr className="border-x border-t border-[#B6B6B6] flex items-center justify-between gap-[135px]">
              <th className="w-[400px] text-base font-bold text-[#131313] leading-[120%] font-manrope text-left py-[15px] pl-[50px]">
                Event Name
              </th>
              <th className="w-[100px] text-base font-bold text-[#131313] leading-[120%] font-manrope text-left py-[15px]">
                Price
              </th>
              <th className="w-[150px] text-base font-bold text-[#131313] leading-[120%] font-manrope text-left py-[15px]">
                <button
                  type="button"
                  onClick={() => handleSortToggle()}
                  className="flex items-center gap-2 hover:text-blue-600 transition-colors group"
                  aria-label="Sort by date"
                >
                  Date
                  <div className="flex flex-col">
                    <ChevronUp
                      className={`w-3 h-3 -mb-1 transition-colors ${
                        sortBy === "upcoming-to-latest" ? "text-blue-600" : "text-gray-300 group-hover:text-gray-400"
                      }`}
                    />
                    <ChevronDown
                      className={`w-3 h-3 transition-colors ${
                        sortBy === "latest-to-upcoming" ? "text-blue-600" : "text-gray-300 group-hover:text-gray-400"
                      }`}
                    />
                  </div>
                </button>
              </th>
              <th className="w-[130px] text-base font-bold text-[#131313] leading-[120%] font-manrope text-right py-[15px] pr-[50px]">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedEvents.map((event, index) => (
              <tr
                key={event._id}
                className={`${
                  index === sortedEvents.length - 1 ? "border-b" : "border-b-0"
                } border-t border-x border-[#B6B6B6] flex items-center justify-between gap-[135px]`}
              >
                <td className="w-[400px] flex items-center gap-[10px] pl-[50px] py-[10px]">
                  <div className="max-w-[100px]">
                    <Image
                      src={event.thumbnail || "/placeholder.svg?height=60&width=100&query=event" || "/placeholder.svg"}
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
                  £{event.price.toFixed(2)}
                </td>
                <td className="w-[150px] text-base font-medium text-[#424242] leading-[120%] font-manrope text-left py-[10px]">
                  {formatEventDate(event)}
                </td>
                <td className="w-[130px] text-right py-[10px] pr-[50px]">
                  <div className="flex items-center justify-end gap-4">
                    <Link href={`/dashboard/my-events/edit-event/${event._id}`}>
                      <button
                        type="button"
                        className="hover:text-blue-600 transition-colors"
                        aria-label={`Edit ${event.title}`}
                      >
                        <SquarePen className="w-5 h-5" />
                      </button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          type="button"
                          className="hover:text-red-600 transition-colors"
                          aria-label={`Delete ${event.title}`}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the event &apos;{event.title}
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

      {/* Pagination Section */}
      <div className="bg-white flex items-center justify-between py-[10px] px-[50px]">
        <p className="text-sm font-medium leading-[120%] font-manrope text-[#707070]">
          Showing {((pagination?.currentPage || 1) - 1) * sortedEvents.length + 1} to{" "}
          {Math.min((pagination?.currentPage || 1) * sortedEvents.length, pagination?.totalData || sortedEvents.length)}{" "}
          of {pagination?.totalData || sortedEvents.length} results
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
  )
}

export default MyEventsContainer
