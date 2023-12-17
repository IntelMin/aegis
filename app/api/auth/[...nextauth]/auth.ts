import supabase from "@/server/supabase";
import {
  getServerSession,
  type NextAuthOptions,
} from "next-auth";
import Credentials from "next-auth/providers/credentials";



export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      console.log("------------ JWT ------------");
      console.log({ token }, { account }, { profile });
      if (account && account.type === "credentials") {
        token.userId = account.providerAccountId; // this is Id that coming from authorize() callback 
      }
      return token;
    },
    async session({ session, token, user }) {
      console.log("------------ SESSION ------------");
      console.log({ session }, { token }, { user });

      return session;
    },
  },
  pages: {
    signIn: '/signin',
    signOut: '/signout',
    newUser: '/signup',
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Username", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const { email, password } = credentials as {
          email: string
          password: string
        };
        console.log(credentials?.email)
        const { data: user, error } = await supabase.from("users").select("*").eq("email", credentials?.email).single()
        if (error) {
          return null;
        }
        if (!user) {
          return "no user found";
        }
        if (user.password !== credentials?.password) {
          return "wrong password";
        }

        return user;
      }
    })
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);