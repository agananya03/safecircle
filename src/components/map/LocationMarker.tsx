import { useState, useEffect } from "react";
import { Marker, Popup, useMap, Circle } from "react-leaflet";
import L from "leaflet";

// ... (DefaultIcon definition remains same)
const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export function LocationMarker() {
    const [position, setPosition] = useState<L.LatLng | null>(null);
    const [accuracy, setAccuracy] = useState<number | null>(null);
    const map = useMap();

    useEffect(() => {
        map.locate().on("locationfound", function (e) {
            setPosition(e.latlng);
            setAccuracy(e.accuracy);
            map.flyTo(e.latlng, map.getZoom());
        });
    }, [map]);

    return position === null ? null : (
        <>
            <Circle
                center={position}
                radius={accuracy || 0}
                pathOptions={{
                    color: accuracy && accuracy > 50 ? 'orange' : 'blue',
                    fillColor: accuracy && accuracy > 50 ? 'orange' : 'blue',
                    fillOpacity: 0.1,
                    weight: 1
                }}
            />
            <Marker position={position} icon={DefaultIcon}>
                <Popup>You are here</Popup>
            </Marker>
        </>
    );
}
