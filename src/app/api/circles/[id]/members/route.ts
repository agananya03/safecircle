
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma/client';
import { NextResponse } from 'next/server';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const { userId } = await request.json(); // ID of the user to add

        // In a real app, you'd verify if 'user' has permission to add 'userId'
        // or if this is a join request from 'userId' themselves via a valid invite.
        // For now, we'll assume this is an admin adding a user (simpler for MVP)
        // OR we can handle the "join" logic here if userId matches user.id.

        // Let's implement: Only admins can add other users directly for now.

        // Check requester's role
        const requesterMember = await prisma.circleMember.findUnique({
            where: {
                circleId_userId: {
                    circleId: id,
                    userId: user.id
                }
            }
        });

        if (!requesterMember || requesterMember.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Check if user is already a member
        const existingMember = await prisma.circleMember.findUnique({
            where: {
                circleId_userId: {
                    circleId: id,
                    userId: userId
                }
            }
        });

        if (existingMember) {
            return NextResponse.json({ error: 'User is already a member' }, { status: 400 });
        }

        const newMember = await prisma.circleMember.create({
            data: {
                circleId: id,
                userId: userId,
                role: 'member'
            }
        });

        return NextResponse.json(newMember);

    } catch (error) {
        console.error('Error adding member:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // We need to know WHICH member to remove.
        // Ideally this should be passed in the body or query param if it's not "self".
        // But RESTful design often uses separate resource for members: /circles/[id]/members/[memberUserId]
        // Since this is /circles/[id]/members, let's assume body contains userId to remove.
        // If no body/userId, assume "leave" (remove self).

        let targetUserId = user.id;
        try {
            const body = await request.json();
            if (body.userId) targetUserId = body.userId;
        } catch {
            // Body parsing failed or empty, assume self (leave)
        }

        // Check requester's role
        const requesterMember = await prisma.circleMember.findUnique({
            where: {
                circleId_userId: {
                    circleId: id,
                    userId: user.id
                }
            }
        });

        if (!requesterMember) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // If removing someone else, must be admin
        if (targetUserId !== user.id && requesterMember.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden: Only admins can remove other members' }, { status: 403 });
        }

        // Prevent removing the last admin? (Optional but good practice)
        // For now, let's just allow it.

        await prisma.circleMember.delete({
            where: {
                circleId_userId: {
                    circleId: id,
                    userId: targetUserId
                }
            }
        });

        return NextResponse.json({ message: 'Member removed successfully' });

    } catch (error) {
        console.error('Error removing member:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
