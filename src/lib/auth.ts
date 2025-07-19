/* eslint-disable */
// @ts-nocheck

import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authApi } from "./auth-api";

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
          return null;
        }

        try {
          const response = await authApi.login({
            email: credentials.email,
            password: credentials.password,
          });

          if (response) {
            console.log("responseeeeeeeeeeeeeeeeeeeeeeeeeeee", response);
            return {
              id: response.data.user?.id || "1",
              email: credentials.email,
              name: response.data.user?.name || credentials.email,
              accessToken: response.data.accessToken || "", // if you use it
            };
          }
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
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
        token.id = user.id;
        token.accessToken = user.accessToken; // if you use it
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token && session?.user) {
        session.user.id = token.id as any;
        session.accessToken = token.accessToken as any; // if you use it
      }
      return session;
    },
  },
};
