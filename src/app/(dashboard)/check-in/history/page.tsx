"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, Clock, Text, CheckCircle, AlertTriangle } from "lucide-react";

interface CheckIn {
    id: string;
    scheduledAt: string;
    confirmedAt: string | null;
    status: 'pending' | 'confirmed' | 'missed';
    message: string | null;
    circles: { name: string }[];
}

export default function CheckInHistoryPage() {
    const { user, isLoading: authLoading } = useAuth();
    const [history, setHistory] = useState<CheckIn[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        async function fetchHistory() {
            try {
                const res = await fetch("/api/check-in/history");
                if (res.ok) {
                    const data = await res.json();
                    setHistory(data);
                }
            } catch (err) {
                console.error("Failed to fetch check-in history", err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchHistory();
    }, [user]);

    if (authLoading || isLoading) return <div className="p-4">Loading history...</div>;

    if (history.length === 0) {
        return (
            <div className="p-4 flex flex-col items-center justify-center text-center space-y-4">
                <h2 className="text-2xl font-bold">Check-in History</h2>
                <p className="text-muted-foreground">No check-ins have been recorded yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto p-4">
            <div>
                <h2 className="text-2xl font-bold">Check-in History</h2>
                <p className="text-muted-foreground">Review your past check-ins and their statuses.</p>
            </div>

            <div className="space-y-4">
                {history.map((checkIn) => {
                    const scheduledAt = new Date(checkIn.scheduledAt);
                    const isConfirmed = checkIn.status === 'confirmed';
                    const isMissed = checkIn.status === 'missed';

                    return (
                        <Card key={checkIn.id} className={`border-l-4 ${isConfirmed ? 'border-l-green-500' : isMissed ? 'border-l-destructive' : 'border-l-primary'}`}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        {isConfirmed ? <CheckCircle className="w-5 h-5 text-green-500" /> : isMissed ? <AlertTriangle className="w-5 h-5 text-destructive" /> : <Clock className="w-5 h-5 text-primary" />}
                                        <span className="capitalize">{checkIn.status}</span>
                                    </span>
                                    <span className="text-sm font-normal text-muted-foreground">
                                        {scheduledAt.toLocaleDateString()}
                                    </span>
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" /> Scheduled for {scheduledAt.toLocaleTimeString()}
                                    {isConfirmed && checkIn.confirmedAt && (
                                        <span className="ml-2">| Confirmed at {new Date(checkIn.confirmedAt).toLocaleTimeString()}</span>
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {checkIn.message && (
                                    <div className="text-sm border-l-2 border-muted pl-3 py-1 text-muted-foreground italic">
                                        "{checkIn.message}"
                                    </div>
                                )}
                                <div className="text-sm flex flex-wrap gap-1">
                                    <span className="font-semibold mr-1">Shared with:</span>
                                    {checkIn.circles.map(c => c.name).join(", ")}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
