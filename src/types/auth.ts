import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      login?: string
      permissions?: any
      department?: string
      phone?: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: string
    login?: string
    permissions?: any
    department?: string
    phone?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    login?: string
    permissions?: any
    department?: string
    phone?: string
  }
}

export type UserRole = "guest" | "client" | "employee" | "admin"
