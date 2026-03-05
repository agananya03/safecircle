import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";

export async function GET(req: Request) {
    try {
        // Verify cron secret if applicable. For now, assuming basic access or Vercel cron header.
        const authHeader = req.headers.get("authorization");
        if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

        // Delete old locations to save space and respect privacy
        const locations = await prisma.location.deleteMany({
            where: { timestamp: { lt: thirtyDaysAgo } }
        });

        // Delete old messages to avoid storing indefinite chat history
        const messages = await prisma.message.deleteMany({
            where: { createdAt: { lt: ninetyDaysAgo } }
        });

        return NextResponse.json({
            success: true,
            deletedLocations: locations.count,
            deletedMessages: messages.count
        });
    } catch (error) {
        console.error("Data Retention Cron Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
