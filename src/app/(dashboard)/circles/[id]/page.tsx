
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, MoreVertical, Shield, UserPlus, LogOut, Trash2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Member {
    id: string;
    userId: string;
    role: string;
    joinedAt: string;
    user: {
        id: string;
        name: string;
        email: string;
        photoUrl: string | null;
        phone: string | null;
    };
}

interface Circle {
    id: string;
    name: string;
    description: string | null;
    createdBy: string; // userId of creator
    members: Member[];
}

export default function CircleDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    const { user } = useAuth();
    const router = useRouter();
    const [circle, setCircle] = useState<Circle | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!user || !id) return;

        const fetchCircle = async () => {
            try {
                const res = await fetch(`/api/circles/${id}`);
                if (!res.ok) {
                    if (res.status === 404) {
                        toast.error("Circle not found");
                        router.push("/circles");
                        return;
                    }
                    throw new Error("Failed to fetch circle details");
                }
                const data = await res.json();
                setCircle(data);
            } catch (error) {
                console.error("Error:", error);
                toast.error("Could not load circle details");
            } finally {
                setLoading(false);
            }
        };

        fetchCircle();
    }, [user, id, router]);

    const handleCopyInvite = () => {
        // For MVP, circle ID is the invite code
        if (!circle) return;
        navigator.clipboard.writeText(circle.id);
        setCopied(true);
        toast.success("Invite code copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleLeaveCircle = async () => {
        if (!confirm("Are you sure you want to leave this circle?")) return;

        try {
            const res = await fetch(`/api/circles/${id}/members`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to leave circle");

            toast.success("Left circle successfully");
            router.push("/circles");
        } catch (error) {
            console.error("Error leaving circle:", error);
            toast.error("Failed to leave circle");
        }
    };

    const handleDeleteCircle = async () => {
        if (!confirm("Are you sure you want to DELETE this circle? This cannot be undone.")) return;

        try {
            const res = await fetch(`/api/circles/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete circle");

            toast.success("Circle deleted successfully");
            router.push("/circles");
        } catch (error) {
            console.error("Error deleting circle:", error);
            toast.error("Failed to delete circle");
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading circle details...</div>;
    }

    if (!circle) return null;

    const isAdmin = circle.members.find(m => m.userId === user?.id)?.role === 'admin';

    return (
        <div className="container max-w-4xl mx-auto p-4 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Link href="/circles">
                        <Button variant="ghost" size="icon">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">{circle.name}</h1>
                        {circle.description && (
                            <p className="text-muted-foreground text-sm">{circle.description}</p>
                        )}
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <UserPlus className="mr-2 h-4 w-4" />
                                Invite
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Invite Members</DialogTitle>
                                <DialogDescription>
                                    Share this code with people you want to join your circle.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex items-center space-x-2 mt-4">
                                <div className="grid flex-1 gap-2">
                                    <Label htmlFor="link" className="sr-only">
                                        Link
                                    </Label>
                                    <Input
                                        id="link"
                                        defaultValue={circle.id}
                                        readOnly
                                    />
                                </div>
                                <Button type="submit" size="sm" className="px-3" onClick={handleCopyInvite}>
                                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    <span className="sr-only">Copy</span>
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem className="text-destructive" onClick={handleLeaveCircle}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Leave Circle
                            </DropdownMenuItem>
                            {isAdmin && (
                                <DropdownMenuItem className="text-destructive" onClick={handleDeleteCircle}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Circle
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Members</CardTitle>
                            <CardDescription>People in this circle</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {circle.members.map((member) => (
                                <div key={member.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <Avatar>
                                            <AvatarImage src={member.user.photoUrl || undefined} />
                                            <AvatarFallback>{member.user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-sm">{member.user.name}</p>
                                            <p className="text-xs text-muted-foreground">{member.user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {member.role === 'admin' && (
                                            <Badge variant="secondary" className="text-xs">
                                                <Shield className="mr-1 h-3 w-3" />
                                                Admin
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">No recent activity.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
