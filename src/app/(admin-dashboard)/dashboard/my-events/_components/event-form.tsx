"use client";
import { useForm, useFieldArray } from "react-hook-form";
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
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { CreateEventRequest, Event, DurationUnit } from "@/types/event";
import { useCreateEvent, useUpdateEvent } from "@/hooks/use-events";
import { useRouter } from "next/navigation";

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

const durationUnits: DurationUnit[] = [
  { value: "h", label: "Hours" },
  { value: "m", label: "Minutes" },
];

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
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
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

  const onSubmit = async (data: EventFormData) => {
    const eventData: CreateEventRequest = {
      title: data.title,
      description: data.description,
      price: data.price,
      type: data.type,
      duration: `${data.durationValue}${data.durationUnit}`, // This will create "15m" or "2h"
      location: data.location,
      schedule: data.schedule,
    };

    try {
      if (mode === "create") {
        await createEventMutation.mutateAsync(eventData);
      } else if (event) {
        await updateEventMutation.mutateAsync({
          eventId: event._id,
          data: eventData,
        });
      }
      router.push("/dashboard/my-events");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const addSchedule = () => {
    append({ date: "", startTime: "", endTime: "" });
  };

  const isLoading =
    createEventMutation.isPending || updateEventMutation.isPending;

  return (
    <Card className="w-full my-6 mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Create New Event" : "Edit Event"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Enter event title"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Event Type</Label>
              <Input
                id="type"
                {...register("type")}
                placeholder="Enter event type"
              />
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Enter event description"
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                {...register("price", { valueAsNumber: true })}
                placeholder="0"
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                {...register("location")}
                placeholder="Enter location"
              />
              {errors.location && (
                <p className="text-sm text-red-500">
                  {errors.location.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Duration</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min="1"
                  {...register("durationValue", { valueAsNumber: true })}
                  placeholder="15"
                  className="flex-1"
                />
                <Select
                  value={watch("durationUnit")}
                  onValueChange={(value: "h" | "m") =>
                    setValue("durationUnit", value)
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="m">Minutes</SelectItem>
                    <SelectItem value="h">Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {errors.durationValue && (
                <p className="text-sm text-red-500">
                  {errors.durationValue.message}
                </p>
              )}
              {errors.durationUnit && (
                <p className="text-sm text-red-500">
                  {errors.durationUnit.message}
                </p>
              )}
            </div>
          </div>

          {/* Schedule Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Event Schedule</Label>
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

            {fields.map((field, index) => (
              <Card key={field.id} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal bg-transparent"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {watch(`schedule.${index}.date`)
                            ? format(
                                new Date(watch(`schedule.${index}.date`)),
                                "PPP"
                              )
                            : "Pick a date"}
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
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      {...register(`schedule.${index}.startTime`)}
                      placeholder="09:00"
                    />
                    {errors.schedule?.[index]?.startTime && (
                      <p className="text-sm text-red-500">
                        {errors.schedule[index]?.startTime?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      {...register(`schedule.${index}.endTime`)}
                      placeholder="11:00"
                    />
                    {errors.schedule?.[index]?.endTime && (
                      <p className="text-sm text-red-500">
                        {errors.schedule[index]?.endTime?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}

            {errors.schedule && (
              <p className="text-sm text-red-500">{errors.schedule.message}</p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : mode === "create"
                ? "Create Event"
                : "Update Event"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
