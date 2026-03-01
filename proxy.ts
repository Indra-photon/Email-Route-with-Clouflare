import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';


const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/profile(.*)'])
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/api/receiving-requests(.*)',
  '/chat(.*)',
  '/api/chat(.*)'
])

import { NextResponse } from 'next/server';

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) {
    const response = NextResponse.next();
    response.headers.set('x-is-public-route', 'true');
    return response;
  }

  const { isAuthenticated, redirectToSignIn } = await auth()

  if (!isAuthenticated && isProtectedRoute(req)) {
    // Add custom logic to run before redirecting
    return redirectToSignIn()
  }
},)

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};