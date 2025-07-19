import OtpVerificationForm from "@/components/auth/otp-verification";
import { Suspense } from "react";

export default function VerifyOtpPage() {
  return <Suspense fallback={<div>Loading...</div>}>
      <OtpVerificationForm />
    </Suspense>;
}
