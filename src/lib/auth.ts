import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { getUsers } from "@/data/users"

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
        const users = await getUsers();

        // Ищем пользователя по email или логину
        const user = users.find(
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
            department: user.department,
            phone: user.phone
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
        token.department = user.department
        token.phone = user.phone
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub || ""
        session.user.role = token.role
        session.user.login = token.login
        session.user.permissions = token.permissions
        session.user.department = token.department
        session.user.phone = token.phone
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
