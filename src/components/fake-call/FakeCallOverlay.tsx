"use client";

import { useFakeCallStore } from "@/hooks/useFakeCall";
import { Phone, PhoneOff, MessageSquare, Video } from "lucide-react";
import { useEffect, useRef } from "react";
import Image from "next/image";

export function FakeCallOverlay() {
    const { status, callerName, callerNumber, photoUrl, ringtone, acceptCall, declineCall } = useFakeCallStore();
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (status === 'ringing') {
            if (!audioRef.current) {
                audioRef.current = new Audio(ringtone);
                audioRef.current.loop = true;
            }
            // Need user interaction to play audio usually, but this is a scheduled event 
            // so we try our best.
            audioRef.current.play().catch(e => console.error("Audio block:", e));

            // Vibrate
            if ("vibrate" in navigator) {
                navigator.vibrate([1000, 1000, 1000, 1000, 1000, 1000]);
            }
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            if ("vibrate" in navigator) {
                navigator.vibrate(0); // Stop vibration
            }
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            if ("vibrate" in navigator) {
                navigator.vibrate(0);
            }
        };
    }, [status, ringtone]);

    if (status !== 'ringing') return null;

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-between text-white backdrop-blur-xl bg-slate-900/90 p-8 pb-16">

            <div className="flex flex-col items-center mt-12 space-y-4">
                <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden mb-2 border border-slate-600">
                    {photoUrl ? (
                        <Image src={photoUrl} alt={callerName} width={96} height={96} className="object-cover" />
                    ) : (
                        <span className="text-4xl text-slate-400">{callerName.charAt(0)}</span>
                    )}
                </div>
                <h2 className="text-3xl font-light tracking-wide">{callerName}</h2>
                <div className="text-slate-400 font-light text-lg">
                    {callerNumber}
                </div>
            </div>

            <div className="flex w-full max-w-sm justify-between px-8 mb-8">
                <button className="flex flex-col items-center gap-2 text-slate-300">
                    <MessageSquare className="w-6 h-6" />
                    <span className="text-xs">Remind Me</span>
                </button>
                <button className="flex flex-col items-center gap-2 text-slate-300">
                    <MessageSquare className="w-6 h-6" />
                    <span className="text-xs">Message</span>
                </button>
            </div>

            <div className="flex w-full max-w-sm justify-between px-6 pb-8">
                <button
                    onClick={declineCall}
                    className="flex flex-col items-center gap-2"
                >
                    <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center">
                        <PhoneOff className="w-8 h-8 fill-current" />
                    </div>
                    <span className="text-sm">Decline</span>
                </button>

                <button
                    onClick={acceptCall}
                    className="flex flex-col items-center gap-2 animate-pulse-ring"
                >
                    <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                        <Phone className="w-8 h-8 fill-current" />
                    </div>
                    <span className="text-sm">Accept</span>
                </button>
            </div>
        </div>
    );
}
