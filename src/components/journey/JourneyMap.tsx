"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon issue
const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface JourneyMapProps {
    startPos: [number, number];
    endPos?: [number, number]; // Might be 0,0 if unknown
    currentPos?: [number, number];
    waypoints: [number, number][]; // History for polyline
}

function MapUpdater({ center }: { center?: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, map.getZoom());
        }
    }, [center, map]);
    return null;
}

export default function JourneyMap({ startPos, endPos, currentPos, waypoints }: JourneyMapProps) {
    const effectiveCenter = currentPos || startPos;

    // Filter out 0,0 points if any
    const validStart = startPos[0] !== 0 && startPos[1] !== 0;
    const validEnd = endPos && endPos[0] !== 0 && endPos[1] !== 0;

    return (
        <MapContainer
            center={effectiveCenter}
            zoom={15}
            scrollWheelZoom={true}
            className="h-full w-full rounded-lg shadow-inner"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Start Marker */}
            {validStart && (
                <Marker position={startPos}>
                    <Popup>Start Point</Popup>
                </Marker>
            )}

            {/* End Marker */}
            {validEnd && (
                <Marker position={endPos!}>
                    <Popup>Destination</Popup>
                </Marker>
            )}

            {/* Current Position */}
            {currentPos && (
                <Marker position={currentPos} opacity={0.9}>
                    <Popup>Current Location</Popup>
                </Marker>
            )}

            {/* Route History */}
            {waypoints.length > 0 && (
                <Polyline positions={waypoints} color="blue" />
            )}

            {/* Dashed line to destination if end is known */}
            {currentPos && validEnd && (
                <Polyline
                    positions={[currentPos, endPos!]}
                    pathOptions={{ color: 'gray', dashArray: '5, 10' }}
                />
            )}

            <MapUpdater center={currentPos} />
        </MapContainer>
    );
}
