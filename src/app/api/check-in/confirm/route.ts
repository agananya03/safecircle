import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const confirmCheckInSchema = z.object({
    checkInId: z.string().uuid(),
});

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const result = confirmCheckInSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input', details: result.error.format() }, { status: 400 });
        }

        const { checkInId } = result.data;

        // Verify the check-in belongs to the user
        const existingCheckIn = await prisma.checkIn.findUnique({
            where: { id: checkInId }
        });

        if (!existingCheckIn || existingCheckIn.userId !== user.id) {
            return NextResponse.json({ error: 'Check-In not found or unauthorized' }, { status: 404 });
        }

        if (existingCheckIn.status === 'confirmed') {
            return NextResponse.json({ error: 'Check-In already confirmed' }, { status: 400 });
        }

        // Update to confirmed
        const updatedCheckIn = await prisma.checkIn.update({
            where: { id: checkInId },
            data: {
                status: 'confirmed',
                confirmedAt: new Date(),
            }
        });

        // If it was already marked as missed, we could potentially resolve the associated alert here,
        // but for safety, alerts usually need explicit resolving. We'll leave alert untouched so circle members know they were late, or we can auto-resolve.
        // Let's auto-resolve the alert if it's currently active.
        if (existingCheckIn.status === 'missed') {
            await prisma.alert.updateMany({
                where: {
                    userId: user.id,
                    type: 'check_in_missed',
                    status: 'active',
                    // Note: If multiple missed check-ins overlap, this resolves all. Good enough for now.
                },
                data: {
                    status: 'resolved',
                    resolvedAt: new Date()
                }
            });
        }


        return NextResponse.json(updatedCheckIn);

    } catch (error) {
        console.error('Error confirming check-in:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
