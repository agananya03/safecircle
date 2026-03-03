import ActiveCheckIns from "@/components/check-in/ActiveCheckIns";
import { FakeCallTrigger } from "@/components/fake-call/FakeCallTrigger";

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
            </div>

            <div>
                <ActiveCheckIns />
            </div>
        </div>
    );
}
