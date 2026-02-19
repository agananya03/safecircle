"use client"

import { useEffect, useState } from "react";
import { MapContainer as LMapContainer, TileLayer, ZoomControl, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LocationMarker } from "./LocationMarker";
import { MemberMarker } from "./MemberMarker";
import { AlertMarker } from "./AlertMarker";
import { io } from "socket.io-client";

interface MapContainerProps {
    className?: string;
    center?: [number, number];
    zoom?: number;
    circleId?: string; // If provided, listen for updates in this circle
    alert?: any; // Alert object
}

export default function MapContainer({
    className = "h-full w-full",
    center = [51.505, -0.09], // Default center (London)
    zoom = 13,
    circleId,
    alert,
}: MapContainerProps) {
    const [members, setMembers] = useState<Record<string, any>>({});
    const [trails, setTrails] = useState<Record<string, [number, number][]>>({});

    // Determine effective center: alert location > default center
    const effectiveCenter: [number, number] = alert
        ? [alert.latitude, alert.longitude]
        : center;

    useEffect(() => {
        if (!circleId) return;

        // Use absolute URL for socket initialization to avoid undefined behavior if path is relative
        const socket = io({
            path: "/api/socket/io",
            addTrailingSlash: false,
        });

        socket.on("connect", () => {
            console.log("Connected to socket for map updates");
            socket.emit("join-circle", circleId);
        });

        socket.on("location:update", (data: any) => {
            console.log("Received location update:", data);

            const newPos: [number, number] = [data.location.latitude, data.location.longitude];

            setMembers(prev => ({
                ...prev,
                [data.userId]: {
                    id: data.userId,
                    name: data.user.name,
                    photoUrl: data.user.photoUrl,
                    location: {
                        latitude: data.location.latitude,
                        longitude: data.location.longitude,
                        timestamp: data.location.timestamp
                    }
                }
            }));

            // Update trails
            setTrails(prev => {
                const userTrail = prev[data.userId] || [];
                // Only add if position changed significantly or just append? 
                // For live capability let's append. Limited to last 50 points to perform.
                const newTrail = [...userTrail, newPos].slice(-50);
                return {
                    ...prev,
                    [data.userId]: newTrail
                };
            });
        });

        return () => {
            socket.disconnect();
        };
    }, [circleId]);

    return (
        <LMapContainer
            center={effectiveCenter}
            zoom={alert ? 15 : zoom}
            scrollWheelZoom={true}
            className={className}
            zoomControl={false} // We will add it manually if needed or stick with default but customized
        >
            {/* Add Zoom Control to bottom-right or top-right as preferred, default is top-left */}
            <ZoomControl position="bottomright" />

            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <LocationMarker />

            {alert && <AlertMarker alert={alert} />}

            {Object.entries(trails).map(([userId, positions]) => (
                <Polyline
                    key={`trail-${userId}`}
                    positions={positions}
                    pathOptions={{ color: 'blue', dashArray: '5, 10', weight: 3, opacity: 0.6 }}
                />
            ))}

            {Object.values(members).map((member) => (
                <MemberMarker key={member.id} member={member} />
            ))}
        </LMapContainer>
    );
}
