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
        const { alertId } = body;

        if (!alertId) {
            return NextResponse.json({ error: 'Alert ID required' }, { status: 400 });
        }

        // Verify alert belongs to user
        const alert = await prisma.alert.findUnique({
            where: { id: alertId },
        });

        if (!alert) {
            return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
        }

        if (alert.userId !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Update status
        const updatedAlert = await prisma.alert.update({
            where: { id: alertId },
            data: {
                status: 'cancelled',
                resolvedAt: new Date(),
            },
        });

        return NextResponse.json(updatedAlert);
    } catch (error) {
        console.error('Error cancelling SOS:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
