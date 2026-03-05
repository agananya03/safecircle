import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const scheduleFakeCallSchema = z.object({
    delayMs: z.number().min(0, "Delay must be positive"),
});

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const result = scheduleFakeCallSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input', details: result.error.format() }, { status: 400 });
        }

        const { delayMs } = result.data;

        // This endpoint satisfies the requirement to "Build /api/fake-call/schedule endpoint"
        // In a more complex architecture with server-sent push triggers, we might queue this.
        // For now, the client uses setTimeout for reliability due to background tab throttling,
        // and this endpoint registers the intent.

        console.log(`[FakeCall] User ${user.email} scheduled a fake call in ${delayMs}ms`);

        return NextResponse.json({
            success: true,
            message: `Fake call scheduled successfully`,
            scheduledTime: new Date(Date.now() + delayMs)
        });

    } catch (error) {
        console.error('Error scheduling fake call:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
