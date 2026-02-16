
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Loader2, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function JoinCirclePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [inviteCode, setInviteCode] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/circles/join", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ inviteCode }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to join circle");
            }

            const data = await res.json();
            toast.success("Joined circle successfully!");
            router.push(`/circles/${data.circleId}`);
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container max-w-xl mx-auto p-4 space-y-6">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Link href="/circles" className="flex items-center hover:text-foreground transition-colors">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back to Circles
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Join a Circle</CardTitle>
                    <CardDescription>
                        Enter the invite code shared with you to join an existing circle.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="inviteCode">Invite Code</Label>
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="inviteCode"
                                    className="pl-9"
                                    placeholder="Paste invite code here"
                                    value={inviteCode}
                                    onChange={(e) => setInviteCode(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
                        <Link href="/circles">
                            <Button variant="ghost" type="button" disabled={loading}>
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Join Circle
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
