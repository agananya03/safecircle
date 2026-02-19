"use client"

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const MapContainer = dynamic(() => import("./MapContainer"), {
    loading: () => (
        <div className="flex h-full w-full items-center justify-center bg-muted/20">
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading Map...</span>
        </div>
    ),
    ssr: false,
});

export default MapContainer;
