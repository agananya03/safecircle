"use client"

import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { formatDistanceToNow } from "date-fns";

// Custom icon for members - could be enhanced to show avatar in the pin
// For now, let's use a different color or standard pin
const MemberIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface MemberMarkerProps {
    member: {
        id: string; // User ID
        name: string;
        location: {
            latitude: number;
            longitude: number;
            timestamp: string | Date;
        };
        photoUrl?: string | null;
    }
}

export function MemberMarker({ member }: MemberMarkerProps) {
    if (!member.location) return null;

    const position: [number, number] = [member.location.latitude, member.location.longitude];

    return (
        <Marker position={position} icon={MemberIcon}>
            <Popup>
                <div className="flex flex-col gap-1 min-w-[150px]">
                    <h3 className="font-bold text-sm">{member.name}</h3>
                    <p className="text-xs text-muted-foreground">
                        Updated {formatDistanceToNow(new Date(member.location.timestamp), { addSuffix: true })}
                    </p>
                </div>
            </Popup>
        </Marker>
    );
}
