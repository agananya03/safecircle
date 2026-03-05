import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma/client";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const circleId = (await params).id;
        const body = await req.json();

        // Ensure only boolean is parsed
        const shareLocation = Boolean(body.shareLocation);

        const updated = await prisma.circleMember.update({
            where: {
                circleId_userId: {
                    circleId,
                    userId: user.id
                }
            },
            data: { shareLocation }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("PATCH Circle Share Location Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
