import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const allowedPaths: (string | RegExp)[] = [
  '/login',
  '/sign-up',
  /^\/api\/.*/,
  /\.png$/,
  /\.svg$/,
  /\.css$/,
  /\.ico$/,
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

    if (pathname.startsWith('/logout') || pathname.startsWith('/pending')) {
      return NextResponse.next();
    }

    return NextResponse.next();

    if (token) {
      if (!token.whitelisted && pathname.startsWith('/logout') === false) {
        console.log('-- not whitelisted, redirecting to pending');
        const pending = new URL('/pending', request.nextUrl.origin);
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
