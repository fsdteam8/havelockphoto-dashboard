"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";
import { Video, Upload, X } from "lucide-react";

const formSchema = z.object({
  addTitle: z.string().min(2, {
    message: "Add Title must be at least 2 characters.",
  }),
  video: z.any().optional(),
});

const AddVideoForm = () => {
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      addTitle: "",
      video: undefined,
    },
  });

  const handleVideoChange = (file: File) => {
    if (file && file.type.startsWith("video/")) {
      const videoUrl = URL.createObjectURL(file);
      setPreviewVideo(videoUrl);
      form.setValue("video", file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith("video/")) {
      handleVideoChange(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="pt-10 md:max-w-4xl lg:max-w-5xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[23px]">
          {/* Title Field */}
          <div>
            <FormField
              control={form.control}
              name="addTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold font-manrope tracking-[0%] leading-[120%] text-black">
                    Add Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full h-[50px] border border-[#B6B6B6] rounded-[4px] p-4 text-base font-semibold font-manrope tracking-[0%] leading-[120%] text-black"
                      placeholder="Add your title..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Video Upload Field */}
          <div className="border border-[#B6B6B6] rounded-[8px] p-[15px]">
            <FormField
              control={form.control}
              name="video"
              render={() => (
                <FormItem>
                  <FormLabel className="text-base font-semibold font-manrope tracking-[0%] leading-[120%] text-black">
                    Add Video
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      {!previewVideo ? (
                        <div
                          className={`
                            h-[450px] border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                            ${
                              isDragOver
                                ? "border-blue-400 bg-blue-50"
                                : "border-gray-300 hover:border-gray-400"
                            }
                          `}
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onClick={() =>
                            document.getElementById("video-upload")?.click()
                          }
                        >
                          <div className="h-full flex flex-col items-center justify-center space-y-3">
                            <div className="">
                              <Video className="w-[38px] h-[38px] text-gray-400" />
                            </div>
                            {/* <p className="text-gray-500">
                              Drag and drop your video here, or click to browse
                            </p>
                            <p className="text-sm text-gray-400">
                              Supported formats: MP4, WebM, Ogg
                            </p> */}
                          </div>
                          <input
                            id="video-upload"
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleVideoChange(file);
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <div className="relative">
                          <video
                            ref={videoRef}
                            src={previewVideo}
                            controls
                            className="w-full h-[450px] object-contain rounded-lg border-2 border-dashed border-gray-300 bg-black"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewVideo(null);
                              form.setValue("video", undefined);
                            }}
                            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-50"
                          >
                            <X className="h-4 w-4 text-gray-600" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              document.getElementById("video-upload")?.click()
                            }
                            className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50"
                          >
                            <Upload className="h-4 w-4 text-gray-600" />
                          </button>
                          <input
                            id="video-upload"
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleVideoChange(file);
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-10 w-full flex items-center justify-end mb-[91px]">
            <Button
              size={"lg"}
              className="h-[45px] bg-primary text-[#F4F4F4] font-manrope text-base leading-[120%] tracking-[0%] py-[13px] px-[41px] rounded-[8px]"
              type="submit"
            >
              Publish
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddVideoForm;
