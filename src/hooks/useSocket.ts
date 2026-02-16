
"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket/client";
import { useAuth } from "@/contexts/AuthContext";

export const useSocket = () => {
    const { user } = useAuth();
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!user) return;

        // Initialize the socket connection
        const socketInitializer = async () => {
            try {
                const response = await fetch("/api/socket/io");
                console.log("Socket init response:", response.status);
            } catch (e) {
                console.error("Socket init failed:", e);
            }
            socket.connect();

            socket.on("connect", () => {
                console.log("Connected to socket");
                setIsConnected(true);
            });

            socket.on("disconnect", () => {
                console.log("Disconnected from socket");
                setIsConnected(false);
            });
        };

        socketInitializer();

        return () => {
            socket.disconnect();
        };
    }, [user]);

    // Join rooms for all user's circles
    // We can fetch circle IDs from an API or pass them in.
    // Ideally, we fetch them here or assume the user has joined relevant rooms.
    // For now, let's just expose a joinCircle method.

    const joinCircle = (circleId: string) => {
        if (isConnected) {
            socket.emit("join-circle", circleId);
        }
    };

    const leaveCircle = (circleId: string) => {
        if (isConnected) {
            socket.emit("leave-circle", circleId);
        }
    };

    return { socket, isConnected, joinCircle, leaveCircle };
};
