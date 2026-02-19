import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { supabase } from "@/lib/supabase/client";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const alert = await prisma.alert.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        // Add other fields if needed, e.g. photoUrl if exists in schema, distinct from Supabase metadata
                    }
                }
            }
        });

        if (!alert) {
            return NextResponse.json(
                { error: "Alert not found" },
                { status: 404 }
            );
        }

        // Return the alert data
        // Note: photoUrl might need to be fetched from Supabase if not in Prisma User model
        // For now, client side handles photoUrl via Auth context for *current* user, 
        // but for *other* users (alert creators), we might need it. 
        // If User model doesn't have photoUrl, we might send a placeholder or let client handle it.
        return NextResponse.json(alert);
    } catch (error) {
        console.error("Error fetching alert:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
