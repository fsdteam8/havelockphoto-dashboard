"use client";
import { useForm, useFieldArray } from "react-hook-form";
import type React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  Plus,
  Trash2,
  Upload,
  ImageIcon,
  Clock,
  MapPin,
  DollarSign,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Event } from "@/components/types/event";
import { useCreateEvent, useUpdateEvent } from "@/hooks/use-events";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be positive"),
  type: z.string().min(1, "Type is required"),
  durationValue: z.number().min(1, "Duration value is required"),
  durationUnit: z.enum(["h", "m"]),
  location: z.string().min(1, "Location is required"),
  schedule: z
    .array(
      z.object({
        date: z.string().min(1, "Date is required"),
        startTime: z.string().min(1, "Start time is required"),
        endTime: z.string().min(1, "End time is required"),
      })
    )
    .min(1, "At least one schedule is required"),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  event?: Event;
  mode: "create" | "edit";
}

// const durationUnits: DurationUnit[] = [
//   { value: "h", label: "Hours" },
//   { value: "m", label: "Minutes" },
// ];

export default function EventForm({ event, mode }: EventFormProps) {
  const router = useRouter();
  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    // getValues,
    formState: { errors, isValid },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    mode: "onChange", // Enable real-time validation
    defaultValues: {
      title: event?.title || "",
      description: event?.description || "",
      price: event?.price || 0,
      type: event?.type || "",
      durationValue: event ? Number.parseInt(event.duration) : 1,
      durationUnit: event ? (event.duration.includes("h") ? "h" : "m") : "m",
      location: event?.location || "",
      schedule: event?.schedule || [{ date: "", startTime: "", endTime: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedule",
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    event?.thumbnail || null
  );
  const [imagesPreviews, setImagesPreviews] = useState<string[]>(
    event?.images || []
  );

  // Debug function to log current form state
  // const debugFormState = () => {
  //   const currentValues = getValues();
  //   console.log("=== FORM DEBUG INFO ===");
  //   console.log("Current form values:", currentValues);
  //   console.log("Form validation errors:", errors);
  //   console.log("Is form valid:", isValid);
  //   console.log("Thumbnail file:", thumbnailFile);
  //   console.log("Image files:", imageFiles);
  //   console.log("Thumbnail preview:", thumbnailPreview);
  //   console.log("Images previews:", imagesPreviews);
  //   console.log("=======================");
  // };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      console.log("Setting thumbnail file:", file.name, file.size);
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    console.log(
      "Selected image files:",
      files.map((f) => ({ name: f.name, size: f.size }))
    );

    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Max size is 5MB`);
        return false;
      }
      return true;
    });

    console.log(
      "Valid image files:",
      validFiles.map((f) => ({ name: f.name, size: f.size }))
    );
    setImageFiles((prev) => {
      const newFiles = [...prev, ...validFiles];
      console.log(
        "Updated image files array:",
        newFiles.map((f) => ({ name: f.name, size: f.size }))
      );
      return newFiles;
    });

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagesPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    console.log("Removing image at index:", index);
    setImageFiles((prev) => {
      const newFiles = prev.filter((_, i) => i !== index);
      console.log(
        "Updated image files after removal:",
        newFiles.map((f) => ({ name: f.name, size: f.size }))
      );
      return newFiles;
    });
    setImagesPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeThumbnail = () => {
    console.log("Removing thumbnail");
    setThumbnailFile(null);
    setThumbnailPreview(null);
  };

  const onSubmit = async (data: EventFormData) => {
    console.log("=== FORM SUBMISSION START ===");
    console.log("Form data received:", data);
    console.log("Thumbnail file:", thumbnailFile);
    console.log("Image files:", imageFiles);
    console.log("Form validation state:", { isValid, errors });

    // Validate that we have the required data
    if (!data.title || !data.description || !data.type || !data.location) {
      console.error("Missing required fields!");
      alert("Please fill in all required fields");
      return;
    }

    if (!data.schedule || data.schedule.length === 0) {
      console.error("No schedule data!");
      alert("Please add at least one schedule entry");
      return;
    }

    // Validate schedule entries
    for (let i = 0; i < data.schedule.length; i++) {
      const schedule = data.schedule[i];
      if (!schedule.date || !schedule.startTime || !schedule.endTime) {
        console.error(`Schedule entry ${i} is incomplete:`, schedule);
        alert(`Please complete schedule entry ${i + 1}`);
        return;
      }
    }

    const formData = new FormData();

    try {
      // Add all text fields with validation
      console.log("Adding form fields...");
      if (mode === "edit" && event) {
        formData.append("_id", event._id);
      }
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());
      formData.append("type", data.type);
      formData.append("duration", `${data.durationValue}${data.durationUnit}`);
      formData.append("location", data.location);
      formData.append("schedule", JSON.stringify(data.schedule));

      // Add files with validation
      console.log("Adding files...");
      if (thumbnailFile) {
        console.log("Adding thumbnail file:", thumbnailFile.name);
        formData.append("thumbnail", thumbnailFile);
      } else {
        console.log("No thumbnail file to add");
      }

      console.log("Adding image files, count:", imageFiles.length);
      imageFiles.forEach((file, index) => {
        console.log(`Adding image file ${index}:`, file.name);
        formData.append("images", file);
      });

      // Debug: Log FormData contents more thoroughly
      console.log("=== FormData Debug ===");
      console.log(
        "FormData entries count:",
        Array.from(formData.entries()).length
      );

      Array.from(formData.entries()).forEach(([key, value]) => {
        if (value instanceof File) {
          console.log(
            `${key}:`,
            `File(name: ${value.name}, size: ${value.size}, type: ${value.type})`
          );
        } else {
          console.log(`${key}:`, value);
        }
      });

      // Additional check for empty FormData
      const formDataArray = Array.from(formData.entries());
      if (formDataArray.length === 0) {
        console.error("FormData is completely empty!");
        alert("Form data is empty. Please check your inputs.");
        return;
      }

      console.log("Submitting to mutation...");
      if (mode === "create") {
        const result = await createEventMutation.mutateAsync(formData);
        console.log("Create mutation result:", result);
      } else if (event) {
        // Pass formData directly to update mutation
        const result = await updateEventMutation.mutateAsync(formData);
        console.log("Update mutation result:", result);
      }

      console.log("Navigating to dashboard...");
      router.push("/dashboard/my-events");
    } catch (error) {
      console.error("=== SUBMISSION ERROR ===");
      console.error("Error details:", error);
      console.error("Error type:", typeof error);
      console.error("Error constructor:", error?.constructor?.name);

      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }

      // Show user-friendly error
      alert(
        `Error submitting form: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }

    console.log("=== FORM SUBMISSION END ===");
  };

  const addSchedule = () => {
    append({ date: "", startTime: "", endTime: "" });
  };

  const isLoading =
    createEventMutation.isPending || updateEventMutation.isPending;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {mode === "create" ? "Create New Event" : "Edit Event"}
          </h1>
          <p className="text-gray-600">
            {mode === "create"
              ? "Fill in the details below to create your event"
              : "Update your event information"}
          </p>

          {/* Debug Button - Remove this in production */}
          {/* <Button
            type="button"
            onClick={debugFormState}
            variant="outline"
            size="sm"
            className="mt-4 bg-yellow-100 border-yellow-300 text-yellow-800"
          >
            🐛 Debug Form State
          </Button> */}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <FileText className="w-5 h-5 text-blue-600" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="title"
                    className="text-sm font-medium text-gray-700"
                  >
                    Event Title *
                  </Label>
                  <Input
                    id="title"
                    {...register("title")}
                    placeholder="Enter a compelling event title"
                    className="h-11"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="type"
                    className="text-sm font-medium text-gray-700"
                  >
                    Event Type *
                  </Label>
                  <Input
                    id="type"
                    {...register("type")}
                    placeholder="e.g., Workshop, Conference, Meetup"
                    className="h-11"
                  />
                  {errors.type && (
                    <p className="text-sm text-red-500">
                      {errors.type.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-700"
                >
                  Description *
                </Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Describe your event in detail..."
                  rows={4}
                  className="resize-none"
                />
                {errors.description && (
                  <p className="text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Event Details Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <DollarSign className="w-5 h-5 text-green-600" />
                Event Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="price"
                    className="text-sm font-medium text-gray-700 flex items-center gap-1"
                  >
                    <DollarSign className="w-4 h-4" />
                    Price *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    {...register("price", { valueAsNumber: true })}
                    placeholder="0.00"
                    className="h-11"
                  />
                  {errors.price && (
                    <p className="text-sm text-red-500">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="location"
                    className="text-sm font-medium text-gray-700 flex items-center gap-1"
                  >
                    <MapPin className="w-4 h-4" />
                    Location *
                  </Label>
                  <Input
                    id="location"
                    {...register("location")}
                    placeholder="Event venue or online"
                    className="h-11"
                  />
                  {errors.location && (
                    <p className="text-sm text-red-500">
                      {errors.location.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Duration *
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="1"
                      {...register("durationValue", { valueAsNumber: true })}
                      placeholder="15"
                      className="flex-1 h-11"
                    />
                    <Select
                      value={watch("durationUnit")}
                      onValueChange={(value: "h" | "m") =>
                        setValue("durationUnit", value)
                      }
                    >
                      <SelectTrigger className="w-28 h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="m">Minutes</SelectItem>
                        <SelectItem value="h">Hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {(errors.durationValue || errors.durationUnit) && (
                    <p className="text-sm text-red-500">Duration is required</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media Upload Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <ImageIcon className="w-5 h-5 text-purple-600" />
                Event Media
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Thumbnail Upload */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">
                    Event Thumbnail
                  </Label>
                  <Badge variant="secondary" className="text-xs">
                    Recommended: 16:9 ratio
                  </Badge>
                </div>

                {!thumbnailPreview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <div className="space-y-2">
                      <Label htmlFor="thumbnail" className="cursor-pointer">
                        <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                          Click to upload thumbnail
                        </span>
                        <Input
                          id="thumbnail"
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailChange}
                          className="hidden"
                        />
                      </Label>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, WEBP up to 5MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <Image
                      width={400}
                      height={200}
                      src={thumbnailPreview || "/placeholder.svg"}
                      alt="Thumbnail preview"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={removeThumbnail}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              <Separator />

              {/* Additional Images */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">
                    Additional Images
                  </Label>
                  <Badge variant="secondary" className="text-xs">
                    {imagesPreviews.length} image
                    {imagesPreviews.length !== 1 ? "s" : ""}
                  </Badge>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <ImageIcon className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <div className="space-y-2">
                    <Label htmlFor="images" className="cursor-pointer">
                      <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                        Add more images
                      </span>
                      <Input
                        id="images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImagesChange}
                        className="hidden"
                      />
                    </Label>
                    <p className="text-xs text-gray-500">
                      Select multiple images, max 5MB each
                    </p>
                  </div>
                </div>

                {imagesPreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagesPreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <Image
                          width={200}
                          height={200}
                          src={preview || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Schedule Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <CalendarIcon className="w-5 h-5 text-orange-600" />
                Event Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Add one or more dates for your event
                </p>
                <Button
                  type="button"
                  onClick={addSchedule}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Date
                </Button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <Card key={field.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            Date
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal h-11 bg-transparent"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {watch(`schedule.${index}.date`)
                                  ? format(
                                      new Date(watch(`schedule.${index}.date`)),
                                      "MMM dd, yyyy"
                                    )
                                  : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              {/* <CalendarComponent
                                mode="single"
                                selected={
                                  watch(`schedule.${index}.date`)
                                    ? new Date(watch(`schedule.${index}.date`))
                                    : undefined
                                }
                                onSelect={(date) => {
                                  if (date) {
                                    setValue(
                                      `schedule.${index}.date`,
                                      format(date, "yyyy-MM-dd")
                                    );
                                  }
                                }}
                                initialFocus
                              /> */}
                              <Calendar
                                mode="single"
                                selected={
                                  watch(`schedule.${index}.date`)
                                    ? new Date(watch(`schedule.${index}.date`))
                                    : undefined
                                }
                                onSelect={(date) => {
                                  if (date) {
                                    setValue(
                                      `schedule.${index}.date`,
                                      format(date, "yyyy-MM-dd")
                                    );
                                  }
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          {errors.schedule?.[index]?.date && (
                            <p className="text-sm text-red-500">
                              {errors.schedule[index]?.date?.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            Start Time
                          </Label>
                          <Input
                            type="time"
                            {...register(`schedule.${index}.startTime`)}
                            className="h-11"
                          />
                          {errors.schedule?.[index]?.startTime && (
                            <p className="text-sm text-red-500">
                              {errors.schedule[index]?.startTime?.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            End Time
                          </Label>
                          <Input
                            type="time"
                            {...register(`schedule.${index}.endTime`)}
                            className="h-11"
                          />
                          {errors.schedule?.[index]?.endTime && (
                            <p className="text-sm text-red-500">
                              {errors.schedule[index]?.endTime?.message}
                            </p>
                          )}
                        </div>

                        <div className="flex justify-end">
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => remove(index)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {errors.schedule && (
                <p className="text-sm text-red-500">
                  {errors.schedule.message}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Submit Section */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
              className="h-12 px-8"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 px-8 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading
                ? "Saving..."
                : mode === "create"
                ? "Create Event"
                : "Update Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
