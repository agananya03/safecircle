import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const settings = await prisma.user.findUnique({
            where: { id: user.id },
            select: { stealthMode: true, smsEnabled: true }
        });

        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        // We ensure we only update stealthMode here to prevent over-posting
        const dataToUpdate: any = {};
        if (body.stealthMode !== undefined) dataToUpdate.stealthMode = Boolean(body.stealthMode);

        const updated = await prisma.user.update({
            where: { id: user.id },
            data: dataToUpdate
        });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
