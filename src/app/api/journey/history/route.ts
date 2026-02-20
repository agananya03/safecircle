
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma/client';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Parse query params for filtering if needed
        const { searchParams } = new URL(req.url);
        const statusFilter = searchParams.get('status'); // optional

        const whereClause: any = {
            userId: user.id,
            status: { in: ['completed', 'cancelled', 'active'] }, // Show all? Usually history implies completed/past.
            // Let's typically show all but sort active first? Or just past?
            // "Journey History" usually means past. Active is on dashboard.
            // Let's include all non-active, or all? 
            // User request says "Display past journeys".
            // Let's filter out 'active' by default unless requested? 
            // Actually, seeing 'active' in history is fine, but usually it's separate.
            // Let's return everything sorted by date desc.
        };

        if (statusFilter && statusFilter !== 'all') {
            whereClause.status = statusFilter;
        }

        const journeys = await prisma.journey.findMany({
            where: whereClause,
            orderBy: { startTime: 'desc' },
            include: {
                waypoints: {
                    orderBy: { timestamp: 'asc' } // Need waypoints for map replay
                }
            },
            take: 50 // Limit to recent 50 for performance?
        });

        // Calculate stats
        // We can do this via aggregate for total counts/sums over ALL time, not just the fetched 50.
        const aggregations = await prisma.journey.aggregate({
            where: {
                userId: user.id,
                status: 'completed'
            },
            _count: { id: true },
            // Prisma doesn't easily sum calculated distances. 
            // We'd need to store distance in DB or calc on fly.
            // For MVP, we'll calculate on client or just count.
        });

        // Calculate stats from the fetched journeys (approximation) 
        // real app would store `distance` field on Journey completion.
        // Let's imply we calculate it on client for now to avoid complex GIS queries here.

        return NextResponse.json({
            journeys,
            stats: {
                totalCompleted: aggregations._count.id
            }
        });

    } catch (error) {
        console.error('Error fetching journey history:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
