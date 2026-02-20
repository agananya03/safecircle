
import JourneyHistory from "@/components/journey/JourneyHistory";

export const metadata = {
    title: "Journey History | SafeCircle",
};

export default function HistoryPage() {
    return (
        <div className="container p-4 h-full">
            <h1 className="text-2xl font-bold mb-4">Journey History</h1>
            <JourneyHistory />
        </div>
    );
}
