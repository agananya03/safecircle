"use client";

import { useEffect } from 'react';
import { useVoiceCommands } from '@/hooks/useVoiceCommands';
import { useVoiceStore } from '@/hooks/useVoiceStore';
import { useFakeCallStore } from '@/hooks/useFakeCall';

export function VoiceCommandListener() {
    const { isEnabled, triggerPhraseSOS, triggerPhraseFakeCall } = useVoiceStore();
    const triggerFakeCall = useFakeCallStore(state => state.triggerCall);

    const handleCommand = (phrase: string) => {
        if (phrase.toLowerCase() === triggerPhraseSOS.toLowerCase()) {
            // Trigger SOS
            console.log("🗣️ Voice Command: SOS Triggered!");
            // Dispatch a global custom event that the SOSButton will listen for
            window.dispatchEvent(new CustomEvent('voice-trigger-sos'));
        }
        else if (phrase.toLowerCase() === triggerPhraseFakeCall.toLowerCase()) {
            // Trigger Fake Call
            console.log("🗣️ Voice Command: Fake Call Triggered!");
            triggerFakeCall();
        }
    };

    const { speakFeedback } = useVoiceCommands({
        enabled: isEnabled,
        triggerPhrases: [triggerPhraseSOS, triggerPhraseFakeCall],
        onCommandDetected: handleCommand
    });

    // Provide auditory feedback ONLY when an event actually runs
    useEffect(() => {
        const handleSosEvent = () => speakFeedback("Activating S O S");
        const handleFakeCallEvent = () => speakFeedback("Activating Fake Call");

        window.addEventListener('voice-trigger-sos', handleSosEvent);
        // Fake call doesn't dispatch a window event right now, we call the store directly,
        // but we can just use the handleCommand flow or listen to store if needed. 
        // For simplicity, we just put the feedback directly in the handleCommand if we want,
        // but using events decouples it well.

        return () => {
            window.removeEventListener('voice-trigger-sos', handleSosEvent);
        };
    }, [speakFeedback]);

    return null; // This is a logic-only component that mounts globally
}
