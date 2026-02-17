"use client";

import { useEffect, useState } from "react";
import { getNotifications } from "./actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Bell, MapPin, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface Alert {
    id: string;
    type: string;
    message: string;
    address: string | null;
    createdAt: Date;
    user: {
        name: string | null;
        avatar: string | null;
    };
}

export default function NotificationsPage() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAlerts() {
            try {
                const data = await getNotifications();
                setAlerts(data);
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchAlerts();
    }, []);

    if (loading) {
        return (
            <div className="p-6 space-y-4">
                <h1 className="text-2xl font-bold">Notifications</h1>
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
                <Bell className="h-6 w-6" />
                <h1 className="text-2xl font-bold">Notifications</h1>
            </div>

            {alerts.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                    No notifications yet.
                </div>
            ) : (
                <div className="space-y-4">
                    {alerts.map((alert) => (
                        <Card key={alert.id} className={`border-l-4 ${alert.type === 'sos' ? 'border-l-red-500' : 'border-l-blue-500'}`}>
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-4">
                                        <div className={`p-2 rounded-full ${alert.type === 'sos' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                            <AlertTriangle className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-lg">
                                                {alert.user.name || "Unknown User"}
                                                <span className="font-normal text-muted-foreground ml-2">
                                                    triggered {alert.type === 'sos' ? 'an SOS' : 'an alert'}
                                                </span>
                                            </p>
                                            <p className="text-sm text-foreground/80 mt-1">{alert.message}</p>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-xs text-muted-foreground">
                                                {alert.address && (
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" />
                                                        {alert.address}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
