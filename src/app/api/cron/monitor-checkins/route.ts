import prisma from '@/lib/prisma/client';
import { NextResponse } from 'next/server';
import { firebaseAdmin } from '@/lib/firebase/admin';

async function sendPushNotification(token: string, title: string, body: string, data: any = {}) {
    try {
        await firebaseAdmin.messaging().send({
            token,
            notification: { title, body },
            data: { ...data, click_action: "FLUTTER_NOTIFICATION_CLICK" }
        });
    } catch (e) {
        console.error("Failed to send push notification to token:", token, e);
    }
}

export async function GET(req: Request) {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.CRON_SECRET) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const now = new Date();
        const reminderTime = new Date(now.getTime() + 5 * 60000);
        const gracePeriodTime = new Date(now.getTime() - 5 * 60000);

        // 1. Reminders (5 mins before)
        const reminders = await prisma.checkIn.findMany({
            where: {
                status: 'pending',
                scheduledAt: {
                    gt: now,
                    lte: reminderTime
                }
            },
            include: { user: true }
        });

        for (const checkin of reminders) {
            const timeDiff = checkin.scheduledAt.getTime() - now.getTime();
            if (timeDiff > 4 * 60000 && timeDiff <= 5 * 60000) {
                if (checkin.user.fcmToken) {
                    await sendPushNotification(
                        checkin.user.fcmToken,
                        "Check-In Reminder",
                        `You have a check-in scheduled in 5 minutes.`,
                        { type: 'checkin_reminder', checkInId: checkin.id }
                    );
                }
            }
        }

        // 2. Missed Check-Ins (Past deadline + grace period)
        const missedCheckIns = await prisma.checkIn.findMany({
            where: {
                status: 'pending',
                scheduledAt: {
                    lte: gracePeriodTime
                }
            },
            include: {
                user: true,
                circles: { include: { members: { include: { user: true } } } }
            }
        });

        let activeAlerts = 0;

        for (const checkIn of missedCheckIns) {
            await prisma.checkIn.update({
                where: { id: checkIn.id },
                data: { status: 'missed' }
            });

            const lastLocation = await prisma.location.findFirst({
                where: { userId: checkIn.userId },
                orderBy: { timestamp: 'desc' }
            });

            for (const circle of checkIn.circles) {
                const alert = await prisma.alert.create({
                    data: {
                        userId: checkIn.userId,
                        circleId: circle.id,
                        type: 'check_in_missed',
                        status: 'active',
                        message: checkIn.message || `Missed check-in scheduled for ${checkIn.scheduledAt.toLocaleTimeString()}`,
                        latitude: lastLocation?.latitude || 0,
                        longitude: lastLocation?.longitude || 0,
                        address: "Last known location"
                    }
                });
                activeAlerts++;

                for (const member of circle.members) {
                    if (member.userId !== checkIn.userId && member.user.fcmToken) {
                        await sendPushNotification(
                            member.user.fcmToken,
                            "Missed Check-In Alert!",
                            `${checkIn.user.name} missed a scheduled check-in.`,
                            { type: 'alert', alertId: alert.id }
                        );
                    }
                }
            }
        }

        return NextResponse.json({
            success: true,
            remindersProcessed: reminders.length,
            missedProcessed: missedCheckIns.length,
            alertsCreated: activeAlerts
        });

    } catch (error) {
        console.error('Check-in monitor cron error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
