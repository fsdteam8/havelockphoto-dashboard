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
import { useState } from "react";
import { Eye, EyeOff, SaveAll } from "lucide-react";

const formSchema = z
  .object({
    currentPassword: z.string().min(6, {
      message: "Current Password must be at least 6 characters.",
    }),
    newPassword: z.string().min(6, {
      message: "New Password must be at least 6 characters.",
    }),
    confirmNewPassword: z.string().min(6, {
      message: "Confirm New Password must be at least 6 characters.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match.",
    path: ["confirmNewPassword"],
  });

const SettingContainerForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <div className="pt-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" px-[50px] pb-[32px] pt-[24px] border border-[#B6B6B6] rounded-md"
        >
          <h3 className="text-lg font-semibold font-manrope leading-[120%] text-[#131313] ">
            change Password
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
                        className="w-full h-[50px] border border-[#929292] rounded-[4px] py-[14px] px-[24px] text-base font-semibold font-manrope leading-[120%]"
                        placeholder="***********"
                        {...field}
                      />
                      <button type="button" className="absolute top-3 right-3">
                        {showPassword ? (
                          <Eye
                            className="text-[#616161]"
                            onClick={() => setShowPassword(!showPassword)}
                          />
                        ) : (
                          <EyeOff
                            className="text-[#616161]"
                            onClick={() => setShowPassword(!showPassword)}
                          />
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
                        className="w-full h-[50px] border border-[#929292] rounded-[4px] py-[14px] px-[24px] text-base font-semibold font-manrope leading-[120%]"
                        placeholder="***********"
                        {...field}
                      />
                      <button type="button" className="absolute top-3 right-3">
                        {showNewPassword ? (
                          <Eye
                            className="text-[#616161]"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          />
                        ) : (
                          <EyeOff
                            className="text-[#616161]"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          />
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
                        className="w-full h-[50px] border border-[#929292] rounded-[4px] py-[14px] px-[24px] text-base font-semibold font-manrope leading-[120%]"
                        placeholder="***********"
                        {...field}
                      />
                      <button type="button" className="absolute top-3 right-3">
                        {showConfirmPassword ? (
                          <Eye
                            className="text-[#616161]"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          />
                        ) : (
                          <EyeOff
                            className="text-[#616161]"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          />
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
              className="h-[50px] w-[120px] flex items-center gap-2 text-base font-normal text-white font-manrope tracking-[0%] leading-[150%] bg-primary py-[15px] px-[28px] "
              type="submit"
            >
              <SaveAll className="w-5 h-5 " /> Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SettingContainerForm;
