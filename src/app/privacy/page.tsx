export default function PrivacyPolicyPage() {
    return (
        <div className="container max-w-3xl mx-auto py-12 px-4 space-y-6">
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
            <p className="text-muted-foreground">Effective Date: October 2026</p>

            <div className="space-y-4 text-sm leading-relaxed">
                <h2 className="text-xl font-semibold mt-6">1. Information We Collect</h2>
                <p>
                    SafeCircle collects information to provide our core safety features. This includes:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Account Data:</strong> Name, email address, and profile photo provided during signup/login via Google or other OAuth providers.</li>
                    <li><strong>Location Data:</strong> When explicitly authorized, we access your device GPS coordinates to track your journey, verify your check-ins, or broadcast an SOS alert. Location data is only shared with the people you explicitly authorize (your "Circles").</li>
                    <li><strong>Contacts:</strong> Phone names and numbers you manually input as Emergency Contacts. We do NOT sync your entire address book.</li>
                    <li><strong>Messages:</strong> Chat data sent within Circles is stored securely to provide chat history to your approved circle members.</li>
                </ul>

                <h2 className="text-xl font-semibold mt-6">2. How We Use Information</h2>
                <p>
                    Your data is strictly used for the provision of personal safety features. SafeCircle does NOT sell or rent your personal data, location history, or messages to third-party data brokers or advertisers.
                </p>

                <h2 className="text-xl font-semibold mt-6">3. Data Retention and Deletion</h2>
                <p>
                    You retain ownership of your data. You may delete your account at any time, which will permanently remove your location history, check-in history, and emergency contacts from our servers.
                </p>

                <h2 className="text-xl font-semibold mt-6">4. Third-Party Services</h2>
                <p>
                    We rely on trusted third parties (such as Supabase for authentication and database management, SendGrid/Twilio for notifications, and Google/OSM for map tiles). They process data under strict confidentiality obligations.
                </p>
            </div>
        </div>
    );
}
