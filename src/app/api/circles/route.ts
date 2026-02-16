
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

        const { name, description } = await request.json();

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        // Transaction to create circle and add creator as member
        const circle = await prisma.$transaction(async (tx) => {
            const newCircle = await tx.circle.create({
                data: {
                    name,
                    description,
                    createdBy: user.id
                }
            });

            await tx.circleMember.create({
                data: {
                    circleId: newCircle.id,
                    userId: user.id,
                    role: 'admin'
                }
            });

            return newCircle;
        });

        return NextResponse.json(circle);
    } catch (error) {
        console.error('Error creating circle:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get circles where user is a member
        const circles = await prisma.circle.findMany({
            where: {
                members: {
                    some: {
                        userId: user.id
                    }
                }
            },
            include: {
                _count: {
                    select: { members: true }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(circles);
    } catch (error) {
        console.error('Error fetching circles:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
