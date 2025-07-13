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
import { format } from "date-fns";
import { CalendarIcon, ImagePlus, Upload, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useState } from "react";
import Image from "next/image";

const formSchema = z.object({
  addTitle: z.string().min(2, {
    message: "Add Title must be at least 2 characters.",
  }),
  price: z.string().min(2, {
    message: "Price must be at least 2 characters.",
  }),
  type: z.string().min(2, {
    message: "Type must be at least 2 characters.",
  }),
  duration: z.string().min(2, {
    message: "Duration must be at least 2 characters.",
  }),
  date: z.date({
    message: "Date is required.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  shorDescription: z.string().min(2, {
    message: "Short Description must be at least 2 characters.",
  }),
  longDescription: z.string().min(2, {
    message: "Long Description must be at least 2 characters.",
  }),
  image: z.any().optional(),
});

const AddEventForm = () => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      addTitle: "",
      price: "",
      type: "",
      duration: "",
      location: "",
      shorDescription: "",
      longDescription: "",
      image: undefined,
    },
  });

  const handleImageChange = (file: File) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("image", [file]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith("image/")) {
      handleImageChange(files[0]);
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

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <div className="pt-10">
      {" "}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            <div className="md:col-span-2 space-y-[23px]">
              {/* first  */}
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
              {/* second  */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold font-manrope tracking-[0%] leading-[120%] text-black">
                        Price
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="w-full h-[50px] border border-[#B6B6B6] rounded-[4px] p-4 text-base font-semibold font-manrope tracking-[0%] leading-[120%] text-black"
                          placeholder="Add Price..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold font-manrope tracking-[0%] leading-[120%] text-black">
                        Type
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="w-full h-[50px] border border-[#B6B6B6] rounded-[4px] p-4 text-base font-semibold font-manrope tracking-[0%] leading-[120%] text-black"
                          placeholder="Write Type"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold font-manrope tracking-[0%] leading-[120%] text-black">
                        Duration
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="w-full h-[50px] border border-[#B6B6B6] rounded-[4px] p-4 text-base font-semibold font-manrope tracking-[0%] leading-[120%] text-black"
                          placeholder="Write Duration"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* third  */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className=" flex flex-col mt-1">
                      <FormLabel className="text-base font-semibold font-manrope tracking-[0%] leading-[120%] text-black">
                        Date
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild className="w-full ">
                          <FormControl className="w-full h-[50px] border border-[#B6B6B6] rounded-[4px]">
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span className="text-sm font-semibold font-manrope tracking-[0%] leading-[120%] text-secondary/50">
                                  Add Date
                                </span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-full p-0 bg-white"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold font-manrope tracking-[0%] leading-[120%] text-black">
                        Location
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="w-full h-[50px] border border-[#B6B6B6] rounded-[4px] p-4 text-base font-semibold font-manrope tracking-[0%] leading-[120%] text-black"
                          placeholder="Write Location"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* four  */}
              <div>
                <FormField
                  control={form.control}
                  name="shorDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold font-manrope tracking-[0%] leading-[120%] text-black">
                        Short Description
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
              {/* five  */}
              <div>
                <FormField
                  control={form.control}
                  name="longDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold font-manrope tracking-[0%] leading-[120%] text-black">
                        Logn Description
                      </FormLabel>
                      <FormControl>
                        <RichTextEditor
                          content={field.value}
                          onChange={field.onChange}
                          placeholder="Description...."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="md:col-span-1">
              <div className="border border-[#B6B6B6] rounded-[8px] p-[15px]">
                <FormField
                  control={form.control}
                  name="image"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold font-manrope tracking-[0%] leading-[120%] text-black">
                        Thumbnail
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          {!previewImage ? (
                            <div
                              className={`
                                  h-[730px] border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
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
                                document.getElementById("image-upload")?.click()
                              }
                            >
                              <div className="h-full flex flex-col items-center justify-center space-y-3">
                                <div className="">
                                  <ImagePlus className="w-[38px] h-[38px] text-gray-400 " />
                                </div>
                              </div>
                              <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleImageChange(file);
                                  }
                                }}
                              />
                            </div>
                          ) : (
                            <div className="relative">
                              <Image
                                width={292}
                                height={277}
                                src={previewImage || "/placeholder.svg"}
                                alt="Preview"
                                className="w-full h-[730px] object-cover rounded-lg border-2 border-dashed border-gray-300"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setPreviewImage(null);
                                  form.setValue("image", undefined);
                                }}
                                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-50"
                              >
                                <X className="h-4 w-4 text-gray-600" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  document
                                    .getElementById("image-upload")
                                    ?.click()
                                }
                                className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50"
                              >
                                <Upload className="h-4 w-4 text-gray-600" />
                              </button>
                              <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleImageChange(file);
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
            </div>
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

export default AddEventForm;
