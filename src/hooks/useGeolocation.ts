import { useState, useEffect, useCallback } from 'react';

interface LocationState {
    latitude: number | null;
    longitude: number | null;
    accuracy: number | null;
    error: string | null;
    loading: boolean;
}

interface GeolocationOptions {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
}

export function useGeolocation(options: GeolocationOptions = {}) {
    const [state, setState] = useState<LocationState>({
        latitude: null,
        longitude: null,
        accuracy: null,
        error: null,
        loading: true,
    });

    const onSuccess = useCallback((position: GeolocationPosition) => {
        setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            error: null,
            loading: false,
        });
    }, []);

    const onError = useCallback((error: GeolocationPositionError) => {
        setState(prev => ({
            ...prev,
            error: error.message,
            loading: false,
        }));
    }, []);

    useEffect(() => {
        if (!navigator.geolocation) {
            setState(prev => ({
                ...prev,
                error: 'Geolocation is not supported by your browser',
                loading: false,
            }));
            return;
        }

        const geoOptions = {
            enableHighAccuracy: options.enableHighAccuracy || true,
            timeout: options.timeout || 15000,
            maximumAge: options.maximumAge || 0,
        };

        // Get initial position
        navigator.geolocation.getCurrentPosition(onSuccess, onError, geoOptions);

        // Watch position
        const watcher = navigator.geolocation.watchPosition(onSuccess, onError, geoOptions);

        return () => navigator.geolocation.clearWatch(watcher);
    }, [options.enableHighAccuracy, options.timeout, options.maximumAge, onSuccess, onError]);

    return state;
}
