import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Map, PhoneCall, AlertTriangle } from "lucide-react";

export default function SafetyTipsPage() {
    return (
        <div className="max-w-4xl mx-auto py-6 px-4 space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Safety Tips & Best Practices</h1>
                <p className="text-muted-foreground">Learn how to maximize your safety using SafeCircle.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" />
                            The SOS Button
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-3">
                        <p>
                            Treat the SOS button as your primary panic button. When pressed, you have a brief 3-second window to cancel it before a high-priority alert is broadcast to all your circles.
                        </p>
                        <p>
                            <strong>Tip:</strong> If you've set up Emergency Contacts and enabled SMS (in Emergency Settings), they will also immediately receive a text message with your GPS coordinates.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PhoneCall className="w-5 h-5 text-indigo-500" />
                            Fake Call Feature
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-3">
                        <p>
                            The Fake Call feature generates a realistic incoming phone call screen. Use this when you feel uncomfortable and need a polite excuse to leave a situation or deter unwanted attention.
                        </p>
                        <p>
                            <strong>Tip:</strong> In the Fake Call Settings, you can enable a <strong>Voice Trigger</strong> or <strong>Time Delay</strong> to discretely trigger a call without obviously tapping your phone screen.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Map className="w-5 h-5 text-green-500" />
                            Journey Tracking
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-3">
                        <p>
                            Walking home alone? Start a Journey. SafeCircle will monitor your progress and notify your circles. If you stop moving unexpectedly or deviate significantly from your route, the app will prompt you. If you don't respond, it auto-escalates to an SOS.
                        </p>
                        <p>
                            <strong>Tip:</strong> Ensure you have a good battery percentage before starting a long journey. The app uses background GPS which can drain your battery faster.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-destructive" />
                            Test Your System
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-3">
                        <p>
                            Don't wait for an emergency to learn how the app works. Coordinate with your trusted circle members to run a test SOS alert and a test Check-In so everyone is familiar with what notifications look like and how to respond.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
