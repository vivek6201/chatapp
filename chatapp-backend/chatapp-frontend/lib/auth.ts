import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { urls } from "./constants";

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user }: any) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.jwtToken = user.token;
      }
      return token;
    },
    session: async ({ session, token }: any) => {
      if (session.user) {
        return {
          ...session,
          user: {
            id: token.id,
            email: token.email,
            token: token.jwtToken,
          },
        };
      }
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials): Promise<{
        id: string;
        token: string;
        email: string;
      } | null> {
        // Add logic here to look up the user from the credentials supplied
        if (!credentials || !credentials.email || !credentials.password)
          return null;

        const res = await fetch(`${urls.backendUrl}/api/v1/users/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        const data = await res.json();
        if (data.success) {
          // Any object returned will be saved in `user` property of the JWT
          return {
            id: data.user.id,
            token: data.token,
            email: credentials.email,
          };
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
};

export default authOptions;
