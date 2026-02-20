"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Calendar, Clock, Navigation } from "lucide-react";
import { toast } from "sonner";
import { calculateDistanceInMeters } from "@/lib/location/distance";

// Dynamic map import
const JourneyMap = dynamic(() => import("./JourneyMap"), { ssr: false });

interface Journey {
    id: string;
    startTime: string;
    expectedEnd?: string;
    actualEnd?: string;
    status: string;
    startAddress: string;
    endAddress?: string;
    startLat: number;
    startLng: number;
    endLat?: number;
    endLng?: number;
    waypoints: { latitude: number; longitude: number }[];
}

export default function JourneyHistory() {
    const [journeys, setJourneys] = useState<Journey[]>([]);
    const [filter, setFilter] = useState("all");
    const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null);
    const [stats, setStats] = useState({ totalDistance: 0, totalTime: 0, count: 0 });

    useEffect(() => {
        fetchHistory();
    }, [filter]);

    const fetchHistory = async () => {
        try {
            const url = filter === 'all'
                ? '/api/journey/history'
                : `/api/journey/history?status=${filter}`;

            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to load history");
            const data = await res.json();

            // Client-side stat calculation for now
            // Distance: Sum of point-to-point in waypoints? Or just start-end? 
            // Better: Sum of waypoints.
            let totalDist = 0;
            let totalTimeMs = 0;
            let completedCount = 0;

            const processedJourneys = data.journeys.map((j: any) => {
                // Calculate distance for this journey
                let d = 0;
                if (j.waypoints && j.waypoints.length > 1) {
                    for (let i = 0; i < j.waypoints.length - 1; i++) {
                        d += calculateDistanceInMeters(
                            j.waypoints[i].latitude, j.waypoints[i].longitude,
                            j.waypoints[i + 1].latitude, j.waypoints[i + 1].longitude
                        ) / 1000;
                    }
                }

                if (j.status === 'completed' && j.actualEnd && j.startTime) {
                    totalTimeMs += new Date(j.actualEnd).getTime() - new Date(j.startTime).getTime();
                    totalDist += d;
                    completedCount++;
                }

                return { ...j, distance: d.toFixed(1) };
            });

            setJourneys(processedJourneys);
            setStats({
                totalDistance: totalDist,
                totalTime: totalTimeMs,
                count: completedCount
            });

            if (processedJourneys.length > 0 && !selectedJourney) {
                // Optional: select first?
            }

        } catch (e) {
            toast.error("Error loading history");
        }
    };

    const formatDuration = (ms: number) => {
        const h = Math.floor(ms / 3600000);
        const m = Math.floor((ms % 3600000) / 60000);
        return `${h}h ${m}m`;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-100px)]">
            {/* Sidebar List */}
            <div className="md:col-span-1 flex flex-col gap-4">
                {/* Stats Card */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                                <p className="text-2xl font-bold">{stats.count}</p>
                                <p className="text-xs text-muted-foreground">Journeys</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.totalDistance.toFixed(1)} km</p>
                                <p className="text-xs text-muted-foreground">Total Distance</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Filters */}
                <div className="flex gap-2">
                    <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* List */}
                <ScrollArea className="flex-1 border rounded-md p-2">
                    <div className="space-y-2">
                        {journeys.map((j: any) => (
                            <div
                                key={j.id}
                                onClick={() => setSelectedJourney(j)}
                                className={`p-3 rounded-lg border cursor-pointer hover:bg-accent transition-colors ${selectedJourney?.id === j.id ? 'border-primary bg-accent/50' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-medium text-sm truncate">{j.endAddress || "Unknown Destination"}</span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full uppercase ${j.status === 'completed' ? 'bg-green-100 text-green-800' :
                                        j.status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {j.status}
                                    </span>
                                </div>
                                <div className="text-xs text-muted-foreground space-y-1">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {format(new Date(j.startTime), 'MMM d, h:mm a')}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Navigation className="w-3 h-3" />
                                        {j.distance} km
                                    </div>
                                </div>
                            </div>
                        ))}
                        {journeys.length === 0 && <p className="text-center text-sm text-muted-foreground p-4">No journeys found.</p>}
                    </div>
                </ScrollArea>
            </div>

            {/* Map View */}
            <div className="md:col-span-2 border rounded-lg overflow-hidden relative">
                {selectedJourney ? (
                    <div className="h-full w-full">
                        <JourneyMap
                            startPos={[selectedJourney.startLat, selectedJourney.startLng]}
                            endPos={selectedJourney.endLat ? [selectedJourney.endLat, selectedJourney.endLng!] : undefined}
                            // Show all waypoints as history
                            waypoints={selectedJourney.waypoints.map(w => [w.latitude, w.longitude])}
                        // No current pos if completed
                        />
                        <div className="absolute top-4 left-4 right-4 z-[400] bg-background/90 p-3 rounded-lg shadow backdrop-blur-sm pointer-events-none md:pointer-events-auto md:w-fit">
                            <h3 className="font-semibold">{selectedJourney.startAddress} ➝ {selectedJourney.endAddress}</h3>
                            {selectedJourney.note && <p className="text-sm text-muted-foreground mt-1">"{selectedJourney.note}"</p>}
                        </div>
                    </div>
                ) : (
                    <div className="h-full w-full flex items-center justify-center bg-muted text-muted-foreground">
                        Select a journey to view details
                    </div>
                )}
            </div>
        </div>
    );
}
