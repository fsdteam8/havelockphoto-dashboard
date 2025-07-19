/* eslint-disable */
// @ts-nocheck

import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { authApi } from "./auth-api"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const response = await authApi.login({
            email: credentials.email,
            password: credentials.password,
          })

          if (response) {
            return {
              id: response.user?.id || "1",
              email: credentials.email,
              name: response.user?.name || credentials.email,
            }
          }
          return null
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
   session: async ({ session, token }) => {
    if (token && session?.user) {
      session.user.id = token.id as any
      session.user.accessToken = token.accessToken as any // if you use it
    }
    return session
  }

  },
}
