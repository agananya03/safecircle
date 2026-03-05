import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VoiceCommandState {
    isEnabled: boolean;
    triggerPhraseSOS: string;
    triggerPhraseFakeCall: string;

    setIsEnabled: (enabled: boolean) => void;
    setTriggerPhraseSOS: (phrase: string) => void;
    setTriggerPhraseFakeCall: (phrase: string) => void;
}

export const useVoiceStore = create<VoiceCommandState>()(
    persist(
        (set) => ({
            isEnabled: false,
            // Default "Wake Words" 
            triggerPhraseSOS: 'Emergency',
            triggerPhraseFakeCall: 'Fake Call',

            setIsEnabled: (enabled) => set({ isEnabled: enabled }),
            setTriggerPhraseSOS: (phrase) => set({ triggerPhraseSOS: phrase }),
            setTriggerPhraseFakeCall: (phrase) => set({ triggerPhraseFakeCall: phrase }),
        }),
        {
            name: 'voice-command-storage',
        }
    )
);
