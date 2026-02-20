
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const extendJourneySchema = z.object({
    journeyId: z.string().uuid(),
    additionalMinutes: z.number().min(1),
});

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const result = extendJourneySchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        const { journeyId, additionalMinutes } = result.data;

        const journey = await prisma.journey.findUnique({
            where: { id: journeyId },
        });

        if (!journey || journey.userId !== user.id) {
            return NextResponse.json({ error: 'Not found or forbidden' }, { status: 404 });
        }

        // Calculate new expected end
        // If current expected end is past, add to NOW? Or add to expected?
        // Usually "Extend by X mins" means add to current ETA.
        const baseTime = journey.expectedEnd && journey.expectedEnd > new Date()
            ? journey.expectedEnd
            : new Date();

        const newExpectedEnd = new Date(baseTime.getTime() + additionalMinutes * 60000);

        const updated = await prisma.journey.update({
            where: { id: journeyId },
            data: { expectedEnd: newExpectedEnd }
        });

        return NextResponse.json(updated);

    } catch (error) {
        console.error('Error extending journey:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
