import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/profile(.*)'])

const isPublicRoute = createRouteMatcher([
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/pricing(.*)',
    '/docs(.*)',
    '/api/(.*)',   // All API routes handle their own auth() internally
    '/chat(.*)',
])

export default clerkMiddleware(async (auth, req) => {
    if (isPublicRoute(req)) {
        return NextResponse.next();
    }

    const { isAuthenticated, redirectToSignIn } = await auth()

    if (!isAuthenticated && isProtectedRoute(req)) {
        return redirectToSignIn()
    }
})

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
};