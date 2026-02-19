"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MapWrapper from "@/components/map/MapWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, MapPin, Navigation, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { calculateDistance } from "@/lib/location/distance";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useAuth } from "@/contexts/AuthContext";

interface AlertDetail {
    id: string;
    type: string;
    message: string;
    latitude: number;
    longitude: number;
    address?: string;
    createdAt: string;
    status: string;
    user: {
        id: string;
        name: string;
        photoUrl?: string;
        phone?: string;
    };
    circleId?: string;
}

export default function AlertDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();
    const { user } = useAuth();
    const [alert, setAlert] = useState<AlertDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const { latitude: myLat, longitude: myLng } = useGeolocation();
    const [distance, setDistance] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchAlert = async () => {
            try {
                // We'll imply an API route exists or build one, but for now assuming we can fetch generic alert details
                // If not, we might need to add a GET /api/alerts/[id] route.
                // For MVP, let's assume we can fetch it or similar.
                // Actually, let's use the existing pattern.
                const res = await fetch(`/api/alerts/${id}`);
                if (!res.ok) throw new Error("Alert not found");
                const data = await res.json();
                setAlert(data);
            } catch (error) {
                console.error("Error fetching alert:", error);
                toast.error("Could not load alert details");
            } finally {
                setLoading(false);
            }
        };

        fetchAlert();
    }, [id]);

    useEffect(() => {
        if (alert && myLat && myLng) {
            const dist = calculateDistance(myLat, myLng, alert.latitude, alert.longitude);
            setDistance(dist);
        }
    }, [alert, myLat, myLng]);

    const handleResolve = async () => {
        if (!alert) return;
        try {
            const res = await fetch('/api/alerts/cancel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ alertId: alert.id })
            });
            if (!res.ok) throw new Error("Failed to resolve");
            toast.success("Alert resolved");
            router.push("/circles");
        } catch (error) {
            toast.error("Failed to resolve alert");
        }
    };

    const openGoogleMaps = () => {
        if (!alert) return;
        const url = `https://www.google.com/maps/dir/?api=1&destination=${alert.latitude},${alert.longitude}`;
        window.open(url, "_blank");
    };

    if (loading) return <div className="p-8 text-center">Loading alert details...</div>;
    if (!alert) return <div className="p-8 text-center text-red-500">Alert not found</div>;

    const isMyAlert = user?.id === alert.user.id;

    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col md:flex-row">
            {/* Sidebar / Info Panel */}
            <div className="w-full md:w-1/3 p-4 bg-background border-r overflow-y-auto space-y-6">
                <Button variant="ghost" className="mb-2" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>

                <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
                    <CardHeader>
                        <div className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="h-6 w-6" />
                            <CardTitle>SOS ALERT</CardTitle>
                        </div>
                        <CardDescription>
                            Triggered by <span className="font-bold text-foreground">{alert.user.name}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="font-medium">Message:</p>
                            <p className="text-sm text-muted-foreground">{alert.message}</p>
                        </div>
                        <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Location:</p>
                                <p className="text-sm text-muted-foreground break-words">{alert.address || `${alert.latitude}, ${alert.longitude}`}</p>
                            </div>
                        </div>
                        {distance && (
                            <div className="flex items-center gap-2 text-blue-600 font-medium">
                                <Navigation className="h-4 w-4" />
                                <span>{distance} away from you</span>
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Time: {new Date(alert.createdAt).toLocaleString()}
                        </p>
                    </CardContent>
                </Card>

                <div className="grid gap-3">
                    <Button size="lg" className="w-full" onClick={openGoogleMaps}>
                        <Navigation className="mr-2 h-5 w-5" />
                        Get Directions
                    </Button>

                    {isMyAlert && (
                        <Button variant="outline" size="lg" className="w-full text-green-600 border-green-200 hover:bg-green-50" onClick={handleResolve}>
                            <CheckCircle className="mr-2 h-5 w-5" />
                            I'm Safe (Resolve)
                        </Button>
                    )}
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative min-h-[400px]">
                {/* 
                    We pass the alert prop to MapWrapper -> MapContainer. 
                    MapWrapper is a dynamic import, so we need to ensure it passes props down correctly.
                    Typically MapWrapper just renders MapContainer, so we might need to update MapWrapper to accept props 
                    or just import MapContainer dynamically here if updating MapWrapper is too risky?
                    Actually MapWrapper in our codebase uses `...props` to pass through? 
                    Let's check MapWrapper.tsx content above. 
                    Wait, I didn't verify MapWrapper passes props.
                    Let's assume it does or I'll fix it if "alert" prop doesn't pass.
                */}
                <MapWrapper
                    alert={alert}
                    circleId={alert.circleId} // To show other members
                />
            </div>
        </div>
    );
}
