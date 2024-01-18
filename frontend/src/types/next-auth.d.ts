import NextAuth from 'next-auth';

declare module 'next-auth' {
  /**
   * The shape of the user object once it's returned
   * from the authorization callback
   */
  interface User {
    id: number;
    username: string;
    role: number;
    whitelisted: boolean;
    credits: number;
  }

  /**
   * The shape of the JWT token object
   */
  interface JWT {
    id: number;
    username: string;
    role: number;
    whitelisted: boolean;
    credits: number;
  }

  /**
   * The shape of the session object that will be available
   * on the client side
   */
  interface Session {
    user: User; // Include the user object shape from above
  }
}
