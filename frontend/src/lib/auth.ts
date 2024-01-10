import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from './db';
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
          label: 'email',
          type: 'email',
          placeholder: 'based@aiaegis.org',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const existingUser = await db.user.findUnique({
          where: { email: credentials?.email },
        });

        if (!existingUser) {
          return null;
        }
        const user_credit = await db.credit_balance.findFirst({
          where: { user_id: existingUser.id },
        });
        const passwordMatch = await compare(
          credentials.password,
          existingUser.password
        );
        if (!passwordMatch) {
          return null;
        }

        return {
          id: `${existingUser.id}`,
          username: existingUser.username,
          email: existingUser.email,
          role: existingUser.role,
          whitelisted: existingUser.whitelisted,
          credits: user_credit ? user_credit.credits : 0,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, session, trigger }) {
      if (trigger === 'update' && session.user.credits) {
        return {
          ...token,
          credits: session.user.credits,
        };
      }
      if (user) {
        return {
          ...token,
          username: user.username,
          credits: token.credits,
        };
      }

      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          username: token.username,
          credits: token.credits,
        },
      };
    },
  },
};
