import { useState, useEffect, useCallback, useRef } from 'react';

// Extend Window interface for WebKit Speech Recognition
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

interface UseVoiceCommandsProps {
    enabled: boolean;
    triggerPhrases: string[];
    onCommandDetected: (phrase: string) => void;
    continuous?: boolean;
}

export function useVoiceCommands({ enabled, triggerPhrases, onCommandDetected, continuous = true }: UseVoiceCommandsProps) {
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(true);
    const recognitionRef = useRef<any>(null);

    // Provide vocal feedback
    const speakFeedback = useCallback((text: string) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.1; // Slightly faster for emergencies
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
        }
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setIsSupported(false);
            return;
        }

        // Initialize only once
        if (!recognitionRef.current) {
            const recognition = new SpeechRecognition();
            recognition.continuous = continuous;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                setIsListening(true);
            };

            recognition.onresult = (event: any) => {
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        const transcript = event.results[i][0].transcript.trim().toLowerCase();
                        console.log("[Voice] Heard:", transcript);

                        // Check against triggers
                        for (const phrase of triggerPhrases) {
                            if (transcript.includes(phrase.toLowerCase())) {
                                console.log("[Voice] Trigger Match Found:", phrase);
                                onCommandDetected(phrase);
                                break; // Prevent multiple triggers from one sentence
                            }
                        }
                    }
                }
            };

            recognition.onerror = (event: any) => {
                console.error("[Voice] Speech recognition error", event.error);
                // "no-speech" isn't really an error, just silence.
                if (event.error !== 'no-speech') {
                    setIsListening(false);
                }
            };

            recognition.onend = () => {
                setIsListening(false);
                // If it's supposed to be enabled, restart it automatically to create "continuous" background listening
                if (enabled && continuous) {
                    try {
                        recognition.start();
                    } catch (e) {
                        // Might throw if it was explicitly stopped or already started
                    }
                }
            };

            recognitionRef.current = recognition;
        }

        const recognition = recognitionRef.current;

        // Manage lifecycle based on enabled state
        if (enabled && !isListening) {
            try {
                recognition.start();
            } catch (e) {
                // Ignore if already started
            }
        } else if (!enabled && isListening) {
            try {
                recognition.stop();
            } catch (e) { }
        }

        // We don't want to stop/destroy the recognizer on every render
        // just let the handle state decide.

    }, [enabled, continuous, triggerPhrases, onCommandDetected, isListening]);

    // Force stop (e.g., when unmounting globally)
    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    return {
        isListening,
        isSupported,
        speakFeedback,
        // Helper to manually request permissions via a user gesture
        requestPermissions: () => {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.start();
                    setTimeout(() => recognitionRef.current.stop(), 100);
                } catch (e) { }
            }
        }
    };
}
