"use client";

import { useVoiceStore } from "@/hooks/useVoiceStore";
import { useVoiceCommands } from "@/hooks/useVoiceCommands";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Mic, MicOff, Settings2, AlertTriangle, PhoneCall } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export default function VoiceSettingsPage() {
    const store = useVoiceStore();
    const [sosPhrase, setSosPhrase] = useState(store.triggerPhraseSOS);
    const [fakeCallPhrase, setFakeCallPhrase] = useState(store.triggerPhraseFakeCall);

    // Provide a dummy hook for testing permissions and status visually
    const { isSupported, isListening, requestPermissions } = useVoiceCommands({
        enabled: store.isEnabled,
        triggerPhrases: [],
        onCommandDetected: () => { },
        continuous: false // Don't actually need continuous here unless we want visual feedback
    });

    const handleSave = () => {
        if (!sosPhrase.trim() || !fakeCallPhrase.trim()) {
            toast.error("Trigger phrases cannot be empty.");
            return;
        }
        store.setTriggerPhraseSOS(sosPhrase);
        store.setTriggerPhraseFakeCall(fakeCallPhrase);
        toast.success("Voice command settings saved.");
    };

    const toggleEnable = (checked: boolean) => {
        store.setIsEnabled(checked);
        if (checked && isSupported) {
            requestPermissions();
        }
    };

    if (!isSupported) {
        return (
            <div className="max-w-2xl mx-auto p-4 pt-10">
                <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
                    <CardHeader>
                        <CardTitle className="text-red-600 flex items-center gap-2">
                            <MicOff className="w-6 h-6" /> Browser Not Supported
                        </CardTitle>
                        <CardDescription className="text-red-500">
                            Your browser does not support the Web Speech API required for Voice Activation.
                            Please try using Chrome or Edge.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 pt-6 pb-20 p-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Mic className="w-8 h-8 text-primary" />
                    Voice Activation
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Hands-free safety. Trigger alerts discretely using voice commands while the app is open.
                </p>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div className="space-y-1">
                        <CardTitle>Enable Background Listening</CardTitle>
                        <CardDescription>
                            Allows the app to listen for wake words. Microphone access is required.
                        </CardDescription>
                    </div>
                    <Switch
                        checked={store.isEnabled}
                        onCheckedChange={toggleEnable}
                        className="data-[state=checked]:bg-green-500"
                    />
                </CardHeader>
                <CardContent>
                    {store.isEnabled ? (
                        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-500/10 p-3 rounded-md">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            {isListening ? "Actively listening for wake words..." : "Waiting for microphone permission..."}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-3 rounded-md">
                            <MicOff className="w-4 h-4" /> Voice activation is currently paused.
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className={!store.isEnabled ? "opacity-50 pointer-events-none transition-opacity" : "transition-opacity"}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings2 className="w-5 h-5" /> Customize Triggers
                    </CardTitle>
                    <CardDescription>
                        Set the exact phrases you want to use. Keep them unique to avoid accidental triggers.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        <Label className="flex items-center gap-2 text-red-500 font-semibold">
                            <AlertTriangle className="w-4 h-4" /> SOS Trigger Phrase
                        </Label>
                        <Input
                            value={sosPhrase}
                            onChange={(e) => setSosPhrase(e.target.value)}
                            placeholder="E.g., Emergency, Help me SafeCircle"
                            className="bg-red-50 dark:bg-red-950/20"
                        />
                        <p className="text-xs text-muted-foreground">
                            When spoken, this will instantly bypass the countdown and trigger a live SOS alert to all your circles.
                        </p>
                    </div>

                    <div className="space-y-3 border-t pt-4">
                        <Label className="flex items-center gap-2 text-blue-500 font-semibold">
                            <PhoneCall className="w-4 h-4" /> Fake Call Trigger Phrase
                        </Label>
                        <Input
                            value={fakeCallPhrase}
                            onChange={(e) => setFakeCallPhrase(e.target.value)}
                            placeholder="E.g., Fake Call, Call me now"
                            className="bg-blue-50 dark:bg-blue-950/20"
                        />
                        <p className="text-xs text-muted-foreground">
                            When spoken, this will instantly ring your phone to help you escape uncomfortable situations.
                        </p>
                    </div>

                    <Button onClick={handleSave} className="w-full">
                        Update Trigger Phrases
                    </Button>
                </CardContent>
            </Card>

            <div className="text-xs text-center text-muted-foreground px-4">
                <strong>Privacy Note:</strong> Voice processing happens entirely on your device using the Web Speech API. No audio recordings are ever sent to our servers.
            </div>
        </div>
    );
}
