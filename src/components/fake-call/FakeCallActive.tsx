"use client";

import { useFakeCallStore } from "@/hooks/useFakeCall";
import { PhoneOff, MicOff, Hash, Volume2, Plus, User, Pause } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

export function FakeCallActive() {
    const { status, callerName, callerNumber, photoUrl, endCall } = useFakeCallStore();
    const [seconds, setSeconds] = useState(0);
    const [scripts, setScripts] = useState([
        "Hello?",
        "Yeah, I'm almost there.",
        "Can you just meet me at the front?",
        "No, don't worry, I see it.",
        "Okay, wait right there."
    ]);
    const [scriptIndex, setScriptIndex] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (status === 'active') {
            interval = setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [status]);

    // Format time HH:MM:SS
    const formatTime = (totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (status !== 'active') return null;

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-between text-white backdrop-blur-3xl bg-slate-900 p-8 pb-12">

            <div className="flex flex-col items-center mt-12 space-y-3">
                <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden mb-2 border border-slate-600">
                    {photoUrl ? (
                        <Image src={photoUrl} alt={callerName} width={80} height={80} className="object-cover" />
                    ) : (
                        <span className="text-3xl text-slate-400">{callerName.charAt(0)}</span>
                    )}
                </div>
                <h2 className="text-3xl font-light tracking-wide">{callerName}</h2>
                <div className="text-green-400 font-normal text-md">
                    {formatTime(seconds)}
                </div>
            </div>

            {/* Script Helper Section (Invisible to bystanders, just text) */}
            <div className="w-full max-w-sm mt-4 p-4 border border-slate-700/50 bg-slate-800/30 rounded-2xl">
                <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider text-center">Conversation Script</p>
                <div className="text-center text-lg text-slate-200 transition-all font-light" onClick={() => setScriptIndex((scriptIndex + 1) % scripts.length)}>
                    "{scripts[scriptIndex]}"
                </div>
                <p className="text-xs text-slate-500 mt-3 text-center cursor-pointer" onClick={() => setScriptIndex((scriptIndex + 1) % scripts.length)}>
                    Tap script to see next line
                </p>
            </div>

            {/* iOS style grid */}
            <div className="w-full max-w-xs grid grid-cols-3 gap-6 mt-6 mb-8 px-4">
                <Button label="mute" icon={<MicOff />} />
                <Button label="keypad" icon={<Hash className="w-7 h-7" />} />
                <Button label="speaker" icon={<Volume2 />} />
                <Button label="add call" icon={<Plus />} />
                <Button label="FaceTime" icon={<User />} disabled />
                <Button label="contacts" icon={<User />} />
            </div>

            <div className="flex w-full justify-center pb-8">
                <button
                    onClick={endCall}
                    className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                    <PhoneOff className="w-8 h-8 fill-current" />
                </button>
            </div>
        </div>
    );
}

// Dummy buttons for grid
function Button({ label, icon, disabled = false }: { label: string, icon: any, disabled?: boolean }) {
    return (
        <div className={`flex flex-col items-center gap-1 ${disabled ? 'opacity-30' : ''}`}>
            <div className="w-16 h-16 rounded-full bg-slate-700/60 flex items-center justify-center border border-slate-600/30">
                <div className="w-7 h-7 text-white flex items-center justify-center">{icon}</div>
            </div>
            <span className="text-xs font-light text-slate-300">{label}</span>
        </div>
    );
}
