/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { useMutation } from "@tanstack/react-query"
import { authApi } from "@/lib/auth-api"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

const OtpVerificationForm = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const { toast } = useToast()

  const verifyOtpMutation = useMutation({
    mutationFn: authApi.verifyOtp,
    onSuccess: () => {
      toast({
        title: "OTP Verified Successfully",
        description: "Your verification code is correct. You can now reset your password.",
        variant: "default",
      })
      router.push(`/reset-password?email=${encodeURIComponent(email)}`)
    },
    onError: (error: any) => {
      toast({
        title: "Invalid OTP",
        description: error.message || "The verification code you entered is incorrect. Please try again.",
        variant: "destructive",
      })
      // Clear the OTP inputs on error
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    },
  })

  const resendOtpMutation = useMutation({
    mutationFn: () => authApi.forgotPassword({ email }),
    onSuccess: () => {
      toast({
        title: "OTP Resent",
        description: "A new verification code has been sent to your email.",
        variant: "default",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Resend OTP",
        description: error.message || "Unable to resend verification code. Please try again.",
        variant: "destructive",
      })
    },
  })

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = () => {
    const otpString = otp.join("")
    if (otpString.length === 6) {
      verifyOtpMutation.mutate({
        otp: otpString,
        email: email,
      })
    }
  }

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

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
            <h2 className="text-[32px] font-bold font-manrope leading-[120%] text-[#131313] mb-2">Enter OTP</h2>
            <p className="text-[#666666] text-base font-normal font-manrope leading-[150%]">
              We have share a code of your registered email address
            </p>
            <p className="text-[#666666] text-base font-normal font-manrope">{email}</p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-3 justify-center">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-bold border border-[#616161] rounded-[8px] focus:border-blue-600"
                />
              ))}
            </div>

            <Button
              className="w-full h-[51px] rounded-[8px] text-base font-bold text-white bg-blue-600 hover:bg-blue-700 font-manrope"
              onClick={handleSubmit}
              disabled={verifyOtpMutation.isPending || otp.join("").length !== 6}
            >
              {verifyOtpMutation.isPending ? "Verifying..." : "Verify"}
            </Button>
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => resendOtpMutation.mutate()}
                disabled={resendOtpMutation.isPending}
                className="text-blue-600 hover:text-blue-500 text-sm font-medium"
              >
                {resendOtpMutation.isPending ? "Resending..." : "Didn't receive code? Resend"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OtpVerificationForm
