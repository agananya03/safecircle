import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { latitude, longitude, message } = body;

        if (!latitude || !longitude) {
            return NextResponse.json({ error: 'Location required' }, { status: 400 });
        }

        // Create the alert
        const alert = await prisma.alert.create({
            data: {
                userId: user.id,
                type: 'sos',
                status: 'active',
                latitude,
                longitude,
                message: message || 'SOS triggered',
                // circleId is optional now
            },
        });

        return NextResponse.json(alert);
    } catch (error) {
        console.error('Error triggering SOS:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
