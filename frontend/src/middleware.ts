import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
const middleware = withAuth(
  function middleware(request) {
    // const token = request.nextauth?.token
    // const pathname = request.nextUrl?.pathname
    // console.log({ token, pathname })
    // if (pathname === "/sign-up") {
    //     return NextResponse.next()
    // }
    // if (pathname === "/api/user") {
    //     return NextResponse.next()
    // }
    // if (!token) {
    //     const signinurl = new URL("/login", request.nextUrl?.origin)
    //     return NextResponse.redirect(signinurl.toString())
    // }
    // if (token) {

    //     return NextResponse.next()
    // }
    return NextResponse.next();
  },
  {
    // Matches the pages config in `[...nextauth]`
    pages: {
      signIn: '/login',
      newUser: '/sign-up',
    },
    callbacks: {
      authorized: ({ token }) => true,
    },
  }
);
export default middleware;
