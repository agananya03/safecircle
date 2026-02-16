
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma/client';
import { NextResponse } from 'next/server';

export async function GET(
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

        const circle = await prisma.circle.findUnique({
            where: { id },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                photoUrl: true,
                                email: true,
                                phone: true
                            }
                        }
                    }
                }
            }
        });

        if (!circle) {
            return NextResponse.json({ error: 'Circle not found' }, { status: 404 });
        }

        // Check if user is a member
        const isMember = circle.members.some(member => member.userId === user.id);
        if (!isMember) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        return NextResponse.json(circle);
    } catch (error) {
        console.error('Error fetching circle details:', error);
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

        // Check if user is admin of the circle
        const member = await prisma.circleMember.findUnique({
            where: {
                circleId_userId: {
                    circleId: id,
                    userId: user.id
                }
            }
        });

        if (!member || member.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await prisma.circle.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Circle deleted successfully' });
    } catch (error) {
        console.error('Error deleting circle:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(
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
        const { name, description } = await request.json();

        // Check if user is admin of the circle
        const member = await prisma.circleMember.findUnique({
            where: {
                circleId_userId: {
                    circleId: id,
                    userId: user.id
                }
            }
        });

        if (!member || member.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const updatedCircle = await prisma.circle.update({
            where: { id },
            data: {
                name,
                description
            }
        });

        return NextResponse.json(updatedCircle);
    } catch (error) {
        console.error('Error updating circle:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
