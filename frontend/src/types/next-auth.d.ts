import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    username: string;
    role: number;
    whitelisted: boolean;
  }

  interface Session {
    user: User;
    token: {
      username: string;
      role: number;
      whitelisted: boolean;
    };
  }
}
