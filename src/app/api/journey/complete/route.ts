
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const completeJourneySchema = z.object({
    journeyId: z.string().uuid(),
    destination: z.string().optional(), // Optional: verify where they actually arrived?
});

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const result = completeJourneySchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        const { journeyId } = result.data;

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

        const updatedJourney = await prisma.journey.update({
            where: { id: journeyId },
            data: {
                status: 'completed',
                actualEnd: new Date(),
            },
        });

        return NextResponse.json(updatedJourney);
    } catch (error) {
        console.error('Error completing journey:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
