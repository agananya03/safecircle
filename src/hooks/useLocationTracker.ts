import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { calculateDistanceInMeters } from '@/lib/location/distance';

interface LocationConfig {
    interval?: number; // ms, default 30000 (30s)
    enableHighAccuracy?: boolean;
    autoStart?: boolean;
}

export function useLocationTracker(config: LocationConfig = {}) {
    const [isTracking, setIsTracking] = useState(false);
    const [lastLocation, setLastLocation] = useState<GeolocationPosition | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Default config
    const interval = config.interval || 30000;
    const enableHighAccuracy = config.enableHighAccuracy ?? true;

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const sendLocationUpdate = useCallback(async (position: GeolocationPosition) => {
        // Optimization: Check distance and time since last update
        if (lastLocation) {
            const distance = calculateDistanceInMeters(
                lastLocation.coords.latitude,
                lastLocation.coords.longitude,
                position.coords.latitude,
                position.coords.longitude
            );

            // If moved less than 10 meters and less than 5 minutes have passed, skip
            // We allow a "heartbeat" every 5 minutes even if stationary
            const timeDiff = position.timestamp - lastLocation.timestamp;
            if (distance < 10 && timeDiff < 5 * 60 * 1000) {
                return;
            }
        }

        try {
            await fetch('/api/location/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: position.timestamp,
                }),
            });
            setLastLocation(position);
        } catch (err) {
            console.error("Failed to send location update", err);
        }
    }, [lastLocation]);

    const trackLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                sendLocationUpdate(position);
                setError(null);
            },
            (err) => {
                setError(err.message);
                console.error("Geolocation error:", err);
            },
            {
                enableHighAccuracy,
                timeout: 10000,
                maximumAge: 0
            }
        );
    }, [enableHighAccuracy, sendLocationUpdate]);

    const startTracking = useCallback(() => {
        if (isTracking) return;

        setIsTracking(true);
        trackLocation(); // Immediate update

        timerRef.current = setInterval(trackLocation, interval);
        toast.info("Location sharing active");
    }, [isTracking, trackLocation, interval]);

    const stopTracking = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setIsTracking(false);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    // Auto-start if requested
    useEffect(() => {
        if (config.autoStart && !isTracking) {
            startTracking();
        }
    }, [config.autoStart, startTracking, isTracking]);

    return {
        isTracking,
        startTracking,
        stopTracking,
        lastLocation,
        error
    };
}
