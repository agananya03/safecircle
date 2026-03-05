import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { createClient } from "@supabase/supabase-js";
import { createClient as createServerSupabase } from "@/lib/supabase/server";

export async function DELETE(req: Request) {
    try {
        const supabaseServer = await createServerSupabase();
        const { data: { user }, error: authError } = await supabaseServer.auth.getUser();

        if (authError || !user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = user.id;

        // Ensure we actually have the service role key defined
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
            return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
        }

        // Initialize Admin client to bypass RLS and delete the Auth user
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        );

        // Delete from Prisma first to ensure cleanup within our application
        // We run these in a transaction to ensure all or nothing
        await prisma.$transaction([
            prisma.location.deleteMany({ where: { userId } }),
            prisma.message.deleteMany({ where: { senderId: userId } }),
            prisma.emergencyContact.deleteMany({ where: { userId } }),
            prisma.alert.deleteMany({ where: { userId } }),
            prisma.checkIn.deleteMany({ where: { userId } }),
            prisma.journey.deleteMany({ where: { userId } }),
            prisma.circleMember.deleteMany({ where: { userId } }),
            prisma.user.delete({ where: { id: userId } })
        ]);

        // Finally delete the user from Supabase Auth
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

        if (deleteError) {
            console.error("Supabase Admin Delete Error:", deleteError);
            throw deleteError;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE User Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
