import { useEffect } from "react";
import { useSocketContext } from "@/components/providers/SocketProvider";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface AlertData {
    id: string;
    userId: string;
    type: string;
    message: string;
    address: string;
    user: {
        name: string;
    };
    createdAt: string;
}

export function AlertListener() {
    const { socket } = useSocketContext();
    const { user } = useAuth();

    useEffect(() => {
        if (!socket) return;

        const handleNewAlert = (data: AlertData) => {
            // Don't show alert if it was triggered by the current user
            if (user && data.userId === user.id) {
                return;
            }

            console.log("Received alert:", data);

            // 1. Play Sound (Browser policy might block autoplay without interaction, but worth a try)
            // 1. Play Sound
            try {
                const audio = new Audio("/sounds/alert.mp3");

                // For SOS, loop the sound a few times or play a longer one? 
                // For now, just play it.
                audio.volume = 1.0;

                const playPromise = audio.play();

                if (playPromise !== undefined) {
                    playPromise.catch(e => {
                        console.warn("Audio autoplay blocked by browser:", e);
                        // Interaction required. We could show a button to "Enable Sound" 
                        // but for critical alerts native toast might be better if supported.
                    });
                }
            } catch (e) {
                console.error("Error playing sound", e);
            }

            // 2. Vibrate
            if (typeof navigator !== "undefined" && navigator.vibrate) {
                navigator.vibrate([500, 200, 500]);
            }

            // 3. Show Toast
            toast.error(
                <div className="flex flex-col gap-1">
                    <span className="font-bold text-lg">SOS ALERT!</span>
                    <span className="font-medium">{data.user?.name || "Someone"} needs help!</span>
                    <span className="text-xs opacity-90">{data.address || "Location shared"}</span>
                    <span className="text-xs opacity-75">{new Date(data.createdAt).toLocaleTimeString()}</span>
                </div>,
                {
                    duration: 30000, // 30 seconds
                    position: "top-center",
                    icon: <AlertTriangle className="h-8 w-8 text-white" />,
                    style: {
                        background: "#ef4444", // Red-500
                        color: "white",
                        border: "2px solid #b91c1c",
                    },
                    action: {
                        label: "View Location",
                        onClick: () => {
                            window.location.href = `/alerts/${data.id}`;
                        },
                    },
                }
            );
        };

        socket.on("alert:new", handleNewAlert);

        return () => {
            socket.off("alert:new", handleNewAlert);
        };
    }, [socket, user]);

    return null;
}
