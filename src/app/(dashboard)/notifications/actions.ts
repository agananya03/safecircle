"use server";

import prisma from "@/lib/prisma/client";
import { createClient } from "@/lib/supabase/server";

export async function getNotifications() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        throw new Error("Unauthorized");
    }

    // 1. Get user's circle IDs
    const userCircles = await prisma.circleMember.findMany({
        where: { userId: user.id },
        select: { circleId: true }
    });

    const circleIds = userCircles.map(Cm => Cm.circleId);

    // 2. Fetch alerts from users in those circles
    const circleMembers = await prisma.circleMember.findMany({
        where: { circleId: { in: circleIds } },
        select: { userId: true }
    });

    const memberIds = [...new Set(circleMembers.map(m => m.userId))];

    const alerts = await prisma.alert.findMany({
        where: {
            userId: { in: memberIds },
        },
        orderBy: { createdAt: 'desc' },
        include: {
            user: {
                select: {
                    name: true,
                    photoUrl: true
                }
            }
        },
        take: 50
    });

    return alerts as any;
}

export async function saveFcmToken(token: string) {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        throw new Error("Unauthorized");
    }

    try {
        await prisma.user.update({
            where: { id: user.id },
            data: { fcmToken: token } as any
        });
        return { success: true };
    } catch (error) {
        console.error("Failed to save FCM token:", error);
        return { success: false, error: "Failed to save token" };
    }
}
