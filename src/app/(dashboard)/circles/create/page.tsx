
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function CreateCirclePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/circles", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to create circle");
            }

            const circle = await res.json();
            toast.success("Circle created successfully!");
            router.push(`/circles/${circle.id}`);
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
                    <CardTitle>Create New Circle</CardTitle>
                    <CardDescription>
                        Create a private group for your friends, family, or colleagues.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Circle Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g. Family, Besties, Hiking Logic"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Textarea
                                id="description"
                                placeholder="What is this circle for?"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                disabled={loading}
                                rows={3}
                            />
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
                            Create Circle
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
