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

        const activeCheckIns = await prisma.checkIn.findMany({
            where: {
                userId: user.id,
                status: {
                    in: ['pending', 'missed'] // Missed check-ins still need attention
                }
            },
            orderBy: {
                scheduledAt: 'asc'
            }
        });

        return NextResponse.json(activeCheckIns);

    } catch (error) {
        console.error('Error fetching active check-ins:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
