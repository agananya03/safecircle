export default function TermsPage() {
    return (
        <div className="container max-w-3xl mx-auto py-12 px-4 space-y-6">
            <h1 className="text-3xl font-bold">Terms of Service</h1>
            <p className="text-muted-foreground">Effective Date: October 2026</p>

            <div className="space-y-4 text-sm leading-relaxed">
                <h2 className="text-xl font-semibold mt-6">1. Acceptance of Terms</h2>
                <p>
                    By accessing or using SafeCircle, you agree to these Terms of Service. If you do not agree with any part
                    of these terms, you must not use our services.
                </p>

                <h2 className="text-xl font-semibold mt-6">2. Description of Service</h2>
                <p>
                    SafeCircle is a personal safety application designed to help users share their location, coordinate check-ins,
                    and issue emergency alerts ("SOS") to designated contacts ("Circles" and "Emergency Contacts").
                </p>
                <p className="font-semibold text-destructive">
                    Disclaimer: SafeCircle is NOT a replacement for emergency services (like 911). Always contact local authorities immediately in a life-threatening emergency.
                </p>

                <h2 className="text-xl font-semibold mt-6">3. User Responsibilities</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                    <li>You agree to provide accurate phone numbers for your emergency contacts.</li>
                    <li>You agree not to misuse the SOS or Fake Call features to harass others or trigger false public alarms.</li>
                </ul>

                <h2 className="text-xl font-semibold mt-6">4. Limitation of Liability</h2>
                <p>
                    SafeCircle is provided "as is" without warranties of any kind. We do not guarantee continuous,
                    uninterrupted access to the service or that emergency notifications will always be delivered,
                    as this depends on third-party cellular and internet networks.
                </p>
            </div>
        </div>
    );
}
