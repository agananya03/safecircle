/**
 * Mock Twilio client for SMS sending.
 * In a real production app, this would use the official twilio SDK:
 * import twilio from 'twilio';
 * const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
 */

interface SendSmsParams {
    to: string;
    body: string;
}

export async function sendSms({ to, body }: SendSmsParams): Promise<boolean> {
    // Check if SMS is disabled globally in ENV
    if (process.env.ENABLE_SMS === "false") {
        console.log(`[SMS MOCK] Skipped sending to ${to}. SMS disabled in environment.`);
        return true;
    }

    try {
        // Mock a slight network delay to simulate real API call
        await new Promise(resolve => setTimeout(resolve, 800));

        console.log("\n=================================");
        console.log("📲 [MOCK TWILIO] SMS DISPATCHED");
        console.log("=================================");
        console.log(`TO: ${to}`);
        console.log(`BODY:\n${body}`);
        console.log("=================================\n");

        // In reality, we'd do:
        // await client.messages.create({ body, from: process.env.TWILIO_PHONE_NUMBER, to });

        return true;
    } catch (error) {
        console.error(`[MOCK TWILIO] Failed to send SMS to ${to}:`, error);
        return false;
    }
}
