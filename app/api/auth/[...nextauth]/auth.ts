import supabase from "@/server/supabase";
import { getServerSession, type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import hashString from "@/app/utils/hash";
import NextAuth from "next-auth/next";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  // callbacks: {
  //   async jwt({ token, account, profile }) {
  //     console.log("------------ JWT ------------");
  //     console.log({ token }, { account }, { profile });
  //     if (account && account.type === "credentials") {
  //       token.userId = account.providerAccountId; // this is Id that coming from authorize() callback
  //     }
  //     return token;
  //   },
  //   async session({ session, token, user }) {
  //     console.log("------------ SESSION ------------");
  //     console.log({ session }, { token }, { user });

  //     return session;
  //   },
  // },
  pages: {
    signIn: "/signin",
    signOut: "/signout",
    newUser: "/signup",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Username", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          const { email, password } = credentials || {};
          if (!email || !password) {
            return null;
          }

          const { data: user, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();
          if (error) throw new Error(error.message);
          if (!user) throw new Error("No user found");

          if (user.password !== hashString(password)) {
            throw new Error("Wrong password");
          }

          return { id: user.id, email: user.email };
        } catch (error) {
          console.error(error);
          return null; 
        }
      }
    })
  ],
  secret: "aaaaaaaaaaaaaaaaaaa",
};
export const { auth, signOut } = NextAuth(authOptions);
export const getServerAuthSession = () => getServerSession(authOptions);