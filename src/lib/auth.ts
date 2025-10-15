import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { users } from "@/data/users"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Получаем актуальных пользователей
        const usersList = users;

        // Ищем пользователя по email или логину
        const user = usersList.find(
          u => (u.email === credentials.email || u.login === credentials.email) && 
               u.password === credentials.password &&
               u.status === 'active'
        );

        if (user) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            login: user.login,
            permissions: user.permissions,
            dateOfBirth: (user as any).dateOfBirth,
            phoneWork: (user as any).phoneWork,
            phonePersonal: (user as any).phonePersonal,
            address: (user as any).address,
            userObjects: (user as any).userObjects,
            comments: (user as any).comments
          }
        }

        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.login = user.login
        token.permissions = user.permissions
        token.dateOfBirth = (user as any).dateOfBirth
        token.phoneWork = (user as any).phoneWork
        token.phonePersonal = (user as any).phonePersonal
        token.address = (user as any).address
        token.userObjects = (user as any).userObjects
        token.comments = (user as any).comments
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub || ""
        session.user.role = token.role
        session.user.login = token.login
        session.user.permissions = token.permissions
        session.user.dateOfBirth = (token as any).dateOfBirth
        session.user.phoneWork = (token as any).phoneWork
        session.user.phonePersonal = (token as any).phonePersonal
        session.user.address = (token as any).address
        session.user.userObjects = (token as any).userObjects
        session.user.comments = (token as any).comments
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/signin"
  },
  session: {
    strategy: "jwt"
  }
}
