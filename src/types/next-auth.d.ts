import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      login?: string
      permissions?: {
        canManageObjects: boolean
        canManageUsers: boolean
        canViewAnalytics: boolean
        canManageTasks: boolean
        canManageMedia: boolean
        canManageContent: boolean
        canManageSettings: boolean
      }
      department?: string
      phone?: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    role: string
    login?: string
    permissions?: {
      canManageObjects: boolean
      canManageUsers: boolean
      canViewAnalytics: boolean
      canManageTasks: boolean
      canManageMedia: boolean
      canManageContent: boolean
      canManageSettings: boolean
    }
    department?: string
    phone?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: string
    login?: string
    permissions?: {
      canManageObjects: boolean
      canManageUsers: boolean
      canViewAnalytics: boolean
      canManageTasks: boolean
      canManageMedia: boolean
      canManageContent: boolean
      canManageSettings: boolean
    }
    department?: string
    phone?: string
  }
}
