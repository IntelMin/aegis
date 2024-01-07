import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
const middleware = withAuth(
  function middleware(request) {
    const token = request.nextauth?.token;
    const pathname = request.nextUrl?.pathname;
    console.log({ token, pathname });

    if (token) {
      if (!token.whitelisted) {
        const pending = new URL('/pending', request.nextUrl?.origin);
        return NextResponse.redirect(pending.toString());
      } else {
        return NextResponse.next();
      }
    } else {
      const allowedPaths = ['/login', '/sign-up', '/api/user', '/api/auth/*'];

      if (allowedPaths.includes(pathname)) {
        return NextResponse.next();
      } else {
        const signinurl = new URL('/login', request.nextUrl?.origin);
        return NextResponse.redirect(signinurl.toString());
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => true,
    },
  }
);
export default middleware;
