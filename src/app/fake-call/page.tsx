"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFakeCallStore } from "@/hooks/useFakeCall";
import { PhoneCall, Settings, Volume2, Upload, Smartphone } from "lucide-react";
import { toast } from "sonner";

export default function FakeCallSettingsPage() {
    const store = useFakeCallStore();
    const [name, setName] = useState(store.callerName);
    const [number, setNumber] = useState(store.callerNumber);
    const [timerValue, setTimerValue] = useState("10"); // seconds
    const [shakeEnabled, setShakeEnabled] = useState(false);

    // Request accelerometer permission
    const requestShakePermission = async () => {
        if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
            try {
                const permissionState = await (DeviceMotionEvent as any).requestPermission();
                if (permissionState === 'granted') {
                    setShakeEnabled(true);
                    toast.success("Shake-to-trigger enabled");
                } else {
                    toast.error("Permission denied for accelerometer");
                }
            } catch (error) {
                console.error(error);
                toast.error("Error requesting accelerometer permission");
            }
        } else {
            // Non-iOS 13+ devices
            setShakeEnabled(true);
            toast.success("Shake-to-trigger enabled (Standard API)");
        }
    };

    // Shake detection logic
    useEffect(() => {
        if (!shakeEnabled) return;

        let lastX = 0, lastY = 0, lastZ = 0;
        let lastTime = new Date().getTime();
        const SHAKE_THRESHOLD = 800; // Adjust sensitivity

        const handleMotion = (event: DeviceMotionEvent) => {
            const current = event.accelerationIncludingGravity;
            if (!current || current.x === null || current.y === null || current.z === null) return;

            const currentTime = new Date().getTime();
            if ((currentTime - lastTime) > 100) {
                const diffTime = (currentTime - lastTime);
                lastTime = currentTime;

                const speed = Math.abs(current.x + current.y + current.z - lastX - lastY - lastZ) / diffTime * 10000;

                if (speed > SHAKE_THRESHOLD) {
                    // Trigger fake call immediately!
                    store.triggerCall();
                }

                lastX = current.x;
                lastY = current.y;
                lastZ = current.z;
            }
        };

        window.addEventListener("devicemotion", handleMotion);
        return () => window.removeEventListener("devicemotion", handleMotion);
    }, [shakeEnabled, store]);

    const handleSaveSettings = () => {
        store.setCallerName(name);
        store.setCallerNumber(number);
        toast.success("Fake call settings saved!");
    };

    const handleTrigger = () => {
        store.triggerCall();
    };

    const handleSchedule = async () => {
        const ms = parseInt(timerValue) * 1000;

        try {
            const res = await fetch('/api/fake-call/schedule', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ delayMs: ms }),
            });

            if (!res.ok) {
                console.error('Failed to register schedule with server');
            }
        } catch (error) {
            console.error('Error scheduling with server:', error);
        }

        store.scheduleCall(ms);
        toast.success(`Fake call scheduled in ${timerValue} seconds. You can minimize the app.`);
    };

    const requestNotificationPermission = async () => {
        if ("Notification" in window) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                toast.success("Notification permissions granted!");
            }
        }
    };

    return (
        <div className="max-w-xl mx-auto space-y-6 pt-6 pb-20 px-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <PhoneCall className="w-8 h-8 text-primary" />
                    Fake Call
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Configure a realistic incoming call to help you escape uncomfortable or unsafe situations.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={handleTrigger} size="lg" className="w-full text-lg h-16 shadow-lg hover:shadow-xl transition-all">
                    <PhoneCall className="w-6 h-6 mr-2" />
                    Trigger Now
                </Button>

                <div className="flex bg-card border rounded-md p-1 shadow-sm">
                    <Select value={timerValue} onValueChange={setTimerValue}>
                        <SelectTrigger className="border-0 focus:ring-0 w-[120px]">
                            <SelectValue placeholder="Delay" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5s Delay</SelectItem>
                            <SelectItem value="10">10s Delay</SelectItem>
                            <SelectItem value="30">30s Delay</SelectItem>
                            <SelectItem value="60">1m Delay</SelectItem>
                            <SelectItem value="300">5m Delay</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="secondary" onClick={handleSchedule} className="flex-1 rounded-sm">
                        Schedule
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Settings className="w-5 h-5" /> Customize Caller Settings
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Caller Name</Label>
                        <Input value={name} onChange={e => setName(e.target.value)} placeholder="E.g., Mom, Dad, Boss" />
                    </div>

                    <div className="space-y-2">
                        <Label>Caller Subtitle / Number</Label>
                        <Input value={number} onChange={e => setNumber(e.target.value)} placeholder="E.g., Mobile, +1 234..." />
                    </div>

                    <div className="space-y-2">
                        <Label>Photo URL (Optional)</Label>
                        <div className="flex gap-2">
                            <Input placeholder="https://..." onChange={e => store.setPhotoUrl(e.target.value)} />
                            <Button variant="outline"><Upload className="w-4 h-4" /></Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Ringtone</Label>
                        <div className="flex gap-2 items-center text-sm text-muted-foreground bg-muted p-2 rounded-md">
                            <Volume2 className="w-4 h-4" /> Default system sound will be simulated
                        </div>
                    </div>

                    <Button onClick={handleSaveSettings} className="w-full mt-4">Save Customizations</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Smartphone className="w-5 h-5" /> Advanced Triggers
                    </CardTitle>
                    <CardDescription>Configure physical actions to trigger the call discretely.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button
                        variant={shakeEnabled ? "default" : "outline"}
                        onClick={requestShakePermission}
                        className="w-full border-dashed"
                    >
                        {shakeEnabled ? "Shake Trigger Active" : "Enable Shake-to-Trigger"}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center px-4">
                        If enabled, vigorously shaking your device will instantly trigger a fake call.
                    </p>

                    <Button variant="outline" onClick={requestNotificationPermission} className="w-full mt-4">
                        Enable Background Notifications
                    </Button>
                </CardContent>
            </Card>

        </div>
    );
}
