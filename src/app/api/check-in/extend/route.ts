import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const extendCheckInSchema = z.object({
    checkInId: z.string().uuid(),
    extendMinutes: z.number().min(1).max(600), // Max 10 hours extension
});

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const result = extendCheckInSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input', details: result.error.format() }, { status: 400 });
        }

        const { checkInId, extendMinutes } = result.data;

        // Verify the check-in belongs to the user
        const existingCheckIn = await prisma.checkIn.findUnique({
            where: { id: checkInId }
        });

        if (!existingCheckIn || existingCheckIn.userId !== user.id) {
            return NextResponse.json({ error: 'Check-In not found or unauthorized' }, { status: 404 });
        }

        if (existingCheckIn.status === 'confirmed') {
            return NextResponse.json({ error: 'Cannot extend a confirmed check-in' }, { status: 400 });
        }

        const newScheduledAt = new Date(existingCheckIn.scheduledAt.getTime() + extendMinutes * 60000);

        // Update schedule
        const updatedCheckIn = await prisma.checkIn.update({
            where: { id: checkInId },
            data: {
                scheduledAt: newScheduledAt,
                status: 'pending' // in case it was missed, extending it resets to pending
            }
        });

        // Resolve active alerts if it was missed
        if (existingCheckIn.status === 'missed') {
            await prisma.alert.updateMany({
                where: {
                    userId: user.id,
                    type: 'check_in_missed',
                    status: 'active'
                },
                data: {
                    status: 'resolved',
                    resolvedAt: new Date()
                }
            });
        }


        return NextResponse.json(updatedCheckIn);

    } catch (error) {
        console.error('Error extending check-in:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
