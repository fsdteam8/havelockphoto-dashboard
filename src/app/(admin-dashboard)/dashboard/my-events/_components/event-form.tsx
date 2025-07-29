"use client";

import { useForm, useFieldArray } from "react-hook-form";
import type React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Re-added Select imports
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  Plus,
  Trash2,
  Upload,
  ImageIcon,
  Clock,
  MapPin,
 
  FileText,
  X,
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

// Updated schema to re-introduce durationValue and durationUnit
const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  // description: z.string().min(1, "Description is required"), // Re-added description to schema
  price: z.coerce.number().nonnegative("Price must be non-negative"),
  type: z.array(z.string()).min(1, "At least one type is required"),
  durationValue: z.coerce.number().positive("Duration value must be positive"), // Duration value
  durationUnit: z.enum(["h", "m"], { message: "Duration unit is required" }), // Duration unit
  date: z.string().datetime("Invalid date format"),
  location: z.string().min(1, "Location is required"),
  schedule: z
    .array(
      z.object({
        date: z.string().datetime("Invalid date format"),
        startTime: z.string().regex(/^\d{2}:\d{2}$/, {
          message: "Invalid startTime format. Expected HH:mm",
        }),
        endTime: z.string().regex(/^\d{2}:\d{2}$/, {
          message: "Invalid endTime format. Expected HH:mm",
        }),
      })
    )
    .min(1, "At least one schedule is required"),
  eventDetails: z
    .array(
      z.object({
        types: z.array(z.string()).min(1, "At least one type is required"),
        image: z.string().optional(), // Will be populated after upload
      })
    )
    .optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  event?: Event;
  mode: "create" | "edit";
}

interface EventDetailState {
  types: string[];
  imageFile: File | null;
  imagePreview: string | null;
  currentTypeInput: string;
}

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
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventSchema),
    mode: "onChange",
    defaultValues: {
      title: event?.title || "",
      // description: event?.description || "", // Re-added description default value
      price: event?.price || 0,
      type: event?.type || [],
      durationValue: event ? Number.parseInt(event.duration) : 15, // Parse duration string
      durationUnit: event ? (event.duration.includes("h") ? "h" : "m") : "m", // Parse duration unit
      date: event?.schedule?.[0]?.date
        ? new Date(event.schedule[0].date).toISOString()
        : new Date().toISOString(),
      location: event?.location || "",
      schedule: event?.schedule?.map((s) => ({
        date: new Date(s.date).toISOString(),
        startTime: s.startTime,
        endTime: s.endTime,
      })) || [
        {
          date: new Date().toISOString(),
          startTime: "",
          endTime: "",
        },
      ],
      eventDetails: event?.eventDetails || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedule",
  });

  // State for main event types
  const [eventTypes, setEventTypes] = useState<string[]>(event?.type || []);
  const [currentTypeInput, setCurrentTypeInput] = useState("");

  // State for event details
  const [eventDetails, setEventDetails] = useState<EventDetailState[]>(
    event?.eventDetails?.map((detail) => ({
      types: detail.types,
      imageFile: null,
      imagePreview: detail.image,
      currentTypeInput: "",
    })) || []
  );

  // Main media state
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    event?.thumbnail || null
  );

  // Main Event Types Functions
  const addEventType = (type: string) => {
    if (!type.trim() || eventTypes.includes(type.trim())) return;

    const newTypes = [...eventTypes, type.trim()];
    setEventTypes(newTypes);
    setValue("type", newTypes);
    setCurrentTypeInput("");
  };

  const removeEventType = (index: number) => {
    const newTypes = eventTypes.filter((_, i) => i !== index);
    setEventTypes(newTypes);
    setValue("type", newTypes);
  };

  // Event Details Functions
  const addEventDetail = () => {
    setEventDetails((prev) => [
      ...prev,
      {
        types: [],
        imageFile: null,
        imagePreview: null,
        currentTypeInput: "",
      },
    ]);
  };

  const removeEventDetail = (index: number) => {
    setEventDetails((prev) => prev.filter((_, i) => i !== index));
  };

  const addTypeToEventDetail = (detailIndex: number, type: string) => {
    if (!type.trim()) return;

    setEventDetails((prev) =>
      prev.map((detail, index) => {
        if (index === detailIndex) {
          return {
            ...detail,
            types: [...detail.types, type.trim()],
            currentTypeInput: "",
          };
        }
        return detail;
      })
    );
  };

  const removeTypeFromEventDetail = (
    detailIndex: number,
    typeIndex: number
  ) => {
    setEventDetails((prev) =>
      prev.map((detail, index) => {
        if (index === detailIndex) {
          return {
            ...detail,
            types: detail.types.filter((_, i) => i !== typeIndex),
          };
        }
        return detail;
      })
    );
  };

  const updateEventDetailTypeInput = (detailIndex: number, value: string) => {
    setEventDetails((prev) =>
      prev.map((detail, index) => {
        if (index === detailIndex) {
          return {
            ...detail,
            currentTypeInput: value,
          };
        }
        return detail;
      })
    );
  };

  const handleEventDetailImageChange = (
    detailIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setEventDetails((prev) =>
          prev.map((detail, index) => {
            if (index === detailIndex) {
              return {
                ...detail,
                imageFile: file,
                imagePreview: reader.result as string,
              };
            }
            return detail;
          })
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const removeEventDetailImage = (detailIndex: number) => {
    setEventDetails((prev) =>
      prev.map((detail, index) => {
        if (index === detailIndex) {
          return {
            ...detail,
            imageFile: null,
            imagePreview: null,
          };
        }
        return detail;
      })
    );
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
  };

  const onSubmit = async (data: EventFormData) => {
    console.log("=== FORM SUBMISSION START ===");
    console.log("Form data received:", data);
    console.log("Event types:", eventTypes);
    console.log("Event details:", eventDetails);

    // Validate that we have the required data
    if (!data.title || !eventTypes.length || !data.location) {
      alert("Please fill in all required fields");
      return;
    }

    if (!data.schedule || data.schedule.length === 0) {
      alert("Please add at least one schedule entry");
      return;
    }

    // Validate schedule entries
    for (let i = 0; i < data.schedule.length; i++) {
      const schedule = data.schedule[i];
      if (!schedule.date || !schedule.startTime || !schedule.endTime) {
        alert(`Please complete schedule entry ${i + 1}`);
        return;
      }
    }

    // Validate event details
    for (let i = 0; i < eventDetails.length; i++) {
      const detail = eventDetails[i];
      if (detail.types.length === 0) {
        alert(`Please add at least one type for event detail ${i + 1}`);
        return;
      }
      if (!detail.imageFile && !detail.imagePreview) {
        alert(`Please add an image for event detail ${i + 1}`);
        return;
      }
    }

    const formData = new FormData();

    try {
      // Add all text fields matching the schema
      if (mode === "edit" && event) {
        formData.append("_id", event._id);
      }
      formData.append("title", data.title);
      // formData.append("description", data.description); // Re-added description to formData
      formData.append("price", data.price.toString());
      formData.append("type", JSON.stringify(eventTypes));
      formData.append("duration", `${data.durationValue}${data.durationUnit}`); // Combine value and unit
      formData.append("date", data.date);
      formData.append("location", data.location);
      formData.append("schedule", JSON.stringify(data.schedule));

      // Add thumbnail
      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      // Add event details data (only types, no image references)
      const eventDetailsData = eventDetails.map((detail) => ({
        types: detail.types,
      }));
      formData.append("eventDetails", JSON.stringify(eventDetailsData));

      // Add event detail images with the same key name "eventDetails"
      eventDetails.forEach((detail) => {
        if (detail.imageFile) {
          formData.append("eventDetails", detail.imageFile);
        }
      });

      // Debug FormData
      console.log("=== FormData Debug ===");
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

      console.log("Submitting to mutation...");
      if (mode === "create") {
        const result = await createEventMutation.mutateAsync(formData);
        console.log("Create mutation result:", result);
      } else if (event) {
        const result = await updateEventMutation.mutateAsync(formData);
        console.log("Update mutation result:", result);
      }

      console.log("Navigating to dashboard...");
      router.push("/dashboard/my-events");
    } catch (error) {
      console.error("=== SUBMISSION ERROR ===");
      console.error("Error details:", error);
      alert(
        `Error submitting form: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
    console.log("=== FORM SUBMISSION END ===");
  };

  const addSchedule = () => {
    append({
      date: new Date().toISOString(),
      startTime: "",
      endTime: "",
    });
  };

  const isLoading =
    createEventMutation.isPending || updateEventMutation.isPending;

  return (
    <div className="min-h-screen bg-gray-50 py-8 my-10 rounded-lg">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 px-4">
          {/* <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {mode === "create" ? "Create New Event" : "Edit Event"}
          </h1> */}
          <p className="text-gray-600">
            {mode === "create"
              ? "Fill in the details below to create your event"
              : "Update your event information"}
          </p>
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
              <div className="grid grid-cols-1 gap-6">
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

                {/* Event Types Section */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-700">
                    Event Types *
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={currentTypeInput}
                      onChange={(e) => setCurrentTypeInput(e.target.value)}
                      placeholder="Add event type (e.g., online, free, workshop)"
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addEventType(currentTypeInput);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addEventType(currentTypeInput)}
                      disabled={!currentTypeInput.trim()}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Event Types Badges */}
                  {eventTypes.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {eventTypes.map((type, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1 text-white  bg-blue-600 hover:bg-blue-700"
                        >
                          {type}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => removeEventType(index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  {errors.type && (
                    <p className="text-sm text-red-500">
                      {errors.type.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                {/* <div className="space-y-2">
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
                </div> */}

                {/* Main Event Date */}
                {/* <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Event Date *
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal h-11 bg-transparent"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {watch("date")
                          ? format(new Date(watch("date")), "MMM dd, yyyy")
                          : "Select main event date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={
                          watch("date") ? new Date(watch("date")) : undefined
                        }
                        onSelect={(date) => {
                          if (date) {
                            setValue("date", date.toISOString());
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.date && (
                    <p className="text-sm text-red-500">
                      {errors.date.message}
                    </p>
                  )}
                </div> */}
              </div>
            </CardContent>
          </Card>

          {/* Event Details Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                {/* <DollarSign className="w-5 h-5 text-green-600" /> */}
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
                    {/* <DollarSign className="w-4 h-4" /> */}
                   £ Price *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    {...register("price", { valueAsNumber: true })}
                    placeholder="   0.00 "
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

          {/* Add Event Details Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Plus className="w-5 h-5 text-purple-600" />
                  Add Event Details
                </CardTitle>
                <Button
                  type="button"
                  onClick={addEventDetail}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add More 
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {eventDetails.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>
                    No event details added yet. Click &apos;Add More&apos; to
                    get started.
                  </p>
                </div>
              ) : (
                eventDetails.map((detail, index) => (
                  <Card key={index} className="border border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-medium">
                          Event Detail {index + 1}
                        </h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeEventDetail(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Types Section */}
                        <div className="space-y-4">
                          <Label className="text-sm font-medium text-gray-700">
                            Types *
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              value={detail.currentTypeInput}
                              onChange={(e) =>
                                updateEventDetailTypeInput(
                                  index,
                                  e.target.value
                                )
                              }
                              placeholder="Add type (e.g., Web Portraits, LinkedIn Profile)"
                              className="flex-1"
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  addTypeToEventDetail(
                                    index,
                                    detail.currentTypeInput
                                  );
                                }
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                addTypeToEventDetail(
                                  index,
                                  detail.currentTypeInput
                                )
                              }
                              disabled={!detail.currentTypeInput.trim()}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Types Badges */}
                          {detail.types.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {detail.types.map((type, typeIndex) => (
                                <Badge
                                  key={typeIndex}
                                  variant="secondary"
                                  className="flex items-center gap-1 text-white bg-blue-600 hover:bg-blue-700"
                                >
                                  {type}
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-4 w-4 p-0 hover:bg-transparent"
                                    onClick={() =>
                                      removeTypeFromEventDetail(
                                        index,
                                        typeIndex
                                      )
                                    }
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Image Section */}
                        <div className="space-y-4">
                          <Label className="text-sm font-medium text-gray-700">
                            Image *
                          </Label>
                          {!detail.imagePreview ? (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                              <div className="space-y-2">
                                <Label
                                  htmlFor={`eventDetailImage-${index}`}
                                  className="cursor-pointer"
                                >
                                  <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                    Click to upload image
                                  </span>
                                  <Input
                                    id={`eventDetailImage-${index}`}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                      handleEventDetailImageChange(index, e)
                                    }
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
                                width={300}
                                height={200}
                                src={detail.imagePreview || "/placeholder.svg"}
                                alt={`Event detail ${index + 1}`}
                                className="w-full h-48 object-cover rounded-lg border"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => removeEventDetailImage(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>

          {/* Thumbnail Upload Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <ImageIcon className="w-5 h-5 text-purple-600" />
                Event Thumbnail
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">
                  Event Thumbnail *
                </Label>
                <Badge variant="secondary" className="text-xs bg-blue-600 hover:bg-blue-700 text-white">
                  Recommended: 16*9 px ratio
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
                  Add one or more schedule entries for your event
                </p>
                <Button
                  type="button"
                  onClick={addSchedule}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Schedule
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
                                      date.toISOString()
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
