import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Mail, MessageCircle, HelpCircle } from "lucide-react";

export default function SupportPage() {
    return (
        <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
                <p className="text-muted-foreground">Getting stuck? We're here to help you stay safe.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <HelpCircle className="w-5 h-5 text-primary" />
                            Frequently Asked Questions
                        </CardTitle>
                        <CardDescription>Quick answers to common issues.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm mt-2">
                        <div>
                            <p className="font-semibold">Why isn't my location updating?</p>
                            <p className="text-muted-foreground mb-2">Ensure SafeCircle has "Always Allow" location permissions in your device settings. Background location tracking requires this to function when the app is minimized.</p>
                        </div>
                        <div>
                            <p className="font-semibold">Who can see my location?</p>
                            <p className="text-muted-foreground mb-2">Only people who have joined your designated Circles via an invite link. SafeCircle does not publicly share your location or sell it to 3rd parties.</p>
                        </div>
                        <div>
                            <p className="font-semibold">How do I test the SOS alert without scaring my friends?</p>
                            <p className="text-muted-foreground">Create a new empty Circle just for testing. Make sure to switch to that Circle before triggering the SOS on your dashboard.</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="w-5 h-5 text-indigo-500" />
                                Email Support
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Our support team typically responds within 24 hours. For non-emergencies only.
                            </p>
                            <Button className="w-full" asChild>
                                <a href="mailto:support@safecircle.local">
                                    Contact Support
                                </a>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageCircle className="w-5 h-5 text-green-500" />
                                Community Forum
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Connect with other users, share safety tips, and request new features.
                            </p>
                            <Button variant="outline" className="w-full">
                                Visit Forums <ExternalLink className="w-4 h-4 ml-2" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
