
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

        const { inviteCode } = await request.json();

        if (!inviteCode) {
            return NextResponse.json({ error: 'Invite code is required' }, { status: 400 });
        }

        // Sync user to ensure they exist in local DB
        try {
            await prisma.user.upsert({
                where: { id: user.id },
                update: {},
                create: {
                    id: user.id,
                    email: user.email!,
                    name: user.user_metadata.full_name || 'Unknown User',
                },
            });
        } catch (e) {
            console.error("User sync error:", e);
        }

        // For MVP, inviteCode IS the circleId.
        // In production, we'd lookup circleId from a separate InviteCode table or signed token.
        const circleId = inviteCode;

        const circle = await prisma.circle.findUnique({
            where: { id: circleId }
        });

        if (!circle) {
            return NextResponse.json({ error: 'Invalid invite code' }, { status: 404 });
        }

        // Check if already a member
        const existingMember = await prisma.circleMember.findUnique({
            where: {
                circleId_userId: {
                    circleId,
                    userId: user.id
                }
            }
        });

        if (existingMember) {
            return NextResponse.json({ error: 'You are already a member of this circle' }, { status: 409 });
        }

        await prisma.circleMember.create({
            data: {
                circleId,
                userId: user.id,
                role: 'member'
            }
        });

        return NextResponse.json({ message: 'Joined circle successfully', circleId });

    } catch (error) {
        console.error('Error joining circle:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
