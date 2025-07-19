"use client";
import DeleteModal from "@/components/modals/DeleteModal";
import HavelockPhotoPagination from "@/components/ui/havelockphoto-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SquarePen, Trash2 } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

export interface VideoInfo {
  url: string;
  type: string; // e.g., "video/mp4"
}

export interface VideoInfo {
  url: string;
  type: string; // e.g., "video/mp4"
}

export interface VideoItem {
  _id: string;
  title: string;
  video: VideoInfo;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalData: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface VideoListData {
  videos: VideoItem[];
  pagination: Pagination;
}

export interface FetchAllVideosResponse {
  status: boolean;
  message: string;
  data: VideoListData;
}

const VideosContainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODcxZjUwZTlkMjFiOTI3YWI4YWY2NTEiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NTI4MTMxMzUsImV4cCI6MTc1MzQxNzkzNX0.8Fa9S3FtjWprAe_TMGeXM2lFOFHeQpIpGHYk6Adoyew";

  // delete api logic
  const { mutate: deleteBlog } = useMutation({
    mutationKey: ["delete-video"],
    mutationFn: (id: string) =>
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/video/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
    onSuccess: (data) => {
      if (!data?.status) {
        toast.error(data?.message || "Failed to delete video");
        return;
      } else {
        toast.success(data?.message || "video deleted successfully");
      }
      queryClient.invalidateQueries({ queryKey: ["all-videos"] });
    },
  });

  // delete modal logic
  const handleDelete = () => {
    if (selectedBlogId) {
      deleteBlog(selectedBlogId);
    }
    setDeleteModalOpen(false);
  };

  // get api
  const { data, isLoading, isError, error } = useQuery<FetchAllVideosResponse>({
    queryKey: ["all-videos", currentPage],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/video/get-all-videos?page=${currentPage}&limit=8`
      ).then((res) => res.json()),
  });

  console.log(data?.data);

  if (isLoading) {
    return (
      <div className="w-full bg-gray-50 mt-10">
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Header */}
          <div className="flex items-center justify-between gap-10 p-4 border-b bg-gray-50 font-medium text-sm">
            <div>Video Name</div>
            <div>Date</div>
            <div>Action</div>
          </div>

          {/* Skeleton Rows */}
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-10 p-4 border-b last:border-b-0 "
            >
              {/* Event Name with Image */}
              <div className="flex items-center gap-3">
                <Skeleton className="w-16 h-12 rounded" />
                <Skeleton className="h-4 w-24" />
              </div>


              {/* Date */}
              <div className="space-y-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>

              {/* Action */}
              <div>
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return <div>Error {error.message}</div>;
  }

  return (
    <div>
      <div className="pt-[32px]">
        <table className="w-full">
          <thead className="">
            <tr className=" border-x border-t border-[#B6B6B6] flex items-center justify-between gap-[135px]">
              <th className="w-[400px] text-base font-bold text-[#131313] leading-[120%] font-manrope text-left py-[15px] pl-[50px]">
                Videos Name
              </th>
              <th className="w-[150px] text-base font-bold text-[#131313] leading-[120%] font-manrope text-left py-[15px]">
                Date
              </th>
              <th className="w-[130px] text-base font-bold text-[#131313] leading-[120%] font-manrope text-right py-[15px] pr-[50px]">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="border-b border-[#B6B6B6]">
            {data?.data?.videos?.map((item) => (
              <tr
                key={item._id}
                className={`border-t border-x border-[#B6B6B6] flex items-center justify-between gap-[135px]`}
              >
                <td className="w-[400px] flex items-center gap-[10px] pl-[50px] py-[10px]">
                  <div className="max-w-[100px]">
                    <video
                      className="w-full h-auto rounded"
                      src={item?.video?.url}
                    />
                  </div>

                  <h4 className="w-[290px] text-base font-medium text-[#424242] leading-[120%] font-manrope text-left py-[10px]">
                    {item.title}
                  </h4>
                </td>
                <td className="w-[140px] text-base font-medium text-[#424242] leading-[120%] font-manrope text-left py-[10px]">
                  {moment(item.createdAt).format("MM/DD/YYYY hh:mma")}
                </td>
                <td className="w-[130px] text-right py-[10px] pr-[50px]">
                  <div className="flex items-center justify-end gap-4">
                    <Link href={`/dashboard/videos/edit-video/${item._id}`}>
                      <button>
                        <SquarePen className="w-5 h-5" />
                      </button>
                    </Link>

                    <button
                      onClick={() => {
                        setDeleteModalOpen(true);
                        setSelectedBlogId(item?._id);
                      }}
                      className="-mt-2"
                    >
                      {" "}
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data &&
        data?.data &&
        data?.data?.pagination &&
        data?.data?.pagination?.totalPages > 1 && (
          <div className="bg-white flex items-center justify-between py-[10px] px-[50px] border-t border-[#B6B6B6]">
            {" "}
            <p className="text-sm font-medium leading-[120%] font-manrope text-[#707070]">
              Showing {currentPage} to 8 of {data?.data?.pagination?.totalData}{" "}
              results
            </p>
            <div>
              <HavelockPhotoPagination
                totalPages={data?.data?.pagination?.totalPages}
                currentPage={currentPage}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>{" "}
          </div>
        )}

      {/* delete modal  */}
      {deleteModalOpen && (
        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default VideosContainer;
