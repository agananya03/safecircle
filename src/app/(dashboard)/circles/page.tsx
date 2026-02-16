
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

interface Circle {
    id: string;
    name: string;
    description: string | null;
    _count: {
        members: number;
    };
}

export default function CirclesPage() {
    const { user } = useAuth();
    const [circles, setCircles] = useState<Circle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchCircles = async () => {
            try {
                const res = await fetch("/api/circles");
                if (res.ok) {
                    const data = await res.json();
                    setCircles(data);
                }
            } catch (error) {
                console.error("Failed to fetch circles", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCircles();
    }, [user]);

    return (
        <div className="container max-w-4xl mx-auto p-4 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Circles</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your trusted groups and keep your loved ones close.
                    </p>
                </div>
                <div className="flex space-x-2">
                    <Link href="/circles/join">
                        <Button variant="outline">
                            Join Circle
                        </Button>
                    </Link>
                    <Link href="/circles/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Circle
                        </Button>
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="animate-pulse">
                            <CardHeader className="h-24 bg-muted/50 rounded-t-lg" />
                            <CardContent className="h-20" />
                        </Card>
                    ))}
                </div>
            ) : circles.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-4">
                        <div className="p-4 rounded-full bg-primary/10 text-primary">
                            <Users className="h-8 w-8" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold text-xl">No circles yet</h3>
                            <p className="text-muted-foreground max-w-sm">
                                Create a circle to start sharing your location and alerts with trusted friends and family.
                            </p>
                        </div>
                        <Link href="/circles/create">
                            <Button variant="outline">Create your first Circle</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {circles.map((circle) => (
                        <Link key={circle.id} href={`/circles/${circle.id}`} className="block h-full group">
                            <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between group-hover:text-primary transition-colors">
                                        {circle.name}
                                        <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                    </CardTitle>
                                    <CardDescription className="line-clamp-2">
                                        {circle.description || "No description provided."}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Users className="mr-2 h-4 w-4" />
                                        <span>
                                            {circle._count.members} {circle._count.members === 1 ? "member" : "members"}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
