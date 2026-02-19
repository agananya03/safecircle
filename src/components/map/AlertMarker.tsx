"use client"

import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { AlertTriangle } from "lucide-react";

// Pulsing red icon for SOS
const AlertIcon = L.divIcon({
    className: "custom-div-icon",
    html: `<div style="
        background-color: #ef4444;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 10px rgba(239, 68, 68, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        animation: pulse 1.5s infinite;
    ">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/></svg>
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
});

interface AlertMarkerProps {
    alert: {
        latitude: number;
        longitude: number;
        user: {
            name: string;
        };
        message?: string;
        createdAt: string | Date;
    };
}

export function AlertMarker({ alert }: AlertMarkerProps) {
    if (!alert.latitude || !alert.longitude) return null;

    const position: [number, number] = [alert.latitude, alert.longitude];

    return (
        <Marker position={position} icon={AlertIcon}>
            <Popup>
                <div className="flex flex-col gap-1 min-w-[150px]">
                    <div className="flex items-center gap-1 text-red-600 font-bold">
                        <AlertTriangle className="h-4 w-4" />
                        <span>SOS ALERT</span>
                    </div>
                    <p className="font-medium text-sm">{alert.user.name}</p>
                    <p className="text-xs">{alert.message || "Needs help!"}</p>
                    <p className="text-xs text-muted-foreground">{new Date(alert.createdAt).toLocaleTimeString()}</p>
                </div>
            </Popup>
        </Marker>
    );
}
