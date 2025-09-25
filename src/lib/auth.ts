import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

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

        // Здесь будет логика проверки пользователя
        // Пока используем моковые данные
        const mockUsers = [
          {
            id: "1",
            email: "client@metrika.ru",
            password: "client123",
            role: "client",
            name: "Клиент"
          },
          {
            id: "2", 
            email: "employee@metrika.ru",
            password: "employee123",
            role: "employee",
            name: "Сотрудник"
          },
          {
            id: "3",
            email: "admin@metrika.ru", 
            password: "admin123",
            role: "admin",
            name: "Администратор"
          }
        ]

        const user = mockUsers.find(
          u => u.email === credentials.email && u.password === credentials.password
        )

        if (user) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
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
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub || ""
        session.user.role = token.role
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
