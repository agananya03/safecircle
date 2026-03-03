
import CreateCheckInForm from "@/components/check-in/CreateCheckInForm";

export const metadata = {
    title: "Schedule Check-In | SafeCircle",
};

export default function CreateCheckInPage() {
    return (
        <div className="container p-4 h-full flex items-center justify-center">
            <div className="w-full max-w-lg">
                <CreateCheckInForm />
            </div>
        </div>
    );
}
