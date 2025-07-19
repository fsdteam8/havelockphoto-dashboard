const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com"

export interface LoginRequest {
  email: string
  password: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface VerifyOtpRequest {
  otp: string
  email: string
}

export interface ResetPasswordRequest {
  email: string
  newPassword: string
}

export const authApi = {
  login: async (data: LoginRequest) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || "Invalid email or password")
    }

    return result
  },

  forgotPassword: async (data: ForgotPasswordRequest) => {
    const response = await fetch(`${BASE_URL}/auth/forget-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || "Email not found or unable to send OTP")
    }

    return result
  },

  verifyOtp: async (data: VerifyOtpRequest) => {
    const response = await fetch(`${BASE_URL}/auth/verify-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || "Invalid or expired verification code")
    }

    return result
  },

  resetPassword: async (data: ResetPasswordRequest) => {
    const response = await fetch(`${BASE_URL}/auth/verify-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || "Unable to reset password")
    }

    return result
  },
}
