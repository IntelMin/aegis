import {
  getServerSession,
  type NextAuthOptions,
} from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const userService = {
  authenticate,
};

function authenticate(username: string, password: string) {
  if (username !== "admin" && password !== "admin") {
    return null;
  }

  const user = {
    id: "9001",
    name: "Web Admin",
    email: "admin@example.com"
  };

  return user;
}

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

      session.user.id = token.userId;

      return session;
    },
  },
  pages: {
    signIn: '/signin',
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "username" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const { username, password } = credentials as {
          username: string
          password: string
        };

        return userService.authenticate(username, password);
      }
    })
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);