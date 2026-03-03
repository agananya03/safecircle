import { create } from 'zustand';

interface FakeCallState {
    callerName: string;
    callerNumber: string;
    photoUrl: string | null;
    ringtone: string;
    status: 'idle' | 'ringing' | 'active';
    scheduledTime: Date | null;

    setCallerName: (name: string) => void;
    setCallerNumber: (number: string) => void;
    setPhotoUrl: (url: string | null) => void;
    setRingtone: (ringtone: string) => void;

    triggerCall: () => void;
    scheduleCall: (delayMs: number) => void;
    acceptCall: () => void;
    declineCall: () => void;
    endCall: () => void;
}

export const useFakeCallStore = create<FakeCallState>((set, get) => ({
    callerName: 'Dad',
    callerNumber: 'Mobile',
    photoUrl: null,
    ringtone: '/sounds/ringtone.mp3', // default ringtone path
    status: 'idle',
    scheduledTime: null,

    setCallerName: (name) => set({ callerName: name }),
    setCallerNumber: (number) => set({ callerNumber: number }),
    setPhotoUrl: (url) => set({ photoUrl: url }),
    setRingtone: (ringtone) => set({ ringtone }),

    triggerCall: () => set({ status: 'ringing', scheduledTime: null }),

    scheduleCall: (delayMs) => {
        const triggerTime = new Date(Date.now() + delayMs);
        set({ scheduledTime: triggerTime });

        // Show notification if page is backgrounded when it rings
        setTimeout(() => {
            const { status } = get();
            if (status === 'idle') {
                set({ status: 'ringing', scheduledTime: null });

                // Try to show browser notification
                if ("Notification" in window && Notification.permission === "granted") {
                    new Notification(`Incoming call from ${get().callerName}`, {
                        icon: '/icons/icon-192x192.png',
                        requireInteraction: true
                    });
                }
            }
        }, delayMs);
    },

    acceptCall: () => set({ status: 'active' }),
    declineCall: () => set({ status: 'idle' }),
    endCall: () => set({ status: 'idle' })
}));
