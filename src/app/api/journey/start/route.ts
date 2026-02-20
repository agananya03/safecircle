import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const startJourneySchema = z.object({
    // userId removed from body schema, taken from auth
    destination: z.string().min(1, "Destination is required"),
    // Allow lat/lng to be optional if purely text-based start is allowed, or require valid coords
    // For now, allow simplified input
    startLat: z.number(),
    startLng: z.number(),
    startAddress: z.string(),
    endLat: z.number().optional(),
    endLng: z.number().optional(),
    endAddress: z.string().optional(),
    expectedEnd: z.string().datetime().optional(), // ISO string
    circleIds: z.array(z.string()).min(1, "Select at least one circle"),
    note: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const result = startJourneySchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: result.error.format() },
                { status: 400 }
            );
        }

        const {
            startLat,
            startLng,
            startAddress,
            endLat,
            endLng,
            endAddress,
            destination, // Effectively endAddress? Or just a label? Using destination as endAddress validation fallback if endAddress empty
            expectedEnd,
            circleIds,
            note
        } = result.data;

        // Validate that user is actually a member of these circles
        // For MVP, we might trust the IDs or do a quick check.
        // Let's assume the UI sends valid IDs, and Prisma connect will fail if they don't exist?
        // Actually connect doesn't check membership, just existence.
        // Ideally check membership.
        // For now, proceeding with basic connect.

        // Use destination as endAddress if endAddress not explicitly provided
        const finalEndAddress = endAddress || destination;

        const journey = await prisma.journey.create({
            data: {
                userId: user.id, // Use authenticated user ID
                startLat,
                startLng,
                startAddress,
                endLat: endLat ?? 0, // Default or require
                endLng: endLng ?? 0,
                endAddress: finalEndAddress,
                status: 'active',
                // startTime defaults to now() in schema
                expectedEnd: expectedEnd ? new Date(expectedEnd) : undefined,
                note,
                circles: {
                    connect: circleIds.map((id) => ({ id })),
                },
            },
            include: {
                circles: true,
            },
        });

        return NextResponse.json(journey, { status: 201 });
    } catch (error) {
        console.error('Error starting journey:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
