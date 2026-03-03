"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, AlertTriangle, Moon } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface CheckIn {
    id: string;
    scheduledAt: string;
    status: 'pending' | 'confirmed' | 'missed';
    message?: string;
}

export default function ActiveCheckIns() {
    const { user } = useAuth();
    const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [now, setNow] = useState(new Date());

    const fetchCheckIns = async () => {
        try {
            const res = await fetch('/api/check-in/active');
            if (res.ok) {
                const data = await res.json();
                setCheckIns(data);
            }
        } catch (error) {
            console.error("Failed to fetch active check-ins", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!user) return;
        fetchCheckIns();

        // Refresh periodically (e.g., every minute)
        const interval = setInterval(() => {
            fetchCheckIns();
        }, 60000);
        return () => clearInterval(interval);
    }, [user]);

    // Timer for UI updates every second
    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleConfirm = async (id: string) => {
        try {
            const res = await fetch('/api/check-in/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ checkInId: id })
            });

            if (res.ok) {
                toast.success("Safety confirmed!");
                setCheckIns(prev => prev.filter(c => c.id !== id));
            } else {
                toast.error("Failed to confirm check-in");
            }
        } catch (e) {
            toast.error("An error occurred");
        }
    };

    const handleExtend = async (id: string, minutes: number = 30) => {
        try {
            const res = await fetch('/api/check-in/extend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ checkInId: id, extendMinutes: minutes })
            });

            if (res.ok) {
                toast.success(`Extended by ${minutes} minutes`);
                fetchCheckIns(); // Refresh to get new time
            } else {
                toast.error("Failed to extend check-in");
            }
        } catch (e) {
            toast.error("An error occurred");
        }
    };

    if (isLoading) return null; // Or a skeleton loader
    if (checkIns.length === 0) return null; // Hide if no active check-ins

    return (
        <div className="space-y-4">
            {checkIns.map((checkIn) => {
                const scheduledTime = new Date(checkIn.scheduledAt);
                const isMissed = checkIn.status === 'missed' || (now > scheduledTime && checkIn.status === 'pending');
                const diffMs = scheduledTime.getTime() - now.getTime();

                // Format countdown time
                const diffAbs = Math.abs(diffMs);
                const minutes = Math.floor(diffAbs / 60000);
                const seconds = Math.floor((diffAbs % 60000) / 1000);
                const timeString = `${minutes}m ${seconds}s`;

                // Calculate progress bar (roughly assuming 30 mins total time for the bar if < 30m, else 100%)
                const totalMinsRef = 30;
                let progress = 100;
                if (!isMissed && minutes < totalMinsRef) {
                    progress = (minutes / totalMinsRef) * 100;
                } else if (isMissed) {
                    progress = 0;
                }

                return (
                    <Card key={checkIn.id} className={`border-l-4 ${isMissed ? 'border-l-destructive bg-destructive/5' : 'border-l-primary'}`}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    {isMissed ? <AlertTriangle className="w-5 h-5 text-destructive" /> : <Clock className="w-5 h-5 text-primary" />}
                                    {isMissed ? 'Check-in Missed!' : 'Scheduled Check-In'}
                                </span>
                                <span className={`text-sm font-mono ${isMissed ? 'text-destructive font-bold' : ''}`}>
                                    {isMissed ? `-${timeString}` : timeString}
                                </span>
                            </CardTitle>
                            <CardDescription>
                                {checkIn.message ? `"${checkIn.message}"` : `Due at ${scheduledTime.toLocaleTimeString()}`}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {!isMissed && (
                                <Progress value={progress} className="h-2 mb-4" />
                            )}

                            <div className="flex gap-2">
                                <Button
                                    className="flex-1"
                                    size="sm"
                                    onClick={() => handleConfirm(checkIn.id)}
                                    variant={isMissed ? "destructive" : "default"}
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    I'm Safe
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    size="sm"
                                    onClick={() => handleExtend(checkIn.id, 30)}
                                >
                                    <Moon className="w-4 h-4 mr-2" />
                                    +30 Mins
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
