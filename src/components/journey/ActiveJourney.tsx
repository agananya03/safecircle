"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Loader2, MapPin, CheckCircle, Clock, MessageSquare } from "lucide-react";

// Dynamic import for Map to avoid SSR
const JourneyMap = dynamic(() => import("./JourneyMap"), {
    ssr: false,
    loading: () => <div className="h-64 w-full bg-gray-100 animate-pulse flex items-center justify-center">Loading Map...</div>
});

interface JourneyData {
    id: string;
    status: string;
    startAddress: string;
    endAddress?: string;
    startLat: number;
    startLng: number;
    endLat?: number;
    endLng?: number;
    expectedEnd?: string;
    note?: string;
}

export default function ActiveJourney({ journeyId }: { journeyId: string }) {
    const router = useRouter();
    const [journey, setJourney] = useState<JourneyData | null>(null);
    const [loading, setLoading] = useState(true);
    const [waypoints, setWaypoints] = useState<[number, number][]>([]);

    // Use Geolocation
    const { latitude, longitude } = useGeolocation({
        enableHighAccuracy: true,
        timeout: 10000,
    });

    // Fetch initial journey data
    useEffect(() => {
        async function fetchJourney() {
            try {
                const res = await fetch(`/api/journey/${journeyId}`);
                if (!res.ok) throw new Error("Failed to load journey");
                const data = await res.json();
                setJourney(data);

                // Initial waypoints? maybe fetch from separate endpoint if needed, or included in GET
                if (data.waypoints) {
                    setWaypoints(data.waypoints.map((wp: any) => [wp.latitude, wp.longitude]));
                }
            } catch (error) {
                toast.error("Error loading journey details");
            } finally {
                setLoading(false);
            }
        }
        fetchJourney();
    }, [journeyId]);

    // Update server with location
    // Debounce or interval? Interval is safer to avoid spamming
    useEffect(() => {
        if (!journey || journey.status !== 'active') return;
        if (!latitude || !longitude) return;

        const interval = setInterval(async () => {
            try {
                await fetch('/api/journey/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        journeyId,
                        latitude,
                        longitude
                    })
                });

                // Update local waypoints
                setWaypoints(prev => [...prev, [latitude, longitude]]);
            } catch (err) {
                console.error("Failed to update location", err);
            }
        }, 10000); // Every 10 seconds

        return () => clearInterval(interval);
    }, [journeyId, journey, latitude, longitude]);

    const handleComplete = async () => {
        try {
            const res = await fetch('/api/journey/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ journeyId })
            });

            if (!res.ok) throw new Error("Failed to complete journey");

            toast.success("Journey completed!");
            setJourney(prev => prev ? { ...prev, status: 'completed' } : null);
            setTimeout(() => router.push('/dashboard'), 2000);
        } catch (e) {
            toast.error("Failed to complete journey");
        }
    };

    const handleExtend = async (minutes: number) => {
        try {
            const res = await fetch('/api/journey/extend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ journeyId, additionalMinutes: minutes })
            });
            if (!res.ok) throw new Error("Failed");
            const updated = await res.json();
            setJourney(prev => prev ? { ...prev, expectedEnd: updated.expectedEnd } : null);
            toast.success(`Journey extended by ${minutes} mins`);
        } catch (e) {
            toast.error("Failed to extend journey");
        }
    };

    const handleMessage = async (message: string) => {
        try {
            const res = await fetch('/api/journey/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ journeyId, message })
            });
            if (!res.ok) throw new Error("Failed");
            toast.success("Message sent to circle");
        } catch (e) {
            toast.error("Failed to send message");
        }
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    if (!journey) return <div className="text-center p-8">Journey not found.</div>;

    const currentPos: [number, number] | undefined = (latitude && longitude) ? [latitude, longitude] : undefined;
    // Fallback to last waypoint if current pos unavailable?
    const displayPos = currentPos || (waypoints.length > 0 ? waypoints[waypoints.length - 1] : [journey.startLat, journey.startLng]);

    // Calculate distance remaining if possible
    const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Radius of the earth in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    };

    const distanceRemaining = (currentPos && journey.endLat && journey.endLng)
        ? getDistance(currentPos[0], currentPos[1], journey.endLat, journey.endLng).toFixed(1)
        : null;

    return (
        <div className="space-y-4 h-[calc(100vh-100px)] flex flex-col">
            <Card className="flex-none">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex justify-between items-center">
                        <span>Journey to {journey.endAddress || "Destination"}</span>
                        <span className={`text-sm px-2 py-1 rounded-full ${journey.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {journey.status}
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center text-sm text-muted-foreground">
                            <div>
                                <p><MapPin className="inline w-3 h-3 mr-1" /> Started: {journey.startAddress}</p>
                                {journey.expectedEnd && <p className="mt-1"><Clock className="inline w-3 h-3 mr-1" /> ETA: {new Date(journey.expectedEnd).toLocaleTimeString()}</p>}
                            </div>
                            {distanceRemaining && (
                                <div className="text-right">
                                    <p className="font-semibold text-lg text-primary">{distanceRemaining} km</p>
                                    <p className="text-xs">remaining</p>
                                </div>
                            )}
                        </div>

                        {journey.status === 'active' && (
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <Button onClick={handleComplete} className="col-span-2 bg-green-600 hover:bg-green-700">
                                    <CheckCircle className="w-4 h-4 mr-2" /> I've Arrived
                                </Button>
                                <Button variant="outline" onClick={() => {
                                    // Simple prompt for now or custom dialog
                                    // Let's implement a better UI state for this later if needed, but for now prompts are quick to verify
                                    // Actually, let's just add hidden state logic in component
                                    const mins = prompt("Extend by how many minutes?", "15");
                                    if (mins) handleExtend(parseInt(mins));
                                }}>
                                    <Clock className="w-4 h-4 mr-2" /> Extend
                                </Button>
                                <Button variant="outline" onClick={() => {
                                    const msg = prompt("Message to circle:", "I'm running a bit late");
                                    if (msg) handleMessage(msg);
                                }}>
                                    <MessageSquare className="w-4 h-4 mr-2" /> Update
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="flex-grow rounded-lg overflow-hidden border">
                <JourneyMap
                    startPos={[journey.startLat, journey.startLng]}
                    endPos={journey.endLat ? [journey.endLat, journey.endLng!] : undefined}
                    currentPos={displayPos}
                    waypoints={waypoints}
                />
            </div>
        </div>
    );
}
