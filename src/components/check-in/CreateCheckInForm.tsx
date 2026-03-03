"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Clock, Users, FileText, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Circle {
    id: string;
    name: string;
}

export default function CreateCheckInForm() {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();

    const [circles, setCircles] = useState<Circle[]>([]);
    const [selectedCircles, setSelectedCircles] = useState<string[]>([]);
    const [message, setMessage] = useState("");
    const [timeOffset, setTimeOffset] = useState("30"); // minutes
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!user) return;
        async function fetchCircles() {
            try {
                const res = await fetch('/api/circles');
                if (res.ok) {
                    const data = await res.json();
                    setCircles(data);
                }
            } catch (err) {
                console.error("Failed to fetch circles", err);
            }
        }
        fetchCircles();
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedCircles.length === 0) {
            toast.error("Please select at least one circle.");
            return;
        }

        setIsLoading(true);
        try {
            const now = new Date();
            const scheduledTime = new Date(now.getTime() + parseInt(timeOffset) * 60000);

            const res = await fetch("/api/check-in/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message,
                    scheduledTime: scheduledTime.toISOString(),
                    circleIds: selectedCircles,
                }),
            });

            if (!res.ok) throw new Error("Failed to create check-in");

            toast.success("Check-in scheduled!");
            router.push('/dashboard'); // Or to a check-ins list page
        } catch (error) {
            toast.error("Error creating check-in");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleCircle = (circleId: string) => {
        setSelectedCircles(prev =>
            prev.includes(circleId)
                ? prev.filter(id => id !== circleId)
                : [...prev, circleId]
        );
    };

    if (authLoading) return <div className="p-4">Loading...</div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto p-4 border rounded-lg shadow-sm bg-card text-card-foreground">
            <div className="text-center mb-4">
                <h2 className="text-xl font-semibold">Schedule Check-In</h2>
                <p className="text-sm text-muted-foreground">We'll alert your circles if you don't check in on time.</p>
            </div>

            <div className="space-y-2">
                <Label className="flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Check In After
                </Label>
                <Select value={timeOffset} onValueChange={setTimeOffset}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="300">5 hours</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label className="flex items-center gap-2">
                    <Users className="w-4 h-4" /> Notify Circles
                </Label>
                <div className="flex flex-wrap gap-2">
                    {circles.length > 0 ? (
                        circles.map((circle) => (
                            <Button
                                key={circle.id}
                                type="button"
                                variant={selectedCircles.includes(circle.id) ? "default" : "outline"}
                                size="sm"
                                onClick={() => toggleCircle(circle.id)}
                            >
                                {circle.name}
                            </Button>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground">No circles found.</p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="message" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Message (Optional)
                </Label>
                <Textarea
                    id="message"
                    placeholder="E.g., I'm going for a run..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Scheduling..." : "Schedule Check-In"}
            </Button>
        </form>
    );
}
