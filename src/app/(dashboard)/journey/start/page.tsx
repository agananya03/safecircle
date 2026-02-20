
import { Metadata } from "next";
import StartJourneyForm from "@/components/journey/StartJourneyForm";

export const metadata: Metadata = {
    title: "Start Journey | SafeCircle",
    description: "Start a new journey and share with your circles.",
};

export default function StartJourneyPage() {
    return (
        <div className="container max-w-2xl py-8">
            <h1 className="text-2xl font-bold mb-6 text-center">Start a New Journey</h1>
            <StartJourneyForm />
        </div>
    );
}
