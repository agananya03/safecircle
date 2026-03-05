import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Simple in-memory rate limiter for Edge runtime isolates
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/api')) {
        const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
        const limit = 60; // 60 requests per minute
        const windowMs = 60 * 1000;

        if (!rateLimitMap.has(ip)) {
            rateLimitMap.set(ip, { count: 1, lastReset: Date.now() });
        } else {
            const data = rateLimitMap.get(ip)!;
            if (Date.now() - data.lastReset > windowMs) {
                rateLimitMap.set(ip, { count: 1, lastReset: Date.now() });
            } else {
                if (data.count >= limit) {
                    return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
                }
                data.count++;
            }
        }
    }

    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protected routes
    if (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/profile')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    // Auth routes
    if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') {
        if (user) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }

    return response
}

export const config = {
    matcher: ['/dashboard/:path*', '/profile/:path*', '/login', '/register', '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
