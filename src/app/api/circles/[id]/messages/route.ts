import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma/client";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const circleId = (await params).id;

        // Verify membership
        const member = await prisma.circleMember.findUnique({
            where: { circleId_userId: { circleId, userId: user.id } }
        });

        if (!member) {
            return NextResponse.json({ error: "Not a member of this circle" }, { status: 403 });
        }

        const messages = await prisma.message.findMany({
            where: { circleId },
            orderBy: { createdAt: 'desc' }, // Latest first
            take: 50, // Limit historical fetch
            include: {
                sender: {
                    select: { id: true, name: true, photoUrl: true, email: true }
                }
            }
        });

        return NextResponse.json(messages.reverse()); // Return chronological
    } catch (error) {
        console.error("GET Messages Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const circleId = (await params).id;
        const { content } = await req.json();

        if (!content || !content.trim()) {
            return NextResponse.json({ error: "Message content required" }, { status: 400 });
        }

        // Verify membership
        const member = await prisma.circleMember.findUnique({
            where: { circleId_userId: { circleId, userId: user.id } }
        });

        if (!member) {
            return NextResponse.json({ error: "Not a member of this circle" }, { status: 403 });
        }

        // Wait, User name is missing in default User object if not upserted yet? 
        // We know they exist if they are a member, but let's be safe.
        const newMessage = await prisma.message.create({
            data: {
                circleId,
                senderId: user.id,
                content: content.trim(),
            },
            include: {
                sender: {
                    select: { id: true, name: true, photoUrl: true, email: true }
                }
            }
        });

        // We also broadcast this message using our socket API
        const origin = new URL(req.url).origin;
        fetch(`${origin}/api/socket/notify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                room: circleId, // using circleId directly for message boards
                event: 'message:new',
                data: newMessage
            })
        }).catch(err => console.error("Message broadcast failed", err));

        return NextResponse.json(newMessage, { status: 201 });
    } catch (error) {
        console.error("POST Message Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
