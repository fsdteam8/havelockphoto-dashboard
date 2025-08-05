"use client"

import type { BookingResponse } from "@/components/types/booking-and-revenue"
import HavelockPhotoPagination from "@/components/ui/havelockphoto-pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import moment from "moment"
import { useState } from "react"
import { toast } from "sonner"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface CancelBookingResponse {
  success: boolean
  message: string
}

const BookingContainer = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const { data: session } = useSession()
  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery<BookingResponse>({
    queryKey: ["booking-all-data", currentPage],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/booking/summary?filter=all&page=${currentPage}&limit=8`).then(
        (res) => res.json(),
      ),
  })

  const cancelBookingMutation = useMutation<CancelBookingResponse, Error, string>({
    mutationFn: async (bookingId: string) => {
      const accessToken =
        (session?.user as { accessToken?: string })?.accessToken ||
        (session as { accessToken?: string })?.accessToken

      if (!accessToken) {
        throw new Error("No access token available")
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/booking/admin-cancel/${bookingId}`, {

        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to cancel booking")
      }

      return response.json()
    },
    onSuccess: () => {
      // Invalidate and refetch the booking data
      queryClient.invalidateQueries({ queryKey: ["booking-all-data"] })
      toast.success("Booking cancelled successfully")
    },
    onError: (error) => {
      toast.error(error.message || "Failed to cancel booking")
    },
  })

  const handleCancelBooking = (bookingId: string, bookingName: string) => {
    if (window.confirm(`Are you sure you want to cancel the booking for "${bookingName}"?`)) {
      cancelBookingMutation.mutate(bookingId)
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "cancelled":
        return "bg-red-600"
      case "paid":
        return "bg-[#008000]"
      case "pending":
        return "bg-yellow-500"
      default:
        return "bg-[#CBA0E3]"
    }
  }

  const canCancelBooking = (paymentStatus: string) => {
    return paymentStatus?.toLowerCase() !== "cancelled"
  }

  if (isLoading)
    return (
      <div className="w-full bg-gray-50 mt-10">
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Header */}
          <div className="grid grid-cols-6 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
            <div>Event Name</div>
            <div>Price</div>
            <div>Email</div>
            <div>Date</div>
            <div>Status</div>
            <div>Action</div>
          </div>
          {/* Skeleton Rows */}
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="grid grid-cols-6 gap-4 p-4 border-b last:border-b-0 items-center">
              <div className="flex items-center gap-3">
                <Skeleton className="w-16 h-12 rounded" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div>
                <Skeleton className="h-4 w-12" />
              </div>
              <div>
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div>
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
              <div>
                <Skeleton className="h-8 w-16 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )

  if (isError) return <div>Error: {error?.message}</div>

  return (
    <div>
      <div className="pt-[32px]">
        <table className="w-full">
          <thead>
            <tr className="border-x border-t border-[#B6B6B6] flex items-center justify-between gap-4">
              <th className="w-[250px] text-base font-bold text-[#131313] leading-[120%] font-manrope text-left py-[15px] pl-[50px]">
                Event Name
              </th>
              <th className="w-[100px] text-base font-bold text-[#131313] leading-[120%] font-manrope text-left py-[15px]">
                Price
              </th>
              <th className="w-[150px] text-base font-bold text-[#131313] leading-[120%] font-manrope text-left py-[15px]">
                Email
              </th>
              <th className="w-[130px] text-base font-bold text-[#131313] leading-[120%] font-manrope text-left py-[15px]">
                Date
              </th>
              <th className="w-[120px] text-base font-bold text-[#131313] leading-[120%] font-manrope text-center py-[15px]">
                Status
              </th>
              <th className="w-[120px] text-base font-bold text-[#131313] leading-[120%] font-manrope text-center py-[15px] pr-[50px]">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="border-b border-[#B6B6B6]">
            {data?.message?.bookings.map((item) => (
              <tr key={item._id} className="border-t border-x border-[#B6B6B6] flex items-center justify-between gap-4">
                <td className="w-[250px] flex items-center gap-[10px] pl-[50px] py-[20px]">
                  <h4 className="text-base font-medium text-[#424242] leading-[120%] font-manrope text-left truncate">
                    {item?.name}
                  </h4>
                </td>
                <td className="w-[100px] text-base font-medium text-[#424242] leading-[120%] font-manrope text-left py-[20px]">
                  £{item?.totalAmount}
                </td>

                {/* <td className="w-[150px] text-base font-medium text-[#424242] leading-[120%] font-manrope text-left py-[20px] truncate">
                  {item?.email}
                </td> */}

    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <td className="w-[150px] text-base font-medium text-[#424242] leading-[120%] font-manrope text-left py-[20px] truncate cursor-help">
            {item?.email}
          </td>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-white">{item?.email}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>



                <td className="w-[130px] text-base font-medium text-[#424242] leading-[120%] font-manrope text-left py-[20px]">
                  {moment(item.createdAt).format("MM/DD/YYYY hh:mma")}
                </td>
                <td className="w-[120px] text-base font-medium text-[#424242] leading-[120%] font-manrope text-center py-[20px]">
                  <button
                    className={`py-[5px] px-[15px] rounded-[32px] text-sm font-semibold leading-[120%] text-[#F4F4F4] font-manrope ${getPaymentStatusColor(
                      item?.paymentStatus,
                    )}`}
                  >
                    {item?.paymentStatus}
                  </button>
                </td>
                <td className="w-[120px] text-center pr-[50px] py-[20px]">
                  {canCancelBooking(item?.paymentStatus) ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancelBooking(item._id, item.name)}
                      disabled={cancelBookingMutation.isPending}
                      className="text-xs px-3 py-1"
                    >
                      {cancelBookingMutation.isPending && cancelBookingMutation.variables === item._id
                        ? "Cancelling..."
                        : "Cancel"}
                    </Button>
                  ) : (
                    <span className="text-xs text-gray-400">Cancelled</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        {data && data?.message && data?.message?.pagination && data?.message?.pagination?.totalPages > 1 && (
          <div className="bg-white flex items-center justify-between py-[10px] px-[50px]">
            <p className="text-sm font-medium leading-[120%] font-manrope text-[#707070]">
              Showing {currentPage} to 8 of {data?.message?.pagination?.totalData} results
            </p>
            <div>
              <HavelockPhotoPagination
                totalPages={data?.message?.pagination?.totalPages}
                currentPage={currentPage}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookingContainer
