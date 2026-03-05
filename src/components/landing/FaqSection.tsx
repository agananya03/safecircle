"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
    {
        question: "How does the SOS alert work?",
        answer: "When you hold the SOS button or use the voice command, SafeCircle immediately sends a high-priority notification to all members of your active trusted circles. This alert includes your exact GPS location, which updates in real-time."
    },
    {
        question: "Can I use SafeCircle without sharing my location all the time?",
        answer: "Yes! By default, your location is strictly private. SafeCircle only shares your live location when you explicitly trigger an SOS alert, start a Journey tracking session, or opt-in to temporary location sharing with a specific circle."
    },
    {
        question: "What happens if I accidentally trigger an alert?",
        answer: "You have a brief 3-second window to cancel an alert before it is broadcasted. If the alert goes through, you can immediately mark yourself as 'Safe' which notifies your circle that it was a false alarm."
    },
    {
        question: "Do my circle members need to have SafeCircle too?",
        answer: "Yes, to receive secure push notifications and view your encrypted live location, your trusted contacts need to install the SafeCircle app and join your specific circle using an invite code."
    },
    {
        question: "How does voice activation work?",
        answer: "When enabled, SafeCircle can listen for a specific wake phrase ('Help me SafeCircle') in the background. Triggering this phrase acts identically to pressing the SOS button, bypassing the need to unlock your phone."
    },
    {
        question: "Is my data secure and private?",
        answer: "We use end-to-end encryption for all location data and messages. We never sell your data, and we provide tools for you to export or completely delete your account at any time."
    },
    {
        question: "Does it work offline?",
        answer: "SafeCircle is a Progressive Web App (PWA) that caches core resources. While live location broadcasting requires an internet connection, you can still access emergency contacts, safety tips, and some offline capabilities."
    },
    {
        question: "How do I add people to my circle?",
        answer: "Go to your 'Circles' dashboard, create a new circle, and generate an invite code. Send this code to your friends or family, and they can enter it in their app to securely join your circle."
    }
];

export function FaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="bg-white py-24 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl font-extrabold text-gray-900"
                    >
                        Frequently Asked Questions
                    </motion.h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="border border-gray-200 rounded-2xl overflow-hidden hover:border-pink-200 transition-colors"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex justify-between items-center p-6 text-left focus:outline-none bg-white"
                            >
                                <span className="text-lg font-bold text-gray-900">{faq.question}</span>
                                <ChevronDown
                                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-pink-500' : ''}`}
                                />
                            </button>
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="px-6 pb-6 text-gray-600 border-t border-gray-50 pt-4 bg-gray-50/50">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
