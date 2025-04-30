import { NextResponse } from 'next/server';

export function middleware(request) {
  // Extract token from cookies
  const token = request.cookies.get('userToken')?.value;

  if (!token) {
    // Redirect to login page if no token is found
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If the token exists, proceed to the requested route
  return NextResponse.next();
}

// Match paths for which this middleware applies
export const config = {
  matcher: ['/dashboard/:path*'], // Applies only to /dashboard and its subroutes
};
