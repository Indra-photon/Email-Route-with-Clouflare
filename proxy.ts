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

const isEmbedRoute = createRouteMatcher([
    '/chat/embed(.*)'
])

import { NextResponse } from 'next/server';

export default clerkMiddleware(async (auth, req) => {
    console.log('>> PROXY PATH:', req.nextUrl.pathname);
    const requestHeaders = new Headers(req.headers);

    if (isEmbedRoute(req)) {
        console.log('>> MATCHED EMBED - SETTING SKIP HEADER');
        requestHeaders.set('x-skip-clerk', 'true');
        return NextResponse.next({ request: { headers: requestHeaders } });
    }

    if (isPublicRoute(req)) {
        return NextResponse.next();
    }

    const { isAuthenticated, redirectToSignIn } = await auth()

    if (!isAuthenticated && isProtectedRoute(req)) {
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
