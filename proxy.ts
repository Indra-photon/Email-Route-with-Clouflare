import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

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

const isMarkdownRoute = createRouteMatcher([
    '/',
    '/pricing',
    '/about',
    '/support',
    '/privacy',
    '/terms-of-service',
    '/frequently-asked-questions',
    '/blog',
    '/blog/(.*)',
    '/syncsupport-vs-zendesk',
])

export default clerkMiddleware(async (auth, req: NextRequest) => {
    // Serve markdown to AI agents that request it
    if (req.headers.get('accept')?.includes('text/markdown') && isMarkdownRoute(req)) {
        const url = req.nextUrl.clone()
        url.pathname = '/api/agent-markdown'
        url.searchParams.set('path', req.nextUrl.pathname)
        return NextResponse.rewrite(url)
    }

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