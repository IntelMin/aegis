import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from './db'; // Make sure this path is correct for your db instance
import { compare } from 'bcrypt';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    newUser: '/sign-up',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'based@aiaegis.org',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          return null;
        }

        const isPasswordMatch = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordMatch) {
          return null;
        }

        const userCredit = await db.credit_balance.findFirst({
          where: { user_id: user.id },
        });

        return {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          whitelisted: user.whitelisted,
          credits: userCredit ? userCredit.credits : 0,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
        token.role = user.role;
        token.whitelisted = user.whitelisted;
        token.credits = user.credits;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as number,
        username: token.username as string,
        role: token.role as number,
        whitelisted: token.whitelisted as boolean,
        credits: token.credits as number,
      };

      return session;
    },
  },
};
