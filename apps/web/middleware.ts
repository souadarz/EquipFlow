import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value
    const path = request.nextUrl.pathname;

    //routes qui necessite etre connecté
    const protectedPaths = ['/dashboard', '/equipements', '/categories', '/reservations'];

    const isProtectedPath = protectedPaths.some((p) => path.startsWith(p));

    // redirection vers login si pas connecte
    if (isProtectedPath && !token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', path);
        return NextResponse.redirect(loginUrl);
    }

    if ((path.startsWith('/login') || path.startsWith('/register')) && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|images|favicon.ico).*)',
    ],
};
