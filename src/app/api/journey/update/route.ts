
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const updateJourneySchema = z.object({
    journeyId: z.string().uuid(),
    latitude: z.number(),
    longitude: z.number(),
    accuracy: z.number().optional(),
});

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const result = updateJourneySchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        const { journeyId, latitude, longitude, accuracy } = result.data;

        // Verify ownership
        const journey = await prisma.journey.findUnique({
            where: { id: journeyId },
        });

        if (!journey) {
            return NextResponse.json({ error: 'Journey not found' }, { status: 404 });
        }

        if (journey.userId !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        if (journey.status !== 'active') {
            return NextResponse.json({ error: 'Journey is not active' }, { status: 400 });
        }

        // Create Location waypoint
        const location = await prisma.location.create({
            data: {
                userId: user.id,
                journeyId,
                latitude,
                longitude,
                accuracy: accuracy || null,
            },
        });

        // Optionally update journey 'actualEnd' estimate if we were doing live routing
        // For now just logging the point.

        return NextResponse.json(location);

    } catch (error) {
        console.error('Error updating journey:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
