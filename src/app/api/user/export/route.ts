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

        const profile = await prisma.user.findUnique({
            where: { id: user.id },
            include: {
                emergencyContacts: true,
                circles: {
                    include: {
                        circle: true
                    }
                },
                checkIns: true,
            }
        });

        if (!profile) {
            return NextResponse.json({ error: "User profile not found" }, { status: 404 });
        }

        // Return the payload with a specialized content-disposition header for easy downloading
        return NextResponse.json(profile, {
            headers: {
                "Content-Disposition": `attachment; filename="data-export-${new Date().toISOString().split('T')[0]}.json"`,
            }
        });
    } catch (error) {
        console.error("Export Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
