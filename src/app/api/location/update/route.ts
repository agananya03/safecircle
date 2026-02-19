import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { latitude, longitude, accuracy, journeyId } = body;

        if (!latitude || !longitude) {
            return NextResponse.json({ error: 'Location data (lat, lng) required' }, { status: 400 });
        }

        // 1. Save to Database
        const location = await prisma.location.create({
            data: {
                userId: user.id,
                latitude,
                longitude,
                accuracy,
                journeyId: journeyId || null,
            }
        });

        // 2. Broadcast to circles
        // Fetch user's circles
        const memberships = await prisma.circleMember.findMany({
            where: { userId: user.id },
            select: { circleId: true }
        });

        const origin = new URL(request.url).origin;

        // Broadcast asynchronously to avoid blocking response
        Promise.allSettled(memberships.map(async ({ circleId }) => {
            try {
                await fetch(`${origin}/api/socket/notify`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        room: circleId,
                        event: 'location:update',
                        data: {
                            userId: user.id,
                            location: location,
                            user: {
                                id: user.id,
                                name: user.user_metadata.full_name,
                                photoUrl: user.user_metadata.avatar_url // Or fetch from DB if inconsistent
                            }
                        }
                    })
                });
            } catch (e) {
                console.error(`Failed to broadcast location to circle ${circleId}`, e);
            }
        }));

        return NextResponse.json(location);
    } catch (error) {
        console.error('Error updating location:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
