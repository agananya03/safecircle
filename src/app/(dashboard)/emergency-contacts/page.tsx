"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Phone, UserPlus, Trash2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

interface EmergencyContact {
    id: string;
    name: string;
    phone: string;
    relation: string | null;
}

export default function EmergencyContactsPage() {
    const [contacts, setContacts] = useState<EmergencyContact[]>([]);
    const [smsEnabled, setSmsEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [relation, setRelation] = useState("");

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const res = await fetch('/api/emergency-contacts');
            if (res.ok) {
                const data = await res.json();
                setContacts(data.contacts || []);
                setSmsEnabled(data.smsEnabled || false);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load contacts");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddContact = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !phone) {
            toast.error("Name and Phone are required.");
            return;
        }

        setIsSaving(true);
        try {
            const res = await fetch('/api/emergency-contacts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone, relation })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to add contact");
            }

            toast.success("Contact added successfully");
            setName("");
            setPhone("");
            setRelation("");
            fetchContacts();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/emergency-contacts?id=${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error("Failed to delete contact");

            toast.success("Contact removed");
            fetchContacts();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const toggleSms = async (checked: boolean) => {
        setSmsEnabled(checked);
        try {
            const res = await fetch('/api/emergency-contacts', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ smsEnabled: checked })
            });
            if (!res.ok) throw new Error("Update failed");
            toast.success(checked ? "SMS Alerts Enabled" : "SMS Alerts Disabled");
        } catch (error) {
            setSmsEnabled(!checked);
            toast.error("Failed to save SMS preferences");
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 pt-6 pb-20 p-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Phone className="w-8 h-8 text-primary" />
                    Emergency Contacts
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Add people outside of your SafeCircle network who should be notified securely via SMS when you trigger an SOS.
                </p>
            </div>

            <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2 text-primary">
                            <ShieldAlert className="w-5 h-5" /> Enable SMS Fallback
                        </CardTitle>
                        <CardDescription>
                            If enabled, your Emergency Contacts will receive an automated text message with a link to your live location when SOS is activated.
                        </CardDescription>
                    </div>
                    <Switch
                        checked={smsEnabled}
                        onCheckedChange={toggleSms}
                    />
                </CardHeader>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <UserPlus className="w-5 h-5" /> Add New Contact
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddContact} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Jane Doe"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+1 (555) 000-0000"
                                    required
                                />
                                <p className="text-[10px] text-muted-foreground">Include country code for international numbers.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="relation">Relationship (Optional)</Label>
                                <Input
                                    id="relation"
                                    value={relation}
                                    onChange={(e) => setRelation(e.target.value)}
                                    placeholder="Sister, Roommate, Partner"
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isSaving || contacts.length >= 5}>
                                {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                {contacts.length >= 5 ? "Limit Reached (5/5)" : "Save Contact"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Your Contacts ({contacts.length}/5)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {contacts.length === 0 ? (
                            <div className="text-sm text-muted-foreground text-center py-8 bg-muted/30 rounded-lg">
                                No emergency contacts added yet.
                            </div>
                        ) : (
                            contacts.map((contact) => (
                                <div key={contact.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg bg-card">
                                    <div>
                                        <div className="font-semibold text-sm">{contact.name}</div>
                                        <div className="text-xs text-muted-foreground">{contact.phone}</div>
                                        {contact.relation && <div className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-block mt-1">{contact.relation}</div>}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50 mt-2 sm:mt-0 self-end sm:self-auto"
                                        onClick={() => handleDelete(contact.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
