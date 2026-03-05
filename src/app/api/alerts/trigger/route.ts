import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma/client';
import { NextResponse } from 'next/server';
import { sendSms } from '@/lib/twilio';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            console.error("SOS Trigger Auth Error:", authError);
            return NextResponse.json({ error: 'Unauthorized', details: authError }, { status: 401 });
        }

        const body = await request.json();
        const { latitude, longitude, message, address } = body;

        if (!latitude || !longitude) {
            return NextResponse.json({ error: 'Location required' }, { status: 400 });
        }

        // Upsert user to ensure they exist in local DB
        let localUser;
        try {
            localUser = await prisma.user.upsert({
                where: { id: user.id },
                update: {},
                create: {
                    id: user.id,
                    email: user.email!,
                    name: user.user_metadata.full_name || 'Unknown User',
                    // phone: user.phone 
                },
            });
        } catch (e) {
            console.error("User sync error", e);
        }

        // Fetch user with SMS prefs and Emergency Contacts
        const fullUser = await prisma.user.findUnique({
            where: { id: user.id },
            include: { emergencyContacts: true }
        });

        // Create the alert
        const alert = await prisma.alert.create({
            data: {
                userId: user.id,
                type: 'sos',
                status: 'active',
                latitude,
                longitude,
                address,
                message: message || 'SOS triggered',
            },
            include: {
                user: true // Include user details for the notification
            }
        });

        // Fetch user's circles to broadcast
        const memberships = await prisma.circleMember.findMany({
            where: { userId: user.id },
            select: { circleId: true }
        });

        // Broadcast to each circle
        const origin = new URL(request.url).origin;

        // We use Promise.allSettled to ensure one failure doesn't stop others/return error
        await Promise.allSettled(memberships.map(async ({ circleId }) => {
            try {
                // 1. Socket.io Broadcast
                fetch(`${origin}/api/socket/notify`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        room: circleId,
                        event: 'alert:new',
                        data: alert
                    })
                }).catch(e => console.error(`Socket broadcast failed for circle ${circleId}`, e));

                // 2. Push Notifications (FCM)
                // Get all members of this circle (except sender)
                const circleMembers = await prisma.circleMember.findMany({
                    where: {
                        circleId,
                        userId: { not: user.id }
                    },
                    select: {
                        userId: true,
                        user: {
                            select: {
                                fcmToken: true
                            }
                        }
                    }
                }) as any;

                const tokens = circleMembers
                    .map((m: any) => m.user?.fcmToken)
                    .filter((t: any) => t);

                if (tokens.length > 0) {
                    const { firebaseAdmin } = await import('@/lib/firebase/admin');
                    if (firebaseAdmin) {
                        try {
                            const fcmMessage = {
                                notification: {
                                    title: 'SOS Alert!',
                                    body: `${user.user_metadata.full_name || 'Someone'} needs help!`,
                                },
                                tokens: tokens,
                                data: {
                                    alertId: alert.id,
                                    type: 'sos'
                                }
                            };

                            // SendMulticast
                            const response = await firebaseAdmin.messaging().sendEachForMulticast(fcmMessage);
                            console.log('FCM generic send success count:', response.successCount);
                        } catch (fcmError) {
                            console.error("FCM Send Error:", fcmError);
                        }
                    }
                }

            } catch (error) {
                console.error(`Failed to broadcast to circle ${circleId}:`, error);
            }
        }));

        // 3. Dispatch SMS to Emergency Contacts if enabled
        if (fullUser?.smsEnabled && fullUser.emergencyContacts && fullUser.emergencyContacts.length > 0) {
            const userName = user.user_metadata.full_name || 'Someone';
            const mapsLink = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
            const smsBody = `SAFE_CIRCLE EMERGENCY: ${userName} has triggered an SOS alert! Location: ${address ? address + ' - ' : ''}${mapsLink}`;

            await Promise.allSettled(fullUser.emergencyContacts.map(async (contact) => {
                await sendSms({
                    to: contact.phone,
                    body: smsBody
                });
            }));
        }

        return NextResponse.json(alert);
    } catch (error) {
        console.error('Error triggering SOS:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
