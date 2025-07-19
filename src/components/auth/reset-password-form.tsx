/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { authApi } from "@/lib/auth-api"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

const formSchema = z
  .object({
    newPassword: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

const ResetPasswordForm = () => {
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  })

  const resetPasswordMutation = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      toast({
        title: "Password Reset Successful",
        description: "Your password has been updated successfully.",
        variant: "default",
      })
      setShowSuccessModal(true)
    },
    onError: (error: any) => {
      toast({
        title: "Password Reset Failed",
        description: error.message || "Unable to reset your password. Please try again.",
        variant: "destructive",
      })
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    resetPasswordMutation.mutate({
      email: email,
      newPassword: values.newPassword,
    })
  }

  const handleBackToLogin = () => {
    router.push("/auth/login")
  }

  return (
    <>
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="mb-14">
          <Image
            src="/assets/images/auth-logo.png"
            alt="PROVIZ logo"
            width={113}
            height={160}
            className="w-[113px] h-[160px] object-cover"
          />
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="bg-white border border-[#E7E7E7] rounded-[8px] p-8">
            <div className="mb-8">
              <h2 className="text-[32px] font-bold font-manrope leading-[120%] text-[#131313] mb-2">Reset Password</h2>
              <p className="text-[#666666] text-base font-normal font-manrope leading-[150%]">
                Create your new password
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-medium font-manrope leading-[120%] text-[#131313]">
                        New Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showNewPassword ? "text" : "password"}
                            className="h-[49px] w-full border border-[#616161] rounded-[8px] p-4 placeholder:text-[#929292] text-lg font-medium font-manrope"
                            placeholder="Enter new password"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-3"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <Eye /> : <EyeOff />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-medium font-manrope leading-[120%] text-[#131313]">
                        Confirm New Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            className="h-[49px] w-full border border-[#616161] rounded-[8px] p-4 placeholder:text-[#929292] text-lg font-medium font-manrope"
                            placeholder="Enter confirm new password"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-3"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <Eye /> : <EyeOff />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <Button
                  className="w-full h-[51px] rounded-[8px] text-base font-bold text-white bg-blue-600 hover:bg-blue-700 font-manrope"
                  type="submit"
                  disabled={resetPasswordMutation.isPending}
                >
                  {resetPasswordMutation.isPending ? "Updating..." : "Continue"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[8px] p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-[#131313] mb-2 font-manrope">Password Changed Successfully</h3>
              <p className="text-[#666666] text-base font-normal font-manrope mb-6">
                Your password has been updated successfully
              </p>
              <Button
                className="w-full h-[51px] rounded-[8px] text-base font-bold text-white bg-blue-600 hover:bg-blue-700 font-manrope"
                onClick={handleBackToLogin}
              >
                Back to Login
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ResetPasswordForm
