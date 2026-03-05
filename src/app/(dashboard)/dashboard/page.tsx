import ActiveCheckIns from "@/components/check-in/ActiveCheckIns";
import { FakeCallTrigger } from "@/components/fake-call/FakeCallTrigger";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="mt-4 text-muted-foreground">
                    Welcome to your safety dashboard.
                </p>
            </div>

            <div className="flex gap-4 mb-6">
                <FakeCallTrigger />
                <Link href="/check-in/create" className="flex-1 sm:flex-none">
                    <Button
                        variant="default"
                        className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        <Clock className="w-5 h-5 mr-3" />
                        Create Check-In
                    </Button>
                </Link>
            </div>

            <div>
                <ActiveCheckIns />
            </div>
        </div>
    );
}
