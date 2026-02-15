interface ReverseGeocodeResult {
    address: string;
    details?: any;
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<ReverseGeocodeResult> {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
                headers: {
                    'User-Agent': 'SafeCircle/1.0', // Nominatim requires a User-Agent
                },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch address');
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        return {
            address: data.display_name,
            details: data.address,
        };
    } catch (error) {
        console.error('Reverse geocoding error:', error);
        return {
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`, // Fallback to coordinates
        };
    }
}
