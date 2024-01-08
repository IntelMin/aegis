import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const allowedPaths: (string | RegExp)[] = [
  '/login',
  '/sign-up',
  '/api/user',
  '/api/auth/session',
  '/api/auth/__log',
  //   /^\/api\/auth\/.*/, // RegExp for wildcard
  /^\/icons\/.*/, // RegExp for wildcard
  /^\/background\/.*/, // RegExp for wildcard
];

function isPathAllowed(
  pathname: string,
  allowedPaths: (string | RegExp)[]
): boolean {
  return allowedPaths.some(pattern => {
    if (pattern instanceof RegExp) {
      return pattern.test(pathname);
    }
    return pathname === pattern;
  });
}

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
      if (isPathAllowed(pathname, allowedPaths)) {
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
