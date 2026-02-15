import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {

        const supabase = await createClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            console.error("SOS Trigger Auth Error:", authError);
            return NextResponse.json({ error: 'Unauthorized', details: authError }, { status: 401 });
        }

        const body = await request.json();
        const { latitude, longitude, message, address } = body;

        if (!latitude || !longitude) {
            return NextResponse.json({ error: 'Location required' }, { status: 400 });
        }

        // Ensure user exists locally (Lazy Sync) to prevent foreign key errors
        // Use upsert to handle race conditions where user might be created between check and create
        try {
            await prisma.user.upsert({
                where: { id: user.id },
                update: {}, // No changes if exists
                create: {
                    id: user.id,
                    email: user.email!,
                    name: user.user_metadata.full_name || 'Unknown User',
                },
            });
        } catch (userSyncError) {
            console.error('Error syncing user:', userSyncError);
            // Proceeding might fail if upsert completely failed, but usually it succeeds.
        }

        // Create the alert
        const alert = await prisma.alert.create({
            data: {
                userId: user.id,
                type: 'sos',
                status: 'active',
                latitude,
                longitude,
                address,
                message: message || 'SOS triggered',
            },
        });

        return NextResponse.json(alert);
    } catch (error) {
        console.error('Error triggering SOS:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
