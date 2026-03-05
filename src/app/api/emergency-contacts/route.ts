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

        const contacts = await prisma.emergencyContact.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
        });

        // Also get SMS preference from user
        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { smsEnabled: true }
        });

        return NextResponse.json({
            contacts,
            smsEnabled: dbUser?.smsEnabled ?? false
        });
    } catch (error) {
        console.error("GET Contacts Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, phone, relation } = body;

        if (!name || !phone) {
            return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
        }

        // Limit to reasonable number of contacts
        const count = await prisma.emergencyContact.count({
            where: { userId: user.id }
        });

        if (count >= 5) {
            return NextResponse.json({ error: "Maximum of 5 emergency contacts allowed" }, { status: 400 });
        }

        const newContact = await prisma.emergencyContact.create({
            data: {
                userId: user.id,
                name,
                phone,
                relation,
            },
        });

        return NextResponse.json(newContact, { status: 201 });
    } catch (error) {
        console.error("POST Contact Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const contactId = searchParams.get('id');

        if (!contactId) {
            return NextResponse.json({ error: "Contact ID is required" }, { status: 400 });
        }

        await prisma.emergencyContact.delete({
            where: {
                id: contactId,
                // Ensure they own it
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE Contact Error:", error);
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
        const { smsEnabled } = body;

        await prisma.user.update({
            where: { id: user.id },
            data: { smsEnabled },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("PATCH SMS Prefs Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
