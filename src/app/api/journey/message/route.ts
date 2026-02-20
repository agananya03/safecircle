
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const messageSchema = z.object({
    journeyId: z.string().uuid(),
    message: z.string().min(1),
});

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const result = messageSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        const { journeyId, message } = result.data;

        const journey = await prisma.journey.findUnique({
            where: { id: journeyId },
            include: { circles: true }
        });

        if (!journey || journey.userId !== user.id) {
            return NextResponse.json({ error: 'Not found or forbidden' }, { status: 404 });
        }

        // Broadcast message
        // We could create a "CheckIn" or just reuse Notification system?
        // User wants "Send Update". Let's use a CheckIn confirmed or a dedicated Notification.
        // Or just a Socket event + optional FCM. 
        // Let's create a CheckIn/Note entry? Or just "Alert" of type "info"?
        // "Alert" seems heavy. 
        // Let's try sending a socket event 'journey:update'.

        const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        await Promise.allSettled(journey.circles.map(async (circle) => {
            // Socket notify
            await fetch(`${origin}/api/socket/notify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    room: circle.id,
                    event: 'journey:message',
                    data: {
                        journeyId,
                        userId: user.id,
                        userName: user.user_metadata.full_name,
                        message,
                        timestamp: new Date()
                    }
                })
            });
        }));

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
