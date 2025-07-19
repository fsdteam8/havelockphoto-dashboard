/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { useMutation } from "@tanstack/react-query"
import { authApi } from "@/lib/auth-api"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

const ForgotPasswordForm = () => {
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  const forgotPasswordMutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      const email = form.getValues("email")
      toast({
        title: "OTP Sent Successfully",
        description: `We've sent a verification code to ${email}. Please check your email.`,
        variant: "default",
      })
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`)
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Send OTP",
        description: error.message || "Unable to send verification code. Please check your email and try again.",
        variant: "destructive",
      })
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    forgotPasswordMutation.mutate(values)
  }

  return (
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
            <h2 className="text-[32px] font-bold font-manrope leading-[120%] text-[#131313] mb-2">Forgot Password</h2>
            <p className="text-[#666666] text-base font-normal font-manrope leading-[150%]">
              Enter your registered email address. we&apos;ll send you a code to reset your password.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium font-manrope leading-[120%] text-[#131313]">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-[49px] w-full border border-[#616161] rounded-[8px] p-4 placeholder:text-[#929292] text-lg font-medium font-manrope"
                        placeholder="Enter your email address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <Button
                className="w-full h-[51px] rounded-[8px] text-base font-bold text-white bg-blue-600 hover:bg-blue-700 font-manrope"
                type="submit"
                disabled={forgotPasswordMutation.isPending}
              >
                {forgotPasswordMutation.isPending ? "Sending..." : "Send OTP"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordForm
