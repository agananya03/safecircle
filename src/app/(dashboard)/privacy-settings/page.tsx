"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download, VenetianMask, FileWarning } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function PrivacySettingsPage() {
    const { user } = useAuth();
    const [stealthMode, setStealthMode] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            if (!user) return;
            try {
                const res = await fetch('/api/user/settings');
                if (res.ok) {
                    const data = await res.json();
                    setStealthMode(data.stealthMode ?? false);
                }
            } catch (error) {
                console.error("Failed to fetch settings", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, [user]);

    const handleToggleStealth = async (checked: boolean) => {
        setStealthMode(checked);
        try {
            const res = await fetch('/api/user/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stealthMode: checked })
            });

            if (!res.ok) throw new Error("Failed to update");
            toast.success(`Stealth Mode ${checked ? 'enabled' : 'disabled'}`);
        } catch (error) {
            setStealthMode(!checked);
            toast.error("Could not update settings");
        }
    };

    const handleExportData = () => {
        window.open('/api/user/export', '_blank');
        toast.success("Data export started");
    };

    const handleDeleteAccount = async () => {
        if (!confirm("Are you absolutely sure you want to permanently delete your account and all associated data? This CANNOT be undone.")) return;

        try {
            const res = await fetch('/api/user/delete', { method: 'DELETE' });
            if (res.ok) {
                toast.success("Account deleted. You will be logged out.");
                window.location.href = '/login';
            } else {
                throw new Error("Failed to delete account");
            }
        } catch (error) {
            toast.error("Could not delete account. Please try again.");
        }
    };

    if (loading) return <div className="p-8 text-center text-muted-foreground">Loading settings...</div>;

    return (
        <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Privacy & Security</h1>
                <p className="text-muted-foreground">Control your data and visibility settings.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <VenetianMask className="w-5 h-5 text-indigo-500" />
                        Stealth Mode
                    </CardTitle>
                    <CardDescription>
                        When enabled, incoming alerts and check-in prompts will not trigger sounds, vibrations, or visible banners to keep your phone silent in unsafe environments.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <Label htmlFor="stealth-mode" className="font-medium cursor-pointer">
                        Enable Stealth Alerts
                    </Label>
                    <Switch
                        id="stealth-mode"
                        checked={stealthMode}
                        onCheckedChange={handleToggleStealth}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Download className="w-5 h-5 text-green-500" />
                        Data Export
                    </CardTitle>
                    <CardDescription>
                        Download a copy of all your personal data, location history, and circle messages in JSON format.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleExportData} variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export My Data
                    </Button>
                </CardContent>
            </Card>

            <Card className="border-destructive/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <FileWarning className="w-5 h-5" />
                        Danger Zone
                    </CardTitle>
                    <CardDescription>
                        Permanently delete your account and securely erase all your data from our servers.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleDeleteAccount} variant="destructive">
                        Delete Account
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
