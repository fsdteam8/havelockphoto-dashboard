/* eslint-disable @typescript-eslint/no-explicit-any */
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
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/auth-api";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Add these imports at the top
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  rememberMe: z.boolean(),
});

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // In the LoginForm component, add the toast hook
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Update the loginMutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: async () => {
      toast({
        title: "Login Successful",
        description: "Welcome back! Redirecting to dashboard...",
        variant: "default",
      });

      // Use NextAuth signIn with credentials
      const result = await signIn("credentials", {
        email: form.getValues("email"),
        password: form.getValues("password"),
        redirect: false,
      });

      if (result?.ok) {
        router.push("/dashboard");
      } else {
        toast({
          title: "Authentication Failed",
          description: "Please check your credentials and try again.",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description:
          error.message || "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    loginMutation.mutate({
      email: values.email,
      password: values.password,
    });
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50">
      <div>
        <Image
          src="/assets/images/auth-logo.png"
          alt="PROVIZ logo"
          width={113}
          height={160}
          className="w-[113px] h-[160px] object-cover"
        />
      </div>
      <div className="pt-[56px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 border border-[#E7E7E7] rounded-[8px] p-8 bg-white"
          >
            <div className="pb-8">
              <h2 className="text-[40px] font-bold font-manrope leading-[120%] text-[#131313]">
                Welcome 👋{" "}
              </h2>
              <p className="text-[#424242] text-base font-bold text-[150%] font-manrope pt-[5px]">
                Please login here
              </p>
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium font-manrope leading-[120%] tracking-[0%] text-[#131313]">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-[49px] w-full md:w-[570px] border border-[#616161] rounded-[8px] p-4 placeholder:text-[#929292] text-lg font-medium font-manrope leading-[120%] tracking-[0%] text-[#131313]"
                      placeholder="Enter your email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium font-manrope leading-[120%] tracking-[0%] text-[#131313]">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        className="h-[49px] w-full md:w-[570px] border border-[#616161] rounded-[8px] p-4 placeholder:text-[#929292] text-lg font-medium font-manrope leading-[120%] tracking-[0%] text-[#131313]"
                        placeholder="Enter your password"
                        {...field}
                      />
                      <button type="button" className="absolute right-3 top-3">
                        {showPassword ? (
                          <Eye onClick={() => setShowPassword(!showPassword)} />
                        ) : (
                          <EyeOff
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
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-[10px]">
                    <FormControl className="mt-2">
                      <Checkbox
                        id="rememberMe"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <Label
                      className="text-sm font-normal text-[#131313] leading-[120%] font-manrope"
                      htmlFor="rememberMe"
                    >
                      Remember Me
                    </Label>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="pt-8">
              <Button
                className="w-full h-[51px] rounded-[8px] text-base font-bold text-white bg-blue-600 hover:bg-blue-700 leading-[120%] tracking-[0%] font-manrope"
                type="submit"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
