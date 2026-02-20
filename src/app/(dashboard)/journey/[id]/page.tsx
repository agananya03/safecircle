
import ActiveJourney from "@/components/journey/ActiveJourney";

export const metadata = {
    title: "Track Journey | SafeCircle",
};

export default async function JourneyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <div className="container p-4 h-full">
            <ActiveJourney journeyId={id} />
        </div>
    );
}
