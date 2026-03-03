import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma/client';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const checkInsList = await prisma.checkIn.findMany({
            where: {
                userId: user.id,
            },
            orderBy: {
                scheduledAt: 'desc'
            },
            include: {
                circles: true
            }
        });

        return NextResponse.json(checkInsList);

    } catch (error) {
        console.error('Error fetching check-ins history:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
