/* eslint-disable */
// @ts-nocheck

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
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
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Eye, EyeOff, SaveAll, Loader2 } from "lucide-react";
import { changePassword, type ChangePasswordRequest } from "@/lib/auth-api";
import ChangePasswordSkeleton from "./change-password-skeleton";
import { useSession } from "next-auth/react";

const formSchema = z
  .object({
    currentPassword: z.string().min(6, {
      message: "Current Password must be at least 6 characters.",
    }),
    newPassword: z
      .string()
      .min(8, {
        message: "New Password must be at least 8 characters.",
      })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
      }),
    confirmNewPassword: z.string().min(6, {
      message: "Confirm New Password must be at least 6 characters.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match.",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password.",
    path: ["newPassword"],
  });

const SettingContainerForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  const { data: session, status } = useSession();
  console.log(session);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordRequest) => {
      if (!session?.accessToken) {
        throw new Error("No access token available. Please sign in again.");
      }
      return changePassword(data, session?.accessToken);
    },
    onSuccess: (data) => {
      toast({
        title: "Success!",
        description: data.message || "Password changed successfully.",
        variant: "default",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description:
          error.message || "Failed to change password. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const requestData: ChangePasswordRequest = {
      oldPassword: values.currentPassword,
      newPassword: values.newPassword,
    };

    changePasswordMutation.mutate(requestData);
  };

  // Show loading during session check
  if (status === "loading") {
    return <ChangePasswordSkeleton />;
  }

  // Redirect or show sign-in if not authenticated
  if (status === "unauthenticated" || !session) {
    return (
      <div className="pt-10">
        <div className="px-[50px] pb-[32px] pt-[24px] border border-[#B6B6B6] rounded-md">
          <h3 className="text-lg font-semibold font-manrope leading-[120%] text-[#131313]">
            Authentication Required
          </h3>
          <p className="mt-4 text-[#ACACAC]">
            Please sign in to change your password.
          </p>
        </div>
      </div>
    );
  }

  // Show skeleton during initial loading if needed
  const isInitialLoading = false; // Set this based on your app's loading state

  if (isInitialLoading) {
    return <ChangePasswordSkeleton />;
  }

  const isSubmitting = changePasswordMutation.isPending;

  return (
    <div className="pt-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="px-[50px] pb-[32px] pt-[24px] border border-[#B6B6B6] rounded-md"
        >
          <h3 className="text-lg font-semibold font-manrope leading-[120%] text-[#131313]">
            Change Password
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium font-manrope leading-[120%] tracking-[0%] text-[#ACACAC]">
                    Current Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        className="w-full h-[50px] border border-[#929292] rounded-[4px] py-[14px] px-[24px] text-lg font-semibold font-manrope leading-[120%]"
                        placeholder="***********"
                        disabled={isSubmitting}
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute top-3 right-3 disabled:opacity-50"
                        disabled={isSubmitting}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <Eye className="text-[#616161] w-5 h-5" />
                        ) : (
                          <EyeOff className="text-[#616161] w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium font-manrope leading-[120%] tracking-[0%] text-[#ACACAC]">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        className="w-full h-[50px] border border-[#929292] rounded-[4px] py-[14px] px-[24px] text-lg font-semibold font-manrope leading-[120%]"
                        placeholder="***********"
                        disabled={isSubmitting}
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute top-3 right-3 disabled:opacity-50"
                        disabled={isSubmitting}
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <Eye className="text-[#616161] w-5 h-5" />
                        ) : (
                          <EyeOff className="text-[#616161] w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium font-manrope leading-[120%] tracking-[0%] text-[#ACACAC]">
                    Confirm New Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        className="w-full h-[50px] border border-[#929292] rounded-[4px] py-[14px] px-[24px] text-lg font-semibold font-manrope leading-[120%]"
                        placeholder="***********"
                        disabled={isSubmitting}
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute top-3 right-3 disabled:opacity-50"
                        disabled={isSubmitting}
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <Eye className="text-[#616161] w-5 h-5" />
                        ) : (
                          <EyeOff className="text-[#616161] w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <div className="pt-8 w-full flex items-center justify-end">
            <Button
              className="h-[50px] w-[120px] flex items-center gap-2 text-base font-normal text-white font-manrope tracking-[0%] leading-[150%] bg-primary py-[15px] px-[28px]"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <SaveAll className="w-5 h-5" />
                  Submit
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SettingContainerForm;
