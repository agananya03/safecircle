"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Extend Window event map for the custom PWA event
declare global {
    interface WindowEventMap {
        beforeinstallprompt: any;
    }
}

export function PwaInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        // Check if already dismissed in this session/local storage
        if (typeof window !== 'undefined') {
            const dismissed = localStorage.getItem('pwa-prompt-dismissed');
            if (dismissed === 'true') {
                setIsDismissed(true);
            }
        }

        const handleBeforeInstallPrompt = (e: any) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Cleanup
        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
        } else {
            console.log('User dismissed the A2HS prompt');
        }

        // We no longer need the prompt. Clear it up.
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setIsDismissed(true);
        localStorage.setItem('pwa-prompt-dismissed', 'true');
    };

    if (!deferredPrompt || isDismissed) {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-20 left-4 right-4 md:left-auto md:right-8 md:bottom-8 md:w-80 z-50 bg-primary text-primary-foreground rounded-2xl shadow-xl p-4 flex items-start gap-3"
            >
                <div className="bg-white/20 p-2 rounded-xl shrink-0">
                    <Download className="w-6 h-6" />
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold text-sm">Install SafeCircle</h4>
                    <p className="text-xs opacity-90 mt-1 mb-3">
                        Add to your home screen for quick access in emergencies and better offline support.
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="w-full text-xs h-8"
                            onClick={handleInstallClick}
                        >
                            Install Now
                        </Button>
                    </div>
                </div>
                <button
                    onClick={handleDismiss}
                    className="shrink-0 p-1 opacity-70 hover:opacity-100 transition-opacity"
                    aria-label="Dismiss"
                >
                    <X className="w-4 h-4" />
                </button>
            </motion.div>
        </AnimatePresence>
    );
}
