"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { MapPin, Clock, Users, FileText } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useAuth } from "@/contexts/AuthContext";

interface Circle {
    id: string;
    name: string;
}

export default function StartJourneyForm() {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const { latitude, longitude, error: geoError } = useGeolocation();

    const [destination, setDestination] = useState("");
    const [circles, setCircles] = useState<Circle[]>([]);
    const [selectedCircles, setSelectedCircles] = useState<string[]>([]);
    const [note, setNote] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [etaMinutes, setEtaMinutes] = useState("30");

    useEffect(() => {
        if (!user) return;

        async function fetchCircles() {
            try {
                const res = await fetch('/api/circles');
                if (res.ok) {
                    const data = await res.json();
                    setCircles(data);
                }
            } catch (err) {
                console.error("Failed to fetch circles", err);
            }
        }
        fetchCircles();
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (authLoading || !user) {
            toast.error("You must be logged in to start a journey.");
            return;
        }

        if (!latitude || !longitude) {
            toast.error("Location not available. Please enable location services.");
            return;
        }
        if (selectedCircles.length === 0) {
            toast.error("Please select at least one circle to share with.");
            return;
        }

        setIsLoading(true);

        try {
            const now = new Date();
            const expectedEnd = new Date(now.getTime() + parseInt(etaMinutes) * 60000);

            const res = await fetch("/api/journey/start", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // userId excluded, handled by server session
                body: JSON.stringify({
                    destination,
                    startLat: latitude,
                    startLng: longitude,
                    startAddress: "Current Location",
                    endLat: 0,
                    endLng: 0,
                    endAddress: destination,
                    expectedEnd: expectedEnd.toISOString(),
                    circleIds: selectedCircles,
                    note,
                }),
            });

            if (!res.ok) throw new Error("Failed to start journey");

            const data = await res.json();
            toast.success("Journey started!");
            router.push(`/journey/${data.id}`);
        } catch (error) {
            toast.error("Error starting journey. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleCircle = (circleId: string) => {
        setSelectedCircles(prev =>
            prev.includes(circleId)
                ? prev.filter(id => id !== circleId)
                : [...prev, circleId]
        );
    };

    if (authLoading) return <p>Loading user...</p>;
    if (!user) return <p>Please log in.</p>;

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto p-4 border rounded-lg shadow-sm bg-card text-card-foreground">
            <div className="space-y-2">
                <Label htmlFor="destination" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Destination
                </Label>
                <Input
                    id="destination"
                    placeholder="Where are you going?"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="eta" className="flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Expected Duration (minutes)
                </Label>
                <Select value={etaMinutes} onValueChange={setEtaMinutes}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="15">15 mins</SelectItem>
                        <SelectItem value="30">30 mins</SelectItem>
                        <SelectItem value="45">45 mins</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label className="flex items-center gap-2">
                    <Users className="w-4 h-4" /> Share with Circles
                </Label>
                <div className="flex flex-wrap gap-2">
                    {circles.length > 0 ? (
                        circles.map((circle) => (
                            <Button
                                key={circle.id}
                                type="button"
                                variant={selectedCircles.includes(circle.id) ? "default" : "outline"}
                                size="sm"
                                onClick={() => toggleCircle(circle.id)}
                            >
                                {circle.name}
                            </Button>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground w-full">No circles found. Create one first!</p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="note" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Note (Optional)
                </Label>
                <Textarea
                    id="note"
                    placeholder="Walking home, battery low..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Starting..." : "Start Journey"}
            </Button>
        </form>
    );
}
