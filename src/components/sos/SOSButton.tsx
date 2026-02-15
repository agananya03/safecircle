"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCurrentLocation } from "@/lib/location/tracker";
import { toast } from "sonner"; // Assuming sonner is used based on package.json

interface SOSButtonProps {
    onTrigger?: () => void;
    onCancel?: () => void;
    duration?: number; // seconds
    className?: string;
}

export function SOSButton({
    onTrigger,
    onCancel,
    duration = 5,
    className,
}: SOSButtonProps) {
    const [status, setStatus] = useState<"idle" | "countdown" | "triggering" | "active">("idle");
    const [timeLeft, setTimeLeft] = useState(duration);
    const [alertId, setAlertId] = useState<string | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Haptic feedback helper
    const vibrate = useCallback((pattern: number | number[]) => {
        if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    }, []);

    const startCountdown = () => {
        if (status !== "idle") return;

        setStatus("countdown");
        setTimeLeft(duration);
        vibrate(200); // Initial haptic feedback

        // Start timer
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    triggerSOS();
                    return 0;
                }
                vibrate(50); // Tick haptic
                return prev - 1;
            });
        }, 1000);
    };

    const cancelCountdown = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setStatus("idle");
        setTimeLeft(duration);
        vibrate([50, 50, 50]); // Cancel haptic pattern
        onCancel?.();
    };

    const triggerSOS = async () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setStatus("triggering");

        try {
            // Get Location
            const location = await getCurrentLocation();

            // Call API
            const response = await fetch('/api/alerts/trigger', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    latitude: location.latitude,
                    longitude: location.longitude,
                    message: "SOS Alert Triggered"
                })
            });

            if (!response.ok) throw new Error('Failed to send SOS');

            const data = await response.json();
            setAlertId(data.id);
            setStatus("active");
            vibrate([500, 200, 500]); // Success/Active haptic pattern
            onTrigger?.();
            toast.success("SOS Alert Sent! Help is on the way.");
        } catch (error) {
            console.error("SOS Error:", error);
            setStatus("idle"); // or error state?
            toast.error("Failed to send SOS. Please call emergency services directly.");
            vibrate([100, 50, 100, 50, 100]); // Error haptic
        }
    };

    const resolveSOS = async () => {
        if (!alertId) return;

        try {
            const response = await fetch('/api/alerts/cancel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ alertId })
            });

            if (!response.ok) throw new Error('Failed to cancel alert');

            setStatus("idle");
            setAlertId(null);
            toast.info("SOS Alert Cancelled.");
        } catch (error) {
            console.error("Cancel Error:", error);
            toast.error("Failed to cancel alert.");
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    return (
        <div className={cn("fixed bottom-6 right-6 z-50", className)}>
            <AnimatePresence mode="wait">
                {status === "idle" && (
                    <motion.button
                        key="idle"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={startCountdown}
                        className="group relative flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white shadow-lg shadow-red-500/30 transition-colors hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/50"
                        aria-label="SOS Button"
                    >
                        <div className="absolute inset-0 -z-10 animate-ping rounded-full bg-red-500 opacity-20 group-hover:opacity-40" />
                        <AlertTriangle className="h-8 w-8" strokeWidth={2.5} />
                        <span className="sr-only">Activate SOS</span>
                    </motion.button>
                )}

                {status === "countdown" && (
                    <motion.div
                        key="countdown"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="relative flex h-24 w-24 items-center justify-center"
                    >
                        {/* Countdown Ring */}
                        <svg className="absolute inset-0 h-full w-full -rotate-90">
                            <circle
                                cx="48"
                                cy="48"
                                r="40"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                className="text-gray-200 dark:text-gray-700"
                            />
                            <motion.circle
                                cx="48"
                                cy="48"
                                r="40"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                className="text-red-500"
                                strokeDasharray="251.2"
                                strokeDashoffset="0"
                                initial={{ strokeDashoffset: 0 }}
                                animate={{ strokeDashoffset: 251.2 }}
                                transition={{ duration: duration, ease: "linear" }}
                            />
                        </svg>

                        {/* Cancel Button / Timer Display */}
                        <button
                            onClick={cancelCountdown}
                            className="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-white text-red-600 shadow-md transition-transform active:scale-95 dark:bg-gray-800"
                        >
                            <span className="text-2xl font-bold">{timeLeft}</span>
                            <span className="text-[10px] font-semibold uppercase tracking-wider">Cancel</span>
                            <X className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-gray-900 text-white p-1 shadow-sm" />
                        </button>
                    </motion.div>
                )}

                {status === "triggering" && (
                    <motion.div
                        key="triggering"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="flex h-20 w-20 items-center justify-center rounded-full bg-red-600 text-white shadow-lg"
                    >
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </motion.div>
                )}

                {status === "active" && (
                    <motion.div
                        key="active"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring" }}
                        className="flex flex-col items-center gap-2"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="flex h-24 w-24 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/50"
                        >
                            <span className="font-bold text-center text-sm px-2">SOS SENT</span>
                        </motion.div>
                        <button
                            onClick={resolveSOS}
                            className="rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-gray-800"
                        >
                            I'M SAFE
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
