
"use client";

import { createContext, useContext, useEffect } from "react";
import { useSocket } from "@/hooks/useSocket";
import { useAuth } from "@/contexts/AuthContext";
import { AlertListener } from "@/components/notifications/AlertListener";

type SocketContextType = ReturnType<typeof useSocket>;

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocketContext = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocketContext must be used within a SocketProvider");
    }
    return context;
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const socketData = useSocket();
    const { user } = useAuth();
    const { isConnected, joinCircle } = socketData;

    useEffect(() => {
        if (user && isConnected) {
            // Fetch user's circles and join rooms
            const fetchCircles = async () => {
                try {
                    const res = await fetch("/api/circles");
                    if (res.ok) {
                        const circles = await res.json();
                        circles.forEach((circle: { id: string }) => {
                            joinCircle(circle.id);
                        });
                    }
                } catch (error) {
                    console.error("Failed to join circle rooms", error);
                }
            };
            fetchCircles();
        }
    }, [user, isConnected, joinCircle]);

    return (
        <SocketContext.Provider value={socketData}>
            <AlertListener />
            {children}
        </SocketContext.Provider>
    );
};
