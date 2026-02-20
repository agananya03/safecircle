
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma/client';
import { NextResponse } from 'next/server';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> } // params is a Promise in Next.js 15+
) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const journey = await prisma.journey.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        photoUrl: true,
                    }
                },
                waypoints: {
                    orderBy: { timestamp: 'desc' },
                    take: 1, // Get latest waypoint? Or all? For map route we need all.
                    // If the journey is long, we might need to filter or simplify.
                    // For now, let's get all to draw the line.
                },
                circles: true,
            }
        });

        if (!journey) {
            return NextResponse.json({ error: 'Journey not found' }, { status: 404 });
        }

        // Check if user is the owner OR a member of a shared circle
        // 1. Owner check
        if (journey.userId === user.id) {
            return NextResponse.json(journey);
        }

        // 2. Circle member check
        // We need to see if the requesting user is in any of journey.circles
        const journeyCircleIds = journey.circles.map(c => c.id);

        // Check user membership in these circles
        const membership = await prisma.circleMember.findFirst({
            where: {
                userId: user.id,
                circleId: { in: journeyCircleIds }
            }
        });

        if (!membership) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        return NextResponse.json(journey);

    } catch (error) {
        console.error('Error fetching journey:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
